import type { AppData, DataFunctionArgs, EntryContext, HandleDocumentRequestFunction } from '@remix-run/node';
import type { Span } from '@sentry/types';
import type { DataFunction, RemixRequest } from './vendor/types';
/**
 * Captures an exception happened in the Remix server.
 *
 * @param err The error to capture.
 * @param name The name of the origin function.
 * @param request The request object.
 * @param isRemixV2 Whether the error is from Remix v2 or not. Default is `true`.
 *
 * @returns A promise that resolves when the exception is captured.
 */
export declare function captureRemixServerException(err: unknown, name: string, request: Request, isRemixV2?: boolean): Promise<void>;
/**
 * Wraps the original `HandleDocumentRequestFunction` with error handling.
 *
 * @param origDocumentRequestFunction The original `HandleDocumentRequestFunction`.
 * @param requestContext The request context.
 * @param isRemixV2 Whether the Remix version is v2 or not.
 *
 * @returns The wrapped `HandleDocumentRequestFunction`.
 */
export declare function errorHandleDocumentRequestFunction(this: unknown, origDocumentRequestFunction: HandleDocumentRequestFunction, requestContext: {
    request: RemixRequest;
    responseStatusCode: number;
    responseHeaders: Headers;
    context: EntryContext;
    loadContext?: Record<string, unknown>;
}, isRemixV2: boolean): HandleDocumentRequestFunction;
/**
 * Wraps the original `DataFunction` with error handling.
 * This function also stores the form data keys if the action is being called.
 *
 * @param origFn The original `DataFunction`.
 * @param name The name of the function.
 * @param args The arguments of the function.
 * @param isRemixV2 Whether the Remix version is v2 or not.
 * @param span The span to store the form data keys.
 *
 * @returns The wrapped `DataFunction`.
 */
export declare function errorHandleDataFunction(this: unknown, origFn: DataFunction, name: string, args: DataFunctionArgs, isRemixV2: boolean, span?: Span): Promise<Response | AppData>;
//# sourceMappingURL=errors.d.ts.map