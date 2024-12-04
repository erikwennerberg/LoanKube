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



const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();