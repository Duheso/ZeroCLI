/**
 * Common interface for CLI transports (SSE, WebSocket, Hybrid).
 * Provides a uniform surface for session I/O regardless of the
 * underlying transport protocol.
 */
export interface Transport {
  /** Establish the transport connection. */
  connect(): Promise<void>

  /** Close the transport connection. */
  close(): void

  /** Write a single message through the transport. */
  write(message: Record<string, unknown>): Promise<void>

  /** Set callback for incoming data. */
  setOnData(callback: (data: string) => void): void

  /** Set callback for transport close. */
  setOnClose(callback: (closeCode?: number) => void): void
}
