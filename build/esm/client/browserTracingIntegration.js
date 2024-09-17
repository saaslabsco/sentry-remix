import { browserTracingIntegration as browserTracingIntegration$1 } from '@sentry/react';
import { startPageloadSpan, setGlobals } from './performance.js';

/**
 * Creates a browser tracing integration for Remix applications.
 * This integration will create pageload and navigation spans.
 */
function browserTracingIntegration(options) {
  const { instrumentPageLoad = true, instrumentNavigation = true, useEffect, useLocation, useMatches } = options;

  setGlobals({
    useEffect,
    useLocation,
    useMatches,
    instrumentNavigation,
  });

  const browserTracingIntegrationInstance = browserTracingIntegration$1({
    ...options,
    instrumentPageLoad: false,
    instrumentNavigation: false,
  });

  return {
    ...browserTracingIntegrationInstance,
    afterAllSetup(client) {
      browserTracingIntegrationInstance.afterAllSetup(client);

      if (instrumentPageLoad) {
        startPageloadSpan(client);
      }
    },
  };
}

export { browserTracingIntegration };
//# sourceMappingURL=browserTracingIntegration.js.map
