Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const react = require('@sentry/react');
const utils = require('@sentry/utils');
const debugBuild = require('./utils/debug-build.js');
const errors = require('./client/errors.js');
const performance = require('./client/performance.js');
const browserTracingIntegration = require('./client/browserTracingIntegration.js');

// This is a no-op function that does nothing. It's here to make sure that the
// function signature is the same as in the server SDK.
// See issue: https://github.com/getsentry/sentry-javascript/issues/9594
/* eslint-disable @typescript-eslint/no-unused-vars */
async function captureRemixServerException(
  err,
  name,
  request,
  isRemixV2,
) {
  debugBuild.DEBUG_BUILD &&
    utils.logger.warn(
      '`captureRemixServerException` is a server-only function and should not be called in the browser. ' +
        'This function is a no-op in the browser environment.',
    );
}

function init(options) {
  const opts = {
    ...options,
    environment: options.environment || process.env.NODE_ENV,
  };

  core.applySdkMetadata(opts, 'remix', ['remix', 'react']);

  return react.init(opts);
}

exports.captureRemixErrorBoundaryError = errors.captureRemixErrorBoundaryError;
exports.withSentry = performance.withSentry;
exports.browserTracingIntegration = browserTracingIntegration.browserTracingIntegration;
exports.captureRemixServerException = captureRemixServerException;
exports.init = init;
Object.prototype.hasOwnProperty.call(react, '__proto__') &&
  !Object.prototype.hasOwnProperty.call(exports, '__proto__') &&
  Object.defineProperty(exports, '__proto__', {
    enumerable: true,
    value: react['__proto__']
  });

Object.keys(react).forEach(k => {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = react[k];
});
//# sourceMappingURL=index.client.js.map
