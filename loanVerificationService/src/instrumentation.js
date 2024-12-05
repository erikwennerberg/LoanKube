const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const {
    OTLPTraceExporter,
  } = require('@opentelemetry/exporter-trace-otlp-proto');
  const {
    OTLPMetricExporter,
  } = require('@opentelemetry/exporter-metrics-otlp-proto');
  const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
  const { Resource } = require('@opentelemetry/resources');
  const {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
  } = require('@opentelemetry/semantic-conventions');


const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'loan-verification-service',
    [ATTR_SERVICE_VERSION]: '0.1.0',
  }),
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();