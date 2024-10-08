/// <reference types="node" />
import type { Agent } from 'https';
import type * as Express from 'express';
import type { ComponentType } from 'react';
type Dev = {
    command?: string;
    scheme?: string;
    host?: string;
    port?: number;
    restart?: boolean;
    tlsKey?: string;
    tlsCert?: string;
};
export interface FutureConfig {
    unstable_dev: boolean | Dev;
    /** @deprecated Use the `postcss` config option instead */
    unstable_postcss: boolean;
    /** @deprecated Use the `tailwind` config option instead */
    unstable_tailwind: boolean;
    v2_errorBoundary: boolean;
    v2_headers: boolean;
    v2_meta: boolean;
    v2_normalizeFormMethod: boolean;
    v2_routeConvention: boolean;
}
export interface RemixConfig {
    [key: string]: any;
    future: FutureConfig;
}
export interface ErrorResponse {
    status: number;
    statusText: string;
    data: any;
    error?: Error;
    internal: boolean;
}
export type RemixRequestState = {
    method: string;
    redirect: RequestRedirect;
    headers: Headers;
    parsedURL: URL;
    signal: AbortSignal | null;
    size: number | null;
};
export type RemixRequest = Request & Record<symbol | string, RemixRequestState> & {
    agent?: Agent | ((parsedURL: URL) => Agent) | undefined;
};
export type AppLoadContext = Record<string, unknown> & {
    __sentry_express_wrapped__?: boolean;
};
export type AppData = any;
export type RequestHandler = (request: RemixRequest, loadContext?: AppLoadContext) => Promise<Response>;
export type CreateRequestHandlerFunction = (this: unknown, build: ServerBuild, ...args: any[]) => RequestHandler;
export type ServerRouteManifest = RouteManifest<Omit<ServerRoute, 'children'>>;
export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};
export type ExpressRequest = Express.Request;
export type ExpressResponse = Express.Response;
export type ExpressNextFunction = Express.NextFunction;
export interface Route {
    index: false | undefined;
    caseSensitive?: boolean;
    id: string;
    parentId?: string;
    path?: string;
}
export interface EntryRoute extends Route {
    hasAction: boolean;
    hasLoader: boolean;
    hasCatchBoundary: boolean;
    hasErrorBoundary: boolean;
    imports?: string[];
    module: string;
}
export interface RouteData {
    [routeId: string]: AppData;
}
export type DeferredData = {
    data: Record<string, unknown>;
    init?: ResponseInit;
    deferredKeys: string[];
    subscribe(fn: (aborted: boolean, settledKey?: string) => void): () => boolean;
    cancel(): void;
    resolveData(signal: AbortSignal): Promise<boolean>;
};
export interface MetaFunction {
    (args: {
        data: AppData;
        parentsData: RouteData;
        params: Params;
        location: Location;
    }): HtmlMetaDescriptor;
}
export interface HtmlMetaDescriptor {
    [name: string]: null | string | undefined | Record<string, string> | Array<Record<string, string> | string>;
    charset?: 'utf-8';
    charSet?: 'utf-8';
    title?: string;
}
export type CatchBoundaryComponent = ComponentType<{}>;
export type RouteComponent = ComponentType<{}>;
export type ErrorBoundaryComponent = ComponentType<{
    error: Error;
}>;
export type RouteHandle = any;
export interface LinksFunction {
    (): any[];
}
export interface EntryRouteModule {
    CatchBoundary?: CatchBoundaryComponent;
    ErrorBoundary?: ErrorBoundaryComponent;
    default: RouteComponent;
    handle?: RouteHandle;
    links?: LinksFunction;
    meta?: MetaFunction | HtmlMetaDescriptor;
}
export interface ActionFunction {
    (args: DataFunctionArgs): Promise<Response> | Response | Promise<AppData> | AppData;
}
export interface LoaderFunction {
    (args: DataFunctionArgs): Promise<Response> | Response | Promise<AppData> | AppData;
}
export interface HeadersFunction {
    (args: {
        loaderHeaders: Headers;
        parentHeaders: Headers;
        actionHeaders: Headers;
    }): Headers | HeadersInit;
}
export interface ServerRouteModule extends EntryRouteModule {
    action?: ActionFunction;
    headers?: HeadersFunction | {
        [name: string]: string;
    };
    loader?: LoaderFunction;
}
export interface ServerRoute extends Route {
    children: ServerRoute[];
    module: ServerRouteModule;
}
export interface RouteManifest<Route> {
    [routeId: string]: Route;
}
export interface ServerBuild {
    entry: {
        module: ServerEntryModule;
    };
    routes: ServerRouteManifest;
    assets: AssetsManifest;
    publicPath?: string;
    assetsBuildDirectory?: string;
    future?: FutureConfig;
}
export interface HandleDocumentRequestFunction {
    (request: RemixRequest, responseStatusCode: number, responseHeaders: Headers, context: EntryContext, loadContext?: AppLoadContext): Promise<Response> | Response;
}
export interface HandleDataRequestFunction {
    (response: Response, args: DataFunctionArgs): Promise<Response> | Response;
}
interface ServerEntryModule {
    default: HandleDocumentRequestFunction;
    handleDataRequest?: HandleDataRequestFunction;
}
export interface DataFunctionArgs {
    request: RemixRequest;
    context: AppLoadContext;
    params: Params;
}
export interface DataFunction {
    (args: DataFunctionArgs): Promise<Response> | Response | Promise<AppData> | AppData;
}
export interface RouteMatch<Route> {
    params: Params;
    pathname: string;
    route: Route;
}
export interface EntryContext {
    [name: string]: any;
}
export interface AssetsManifest {
    entry: {
        imports: string[];
        module: string;
    };
    routes: RouteManifest<EntryRoute>;
    url: string;
    version: string;
}
export type ExpressRequestHandler = (req: any, res: any, next: any) => Promise<void>;
export type ExpressCreateRequestHandler = (this: unknown, options: any) => ExpressRequestHandler;
export interface ExpressCreateRequestHandlerOptions {
    build: ServerBuild;
    getLoadContext?: GetLoadContextFunction;
    mode?: string;
}
export type GetLoadContextFunction = (req: any, res: any) => AppLoadContext;
export {};
//# sourceMappingURL=types.d.ts.map