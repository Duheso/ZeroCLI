export type EffortLevel = 'low' | 'medium' | 'high' | 'max'

export type SDKSessionOptions = {
  model?: string
  [key: string]: unknown
}

export type SDKSession = {
  prompt(message: string): Promise<unknown>
  close(): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyZodRawShape = Record<string, any>
export type InferShape<T> = T extends AnyZodRawShape ? { [K in keyof T]: unknown } : unknown
export type ForkSessionResult = { session_id: string; [key: string]: unknown }
export type ForkSessionOptions = { [key: string]: unknown }
export type GetSessionInfoOptions = { session_id?: string; [key: string]: unknown }
export type GetSessionMessagesOptions = { session_id?: string; [key: string]: unknown }
export type InternalOptions = { [key: string]: unknown }
export type InternalQuery = AsyncIterable<unknown>
export type ListSessionsOptions = { [key: string]: unknown }
export type McpSdkServerConfigWithInstance = { name: string; [key: string]: unknown }
export type Options = { [key: string]: unknown }
export type Query = AsyncIterable<unknown>
export type SdkMcpToolDefinition = { name: string; description?: string; [key: string]: unknown }
export type SessionMessage = { role: string; content: unknown; [key: string]: unknown }
export type SessionMutationOptions = { [key: string]: unknown }
