import { logger } from '@sentry/utils';
import { DEBUG_BUILD } from './debug-build.js';
import { matchServerRoutes, getRequestMatch } from './vendor/response.js';

/**
 *
 */
async function storeFormDataKeys(args, span) {
  try {
    // We clone the request for Remix be able to read the FormData later.
    const clonedRequest = args.request.clone();

    // This only will return the last name of multiple file uploads in a single FormData entry.
    // We can switch to `unstable_parseMultipartFormData` when it's stable.
    // https://remix.run/docs/en/main/utils/parse-multipart-form-data#unstable_parsemultipartformdata
    const formData = await clonedRequest.formData();

    formData.forEach((value, key) => {
      span.setAttribute(`remix.action_form_data.${key}`, typeof value === 'string' ? value : '[non-string value]');
    });
  } catch (e) {
    DEBUG_BUILD && logger.warn('Failed to read FormData from request', e);
  }
}

/**
 * Get transaction name from routes and url
 */
function getTransactionName(routes, url) {
  const matches = matchServerRoutes(routes, url.pathname);
  const match = matches && getRequestMatch(url, matches);
  return match === null ? [url.pathname, 'url'] : [match.route.id || 'no-route-id', 'route'];
}

/**
 * Creates routes from the server route manifest
 *
 * @param manifest
 * @param parentId
 */
function createRoutes(manifest, parentId) {
  return Object.entries(manifest)
    .filter(([, route]) => route.parentId === parentId)
    .map(([id, route]) => ({
      ...route,
      children: createRoutes(manifest, id),
    }));
}

export { createRoutes, getTransactionName, storeFormDataKeys };
//# sourceMappingURL=utils.js.map
