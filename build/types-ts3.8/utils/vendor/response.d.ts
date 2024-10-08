import { AgnosticRouteMatch, AgnosticRouteObject } from '@remix-run/router';
import { DeferredData, ErrorResponse, ServerRoute } from './types';
/**
 * Based on Remix Implementation
 *
 * https://github.com/remix-run/remix/blob/7688da5c75190a2e29496c78721456d6e12e3abe/packages/remix-server-runtime/data.ts#L131-L145
 */
export declare function extractData(response: Response): Promise<unknown>;
/**
 * Taken from Remix Implementation
 *
 * https://github.com/remix-run/remix/blob/32300ec6e6e8025602cea63e17a2201989589eab/packages/remix-server-runtime/responses.ts#L60-L77
 */
export declare function isResponse(value: any): value is Response;
export type JsonFunction = <Data>(data: Data, init?: number | ResponseInit) => Response;
/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 *
 * @see https://remix.run/api/remix#json
 *
 * https://github.com/remix-run/remix/blob/7688da5c75190a2e29496c78721456d6e12e3abe/packages/remix-server-runtime/responses.ts#L12-L24
 */
export declare const json: JsonFunction;
/**
 * Remix Implementation:
 * https://github.com/remix-run/remix/blob/38e127b1d97485900b9c220d93503de0deb1fc81/packages/remix-server-runtime/routeMatching.ts#L12-L24
 *
 * Changed so that `matchRoutes` function is passed in.
 */
export declare function matchServerRoutes(routes: ServerRoute[], pathname: string): AgnosticRouteMatch<string, AgnosticRouteObject>[] | null;
/**
 * https://github.com/remix-run/remix/blob/97999d02493e8114c39d48b76944069d58526e8d/packages/remix-server-runtime/server.ts#L573-L586
 */
export declare function isIndexRequestUrl(url: URL): boolean;
/**
 * https://github.com/remix-run/remix/blob/97999d02493e8114c39d48b76944069d58526e8d/packages/remix-server-runtime/server.ts#L588-L596
 */
export declare function getRequestMatch(url: URL, matches: AgnosticRouteMatch[]): AgnosticRouteMatch<string, AgnosticRouteObject>;
/**
 * https://github.com/remix-run/remix/blob/3e589152bc717d04e2054c31bea5a1056080d4b9/packages/remix-server-runtime/responses.ts#L75-L85
 */
export declare function isDeferredData(value: any): value is DeferredData;
/**
 * https://github.com/remix-run/react-router/blob/f9b3dbd9cbf513366c456b33d95227f42f36da63/packages/router/utils.ts#L1574
 *
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
export declare function isRouteErrorResponse(value: any): value is ErrorResponse;
//# sourceMappingURL=response.d.ts.map
