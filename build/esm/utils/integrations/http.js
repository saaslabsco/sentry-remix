import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { httpIntegration as httpIntegration$1 } from '@sentry/node';

// This integration is ported from the Next.JS SDK.

class RemixHttpIntegration extends HttpInstrumentation {
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
  return httpIntegration$1({
    ...options,
    _instrumentation: RemixHttpIntegration,
  });
}) ;

export { httpIntegration };
//# sourceMappingURL=http.js.map
