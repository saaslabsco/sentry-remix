/*
 * Symbol extractor utility to be able to access internal fields of Remix requests.
 */
const getInternalSymbols = (
  request,

) => {
  const symbols = Object.getOwnPropertySymbols(request);
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bodyInternalsSymbol: symbols.find(symbol => symbol.toString().includes('Body internals')) ,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestInternalsSymbol: symbols.find(symbol => symbol.toString().includes('Request internals')) ,
  };
};

/**
 * Vendored from:
 * https://github.com/remix-run/web-std-io/blob/f715b354c8c5b8edc550c5442dec5712705e25e7/packages/fetch/src/utils/get-search.js#L5
 */
const getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }

  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === '#' ? '#' : '');
  return parsedURL.href[lastOffset - hash.length] === '?' ? '?' : '';
};

/**
 * Convert a Request to Node.js http request options.
 * The options object to be passed to http.request
 * Vendored / modified from:
 * https://github.com/remix-run/web-std-io/blob/f715b354c8c5b8edc550c5442dec5712705e25e7/packages/fetch/src/request.js#L259
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeRemixRequest = (request) => {
  const { requestInternalsSymbol, bodyInternalsSymbol } = getInternalSymbols(request);

  if (!requestInternalsSymbol && !request.headers) {
    throw new Error('Could not find request headers');
  }

  const internalRequest = request[requestInternalsSymbol];

  const parsedURL = internalRequest ? internalRequest.parsedURL : new URL(request.url);
  const headers = internalRequest ? new Headers(internalRequest.headers) : request.headers;

  // Fetch step 1.3
  if (!headers.has('Accept')) {
    headers.set('Accept', '*/*');
  }

  // HTTP-network-or-cache fetch steps 2.4-2.7
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = '0';
  }

  const internalBody = request[bodyInternalsSymbol];
  if (request.body !== null && internalBody) {
    const totalBytes = internalBody.size;
    // Set Content-Length if totalBytes is a number (that is not NaN)
    if (typeof totalBytes === 'number' && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }

  if (contentLengthValue) {
    headers.set('Content-Length', contentLengthValue);
  }

  // HTTP-network-or-cache fetch step 2.11
  if (!headers.has('User-Agent')) {
    headers.set('User-Agent', 'node-fetch');
  }

  // HTTP-network-or-cache fetch step 2.15
  if (request.compress && !headers.has('Accept-Encoding')) {
    headers.set('Accept-Encoding', 'gzip,deflate,br');
  }

  let { agent } = request;

  if (typeof agent === 'function') {
    agent = agent(parsedURL);
  }

  if (!headers.has('Connection') && !agent) {
    headers.set('Connection', 'close');
  }

  // HTTP-network fetch step 4.2
  // chunked encoding is handled by Node.js
  const search = getSearch(parsedURL);

  // Manually spread the URL object instead of spread syntax
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    // @ts-expect-error - it does not has a query
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: objectFromHeaders(headers),
    insecureHTTPParser: request.insecureHTTPParser,
    agent,

    // [SENTRY] For compatibility with Sentry SDK RequestData parser, adding `originalUrl` property.
    originalUrl: parsedURL.href,
  };

  return requestOptions;
};

// This function is a `polyfill` for Object.fromEntries()
function objectFromHeaders(headers) {
  const result = {};
  let iterator;

  if (hasIterator(headers)) {
    iterator = getIterator(headers) ;
  } else {
    return {};
  }

  for (const [key, value] of iterator) {
    result[key] = value;
  }
  return result;
}

function hasIterator(obj) {
  return obj !== null && typeof (obj )[Symbol.iterator] === 'function';
}

function getIterator(obj) {
  if (hasIterator(obj)) {
    return (obj )[Symbol.iterator]();
  }
  throw new Error('Object does not have an iterator');
}

export { getSearch, normalizeRemixRequest };
//# sourceMappingURL=web-fetch.js.map
