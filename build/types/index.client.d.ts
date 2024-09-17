import type { Client } from '@sentry/types';
import type { RemixOptions } from './utils/remixOptions';
export { captureRemixErrorBoundaryError } from './client/errors';
export { withSentry } from './client/performance';
export { browserTracingIntegration } from './client/browserTracingIntegration';
export declare function captureRemixServerException(err: unknown, name: string, request: Request, isRemixV2?: boolean): Promise<void>;
export * from '@sentry/react';
export declare function init(options: RemixOptions): Client | undefined;
//# sourceMappingURL=index.client.d.ts.map