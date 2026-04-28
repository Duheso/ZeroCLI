import type { Message } from '../../types/message.js'

/**
 * Checks whether a message is a snip boundary message.
 */
export function isSnipBoundaryMessage(msg: Message): boolean {
  return msg.type === 'system' && msg.subtype === 'compact_boundary'
}

/**
 * Projects the snipped view of the message store (stub).
 */
export function projectSnippedView<T extends Message>(messages: T[]): T[] {
  return messages
}
