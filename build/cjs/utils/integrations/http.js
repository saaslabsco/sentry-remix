Object.defineProperty(exports, '__esModule', { value: true });

const instrumentationHttp = require('@opentelemetry/instrumentation-http');
const node = require('@sentry/node');

// This integration is ported from the Next.JS SDK.

class RemixHttpIntegration extends instrumentationHttp.HttpInstrumentation {
  // Instead of the default behavior, we just don't do any wrapping for incoming requests
   _getPatchIncomingRequestFunction(_component) {
    return (
      original,
    ) => {
      return function incomingRequest( event, ...args) {
        return original.apply(this, [event, ...args]);
      };
    };
  }
}

/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs and spans for outgoing HTTP requests which will be attached to the currently active span.
 */
const httpIntegration = ((options = {}) => {
  return node.httpIntegration({
    ...options,
    _instrumentation: RemixHttpIntegration,
  });
}) ;

exports.httpIntegration = httpIntegration;
//# sourceMappingURL=http.js.map
