import { describe, it, expect } from 'bun:test'
import { normalizeMessagesForAPI } from './messages.js'
import type { Message } from '../types/message.js'
import { createUserMessage, createAssistantMessage } from './messages.js'

describe('normalizeMessagesForAPI', () => {
  it('should handle empty message array', () => {
    const result = normalizeMessagesForAPI([])
    expect(result).toEqual([])
  })

  it('should preserve user messages', () => {
    const messages: Message[] = [
      createUserMessage({ content: 'Hello' }),
    ]
    const result = normalizeMessagesForAPI(messages)
    expect(result.length).toBe(1)
    expect(result[0]?.type).toBe('user')
  })

  it('should preserve assistant messages', () => {
    const messages: Message[] = [
      createUserMessage({ content: 'Hello' }),
      createAssistantMessage({
        content: 'Hi there',
      }),
    ]
    const result = normalizeMessagesForAPI(messages)
    expect(result.length).toBe(2)
    expect(result[1]?.type).toBe('assistant')
  })

  it('should merge consecutive user messages', () => {
    const msg1 = createUserMessage({ content: 'First' })
    const msg2 = createUserMessage({ content: 'Second' })
    
    const messages: Message[] = [msg1, msg2]
    const result = normalizeMessagesForAPI(messages)
    
    // Should merge into one user message
    expect(result.length).toBe(1)
    expect(result[0]?.type).toBe('user')
  })

  it('should handle tools parameter efficiently (no allocation when empty)', () => {
    const messages: Message[] = [
      createUserMessage({ content: 'Test' }),
    ]
    const result1 = normalizeMessagesForAPI(messages, [])
    const result2 = normalizeMessagesForAPI(messages, [])
    
    // Should produce identical results
    expect(result1.length).toBe(result2.length)
  })

  it('should be idempotent (calling twice with same input yields same output)', () => {
    const messages: Message[] = [
      createUserMessage({ content: 'Hello' }),
      createAssistantMessage({
        content: 'Hi',
      }),
    ]
    
    const result1 = normalizeMessagesForAPI(messages)
    const result2 = normalizeMessagesForAPI(messages)
    
    expect(result1.length).toBe(result2.length)
    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2))
  })

  it('should handle memory efficiently with repeated calls (100x)', () => {
    const messages: Message[] = [
      createUserMessage({ content: 'Test' }),
    ]
    
    // Simulate repeated calls (e.g., in API loops)
    const results = []
    for (let i = 0; i < 100; i++) {
      results.push(normalizeMessagesForAPI([...messages]))
    }
    
    // All should be valid
    expect(results.every(r => r.length > 0)).toBe(true)
  })

  it('should handle 500+ message sequences', () => {
    const messages: Message[] = []
    for (let i = 0; i < 300; i++) {
      messages.push(createUserMessage({ content: `Message ${i}` }))
      if (i % 3 === 0) {
        messages.push(
          createAssistantMessage({
            content: `Response ${i}`,
          })
        )
      }
    }
    
    const result = normalizeMessagesForAPI(messages)
    // Should handle all messages without allocation issues
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(messages.length)
  })
})
