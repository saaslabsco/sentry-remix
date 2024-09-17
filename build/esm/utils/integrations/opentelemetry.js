import { _optionalChain } from '@sentry/utils';
import { RemixInstrumentation } from 'opentelemetry-instrumentation-remix';
import { defineIntegration, SEMANTIC_ATTRIBUTE_SENTRY_OP, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN } from '@sentry/core';
import { generateInstrumentOnce, getClient, spanToJSON } from '@sentry/node';

const INTEGRATION_NAME = 'Remix';

const instrumentRemix = generateInstrumentOnce(
  INTEGRATION_NAME,
  (_options) =>
    new RemixInstrumentation({
      actionFormDataAttributes: _optionalChain([_options, 'optionalAccess', _ => _.sendDefaultPii]) ? _optionalChain([_options, 'optionalAccess', _2 => _2.captureActionFormDataKeys]) : undefined,
    }),
);

const _remixIntegration = (() => {
  return {
    name: 'Remix',
    setupOnce() {
      const client = getClient();
      const options = _optionalChain([client, 'optionalAccess', _3 => _3.getOptions, 'call', _4 => _4()]);

      instrumentRemix(options);
    },

    setup(client) {
      client.on('spanStart', span => {
        addRemixSpanAttributes(span);
      });
    },
  };
}) ;

const addRemixSpanAttributes = (span) => {
  const attributes = spanToJSON(span).data || {};

  // this is one of: loader, action, requestHandler
  const type = attributes['code.function'];

  // If this is already set, or we have no remix span, no need to process again...
  if (attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP] || !type) {
    return;
  }

  // `requestHandler` span from `opentelemetry-instrumentation-remix` is the main server span.
  // It should be marked as the `http.server` operation.
  // The incoming requests are skipped by the custom `RemixHttpIntegration` package.
  // All other spans are marked as `remix` operations with their specific type [loader, action]
  const op = type === 'requestHandler' ? 'http.server' : `${type}.remix`;

  span.setAttributes({
    [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.remix',
    [SEMANTIC_ATTRIBUTE_SENTRY_OP]: op,
  });
};

/**
 * Instrumentation for aws-sdk package
 */
const remixIntegration = defineIntegration(_remixIntegration);

export { remixIntegration };
//# sourceMappingURL=opentelemetry.js.map
