/**
 * QuerySource identifies the origin of a query to the LLM.
 * Used for analytics, session tracking, and conditional logic.
 */
export type QuerySource =
  | 'repl_main_thread'
  | `repl_main_thread:outputStyle:${string}`
  | 'repl_main_thread:outputStyle:custom'
  | 'sdk'
  | 'compact'
  | 'session_memory'
  | `agent:builtin:${string}`
  | 'agent:default'
  | 'agent:custom'
  | 'agent:teammate'
  | `agent:${string}`
  | 'auto_mode_critique'
  | 'memdir_relevance'
  | 'session_search'
  | 'magic_docs'
  | 'away_summary'
  | 'generate_session_title'
  | 'mcp_datetime_parse'
  | 'marble_origami'
  | string
