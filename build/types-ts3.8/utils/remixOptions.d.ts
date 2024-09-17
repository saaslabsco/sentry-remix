import { NodeOptions } from '@sentry/node';
import { BrowserOptions } from '@sentry/react';
import { Options } from '@sentry/types';
export type RemixOptions = (Options | BrowserOptions | NodeOptions) & {
    captureActionFormDataKeys?: Record<string, string | boolean>;
    autoInstrumentRemix?: boolean;
};
//# sourceMappingURL=remixOptions.d.ts.map
