Object.defineProperty(exports, '__esModule', { value: true });

const react = require('@sentry/react');
const performance = require('./performance.js');

/**
 * Creates a browser tracing integration for Remix applications.
 * This integration will create pageload and navigation spans.
 */
function browserTracingIntegration(options) {
  const { instrumentPageLoad = true, instrumentNavigation = true, useEffect, useLocation, useMatches } = options;

  performance.setGlobals({
    useEffect,
    useLocation,
    useMatches,
    instrumentNavigation,
  });

  const browserTracingIntegrationInstance = react.browserTracingIntegration({
    ...options,
    instrumentPageLoad: false,
    instrumentNavigation: false,
  });

  return {
    ...browserTracingIntegrationInstance,
    afterAllSetup(client) {
      browserTracingIntegrationInstance.afterAllSetup(client);

      if (instrumentPageLoad) {
        performance.startPageloadSpan(client);
      }
    },
  };
}

exports.browserTracingIntegration = browserTracingIntegration;
//# sourceMappingURL=browserTracingIntegration.js.map
