import type { Message } from '../../types/message.js'

// Stub — contextCollapse not included in source snapshot (feature-gated)
export function isContextCollapseEnabled(): boolean {
  return false
}
export function getContextCollapseState() {
  return null
}
export function initContextCollapse(): void {
  // No-op stub — feature gated behind CONTEXT_COLLAPSE
}
export function applyCollapsesIfNeeded(
  messages: Message[],
  _toolUseContext: unknown,
  _querySource: string,
) {
  return { messages }
}
export function isWithheldPromptTooLong(
  _msg: unknown,
  _isPromptTooLong: unknown,
  _querySource: string,
): boolean {
  return false
}
export function recoverFromOverflow(
  _messages: Message[],
  _querySource: string,
) {
  return { messages: [], committed: 0 }
}
