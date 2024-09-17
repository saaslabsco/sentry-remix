import type { browserTracingIntegration as originalBrowserTracingIntegration } from '@sentry/react';
import type { ErrorBoundaryProps } from '@sentry/react';
import type { Client } from '@sentry/types';
import * as React from 'react';
export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};
export interface RouteMatch<ParamKey extends string = string> {
    params: Params<ParamKey>;
    pathname: string;
    id: string;
    handle: unknown;
}
export type UseEffect = (cb: () => void, deps: unknown[]) => void;
export type UseLocation = () => {
    pathname: string;
    search?: string;
    hash?: string;
    state?: unknown;
    key?: unknown;
};
export type UseMatches = () => RouteMatch[] | null;
export type RemixBrowserTracingIntegrationOptions = Partial<Parameters<typeof originalBrowserTracingIntegration>[0]> & {
    useEffect?: UseEffect;
    useLocation?: UseLocation;
    useMatches?: UseMatches;
};
export declare function startPageloadSpan(client: Client): void;
/**
 * Wraps a remix `root` (see: https://remix.run/docs/en/v1/guides/migrating-react-router-app#creating-the-root-route)
 * To enable pageload/navigation tracing on every route.
 * Also wraps the application with `ErrorBoundary`.
 *
 * @param OrigApp The Remix root to wrap
 * @param options The options for ErrorBoundary wrapper.
 */
export declare function withSentry<P extends Record<string, unknown>, R extends React.ComponentType<P>>(OrigApp: R, options?: {
    wrapWithErrorBoundary?: boolean;
    errorBoundaryOptions?: ErrorBoundaryProps;
}): R;
export declare function setGlobals({ useEffect, useLocation, useMatches, instrumentNavigation, }: {
    useEffect?: UseEffect;
    useLocation?: UseLocation;
    useMatches?: UseMatches;
    instrumentNavigation?: boolean;
}): void;
//# sourceMappingURL=performance.d.ts.map