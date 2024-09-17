import { httpIntegration as originalHttpIntegration } from '@sentry/node';
type HttpOptions = Parameters<typeof originalHttpIntegration>[0];
/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs and spans for outgoing HTTP requests which will be attached to the currently active span.
 */
export declare const httpIntegration: (options?: HttpOptions) => import("@sentry/types").Integration;
export {};
//# sourceMappingURL=http.d.ts.map
