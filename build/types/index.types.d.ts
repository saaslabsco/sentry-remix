export * from './index.client';
export * from './index.server';
import type { Integration, Options, StackParser } from '@sentry/types';
import * as clientSdk from './index.client';
import * as serverSdk from './index.server';
import type { RemixOptions } from './utils/remixOptions';
/** Initializes Sentry Remix SDK */
export declare function init(options: RemixOptions): void;
export declare const linkedErrorsIntegration: typeof clientSdk.linkedErrorsIntegration;
export declare const contextLinesIntegration: typeof clientSdk.contextLinesIntegration;
export declare const getDefaultIntegrations: (options: Options) => Integration[];
export declare const defaultStackParser: StackParser;
export declare function captureRemixServerException(err: unknown, name: string, request: Request, isRemixV2?: boolean): Promise<void>;
export declare const getCurrentHub: typeof clientSdk.getCurrentHub;
export declare const getClient: typeof clientSdk.getClient;
export declare const continueTrace: typeof clientSdk.continueTrace;
export declare const close: typeof clientSdk.close;
export declare const flush: typeof clientSdk.flush;
export declare const lastEventId: typeof clientSdk.lastEventId;
export declare const metrics: typeof clientSdk.metrics & typeof serverSdk.metrics;
//# sourceMappingURL=index.types.d.ts.map