import { _optionalChain } from '@sentry/utils';
import { getCurrentScope, getActiveSpan, getRootSpan, SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN } from '@sentry/core';
import { startBrowserTracingPageLoadSpan, withErrorBoundary, WINDOW, getClient, startBrowserTracingNavigationSpan } from '@sentry/react';
import { isNodeEnv, logger } from '@sentry/utils';
import * as React from 'react';
import { DEBUG_BUILD } from '../utils/debug-build.js';
import { readRemixVersionFromLoader, getFutureFlagsBrowser } from '../utils/futureFlags.js';

let _useEffect;
let _useLocation;
let _useMatches;

let _instrumentNavigation;

function getInitPathName() {
  if (WINDOW && WINDOW.location) {
    return WINDOW.location.pathname;
  }

  return undefined;
}

function isRemixV2(remixVersion) {
  return remixVersion === 2 || _optionalChain([getFutureFlagsBrowser, 'call', _ => _(), 'optionalAccess', _2 => _2.v2_errorBoundary]) || false;
}

function startPageloadSpan(client) {
  const initPathName = getInitPathName();

  if (!initPathName) {
    return;
  }

  const spanContext = {
    name: initPathName,
    op: 'pageload',
    attributes: {
      [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.pageload.remix',
      [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'url',
    },
  };

  startBrowserTracingPageLoadSpan(client, spanContext);
}

function startNavigationSpan(matches) {
  const lastMatch = matches[matches.length - 1];

  const client = getClient();

  if (!client || !lastMatch) {
    return;
  }

  const spanContext = {
    name: lastMatch.id,
    op: 'navigation',
    attributes: {
      [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.navigation.remix',
      [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
    },
  };

  startBrowserTracingNavigationSpan(client, spanContext);
}

/**
 * Wraps a remix `root` (see: https://remix.run/docs/en/v1/guides/migrating-react-router-app#creating-the-root-route)
 * To enable pageload/navigation tracing on every route.
 * Also wraps the application with `ErrorBoundary`.
 *
 * @param OrigApp The Remix root to wrap
 * @param options The options for ErrorBoundary wrapper.
 */
function withSentry(
  OrigApp,
  options

 = {
    // We don't want to wrap application with Sentry's ErrorBoundary by default for Remix v2
    wrapWithErrorBoundary: true,
    errorBoundaryOptions: {},
  },
) {
  const SentryRoot = (props) => {
    // Early return when any of the required functions is not available.
    if (!_useEffect || !_useLocation || !_useMatches) {
      DEBUG_BUILD &&
        !isNodeEnv() &&
        logger.warn('Remix SDK was unable to wrap your root because of one or more missing parameters.');

      // @ts-expect-error Setting more specific React Component typing for `R` generic above
      // will break advanced type inference done by react router params
      return React.createElement(OrigApp, { ...props,} );
    }

    let isBaseLocation = false;

    const location = _useLocation();
    const matches = _useMatches();

    _useEffect(() => {
      const lastMatch = matches && matches[matches.length - 1];
      if (lastMatch) {
        const routeName = lastMatch.id;
        getCurrentScope().setTransactionName(routeName);

        const activeRootSpan = getActiveSpan();
        if (activeRootSpan) {
          const transaction = getRootSpan(activeRootSpan);

          if (transaction) {
            transaction.updateName(routeName);
            transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, 'route');
          }
        }
      }

      isBaseLocation = true;
    }, []);

    _useEffect(() => {
      const activeRootSpan = getActiveSpan();

      if (isBaseLocation) {
        if (activeRootSpan) {
          activeRootSpan.end();
        }

        return;
      }

      if (_instrumentNavigation && matches && matches.length) {
        if (activeRootSpan) {
          activeRootSpan.end();
        }

        startNavigationSpan(matches);
      }
    }, [location]);

    isBaseLocation = false;

    if (!isRemixV2(readRemixVersionFromLoader()) && options.wrapWithErrorBoundary) {
      // @ts-expect-error Setting more specific React Component typing for `R` generic above
      // will break advanced type inference done by react router params
      return withErrorBoundary(OrigApp, options.errorBoundaryOptions)(props);
    }
    // @ts-expect-error Setting more specific React Component typing for `R` generic above
    // will break advanced type inference done by react router params
    return React.createElement(OrigApp, { ...props,} );
  };

  // @ts-expect-error Setting more specific React Component typing for `R` generic above
  // will break advanced type inference done by react router params
  return SentryRoot;
}

function setGlobals({
  useEffect,
  useLocation,
  useMatches,
  instrumentNavigation,
}

) {
  _useEffect = useEffect;
  _useLocation = useLocation;
  _useMatches = useMatches;
  _instrumentNavigation = instrumentNavigation;
}

export { setGlobals, startPageloadSpan, withSentry };
//# sourceMappingURL=performance.js.map
