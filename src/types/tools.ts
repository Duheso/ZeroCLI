import type { NormalizedUserMessage } from './message.js'

// Shell progress types (shared between Bash and PowerShell)
export type BashProgress = {
  type: 'bash_progress'
  output: string
  fullOutput: string
  elapsedTimeSeconds: number
  totalLines: number
  totalBytes: number
  taskId?: string
  timeoutMs?: number
}

export type PowerShellProgress = {
  type: 'powershell_progress'
  output: string
  fullOutput: string
  elapsedTimeSeconds: number
  totalLines: number
  totalBytes: number
  taskId?: string
  timeoutMs?: number
}

export type ShellProgress = BashProgress | PowerShellProgress

// Agent/Skill progress
export type AgentToolProgress = {
  type: 'agent_progress'
  message: NormalizedUserMessage
  prompt: string
  agentId: string
}

export type SkillToolProgress = {
  type: 'skill_progress'
  message: NormalizedUserMessage
  prompt: string
  agentId: string
}

// MCP progress
export type MCPProgress = {
  type: 'mcp_progress'
  status: 'started' | 'completed' | 'failed'
  serverName: string
  toolName: string
}

// Web search progress
export type WebSearchProgress = {
  type: 'web_search_progress'
  query: string
  status: 'searching' | 'complete' | 'failed'
  resultsCount?: number
}

// Task output progress
export type TaskOutputProgress = {
  type: 'task_output_progress'
  taskId: string
  output: string
  isComplete: boolean
}

// REPL tool progress
export type REPLToolProgress = {
  type: 'repl_progress'
  message: string
}

// SDK workflow progress (used by sdkEventQueue + sdkProgress)
export type SdkWorkflowProgress = {
  type: 'sdk_workflow_progress'
  phaseIndex?: number
  status?: string
  description?: string
  [key: string]: unknown
}

// Union of all tool progress data types
export type ToolProgressData =
  | BashProgress
  | PowerShellProgress
  | AgentToolProgress
  | SkillToolProgress
  | MCPProgress
  | WebSearchProgress
  | TaskOutputProgress
  | REPLToolProgress
