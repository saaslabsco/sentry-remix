import type { DataFunctionArgs } from '@remix-run/node';
import type { Span, TransactionSource } from '@sentry/types';
import type { ServerRoute, ServerRouteManifest } from './vendor/types';
/**
 *
 */
export declare function storeFormDataKeys(args: DataFunctionArgs, span: Span): Promise<void>;
/**
 * Get transaction name from routes and url
 */
export declare function getTransactionName(routes: ServerRoute[], url: URL): [string, TransactionSource];
/**
 * Creates routes from the server route manifest
 *
 * @param manifest
 * @param parentId
 */
export declare function createRoutes(manifest: ServerRouteManifest, parentId?: string): ServerRoute[];
//# sourceMappingURL=utils.d.ts.map