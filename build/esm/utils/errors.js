import { _optionalChain } from '@sentry/utils';
import { captureException, getActiveSpan, getRootSpan, spanToJSON, handleCallbackErrors, getClient } from '@sentry/core';
import { logger, objectify, addExceptionMechanism, isPrimitive } from '@sentry/utils';
import { DEBUG_BUILD } from './debug-build.js';
import { storeFormDataKeys } from './utils.js';
import { isRouteErrorResponse, isResponse, extractData } from './vendor/response.js';
import { normalizeRemixRequest } from './web-fetch.js';

/**
 * Captures an exception happened in the Remix server.
 *
 * @param err The error to capture.
 * @param name The name of the origin function.
 * @param request The request object.
 * @param isRemixV2 Whether the error is from Remix v2 or not. Default is `true`.
 *
 * @returns A promise that resolves when the exception is captured.
 */
async function captureRemixServerException(
  err,
  name,
  request,
  isRemixV2 = true,
) {
  // Skip capturing if the thrown error is not a 5xx response
  // https://remix.run/docs/en/v1/api/conventions#throwing-responses-in-loaders
  if (isRemixV2 && isRouteErrorResponse(err) && err.status < 500) {
    return;
  }

  if (isResponse(err) && err.status < 500) {
    return;
  }
  // Skip capturing if the request is aborted as Remix docs suggest
  // Ref: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
  if (request.signal.aborted) {
    DEBUG_BUILD && logger.warn('Skipping capture of aborted request');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let normalizedRequest = request ;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normalizedRequest = normalizeRemixRequest(request );
  } catch (e) {
    DEBUG_BUILD && logger.warn('Failed to normalize Remix request');
  }

  const objectifiedErr = objectify(err);

  captureException(isResponse(objectifiedErr) ? await extractResponseError(objectifiedErr) : objectifiedErr, scope => {
    const activeSpan = getActiveSpan();
    const rootSpan = activeSpan && getRootSpan(activeSpan);
    const activeRootSpanName = rootSpan ? spanToJSON(rootSpan).description : undefined;

    scope.setSDKProcessingMetadata({
      request: {
        ...normalizedRequest,
        // When `route` is not defined, `RequestData` integration uses the full URL
        route: activeRootSpanName
          ? {
              path: activeRootSpanName,
            }
          : undefined,
      },
    });

    scope.addEventProcessor(event => {
      addExceptionMechanism(event, {
        type: 'instrument',
        handled: false,
        data: {
          function: name,
        },
      });

      return event;
    });

    return scope;
  });
}

/**
 * Wraps the original `HandleDocumentRequestFunction` with error handling.
 *
 * @param origDocumentRequestFunction The original `HandleDocumentRequestFunction`.
 * @param requestContext The request context.
 * @param isRemixV2 Whether the Remix version is v2 or not.
 *
 * @returns The wrapped `HandleDocumentRequestFunction`.
 */
function errorHandleDocumentRequestFunction(

  origDocumentRequestFunction,
  requestContext

,
  isRemixV2,
) {
  const { request, responseStatusCode, responseHeaders, context, loadContext } = requestContext;

  return handleCallbackErrors(
    () => {
      return origDocumentRequestFunction.call(this, request, responseStatusCode, responseHeaders, context, loadContext);
    },
    err => {
      // This exists to capture the server-side rendering errors on Remix v1
      // On Remix v2, we capture SSR errors at `handleError`
      // We also skip primitives here, as we can't dedupe them, and also we don't expect any primitive SSR errors.
      if (!isRemixV2 && !isPrimitive(err)) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        captureRemixServerException(err, 'documentRequest', request, isRemixV2);
      }

      throw err;
    },
  );
}

/**
 * Wraps the original `DataFunction` with error handling.
 * This function also stores the form data keys if the action is being called.
 *
 * @param origFn The original `DataFunction`.
 * @param name The name of the function.
 * @param args The arguments of the function.
 * @param isRemixV2 Whether the Remix version is v2 or not.
 * @param span The span to store the form data keys.
 *
 * @returns The wrapped `DataFunction`.
 */
async function errorHandleDataFunction(

  origFn,
  name,
  args,
  isRemixV2,
  span,
) {
  return handleCallbackErrors(
    async () => {
      if (name === 'action' && span) {
        const options = _optionalChain([getClient, 'call', _ => _(), 'optionalAccess', _2 => _2.getOptions, 'call', _3 => _3()]) ;

        if (options.sendDefaultPii && options.captureActionFormDataKeys) {
          await storeFormDataKeys(args, span);
        }
      }

      return origFn.call(this, args);
    },
    err => {
      // On Remix v2, we capture all unexpected errors (except the `Route Error Response`s / Thrown Responses) in `handleError` function.
      // This is both for consistency and also avoid duplicates such as primitives like `string` or `number` being captured twice.
      // Remix v1 does not have a `handleError` function, so we capture all errors here.
      if (isRemixV2 ? isResponse(err) : true) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        captureRemixServerException(err, name, args.request, true);
      }

      throw err;
    },
  );
}

async function extractResponseError(response) {
  const responseData = await extractData(response);

  if (typeof responseData === 'string' && responseData.length > 0) {
    return new Error(responseData);
  }

  if (response.statusText) {
    return new Error(response.statusText);
  }

  return responseData;
}

export { captureRemixServerException, errorHandleDataFunction, errorHandleDocumentRequestFunction };
//# sourceMappingURL=errors.js.map
