import type { Message } from '../../types/message.js'

/** Stub — reactiveCompact not included in source snapshot (feature-gated). */

export function isReactiveCompactEnabled(): boolean {
  return false
}

export function isWithheldPromptTooLong(_msg: Message): boolean {
  return false
}

export function isWithheldMediaSizeError(_msg: Message): boolean {
  return false
}

export async function tryReactiveCompact(
  _opts: {
    hasAttempted: boolean
    querySource: string
    aborted: boolean
    messages: Message[]
    cacheSafeParams: Record<string, unknown>
  },
) {
  return null
}
