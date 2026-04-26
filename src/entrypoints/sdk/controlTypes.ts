/**
 * SDK Control Types - TypeScript types for the control protocol.
 *
 * These types correspond to the Zod schemas in controlSchemas.ts.
 * They define the control protocol between SDK implementations and the CLI.
 *
 * SDK consumers should import from coreTypes.ts instead.
 * SDK builders who implement the bridge protocol use these types.
 */

/** Inner payload of a control request (discriminated on `subtype`). */
export type SDKControlRequestInner = {
  subtype: string
  [key: string]: unknown
}

/** Control request sent from the SDK to the CLI process. */
export type SDKControlRequest = {
  type: 'control_request'
  request_id: string
  request: SDKControlRequestInner
}

/** Successful control response. */
export type ControlResponse = {
  subtype: 'success'
  request_id: string
  response?: Record<string, unknown>
}

/** Error control response. */
export type ControlErrorResponse = {
  subtype: 'error'
  request_id: string
  error: string
  pending_permission_requests?: SDKControlRequest[]
}

/** Control response sent from the CLI to the SDK. */
export type SDKControlResponse = {
  type: 'control_response'
  response: ControlResponse | ControlErrorResponse
}

/** Cancels a currently open control request. */
export type SDKControlCancelRequest = {
  type: 'control_cancel_request'
  request_id: string
}

/** Keep-alive message to maintain WebSocket connection. */
export type SDKKeepAliveMessage = {
  type: 'keep_alive'
}

/** Updates environment variables at runtime. */
export type SDKUpdateEnvironmentVariablesMessage = {
  type: 'update_environment_variables'
  variables: Record<string, string>
}

/** Control request subtype: initialize a session. */
export type SDKControlInitializeRequest = SDKControlRequest & {
  request: SDKControlRequestInner & {
    subtype: 'initialize'
    [key: string]: unknown
  }
  systemPrompt?: string
  appendSystemPrompt?: string
  promptSuggestions?: string[]
  agents?: unknown
  hooks?: Record<string, unknown>
  jsonSchema?: Record<string, unknown>
  [key: string]: unknown
}

/** Control response for initialize. */
export type SDKControlInitializeResponse = {
  subtype: 'initialize'
  session_id?: string
  [key: string]: unknown
}

/** Control response for mcp/set_servers. */
export type SDKControlMcpSetServersResponse = {
  subtype: 'mcp_set_servers'
  [key: string]: unknown
}

/** Control response for reload_plugins. */
export type SDKControlReloadPluginsResponse = {
  subtype: 'reload_plugins'
  [key: string]: unknown
}

/** Control request subtype: permission request. */
export type SDKControlPermissionRequest = SDKControlRequest & {
  request: SDKControlRequestInner & {
    subtype: 'permission'
    tool_name?: string
    tool_use_id?: string
    input?: Record<string, unknown>
    description?: string
    permission_suggestions?: string[]
    blocked_path?: string
    [key: string]: unknown
  }
  tool_name?: string
  tool_use_id?: string
  input?: Record<string, unknown>
  description?: string
  permission_suggestions?: string[]
  blocked_path?: string
}

/** Partial assistant message streamed in real time. */
export type SDKPartialAssistantMessage = {
  type: 'partial_assistant_message'
  partial_message: string
  [key: string]: unknown
}

/** Messages emitted on stdout (from CLI to SDK). */
export type StdoutMessage =
  | { type: string; [key: string]: unknown }  // SDKMessage, SDKControlResponse, etc.

/** Messages accepted on stdin (from SDK to CLI). */
export type StdinMessage =
  | { type: 'user'; [key: string]: unknown }  // SDKUserMessage
  | SDKControlRequest
  | SDKControlResponse
  | SDKKeepAliveMessage
  | SDKUpdateEnvironmentVariablesMessage
