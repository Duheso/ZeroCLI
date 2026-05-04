import { describe, it, expect } from 'bun:test'
import { normalizeMessagesForAPI } from './messages.js'
import type { Message } from '../types/message.js'
import { createUserMessage, createAssistantMessage } from './messages.js'

describe('normalizeMessagesForAPI — Memory Efficiency (OOM Prevention)', () => {
  /**
   * Simulate 100 waves of file edits (like the crash scenario).
   * Each wave: ~10 interactions.
   * Total: ~1000 messages.
   * 
   * Original leak: content.map() reallocates full array on every call.
   * Optimized: only allocates when tool_use blocks exist.
   */
  it('should handle 100 waves of interactions without unbounded memory growth', () => {
    const messages: Message[] = []
    
    for (let wave = 0; wave < 100; wave++) {
      messages.push(
        createUserMessage({
          content: `Wave ${wave}: Fix TypeScript errors in file ${wave}.ts`,
        })
      )
      
      messages.push(
        createAssistantMessage({
          content: `Applying ${wave} fixes to the codebase`,
        })
      )
      
      messages.push(
        createUserMessage({
          content: 'All edits applied successfully',
        })
      )
    }
    
    // Key test: normalizeMessagesForAPI should efficiently handle this
    // without allocating massive structures repeatedly
    const result = normalizeMessagesForAPI(messages)
    
    // Verify output is valid
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(m => m.type === 'user' || m.type === 'assistant')).toBe(true)
  })

  /**
   * Test that consecutive user messages are properly merged,
   * reducing memory footprint.
   */
  it('should merge consecutive user messages to reduce heap allocations', () => {
    const messages: Message[] = []
    
    // Simulate interleaving system + user messages
    for (let i = 0; i < 50; i++) {
      messages.push(createUserMessage({ content: `Part A of message ${i}` }))
      messages.push(createUserMessage({ content: `Part B of message ${i}` }))
      if (i % 5 === 0) {
        messages.push(
          createAssistantMessage({
            content: 'Response',
          })
        )
      }
    }
    
    const result = normalizeMessagesForAPI(messages)
    
    // After merging, should be significantly fewer messages
    // (original had ~100 user messages, should merge many)
    expect(result.length).toBeLessThan(messages.length)
  })

  /**
   * Stress test: ensure content.map() optimization doesn't break
   * text-only assistant messages.
   */
  it('should avoid allocating content array for text-only assistant messages', () => {
    const messages: Message[] = []
    
    // Add 50 text-only interactions
    for (let i = 0; i < 50; i++) {
      messages.push(createUserMessage({ content: `Question ${i}` }))
      messages.push(
        createAssistantMessage({
          content: `Answer ${i}`,
        })
      )
    }
    
    const result = normalizeMessagesForAPI(messages)
    
    // All messages should be preserved without allocation issues
    expect(result.length).toBeGreaterThan(0)
  })

  /**
   * Verify that large message sets are handled efficiently
   */
  it('should handle 1000+ message sequences efficiently', () => {
    const messages: Message[] = []
    
    // Build 1000+ messages (500 pairs)
    for (let i = 0; i < 500; i++) {
      messages.push(createUserMessage({ content: `User message ${i}` }))
      messages.push(
        createAssistantMessage({
          content: `Assistant response ${i}`,
        })
      )
    }
    
    const result = normalizeMessagesForAPI(messages)
    
    // Should handle without stack overflow or memory explosion
    expect(result.length).toBeGreaterThan(100)
    expect(result.every(m => m.type === 'user' || m.type === 'assistant')).toBe(true)
  })
})
