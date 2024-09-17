import { _optionalChain } from '@sentry/utils';
import { GLOBAL_OBJ } from '@sentry/utils';

/**
 * Get the future flags from the Remix browser context
 *
 * @returns The future flags
 */
function getFutureFlagsBrowser() {
  const window = GLOBAL_OBJ ;

  if (!window.__remixContext) {
    return;
  }

  return window.__remixContext.future;
}

/**
 * Get the future flags from the Remix server build
 *
 * @param build The Remix server build
 *
 * @returns The future flags
 */
function getFutureFlagsServer(build) {
  return build.future;
}

/**
 * Learn Remix version from the server build object
 * V2 Server builds have a non-optional `mode` property
 *
 * @returns The major version number
 */
function getRemixVersionFromBuild(build) {
  if ('mode' in build) {
    return 2;
  }

  return 1;
}

/**
 * Read Remix version from the Remix context on the browser
 *
 * @returns The major version number
 */
function readRemixVersionFromLoader() {
  const window = GLOBAL_OBJ ;

  return _optionalChain([window, 'access', _ => _.__remixContext, 'optionalAccess', _2 => _2.state, 'optionalAccess', _3 => _3.loaderData, 'optionalAccess', _4 => _4.root, 'optionalAccess', _5 => _5.remixVersion]);
}

export { getFutureFlagsBrowser, getFutureFlagsServer, getRemixVersionFromBuild, readRemixVersionFromLoader };
//# sourceMappingURL=futureFlags.js.map
