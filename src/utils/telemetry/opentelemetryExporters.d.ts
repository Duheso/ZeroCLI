/**
 * Type declarations for OpenTelemetry exporters that are dynamically imported
 * but not installed in the open-source repo (only loaded when configured).
 * Only declares packages NOT present in node_modules.
 */

declare module '@opentelemetry/exporter-metrics-otlp-grpc' {
  import type { PushMetricExporter } from '@opentelemetry/sdk-metrics'
  export class OTLPMetricExporter implements PushMetricExporter {
    constructor(config?: Record<string, unknown>)
    export(_metrics: any, _resultCallback: (result: any) => void): void
    forceFlush(): Promise<void>
    shutdown(): Promise<void>
  }
}

declare module '@opentelemetry/exporter-metrics-otlp-http' {
  import type { PushMetricExporter } from '@opentelemetry/sdk-metrics'
  export class OTLPMetricExporter implements PushMetricExporter {
    constructor(config?: Record<string, unknown>)
    export(_metrics: any, _resultCallback: (result: any) => void): void
    forceFlush(): Promise<void>
    shutdown(): Promise<void>
  }
}

declare module '@opentelemetry/exporter-metrics-otlp-proto' {
  import type { PushMetricExporter } from '@opentelemetry/sdk-metrics'
  export class OTLPMetricExporter implements PushMetricExporter {
    constructor(config?: Record<string, unknown>)
    export(_metrics: any, _resultCallback: (result: any) => void): void
    forceFlush(): Promise<void>
    shutdown(): Promise<void>
  }
}

declare module '@opentelemetry/exporter-prometheus' {
  import type { IMetricReader } from '@opentelemetry/sdk-metrics'
  export class PrometheusExporter implements IMetricReader {
    constructor(config?: Record<string, unknown>)
    setMetricProducer(_producer?: any): void
    selectAggregation(_instrumentType: any): any
    selectAggregationTemporality(_instrumentKind: any): any
    selectCardinalityLimit(_instrumentKind: any): number
    shutdown(): Promise<void>
    forceFlush(): Promise<void>
    onShutdown(): Promise<void>
    onForceFlush(): Promise<void>
    collect(): Promise<any>
  }
}

declare module '@opentelemetry/exporter-logs-otlp-grpc' {
  import type { LogRecordExporter } from '@opentelemetry/sdk-logs'
  export class OTLPLogExporter implements LogRecordExporter {
    constructor(config?: Record<string, unknown>)
    export(_items: any[], _resultCallback: (result: any) => void): void
    shutdown(): Promise<void>
  }
}

declare module '@opentelemetry/exporter-logs-otlp-proto' {
  import type { LogRecordExporter } from '@opentelemetry/sdk-logs'
  export class OTLPLogExporter implements LogRecordExporter {
    constructor(config?: Record<string, unknown>)
    export(_items: any[], _resultCallback: (result: any) => void): void
    shutdown(): Promise<void>
  }
}

declare module '@opentelemetry/exporter-trace-otlp-http' {
  import type { SpanExporter } from '@opentelemetry/sdk-trace-base'
  export class OTLPTraceExporter implements SpanExporter {
    constructor(config?: Record<string, unknown>)
    export(_items: any, _resultCallback: (result: any) => void): void
    shutdown(): Promise<void>
  }
}

declare module '@opentelemetry/exporter-trace-otlp-proto' {
  import type { SpanExporter } from '@opentelemetry/sdk-trace-base'
  export class OTLPTraceExporter implements SpanExporter {
    constructor(config?: Record<string, unknown>)
    export(_items: any, _resultCallback: (result: any) => void): void
    shutdown(): Promise<void>
  }
}
