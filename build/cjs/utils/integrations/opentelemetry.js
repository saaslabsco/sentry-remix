var {
  _optionalChain
} = require('@sentry/utils');

Object.defineProperty(exports, '__esModule', { value: true });

const opentelemetryInstrumentationRemix = require('opentelemetry-instrumentation-remix');
const core = require('@sentry/core');
const node = require('@sentry/node');

const INTEGRATION_NAME = 'Remix';

const instrumentRemix = node.generateInstrumentOnce(
  INTEGRATION_NAME,
  (_options) =>
    new opentelemetryInstrumentationRemix.RemixInstrumentation({
      actionFormDataAttributes: _optionalChain([_options, 'optionalAccess', _ => _.sendDefaultPii]) ? _optionalChain([_options, 'optionalAccess', _2 => _2.captureActionFormDataKeys]) : undefined,
    }),
);

const _remixIntegration = (() => {
  return {
    name: 'Remix',
    setupOnce() {
      const client = node.getClient();
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
  const attributes = node.spanToJSON(span).data || {};

  // this is one of: loader, action, requestHandler
  const type = attributes['code.function'];

  // If this is already set, or we have no remix span, no need to process again...
  if (attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_OP] || !type) {
    return;
  }

  // `requestHandler` span from `opentelemetry-instrumentation-remix` is the main server span.
  // It should be marked as the `http.server` operation.
  // The incoming requests are skipped by the custom `RemixHttpIntegration` package.
  // All other spans are marked as `remix` operations with their specific type [loader, action]
  const op = type === 'requestHandler' ? 'http.server' : `${type}.remix`;

  span.setAttributes({
    [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.remix',
    [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: op,
  });
};

/**
 * Instrumentation for aws-sdk package
 */
const remixIntegration = core.defineIntegration(_remixIntegration);

exports.remixIntegration = remixIntegration;
//# sourceMappingURL=opentelemetry.js.map
