Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const node = require('@sentry/node');
const utils = require('@sentry/utils');
const debugBuild = require('./utils/debug-build.js');
const instrumentServer = require('./utils/instrumentServer.js');
const http = require('./utils/integrations/http.js');
const opentelemetry = require('./utils/integrations/opentelemetry.js');
const errors = require('./utils/errors.js');
const react = require('@sentry/react');
const performance = require('./client/performance.js');
const errors$1 = require('./client/errors.js');
const browserTracingIntegration = require('./client/browserTracingIntegration.js');

/**
 * Returns the default Remix integrations.
 *
 * @param options The options for the SDK.
 */
function getRemixDefaultIntegrations(options) {
  return [
    ...node.getDefaultIntegrations(options ).filter(integration => integration.name !== 'Http'),
    http.httpIntegration(),
    options.autoInstrumentRemix ? opentelemetry.remixIntegration() : undefined,
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
  debugBuild.DEBUG_BUILD && utils.logger.warn('wrapExpressCreateRequestHandler is deprecated and no longer needed.');

  return createRequestHandlerFn;
}

/** Initializes Sentry Remix SDK on Node. */
function init(options) {
  core.applySdkMetadata(options, 'remix', ['remix', 'node']);

  if (node.isInitialized()) {
    debugBuild.DEBUG_BUILD && utils.logger.log('SDK already initialized');

    return;
  }

  options.defaultIntegrations = getRemixDefaultIntegrations(options );

  const client = node.init(options );

  instrumentServer.instrumentServer(options);

  return client;
}

exports.DEFAULT_USER_INCLUDES = node.DEFAULT_USER_INCLUDES;
exports.NodeClient = node.NodeClient;
exports.SDK_VERSION = node.SDK_VERSION;
exports.SEMANTIC_ATTRIBUTE_SENTRY_OP = node.SEMANTIC_ATTRIBUTE_SENTRY_OP;
exports.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = node.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = node.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = node.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
exports.Scope = node.Scope;
exports.addBreadcrumb = node.addBreadcrumb;
exports.addEventProcessor = node.addEventProcessor;
exports.addIntegration = node.addIntegration;
exports.addOpenTelemetryInstrumentation = node.addOpenTelemetryInstrumentation;
exports.addRequestDataToEvent = node.addRequestDataToEvent;
exports.anrIntegration = node.anrIntegration;
exports.captureCheckIn = node.captureCheckIn;
exports.captureConsoleIntegration = node.captureConsoleIntegration;
exports.captureEvent = node.captureEvent;
exports.captureException = node.captureException;
exports.captureFeedback = node.captureFeedback;
exports.captureMessage = node.captureMessage;
exports.captureSession = node.captureSession;
exports.close = node.close;
exports.connectIntegration = node.connectIntegration;
exports.consoleIntegration = node.consoleIntegration;
exports.contextLinesIntegration = node.contextLinesIntegration;
exports.continueTrace = node.continueTrace;
exports.createGetModuleFromFilename = node.createGetModuleFromFilename;
exports.createTransport = node.createTransport;
exports.cron = node.cron;
exports.debugIntegration = node.debugIntegration;
exports.dedupeIntegration = node.dedupeIntegration;
exports.defaultStackParser = node.defaultStackParser;
exports.endSession = node.endSession;
exports.expressErrorHandler = node.expressErrorHandler;
exports.expressIntegration = node.expressIntegration;
exports.extraErrorDataIntegration = node.extraErrorDataIntegration;
exports.extractRequestData = node.extractRequestData;
exports.fastifyIntegration = node.fastifyIntegration;
exports.flush = node.flush;
exports.functionToStringIntegration = node.functionToStringIntegration;
exports.generateInstrumentOnce = node.generateInstrumentOnce;
exports.genericPoolIntegration = node.genericPoolIntegration;
exports.getActiveSpan = node.getActiveSpan;
exports.getAutoPerformanceIntegrations = node.getAutoPerformanceIntegrations;
exports.getClient = node.getClient;
exports.getCurrentHub = node.getCurrentHub;
exports.getCurrentScope = node.getCurrentScope;
exports.getDefaultIntegrations = node.getDefaultIntegrations;
exports.getGlobalScope = node.getGlobalScope;
exports.getIsolationScope = node.getIsolationScope;
exports.getRootSpan = node.getRootSpan;
exports.getSentryRelease = node.getSentryRelease;
exports.getSpanDescendants = node.getSpanDescendants;
exports.getSpanStatusFromHttpCode = node.getSpanStatusFromHttpCode;
exports.graphqlIntegration = node.graphqlIntegration;
exports.hapiIntegration = node.hapiIntegration;
exports.httpIntegration = node.httpIntegration;
exports.inboundFiltersIntegration = node.inboundFiltersIntegration;
exports.initOpenTelemetry = node.initOpenTelemetry;
exports.isInitialized = node.isInitialized;
exports.kafkaIntegration = node.kafkaIntegration;
exports.koaIntegration = node.koaIntegration;
exports.lastEventId = node.lastEventId;
exports.linkedErrorsIntegration = node.linkedErrorsIntegration;
exports.localVariablesIntegration = node.localVariablesIntegration;
exports.makeNodeTransport = node.makeNodeTransport;
exports.metrics = node.metrics;
exports.modulesIntegration = node.modulesIntegration;
exports.mongoIntegration = node.mongoIntegration;
exports.mongooseIntegration = node.mongooseIntegration;
exports.mysql2Integration = node.mysql2Integration;
exports.mysqlIntegration = node.mysqlIntegration;
exports.nativeNodeFetchIntegration = node.nativeNodeFetchIntegration;
exports.nestIntegration = node.nestIntegration;
exports.nodeContextIntegration = node.nodeContextIntegration;
exports.onUncaughtExceptionIntegration = node.onUncaughtExceptionIntegration;
exports.onUnhandledRejectionIntegration = node.onUnhandledRejectionIntegration;
exports.parameterize = node.parameterize;
exports.postgresIntegration = node.postgresIntegration;
exports.prismaIntegration = node.prismaIntegration;
exports.redisIntegration = node.redisIntegration;
exports.requestDataIntegration = node.requestDataIntegration;
exports.rewriteFramesIntegration = node.rewriteFramesIntegration;
exports.sessionTimingIntegration = node.sessionTimingIntegration;
exports.setContext = node.setContext;
exports.setCurrentClient = node.setCurrentClient;
exports.setExtra = node.setExtra;
exports.setExtras = node.setExtras;
exports.setHttpStatus = node.setHttpStatus;
exports.setMeasurement = node.setMeasurement;
exports.setTag = node.setTag;
exports.setTags = node.setTags;
exports.setUser = node.setUser;
exports.setupConnectErrorHandler = node.setupConnectErrorHandler;
exports.setupExpressErrorHandler = node.setupExpressErrorHandler;
exports.setupHapiErrorHandler = node.setupHapiErrorHandler;
exports.setupKoaErrorHandler = node.setupKoaErrorHandler;
exports.setupNestErrorHandler = node.setupNestErrorHandler;
exports.spanToBaggageHeader = node.spanToBaggageHeader;
exports.spanToJSON = node.spanToJSON;
exports.spanToTraceHeader = node.spanToTraceHeader;
exports.spotlightIntegration = node.spotlightIntegration;
exports.startInactiveSpan = node.startInactiveSpan;
exports.startNewTrace = node.startNewTrace;
exports.startSession = node.startSession;
exports.startSpan = node.startSpan;
exports.startSpanManual = node.startSpanManual;
exports.trpcMiddleware = node.trpcMiddleware;
exports.withActiveSpan = node.withActiveSpan;
exports.withIsolationScope = node.withIsolationScope;
exports.withMonitor = node.withMonitor;
exports.withScope = node.withScope;
exports.zodErrorsIntegration = node.zodErrorsIntegration;
exports.sentryHandleError = instrumentServer.sentryHandleError;
exports.wrapHandleErrorWithSentry = instrumentServer.wrapHandleErrorWithSentry;
exports.wrapRemixHandleError = instrumentServer.wrapRemixHandleError;
exports.captureRemixServerException = errors.captureRemixServerException;
exports.ErrorBoundary = react.ErrorBoundary;
exports.withErrorBoundary = react.withErrorBoundary;
exports.withSentry = performance.withSentry;
exports.captureRemixErrorBoundaryError = errors$1.captureRemixErrorBoundaryError;
exports.browserTracingIntegration = browserTracingIntegration.browserTracingIntegration;
exports.getRemixDefaultIntegrations = getRemixDefaultIntegrations;
exports.init = init;
exports.wrapExpressCreateRequestHandler = wrapExpressCreateRequestHandler;
Object.prototype.hasOwnProperty.call(node, '__proto__') &&
  !Object.prototype.hasOwnProperty.call(exports, '__proto__') &&
  Object.defineProperty(exports, '__proto__', {
    enumerable: true,
    value: node['__proto__']
  });

Object.keys(node).forEach(k => {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = node[k];
});
//# sourceMappingURL=index.server.js.map
