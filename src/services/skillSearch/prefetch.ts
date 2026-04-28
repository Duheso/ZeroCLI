import type { Message } from '../../types/message.js'
import type { ToolUseContext } from '../../Tool.js'

/** Stub — skillSearch/prefetch not included in source snapshot (feature-gated). */

export interface SkillPrefetchHandle {
  // placeholder
}

export function startSkillDiscoveryPrefetch(
  _agentId: string | null,
  _messages: Message[],
  _toolUseContext: ToolUseContext,
): SkillPrefetchHandle | undefined {
  return undefined
}

export async function collectSkillDiscoveryPrefetch(
  _handle: SkillPrefetchHandle,
): Promise<[]> {
  return []
}
