import { applySdkMetadata } from '@sentry/core';
import { getDefaultIntegrations, isInitialized, init as init$1 } from '@sentry/node';
export * from '@sentry/node';
export { DEFAULT_USER_INCLUDES, NodeClient, SDK_VERSION, SEMANTIC_ATTRIBUTE_SENTRY_OP, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, Scope, addBreadcrumb, addEventProcessor, addIntegration, addOpenTelemetryInstrumentation, addRequestDataToEvent, anrIntegration, captureCheckIn, captureConsoleIntegration, captureEvent, captureException, captureFeedback, captureMessage, captureSession, close, connectIntegration, consoleIntegration, contextLinesIntegration, continueTrace, createGetModuleFromFilename, createTransport, cron, debugIntegration, dedupeIntegration, defaultStackParser, endSession, expressErrorHandler, expressIntegration, extraErrorDataIntegration, extractRequestData, fastifyIntegration, flush, functionToStringIntegration, generateInstrumentOnce, genericPoolIntegration, getActiveSpan, getAutoPerformanceIntegrations, getClient, getCurrentHub, getCurrentScope, getDefaultIntegrations, getGlobalScope, getIsolationScope, getRootSpan, getSentryRelease, getSpanDescendants, getSpanStatusFromHttpCode, graphqlIntegration, hapiIntegration, httpIntegration, inboundFiltersIntegration, initOpenTelemetry, isInitialized, kafkaIntegration, koaIntegration, lastEventId, linkedErrorsIntegration, localVariablesIntegration, makeNodeTransport, metrics, modulesIntegration, mongoIntegration, mongooseIntegration, mysql2Integration, mysqlIntegration, nativeNodeFetchIntegration, nestIntegration, nodeContextIntegration, onUncaughtExceptionIntegration, onUnhandledRejectionIntegration, parameterize, postgresIntegration, prismaIntegration, redisIntegration, requestDataIntegration, rewriteFramesIntegration, sessionTimingIntegration, setContext, setCurrentClient, setExtra, setExtras, setHttpStatus, setMeasurement, setTag, setTags, setUser, setupConnectErrorHandler, setupExpressErrorHandler, setupHapiErrorHandler, setupKoaErrorHandler, setupNestErrorHandler, spanToBaggageHeader, spanToJSON, spanToTraceHeader, spotlightIntegration, startInactiveSpan, startNewTrace, startSession, startSpan, startSpanManual, trpcMiddleware, withActiveSpan, withIsolationScope, withMonitor, withScope, zodErrorsIntegration } from '@sentry/node';
import { logger } from '@sentry/utils';
import { DEBUG_BUILD } from './utils/debug-build.js';
import { instrumentServer } from './utils/instrumentServer.js';
export { sentryHandleError, wrapHandleErrorWithSentry, wrapRemixHandleError } from './utils/instrumentServer.js';
import { httpIntegration } from './utils/integrations/http.js';
import { remixIntegration } from './utils/integrations/opentelemetry.js';
export { captureRemixServerException } from './utils/errors.js';
export { ErrorBoundary, withErrorBoundary } from '@sentry/react';
export { withSentry } from './client/performance.js';
export { captureRemixErrorBoundaryError } from './client/errors.js';
export { browserTracingIntegration } from './client/browserTracingIntegration.js';

/**
 * Returns the default Remix integrations.
 *
 * @param options The options for the SDK.
 */
function getRemixDefaultIntegrations(options) {
  return [
    ...getDefaultIntegrations(options ).filter(integration => integration.name !== 'Http'),
    httpIntegration(),
    options.autoInstrumentRemix ? remixIntegration() : undefined,
  ].filter(int => int) ;
}

/**
 * Returns the given Express createRequestHandler function.
 * This function is no-op and only returns the given function.
 *
 * @deprecated No need to wrap the Express request handler.
 * @param createRequestHandlerFn The Remix Express `createRequestHandler`.
 * @returns `createRequestHandler` function.
 */
function wrapExpressCreateRequestHandler(createRequestHandlerFn) {
  DEBUG_BUILD && logger.warn('wrapExpressCreateRequestHandler is deprecated and no longer needed.');

  return createRequestHandlerFn;
}

/** Initializes Sentry Remix SDK on Node. */
function init(options) {
  applySdkMetadata(options, 'remix', ['remix', 'node']);

  if (isInitialized()) {
    DEBUG_BUILD && logger.log('SDK already initialized');

    return;
  }

  options.defaultIntegrations = getRemixDefaultIntegrations(options );

  const client = init$1(options );

  instrumentServer(options);

  return client;
}

export { getRemixDefaultIntegrations, init, wrapExpressCreateRequestHandler };
//# sourceMappingURL=index.server.js.map
