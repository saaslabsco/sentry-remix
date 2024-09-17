import type { RemixOptions } from './remixOptions';
import type { DataFunctionArgs, ServerBuild } from './vendor/types';
/**
 * Sentry utility to be used in place of `handleError` function of Remix v2
 * Remix Docs: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
 *
 * Should be used in `entry.server` like:
 *
 * export const handleError = Sentry.sentryHandleError
 */
export declare function sentryHandleError(err: unknown, { request }: DataFunctionArgs): void;
/**
 * @deprecated Use `sentryHandleError` instead.
 */
export declare const wrapRemixHandleError: typeof sentryHandleError;
/**
 * Sentry wrapper for Remix's `handleError` function.
 * Remix Docs: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
 */
export declare function wrapHandleErrorWithSentry(origHandleError: (err: unknown, args: {
    request: unknown;
}) => void): (err: unknown, args: {
    request: unknown;
}) => void;
/**
 * Instruments `remix` ServerBuild for performance tracing and error tracking.
 */
export declare function instrumentBuild(build: ServerBuild | (() => ServerBuild | Promise<ServerBuild>), options: RemixOptions): ServerBuild | (() => ServerBuild | Promise<ServerBuild>);
/**
 * Monkey-patch Remix's `createRequestHandler` from `@remix-run/server-runtime`
 * which Remix Adapters (https://remix.run/docs/en/v1/api/remix) use underneath.
 */
export declare function instrumentServer(options: RemixOptions): void;
//# sourceMappingURL=instrumentServer.d.ts.map