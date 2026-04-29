import type { Message } from '../../types/message.js'

// Stub: snipCompact not included in source snapshot
export function snipCompact() {
  return null
}

export function snipCompactIfNeeded(
  store: Message[],
  _options?: { force?: boolean },
): { messages: Message[]; executed: boolean; tokensFreed: number; boundaryMessage?: Message } {
  return { messages: store, executed: false, tokensFreed: 0 }
}

export function isSnipRuntimeEnabled(): boolean {
  return false
}

export const SNIP_NUDGE_TEXT = ''
