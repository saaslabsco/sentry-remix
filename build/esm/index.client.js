import { applySdkMetadata } from '@sentry/core';
import { init as init$1 } from '@sentry/react';
export * from '@sentry/react';
import { logger } from '@sentry/utils';
import { DEBUG_BUILD } from './utils/debug-build.js';
export { captureRemixErrorBoundaryError } from './client/errors.js';
export { withSentry } from './client/performance.js';
export { browserTracingIntegration } from './client/browserTracingIntegration.js';

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
  DEBUG_BUILD &&
    logger.warn(
      '`captureRemixServerException` is a server-only function and should not be called in the browser. ' +
        'This function is a no-op in the browser environment.',
    );
}

function init(options) {
  const opts = {
    ...options,
    environment: options.environment || process.env.NODE_ENV,
  };

  applySdkMetadata(opts, 'remix', ['remix', 'react']);

  return init$1(opts);
}

export { captureRemixServerException, init };
//# sourceMappingURL=index.client.js.map
