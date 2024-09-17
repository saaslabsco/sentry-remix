import type { NodeOptions } from '@sentry/node';
import type { BrowserOptions } from '@sentry/react';
import type { Options } from '@sentry/types';

export type RemixOptions = (Options | BrowserOptions | NodeOptions) & {
  captureActionFormDataKeys?: Record<string, string | boolean>;
  autoInstrumentRemix?: boolean;
};
