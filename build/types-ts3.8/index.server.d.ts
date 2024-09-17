import { NodeClient } from '@sentry/node';
import { Integration } from '@sentry/types';
import { RemixOptions } from './utils/remixOptions';
export { addBreadcrumb, addEventProcessor, addIntegration, addOpenTelemetryInstrumentation, addRequestDataToEvent, anrIntegration, captureCheckIn, captureConsoleIntegration, captureEvent, captureException, captureFeedback, captureMessage, captureSession, close, connectIntegration, consoleIntegration, contextLinesIntegration, continueTrace, createGetModuleFromFilename, createTransport, cron, debugIntegration, dedupeIntegration, DEFAULT_USER_INCLUDES, defaultStackParser, endSession, expressErrorHandler, expressIntegration, extractRequestData, extraErrorDataIntegration, fastifyIntegration, flush, functionToStringIntegration, generateInstrumentOnce, genericPoolIntegration, getActiveSpan, getAutoPerformanceIntegrations, getClient, getCurrentHub, getCurrentScope, getDefaultIntegrations, getGlobalScope, getIsolationScope, getRootSpan, getSentryRelease, getSpanDescendants, getSpanStatusFromHttpCode, graphqlIntegration, hapiIntegration, httpIntegration, inboundFiltersIntegration, initOpenTelemetry, isInitialized, kafkaIntegration, koaIntegration, lastEventId, linkedErrorsIntegration, localVariablesIntegration, makeNodeTransport, metrics, modulesIntegration, mongoIntegration, mongooseIntegration, mysql2Integration, mysqlIntegration, nativeNodeFetchIntegration, nestIntegration, NodeClient, nodeContextIntegration, onUncaughtExceptionIntegration, onUnhandledRejectionIntegration, parameterize, postgresIntegration, prismaIntegration, redisIntegration, requestDataIntegration, rewriteFramesIntegration, Scope, SDK_VERSION, SEMANTIC_ATTRIBUTE_SENTRY_OP, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, sessionTimingIntegration, setContext, setCurrentClient, setExtra, setExtras, setHttpStatus, setMeasurement, setTag, setTags, setupConnectErrorHandler, setupExpressErrorHandler, setupHapiErrorHandler, setupKoaErrorHandler, setupNestErrorHandler, setUser, spanToBaggageHeader, spanToJSON, spanToTraceHeader, spotlightIntegration, startInactiveSpan, startNewTrace, startSession, startSpan, startSpanManual, trpcMiddleware, withActiveSpan, withIsolationScope, withMonitor, withScope, zodErrorsIntegration, } from '@sentry/node';
export * from '@sentry/node';
export { wrapRemixHandleError, sentryHandleError, wrapHandleErrorWithSentry, } from './utils/instrumentServer';
export { captureRemixServerException } from './utils/errors';
export { ErrorBoundary, withErrorBoundary } from '@sentry/react';
export { withSentry } from './client/performance';
export { captureRemixErrorBoundaryError } from './client/errors';
export { browserTracingIntegration } from './client/browserTracingIntegration';
export { SentryMetaArgs } from './utils/types';
/**
 * Returns the default Remix integrations.
 *
 * @param options The options for the SDK.
 */
export declare function getRemixDefaultIntegrations(options: RemixOptions): Integration[];
/**
 * Returns the given Express createRequestHandler function.
 * This function is no-op and only returns the given function.
 *
 * @deprecated No need to wrap the Express request handler.
 * @param createRequestHandlerFn The Remix Express `createRequestHandler`.
 * @returns `createRequestHandler` function.
 */
export declare function wrapExpressCreateRequestHandler(createRequestHandlerFn: unknown): unknown;
/** Initializes Sentry Remix SDK on Node. */
export declare function init(options: RemixOptions): NodeClient | undefined;
//# sourceMappingURL=index.server.d.ts.map
