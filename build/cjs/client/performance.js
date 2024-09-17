var {
  _optionalChain
} = require('@sentry/utils');

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const react = require('@sentry/react');
const utils = require('@sentry/utils');
const React = require('react');
const debugBuild = require('../utils/debug-build.js');
const futureFlags = require('../utils/futureFlags.js');

let _useEffect;
let _useLocation;
let _useMatches;

let _instrumentNavigation;

function getInitPathName() {
  if (react.WINDOW && react.WINDOW.location) {
    return react.WINDOW.location.pathname;
  }

  return undefined;
}

function isRemixV2(remixVersion) {
  return remixVersion === 2 || _optionalChain([futureFlags.getFutureFlagsBrowser, 'call', _ => _(), 'optionalAccess', _2 => _2.v2_errorBoundary]) || false;
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
      [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.pageload.remix',
      [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'url',
    },
  };

  react.startBrowserTracingPageLoadSpan(client, spanContext);
}

function startNavigationSpan(matches) {
  const lastMatch = matches[matches.length - 1];

  const client = react.getClient();

  if (!client || !lastMatch) {
    return;
  }

  const spanContext = {
    name: lastMatch.id,
    op: 'navigation',
    attributes: {
      [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.navigation.remix',
      [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
    },
  };

  react.startBrowserTracingNavigationSpan(client, spanContext);
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
      debugBuild.DEBUG_BUILD &&
        !utils.isNodeEnv() &&
        utils.logger.warn('Remix SDK was unable to wrap your root because of one or more missing parameters.');

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
        core.getCurrentScope().setTransactionName(routeName);

        const activeRootSpan = core.getActiveSpan();
        if (activeRootSpan) {
          const transaction = core.getRootSpan(activeRootSpan);

          if (transaction) {
            transaction.updateName(routeName);
            transaction.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, 'route');
          }
        }
      }

      isBaseLocation = true;
    }, []);

    _useEffect(() => {
      const activeRootSpan = core.getActiveSpan();

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

    if (!isRemixV2(futureFlags.readRemixVersionFromLoader()) && options.wrapWithErrorBoundary) {
      // @ts-expect-error Setting more specific React Component typing for `R` generic above
      // will break advanced type inference done by react router params
      return react.withErrorBoundary(OrigApp, options.errorBoundaryOptions)(props);
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

exports.setGlobals = setGlobals;
exports.startPageloadSpan = startPageloadSpan;
exports.withSentry = withSentry;
//# sourceMappingURL=performance.js.map
