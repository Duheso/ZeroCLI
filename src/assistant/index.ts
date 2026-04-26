/**
 * Assistant mode stub.
 * The KAIROS feature flag is disabled in this build; this file exists
 * so that code gated behind feature('KAIROS') type-checks correctly.
 */
export function isAssistantMode(): boolean {
  return false
}

export function isAssistantForced(): boolean {
  return false
}

export function markAssistantForced(): void {
  // no-op in stub
}

export async function initializeAssistantTeam(): Promise<unknown> {
  throw new Error('KAIROS is not enabled')
}

export function getAssistantSystemPromptAddendum(): string {
  return ''
}

export function getAssistantActivationPath(): string | undefined {
  return undefined
}
