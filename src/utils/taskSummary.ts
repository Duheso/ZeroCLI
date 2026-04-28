import type { Message } from '../types/message.js'

/** Stub — taskSummary not included in source snapshot (feature-gated). */

export function shouldGenerateTaskSummary(): boolean {
  return false
}

export function maybeGenerateTaskSummary(
  _opts: {
    systemPrompt: unknown
    userContext: unknown
    systemContext: unknown
    toolUseContext: unknown
    forkContextMessages: Message[]
  },
): void {
  // no-op
}
