/**
 * Core message types for the ZeroCLI REPL.
 *
 * These types describe the internal message format used to represent
 * conversation state in the CLI. They are distinct from the SDK message
 * types (see entrypoints/sdk/coreTypes.ts) which are the externally-visible
 * serialized representation.
 */

import type { BetaContentBlock, BetaUsage } from '@anthropic-ai/sdk/resources/beta/messages/messages.mjs'
import type { ContentBlockParam } from '@anthropic-ai/sdk/resources/index.mjs'
import type { APIError } from '@anthropic-ai/sdk'
import type { UUID } from 'crypto'
import type { Progress } from '../Tool.js'
import type { HookEvent } from '../entrypoints/agentSdkTypes.js'
import type { Attachment } from '../utils/attachments.js'
import type { PermissionMode } from './permissions.js'

// ─── Shared base types ───────────────────────────────────────────────────────

export type SystemMessageLevel = 'error' | 'warning' | 'info' | 'success' | 'debug'

/** How a user message was produced (undefined = keyboard input). */
export type MessageOrigin =
  | 'hook'
  | 'voice'
  | 'script'
  | 'bridge'
  | 'scheduled'
  | 'api'
  | 'ide'

export type PartialCompactDirection = 'older' | 'newer' | 'both'

// ─── User message ────────────────────────────────────────────────────────────

export type UserMessage = {
  type: 'user'
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
  uuid: UUID | string
  timestamp: string
  isMeta?: true
  isVisibleInTranscriptOnly?: true
  isVirtual?: true
  isCompactSummary?: true
  toolUseResult?: unknown
  mcpMeta?: {
    _meta?: Record<string, unknown>
    structuredContent?: Record<string, unknown>
  }
  imagePasteIds?: number[]
  sourceToolAssistantUUID?: UUID
  permissionMode?: PermissionMode
  summarizeMetadata?: {
    messagesSummarized: number
    userContext?: string
    direction?: PartialCompactDirection
  }
  origin?: MessageOrigin
  planContent?: string
}

// ─── Assistant message ───────────────────────────────────────────────────────

export type SDKAssistantMessageError =
  | 'authentication_failed'
  | 'billing_error'
  | 'rate_limit'
  | 'invalid_request'
  | 'server_error'
  | 'unknown'
  | 'max_output_tokens'
  | string

export type AssistantMessage = {
  type: 'assistant'
  uuid: UUID | string
  timestamp: string
  message: {
    id: string
    container: unknown
    model: string
    role: 'assistant'
    stop_reason: string | null
    stop_sequence: string | null
    type: 'message'
    usage: BetaUsage
    content: BetaContentBlock[]
    context_management: unknown
  }
  requestId?: string
  apiError?: Record<string, unknown>
  error?: SDKAssistantMessageError
  errorDetails?: string
  isApiErrorMessage?: boolean
  isVirtual?: true
  isMeta?: boolean
  isVirtual2?: true
  advisorModel?: string
}

// ─── Attachment message ──────────────────────────────────────────────────────

export type AttachmentMessage<T extends Attachment = Attachment> = {
  type: 'attachment'
  attachment: T
  uuid: UUID | string
  timestamp: string
}

// ─── Progress message ────────────────────────────────────────────────────────

export type ProgressMessage<P extends Progress = Progress> = {
  type: 'progress'
  data: P
  toolUseID: string
  parentToolUseID: string
  uuid: UUID | string
  timestamp: string
}

// ─── System messages ─────────────────────────────────────────────────────────

type SystemMessageBase = {
  type: 'system'
  uuid: UUID | string
  timestamp: string
  isMeta: boolean
  toolUseID?: string
}

export type SystemInformationalMessage = SystemMessageBase & {
  subtype: 'informational'
  content: string
  level: SystemMessageLevel
  preventContinuation?: boolean
}

export type SystemLocalCommandMessage = SystemMessageBase & {
  subtype: 'local_command'
  content: string
  level: SystemMessageLevel
}

export type SystemPermissionRetryMessage = SystemMessageBase & {
  subtype: 'permission_retry'
  content: string
  commands: string[]
  level: SystemMessageLevel
}

export type SystemBridgeStatusMessage = SystemMessageBase & {
  subtype: 'bridge_status'
  content: string
  url: string
  upgradeNudge?: string
}

export type SystemScheduledTaskFireMessage = SystemMessageBase & {
  subtype: 'scheduled_task_fire'
  content: string
}

export type StopHookInfo = {
  hookName: string
  command: string
  promptText?: string
  statusMessage?: string
}

export type SystemStopHookSummaryMessage = SystemMessageBase & {
  subtype: 'stop_hook_summary'
  hookCount: number
  hookInfos: StopHookInfo[]
  hookErrors: string[]
  preventedContinuation: boolean
  stopReason: string | undefined
  hasOutput: boolean
  level: SystemMessageLevel
  hookLabel?: string
  totalDurationMs?: number
}

export type SystemTurnDurationMessage = SystemMessageBase & {
  subtype: 'turn_duration'
  durationMs: number
  budgetTokens?: number
  budgetLimit?: number
  budgetNudges?: number
  messageCount?: number
}

export type SystemAwaySummaryMessage = SystemMessageBase & {
  subtype: 'away_summary'
  content: string
}

export type SystemMemorySavedMessage = SystemMessageBase & {
  subtype: 'memory_saved'
  writtenPaths: string[]
}

export type SystemAgentsKilledMessage = SystemMessageBase & {
  subtype: 'agents_killed'
}

export type SystemApiMetricsMessage = SystemMessageBase & {
  subtype: 'api_metrics'
  ttftMs: number
  otps: number
  isP50?: boolean
  hookDurationMs?: number
  turnDurationMs?: number
  toolDurationMs?: number
  classifierDurationMs?: number
  toolCount?: number
  hookCount?: number
  classifierCount?: number
  configWriteCount?: number
}

export type SystemAPIErrorMessage = {
  type: 'system'
  subtype: 'api_error'
  level: SystemMessageLevel
  cause?: Error
  error: APIError
  retryInMs: number
  retryAttempt: number
  maxRetries: number
  timestamp: string
  uuid: UUID | string
}

export type SystemCompactBoundaryMessage = SystemMessageBase & {
  subtype: 'compact_boundary'
  content: string
  level: SystemMessageLevel
  compactMetadata?: {
    trigger: 'manual' | 'auto'
    preTokens: number
    userContext?: string
    messagesSummarized?: number
  }
  logicalParentUuid?: UUID
}

export type SystemMicrocompactBoundaryMessage = SystemMessageBase & {
  subtype: 'microcompact_boundary'
  content: string
  level: SystemMessageLevel
  microcompactMetadata?: {
    trigger: 'auto'
    preTokens: number
    tokensSaved: number
    compactedToolIds: string[]
    clearedAttachmentUUIDs: string[]
  }
}

export type SystemThinkingMessage = SystemMessageBase & {
  subtype: 'thinking'
  content: string
  level: SystemMessageLevel
}

export type SystemFileSnapshotMessage = SystemMessageBase & {
  subtype: 'file_snapshot'
  content: string
  level: SystemMessageLevel
  files: Array<{ path: string; content: string }>
}

/** Union of all system message subtypes. */
export type SystemMessage =
  | SystemInformationalMessage
  | SystemLocalCommandMessage
  | SystemPermissionRetryMessage
  | SystemBridgeStatusMessage
  | SystemScheduledTaskFireMessage
  | SystemStopHookSummaryMessage
  | SystemTurnDurationMessage
  | SystemAwaySummaryMessage
  | SystemMemorySavedMessage
  | SystemAgentsKilledMessage
  | SystemApiMetricsMessage
  | SystemAPIErrorMessage
  | SystemCompactBoundaryMessage
  | SystemMicrocompactBoundaryMessage
  | SystemThinkingMessage
  | SystemFileSnapshotMessage

/** Subset of messages that can appear in a collapsed read/search group. */
export type CollapsibleMessage = NormalizedAssistantMessage | AttachmentMessage

/** Compact metadata for a compact boundary message. */
export type CompactMetadata = {
  trigger: 'manual' | 'auto'
  preTokens: number
  userContext?: string
  messagesSummarized?: number
}

// ─── Tombstone / summary messages ────────────────────────────────────────────

export type TombstoneMessage = {
  type: 'tombstone'
  uuid: UUID | string
  timestamp: string
  toolUseID?: string
}

export type ToolUseSummaryMessage = {
  type: 'tool_use_summary'
  uuid: UUID | string
  timestamp: string
  content: string
  toolUseIDs: string[]
  isMeta?: boolean
}

export type HookResultMessage = AttachmentMessage | ProgressMessage

// ─── Normalized / display-only types ─────────────────────────────────────────

export type NormalizedUserMessage = UserMessage & {
  message: UserMessage['message'] & {
    content: ContentBlockParam[]
  }
}

export type NormalizedAssistantMessage = AssistantMessage

export type NormalizedMessage =
  | NormalizedUserMessage
  | NormalizedAssistantMessage
  | AttachmentMessage
  | ProgressMessage
  | SystemMessage

// Grouped display types
export type GroupedToolUseMessage = {
  type: 'grouped_tool_use'
  uuid: UUID | string
  timestamp: string
  toolUseIDs: string[]
  messages: NormalizedAssistantMessage[]
}

export type CollapsedReadSearchGroup = {
  type: 'collapsed_read_search_group'
  uuid: UUID | string
  timestamp: string
  messages: NormalizedMessage[]
}

export type QueueOperationMessage = {
  type: 'queue_operation'
  uuid: UUID | string
  timestamp: string
  operation: string
}

export type RenderableMessage =
  | NormalizedUserMessage
  | NormalizedAssistantMessage
  | AttachmentMessage
  | ProgressMessage
  | SystemMessage
  | GroupedToolUseMessage
  | CollapsedReadSearchGroup

// ─── Event types ─────────────────────────────────────────────────────────────

export type StreamEvent = {
  type: 'stream_event'
  uuid: UUID | string
  timestamp: string
}

export type RequestStartEvent = {
  type: 'request_start'
  uuid: UUID | string
  timestamp: string
}

// ─── Main Message union ───────────────────────────────────────────────────────

/** Union of all message types used in the REPL conversation state. */
export type Message =
  | UserMessage
  | AssistantMessage
  | AttachmentMessage
  | ProgressMessage
  | SystemMessage
  | TombstoneMessage
  | ToolUseSummaryMessage
  | HookResultMessage
