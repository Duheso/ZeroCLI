// Content for the claude-api bundled skill.
// Each .md file is inlined as a string at build time via Bun's text loader.

import csharpZeroApi from './claude-api/csharp/claude-api.md'
import curlExamples from './claude-api/curl/examples.md'
import goZeroApi from './claude-api/go/claude-api.md'
import javaZeroApi from './claude-api/java/claude-api.md'
import phpZeroApi from './claude-api/php/claude-api.md'
import pythonAgentSdkPatterns from './claude-api/python/agent-sdk/patterns.md'
import pythonAgentSdkReadme from './claude-api/python/agent-sdk/README.md'
import pythonZeroApiBatches from './claude-api/python/claude-api/batches.md'
import pythonZeroApiFilesApi from './claude-api/python/claude-api/files-api.md'
import pythonZeroApiReadme from './claude-api/python/claude-api/README.md'
import pythonZeroApiStreaming from './claude-api/python/claude-api/streaming.md'
import pythonZeroApiToolUse from './claude-api/python/claude-api/tool-use.md'
import rubyZeroApi from './claude-api/ruby/claude-api.md'
import skillPrompt from './claude-api/SKILL.md'
import sharedErrorCodes from './claude-api/shared/error-codes.md'
import sharedLiveSources from './claude-api/shared/live-sources.md'
import sharedModels from './claude-api/shared/models.md'
import sharedPromptCaching from './claude-api/shared/prompt-caching.md'
import sharedToolUseConcepts from './claude-api/shared/tool-use-concepts.md'
import typescriptAgentSdkPatterns from './claude-api/typescript/agent-sdk/patterns.md'
import typescriptAgentSdkReadme from './claude-api/typescript/agent-sdk/README.md'
import typescriptZeroApiBatches from './claude-api/typescript/claude-api/batches.md'
import typescriptZeroApiFilesApi from './claude-api/typescript/claude-api/files-api.md'
import typescriptZeroApiReadme from './claude-api/typescript/claude-api/README.md'
import typescriptZeroApiStreaming from './claude-api/typescript/claude-api/streaming.md'
import typescriptZeroApiToolUse from './claude-api/typescript/claude-api/tool-use.md'

// @[MODEL LAUNCH]: Update the model IDs/names below. These are substituted into {{VAR}}
// placeholders in the .md files at runtime before the skill prompt is sent.
// After updating these constants, manually update the two files that still hardcode models:
//   - claude-api/SKILL.md (Current Models pricing table)
//   - claude-api/shared/models.md (full model catalog with legacy versions and alias mappings)
export const SKILL_MODEL_VARS = {
  OPUS_ID: 'claude-opus-4-6',
  OPUS_NAME: 'Claude Opus 4.6',
  SONNET_ID: 'claude-sonnet-4-6',
  SONNET_NAME: 'Claude Sonnet 4.6',
  HAIKU_ID: 'claude-haiku-4-5',
  HAIKU_NAME: 'Claude Haiku 4.5',
  // Previous Sonnet ID — used in "do not append date suffixes" example in SKILL.md.
  PREV_SONNET_ID: 'claude-sonnet-4-5',
} satisfies Record<string, string>

export const SKILL_PROMPT: string = skillPrompt

export const SKILL_FILES: Record<string, string> = {
  'csharp/claude-api.md': csharpZeroApi,
  'curl/examples.md': curlExamples,
  'go/claude-api.md': goZeroApi,
  'java/claude-api.md': javaZeroApi,
  'php/claude-api.md': phpZeroApi,
  'python/agent-sdk/README.md': pythonAgentSdkReadme,
  'python/agent-sdk/patterns.md': pythonAgentSdkPatterns,
  'python/claude-api/README.md': pythonZeroApiReadme,
  'python/claude-api/batches.md': pythonZeroApiBatches,
  'python/claude-api/files-api.md': pythonZeroApiFilesApi,
  'python/claude-api/streaming.md': pythonZeroApiStreaming,
  'python/claude-api/tool-use.md': pythonZeroApiToolUse,
  'ruby/claude-api.md': rubyZeroApi,
  'shared/error-codes.md': sharedErrorCodes,
  'shared/live-sources.md': sharedLiveSources,
  'shared/models.md': sharedModels,
  'shared/prompt-caching.md': sharedPromptCaching,
  'shared/tool-use-concepts.md': sharedToolUseConcepts,
  'typescript/agent-sdk/README.md': typescriptAgentSdkReadme,
  'typescript/agent-sdk/patterns.md': typescriptAgentSdkPatterns,
  'typescript/claude-api/README.md': typescriptZeroApiReadme,
  'typescript/claude-api/batches.md': typescriptZeroApiBatches,
  'typescript/claude-api/files-api.md': typescriptZeroApiFilesApi,
  'typescript/claude-api/streaming.md': typescriptZeroApiStreaming,
  'typescript/claude-api/tool-use.md': typescriptZeroApiToolUse,
}
