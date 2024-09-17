var {
  _optionalChain
} = require('@sentry/utils');

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const opentelemetry = require('@sentry/opentelemetry');
const utils = require('@sentry/utils');
const debugBuild = require('./debug-build.js');
const errors = require('./errors.js');
const futureFlags = require('./futureFlags.js');
const utils$1 = require('./utils.js');
const response = require('./vendor/response.js');
const webFetch = require('./web-fetch.js');

/* eslint-disable max-lines */

let FUTURE_FLAGS;

const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
function isRedirectResponse(response) {
  return redirectStatusCodes.has(response.status);
}

function isCatchResponse(response) {
  return response.headers.get('X-Remix-Catch') != null;
}

/**
 * Sentry utility to be used in place of `handleError` function of Remix v2
 * Remix Docs: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
 *
 * Should be used in `entry.server` like:
 *
 * export const handleError = Sentry.sentryHandleError
 */
function sentryHandleError(err, { request }) {
  // We are skipping thrown responses here as they are handled by
  // `captureRemixServerException` at loader / action level
  // We don't want to capture them twice.
  // This function is only for capturing unhandled server-side exceptions.
  // https://remix.run/docs/en/main/file-conventions/entry.server#thrown-responses
  // https://remix.run/docs/en/v1/api/conventions#throwing-responses-in-loaders
  if (response.isResponse(err) || response.isRouteErrorResponse(err)) {
    return;
  }

  errors.captureRemixServerException(err, 'remix.server.handleError', request).then(null, e => {
    debugBuild.DEBUG_BUILD && utils.logger.warn('Failed to capture Remix Server exception.', e);
  });
}

/**
 * @deprecated Use `sentryHandleError` instead.
 */
const wrapRemixHandleError = sentryHandleError;

/**
 * Sentry wrapper for Remix's `handleError` function.
 * Remix Docs: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
 */
function wrapHandleErrorWithSentry(
  origHandleError,
) {
  return function ( err, args) {
    // This is expected to be void but just in case it changes in the future.
    const res = origHandleError.call(this, err, args);

    sentryHandleError(err, args );

    return res;
  };
}

function makeWrappedDocumentRequestFunction(autoInstrumentRemix, remixVersion) {
  return function (origDocumentRequestFunction) {
    return async function (

      request,
      responseStatusCode,
      responseHeaders,
      context,
      loadContext,
    ) {
      const documentRequestContext = {
        request,
        responseStatusCode,
        responseHeaders,
        context,
        loadContext,
      };

      const isRemixV2 = _optionalChain([FUTURE_FLAGS, 'optionalAccess', _ => _.v2_errorBoundary]) || remixVersion === 2;

      if (!autoInstrumentRemix) {
        const activeSpan = core.getActiveSpan();
        const rootSpan = activeSpan && core.getRootSpan(activeSpan);

        const name = rootSpan ? core.spanToJSON(rootSpan).description : undefined;

        return core.startSpan(
          {
            // If we don't have a root span, `onlyIfParent` will lead to the span not being created anyhow
            // So we don't need to care too much about the fallback name, it's just for typing purposes....
            name: name || '<unknown>',
            onlyIfParent: true,
            attributes: {
              method: request.method,
              url: request.url,
              [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.remix',
              [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'function.remix.document_request',
            },
          },
          () => {
            return errors.errorHandleDocumentRequestFunction.call(
              this,
              origDocumentRequestFunction,
              documentRequestContext,
              isRemixV2,
            );
          },
        );
      } else {
        return errors.errorHandleDocumentRequestFunction.call(
          this,
          origDocumentRequestFunction,
          documentRequestContext,
          isRemixV2,
        );
      }
    };
  };
}

function makeWrappedDataFunction(
  origFn,
  id,
  name,
  remixVersion,
  autoInstrumentRemix,
) {
  return async function ( args) {
    const isRemixV2 = _optionalChain([FUTURE_FLAGS, 'optionalAccess', _2 => _2.v2_errorBoundary]) || remixVersion === 2;

    if (!autoInstrumentRemix) {
      return core.startSpan(
        {
          op: `function.remix.${name}`,
          name: id,
          attributes: {
            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.ui.remix',
            name,
          },
        },
        (span) => {
          return errors.errorHandleDataFunction.call(this, origFn, name, args, isRemixV2, span);
        },
      );
    } else {
      return errors.errorHandleDataFunction.call(this, origFn, name, args, isRemixV2);
    }
  };
}

const makeWrappedAction =
  (id, remixVersion, autoInstrumentRemix) =>
  (origAction) => {
    return makeWrappedDataFunction(origAction, id, 'action', remixVersion, autoInstrumentRemix);
  };

const makeWrappedLoader =
  (id, remixVersion, autoInstrumentRemix) =>
  (origLoader) => {
    return makeWrappedDataFunction(origLoader, id, 'loader', remixVersion, autoInstrumentRemix);
  };

function getTraceAndBaggage()

 {
  if (utils.isNodeEnv() && core.hasTracingEnabled()) {
    const span = core.getActiveSpan();
    const rootSpan = span && core.getRootSpan(span);

    if (rootSpan) {
      const dynamicSamplingContext = opentelemetry.getDynamicSamplingContextFromSpan(rootSpan);

      return {
        sentryTrace: core.spanToTraceHeader(span),
        sentryBaggage: utils.dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext),
      };
    }
  }

  return {};
}

function makeWrappedRootLoader(remixVersion) {
  return function (origLoader) {
    return async function ( args) {
      const res = await origLoader.call(this, args);
      const traceAndBaggage = getTraceAndBaggage();

      if (response.isDeferredData(res)) {
        res.data['sentryTrace'] = traceAndBaggage.sentryTrace;
        res.data['sentryBaggage'] = traceAndBaggage.sentryBaggage;
        res.data['remixVersion'] = remixVersion;

        return res;
      }

      if (response.isResponse(res)) {
        // Note: `redirect` and `catch` responses do not have bodies to extract.
        // We skip injection of trace and baggage in those cases.
        // For `redirect`, a valid internal redirection target will have the trace and baggage injected.
        if (isRedirectResponse(res) || isCatchResponse(res)) {
          debugBuild.DEBUG_BUILD && utils.logger.warn('Skipping injection of trace and baggage as the response does not have a body');
          return res;
        } else {
          const data = await response.extractData(res);

          if (typeof data === 'object') {
            return response.json(
              { ...data, ...traceAndBaggage, remixVersion },
              {
                headers: res.headers,
                statusText: res.statusText,
                status: res.status,
              },
            );
          } else {
            debugBuild.DEBUG_BUILD && utils.logger.warn('Skipping injection of trace and baggage as the response body is not an object');
            return res;
          }
        }
      }

      return { ...res, ...traceAndBaggage, remixVersion };
    };
  };
}

function wrapRequestHandler(
  origRequestHandler,
  build,
  autoInstrumentRemix,
) {
  let resolvedBuild;
  let routes;
  let name;
  let source;

  return async function ( request, loadContext) {
    const upperCaseMethod = request.method.toUpperCase();
    // We don't want to wrap OPTIONS and HEAD requests
    if (upperCaseMethod === 'OPTIONS' || upperCaseMethod === 'HEAD') {
      return origRequestHandler.call(this, request, loadContext);
    }

    if (!autoInstrumentRemix) {
      if (typeof build === 'function') {
        resolvedBuild = await build();
      } else {
        resolvedBuild = build;
      }

      routes = utils$1.createRoutes(resolvedBuild.routes);
    }

    return core.withIsolationScope(async isolationScope => {
      const options = _optionalChain([core.getClient, 'call', _3 => _3(), 'optionalAccess', _4 => _4.getOptions, 'call', _5 => _5()]);

      let normalizedRequest = request;

      try {
        normalizedRequest = webFetch.normalizeRemixRequest(request);
      } catch (e) {
        debugBuild.DEBUG_BUILD && utils.logger.warn('Failed to normalize Remix request');
      }

      if (!autoInstrumentRemix) {
        const url = new URL(request.url);
        [name, source] = utils$1.getTransactionName(routes, url);

        isolationScope.setTransactionName(name);
      }

      isolationScope.setSDKProcessingMetadata({
        request: {
          ...normalizedRequest,
          route: {
            path: name,
          },
        },
      });

      if (!options || !core.hasTracingEnabled(options)) {
        return origRequestHandler.call(this, request, loadContext);
      }

      return opentelemetry.continueTrace(
        {
          sentryTrace: request.headers.get('sentry-trace') || '',
          baggage: request.headers.get('baggage') || '',
        },
        async () => {
          if (!autoInstrumentRemix) {
            return core.startSpan(
              {
                name,
                attributes: {
                  [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.remix',
                  [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: source,
                  [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'http.server',
                  method: request.method,
                },
              },
              async span => {
                const res = (await origRequestHandler.call(this, request, loadContext)) ;

                if (response.isResponse(res)) {
                  core.setHttpStatus(span, res.status);
                }

                return res;
              },
            );
          }

          return (await origRequestHandler.call(this, request, loadContext)) ;
        },
      );
    });
  };
}

function instrumentBuildCallback(build, autoInstrumentRemix) {
  const routes = {};
  const remixVersion = futureFlags.getRemixVersionFromBuild(build);
  const wrappedEntry = { ...build.entry, module: { ...build.entry.module } };

  // Not keeping boolean flags like it's done for `requestHandler` functions,
  // Because the build can change between build and runtime.
  // So if there is a new `loader` or`action` or `documentRequest` after build.
  // We should be able to wrap them, as they may not be wrapped before.
  const defaultExport = wrappedEntry.module.default ;
  if (defaultExport && !defaultExport.__sentry_original__) {
    utils.fill(wrappedEntry.module, 'default', makeWrappedDocumentRequestFunction(autoInstrumentRemix, remixVersion));
  }

  for (const [id, route] of Object.entries(build.routes)) {
    const wrappedRoute = { ...route, module: { ...route.module } };

    const routeAction = wrappedRoute.module.action ;
    if (routeAction && !routeAction.__sentry_original__) {
      utils.fill(wrappedRoute.module, 'action', makeWrappedAction(id, remixVersion, autoInstrumentRemix));
    }

    const routeLoader = wrappedRoute.module.loader ;
    if (routeLoader && !routeLoader.__sentry_original__) {
      utils.fill(wrappedRoute.module, 'loader', makeWrappedLoader(id, remixVersion, autoInstrumentRemix));
    }

    // Entry module should have a loader function to provide `sentry-trace` and `baggage`
    // They will be available for the root `meta` function as `data.sentryTrace` and `data.sentryBaggage`
    if (!wrappedRoute.parentId) {
      if (!wrappedRoute.module.loader) {
        wrappedRoute.module.loader = () => ({});
      }

      // We want to wrap the root loader regardless of whether it's already wrapped before.
      utils.fill(wrappedRoute.module, 'loader', makeWrappedRootLoader(remixVersion));
    }

    routes[id] = wrappedRoute;
  }

  return { ...build, routes, entry: wrappedEntry };
}

/**
 * Instruments `remix` ServerBuild for performance tracing and error tracking.
 */
function instrumentBuild(
  build,
  options,
) {
  const autoInstrumentRemix = _optionalChain([options, 'optionalAccess', _6 => _6.autoInstrumentRemix]) || false;

  if (typeof build === 'function') {
    return function () {
      const resolvedBuild = build();

      if (resolvedBuild instanceof Promise) {
        return resolvedBuild.then(build => {
          FUTURE_FLAGS = futureFlags.getFutureFlagsServer(build);

          return instrumentBuildCallback(build, autoInstrumentRemix);
        });
      } else {
        FUTURE_FLAGS = futureFlags.getFutureFlagsServer(resolvedBuild);

        return instrumentBuildCallback(resolvedBuild, autoInstrumentRemix);
      }
    };
  } else {
    FUTURE_FLAGS = futureFlags.getFutureFlagsServer(build);

    return instrumentBuildCallback(build, autoInstrumentRemix);
  }
}

const makeWrappedCreateRequestHandler = (options) =>
  (function(origCreateRequestHandler) {
    return function (

      build,
      ...args
    ) {
      const newBuild = instrumentBuild(build, options);
      const requestHandler = origCreateRequestHandler.call(this, newBuild, ...args);

      return wrapRequestHandler(requestHandler, newBuild, options.autoInstrumentRemix || false);
    };
  });

/**
 * Monkey-patch Remix's `createRequestHandler` from `@remix-run/server-runtime`
 * which Remix Adapters (https://remix.run/docs/en/v1/api/remix) use underneath.
 */
function instrumentServer(options) {
  const pkg = utils.loadModule

('@remix-run/server-runtime');

  if (!pkg) {
    debugBuild.DEBUG_BUILD && utils.logger.warn('Remix SDK was unable to require `@remix-run/server-runtime` package.');

    return;
  }

  utils.fill(pkg, 'createRequestHandler', makeWrappedCreateRequestHandler(options));
}

exports.instrumentBuild = instrumentBuild;
exports.instrumentServer = instrumentServer;
exports.sentryHandleError = sentryHandleError;
exports.wrapHandleErrorWithSentry = wrapHandleErrorWithSentry;
exports.wrapRemixHandleError = wrapRemixHandleError;
//# sourceMappingURL=instrumentServer.js.map
