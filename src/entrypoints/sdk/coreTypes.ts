// SDK Core Types - Common serializable types used by both SDK consumers and SDK builders.
//
// Types are generated from Zod schemas in coreSchemas.ts.
// To modify types:
// 1. Edit Zod schemas in coreSchemas.ts
// 2. Run: bun scripts/generate-sdk-types.ts
//
// Schemas are available in coreSchemas.ts for runtime validation but are not
// part of the public API.

// Re-export sandbox types for SDK consumers
export type {
  SandboxFilesystemConfig,
  SandboxIgnoreViolations,
  SandboxNetworkConfig,
  SandboxSettings,
} from '../sandboxTypes.js'
// Re-export all generated types
export * from './coreTypes.generated.js'

// Re-export utility types that can't be expressed as Zod schemas
export type { NonNullableUsage } from './sdkUtilityTypes.js'

// Manually defined types that are not in the generated file
export type ModelUsage = {
  inputTokens: number
  outputTokens: number
  cacheReadInputTokens: number
  cacheCreationInputTokens: number
  webSearchRequests: number
  costUSD: number
  contextWindow: number
  maxOutputTokens: number
}

/** Permission denial recorded in a result message. */
export type SDKPermissionDenial = {
  tool_name: string
  tool_use_id: string
  tool_input: Record<string, unknown>
}

/** Successful session result message. */
export type SDKResultSuccess = {
  type: 'result'
  subtype: 'success'
  duration_ms: number
  duration_api_ms: number
  is_error: boolean
  num_turns: number
  result: string
  stop_reason: string | null
  total_cost_usd: number
  usage: import('./sdkUtilityTypes.js').NonNullableUsage
  modelUsage: Record<string, ModelUsage>
  permission_denials: SDKPermissionDenial[]
  structured_output?: unknown
  fast_mode_state?: 'off' | 'cooldown' | 'on'
  uuid: string
  session_id: string
}

/** Error session result message. */
export type SDKResultError = {
  type: 'result'
  subtype:
    | 'error_during_execution'
    | 'error_max_turns'
    | 'error_max_budget_usd'
    | 'error_max_structured_output_retries'
  duration_ms: number
  duration_api_ms: number
  is_error: boolean
  num_turns: number
  stop_reason: string | null
  total_cost_usd: number
  usage: import('./sdkUtilityTypes.js').NonNullableUsage
  modelUsage: Record<string, ModelUsage>
  permission_denials: SDKPermissionDenial[]
  errors: string[]
  fast_mode_state?: 'off' | 'cooldown' | 'on'
  uuid: string
  session_id: string
}

/** Session result message (success or error). */
export type SDKResultMessage = SDKResultSuccess | SDKResultError

/** User message sent to the SDK. */
export type SDKUserMessage = {
  type: 'user'
  message: unknown
  parent_tool_use_id: string | null
  isSynthetic?: boolean
  tool_use_result?: unknown
  priority?: 'now' | 'next' | 'later'
  timestamp?: string
  uuid?: string
  session_id?: string
}

/** Session metadata returned by listSessions and getSessionInfo. */
export type SDKSessionInfo = {
  sessionId: string
  summary: string
  lastModified: number
  fileSize?: number
  customTitle?: string
  firstPrompt?: string
  gitBranch?: string
  cwd?: string
  tag?: string
  createdAt?: number
}

/**
 * All possible messages emitted by a ZeroCLI SDK session.
 * Discriminated union on `type`.
 */
export type SDKMessage = {
  type: string
  uuid?: string
  session_id?: string
  [key: string]: unknown
}

// Const arrays for runtime usage
export const HOOK_EVENTS = [
  'PreToolUse',
  'PostToolUse',
  'PostToolUseFailure',
  'Notification',
  'UserPromptSubmit',
  'SessionStart',
  'SessionEnd',
  'Stop',
  'StopFailure',
  'SubagentStart',
  'SubagentStop',
  'PreCompact',
  'PostCompact',
  'PermissionRequest',
  'PermissionDenied',
  'Setup',
  'TeammateIdle',
  'TaskCreated',
  'TaskCompleted',
  'Elicitation',
  'ElicitationResult',
  'ConfigChange',
  'WorktreeCreate',
  'WorktreeRemove',
  'InstructionsLoaded',
  'CwdChanged',
  'FileChanged',
] as const

export type HookEvent = (typeof HOOK_EVENTS)[number]

export const EXIT_REASONS = [
  'clear',
  'resume',
  'logout',
  'prompt_input_exit',
  'other',
  'bypass_permissions_disabled',
] as const

// ─── Additional types needed by SDK consumers ─────────────────────────────────

// Re-export permission types from the canonical types location to avoid duplication
export type { PermissionMode, PermissionUpdate } from '../../types/permissions.js'

/** MCP server status. */
export type McpServerStatus = 'connected' | 'disconnected' | 'error' | 'connecting'

/** MCP server configuration for process transport. */
export type McpServerConfigForProcessTransport = {
  type?: 'process' | 'stdio' | 'sdk' | string
  command?: string
  args?: string[]
  env?: Record<string, string>
  scope?: 'user' | 'local' | 'project' | 'managed' | 'dynamic' | 'enterprise' | 'claudeai' | string
  [key: string]: unknown
}

/** Model information. */
export type ModelInfo = {
  id: string
  displayName: string
  supportsThinking?: boolean
  supportsVision?: boolean
}

/** SDK status message. */
export type SDKStatus = 'compacting' | null

/** SDK compact boundary message. */
export type SDKCompactBoundaryMessage = {
  type: 'compact_boundary'
  uuid: string
  session_id: string
  preTokens: number
  trigger: 'manual' | 'auto'
}

/** SDK status message. */
export type SDKStatusMessage = {
  type: 'status'
  status: SDKStatus
  uuid: string
  session_id: string
}

/** SDK system message (init). */
export type SDKSystemMessage = {
  type: 'system'
  subtype: string
  uuid: string
  session_id: string
  [key: string]: unknown
}

/** Replay of a user message from history. */
export type SDKUserMessageReplay = SDKUserMessage & {
  isReplay: true
}

/** Result of a files rewind operation. */
export type RewindFilesResult = {
  success: boolean
  canRewind?: boolean
  restoredFiles: string[]
  errors: string[]
  error?: string
}

/** Permission result from a permission check. */
export type PermissionResult =
  | { behavior: 'allow'; updatedInput?: Record<string, unknown> }
  | { behavior: 'deny'; message?: string }
  | { behavior: 'ask' }

/** Base hook input fields present in all hook events. */
export type HookInput = {
  session_id: string
  transcript_path: string
  cwd: string
  permission_mode?: string
  agent_id?: string
  agent_type?: string
  hook_event_name: HookEvent
  // Common optional fields used by hook subtypes
  tool_name?: string
  tool_input?: unknown
  tool_output?: unknown
  tool_use_id?: string
  tool_response?: unknown
  error?: string
  message?: string
  prompt?: string
  file_path?: string
  stop_reason?: string
  source?: string
  trigger?: string
  notification_type?: string
  reason?: string
  load_reason?: string
  mcp_server_name?: string
}

/** Output of a hook invocation in JSON mode. */
export type HookJSONOutput = {
  continue?: boolean
  stopReason?: string
  suppressOutput?: boolean
  decision?: 'approve' | 'block'
  reason?: string
  updatedInput?: Record<string, unknown>
  additionalContext?: string
  initialUserMessage?: string
  hookEventName?: string
  [key: string]: unknown
}


// Hook input types (stubs for open-source mirror)
type HookInputExt = HookInput & { tool_input?: unknown; title?: string; error_details?: unknown; teammate_name?: string; team_name?: string; task_id?: string; task_subject?: string; task_description?: unknown; model?: string; custom_instructions?: string; compact_summary?: string; old_cwd?: string; new_cwd?: string; event?: string; memory_type?: string; globs?: string[]; mode?: string; elicitation_id?: string; action?: string; url?: string; matchQuery?: unknown; last_assistant_message?: string; stop_hook_active?: boolean; agent_id?: unknown; agent_transcript_path?: string; agent_type?: string; is_interrupt?: boolean; permission_suggestions?: unknown[]; trigger_file_path?: string; parent_file_path?: string; requested_schema?: unknown; content?: unknown }
export type SessionStartHookInput = HookInputExt
export type SessionEndHookInput = HookInputExt
export type StopHookInput = HookInputExt
export type PreToolUseHookInput = HookInputExt
export type PostToolUseHookInput = HookInputExt
export type PostToolUseFailureHookInput = HookInputExt
export type NotificationHookInput = HookInputExt
export type UserPromptSubmitHookInput = HookInputExt
export type PermissionDeniedHookInput = HookInputExt
export type PermissionRequestHookInput = HookInputExt
export type PreCompactHookInput = HookInputExt
export type PostCompactHookInput = HookInputExt
export type SubagentStartHookInput = HookInputExt
export type SubagentStopHookInput = HookInputExt
export type StopFailureHookInput = HookInputExt
export type TaskCreatedHookInput = HookInputExt
export type TaskCompletedHookInput = HookInputExt
export type TeammateIdleHookInput = HookInputExt
export type InstructionsLoadedHookInput = HookInputExt
export type FileChangedHookInput = HookInputExt
export type CwdChangedHookInput = HookInputExt
export type ConfigChangeHookInput = HookInputExt
export type SetupHookInput = HookInputExt
export type ElicitationHookInput = HookInputExt
export type ElicitationResultHookInput = HookInputExt

// Additional SDK message types
export type SDKAssistantMessageError = string | { type: 'error'; error: string; [key: string]: unknown }
export type SDKPartialAssistantMessage = { type: 'partial_assistant_message'; partial_message: string; [key: string]: unknown }
export type SDKToolProgressMessage = { type: 'tool_progress'; tool_use_id: string; progress: unknown; [key: string]: unknown }
export type SDKRateLimitInfo = { requests_per_minute?: number; tokens_per_minute?: number; [key: string]: unknown }
export type ApiKeySource = 'env' | 'config' | 'prompt' | string
export type SyncHookJSONOutput = HookJSONOutput
