/** Shape of the UDS messaging server (local type — not from node:net). */
export interface UdsMessagingServer {
  address(): string;
}

/** Default UDS socket path for the messaging server. */
export function getDefaultUdsSocketPath(): string {
  return process.env.ZERO_CLI_MESSAGING_SOCKET ?? '/tmp/.zerocli-uds.sock'
}

/** Start the UDS messaging server (stub — feature-gated). */
export async function startUdsMessaging(
  _socketPath: string,
  _options?: { isExplicit: boolean },
): Promise<UdsMessagingServer> {
  return { address() { return _socketPath } } as unknown as UdsMessagingServer
}
