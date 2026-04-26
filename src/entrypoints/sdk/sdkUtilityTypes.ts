/**
 * SDK Utility Types - Non-Zod types used across the SDK.
 *
 * These types cannot be easily expressed as Zod schemas (e.g., because they
 * reference Anthropic SDK types directly) and are defined manually here.
 */

/** Anthropic API usage object with all nullable fields made non-nullable. */
export type NonNullableUsage = {
  input_tokens: number
  cache_creation_input_tokens: number
  cache_read_input_tokens: number
  output_tokens: number
  server_tool_use: {
    web_search_requests: number
    web_fetch_requests: number
  }
  service_tier: string
  cache_creation: {
    ephemeral_1h_input_tokens: number
    ephemeral_5m_input_tokens: number
  }
  inference_geo: string
  iterations: unknown[]
  speed: string
}
