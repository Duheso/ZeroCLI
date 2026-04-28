import { afterEach, expect, test } from 'bun:test'

// MACRO is replaced at build time by Bun.define but not in test mode.
// Define it globally so tests that import modules using MACRO don't crash.
;(globalThis as Record<string, unknown>).MACRO = {
  VERSION: '0.7.2',
  DISPLAY_VERSION: '0.0.0-test',
  BUILD_TIME: new Date().toISOString(),
  ISSUES_EXPLAINER: 'report the issue at https://github.com/anthropics/claude-code/issues',
  PACKAGE_URL: '@duheso/zerocli',
  NATIVE_PACKAGE_URL: undefined,
}

import { getSystemPrompt, DEFAULT_AGENT_PROMPT } from './prompts.js'
import { CLI_SYSPROMPT_PREFIXES, getCLISyspromptPrefix } from './system.js'
import { CLAUDE_CODE_GUIDE_AGENT } from '../tools/AgentTool/built-in/claudeCodeGuideAgent.js'
import { GENERAL_PURPOSE_AGENT } from '../tools/AgentTool/built-in/generalPurposeAgent.js'
import { EXPLORE_AGENT } from '../tools/AgentTool/built-in/exploreAgent.js'
import { PLAN_AGENT } from '../tools/AgentTool/built-in/planAgent.js'
import { STATUSLINE_SETUP_AGENT } from '../tools/AgentTool/built-in/statuslineSetup.js'

const originalSimpleEnv = process.env.CLAUDE_CODE_SIMPLE

afterEach(() => {
  process.env.CLAUDE_CODE_SIMPLE = originalSimpleEnv
})

test('CLI identity prefixes describe Zero CLI instead of ZeroCLI', () => {
  expect(getCLISyspromptPrefix()).toContain('Zero CLI')
  expect(getCLISyspromptPrefix()).not.toContain('ZeroCLI')
  expect(getCLISyspromptPrefix()).not.toContain("Anthropic's official CLI for Claude")

  for (const prefix of CLI_SYSPROMPT_PREFIXES) {
    expect(prefix).toContain('Zero CLI')
    expect(prefix).not.toContain('ZeroCLI')
    expect(prefix).not.toContain("Anthropic's official CLI for Claude")
  }
})

test('simple mode identity describes Zero CLI instead of ZeroCLI', async () => {
  process.env.CLAUDE_CODE_SIMPLE = '1'

  const prompt = await getSystemPrompt([], 'gpt-4o')

  expect(prompt[0]).toContain('Zero CLI')
  expect(prompt[0]).not.toContain('ZeroCLI')
  expect(prompt[0]).not.toContain("Anthropic's official CLI for Claude")
})

test('built-in agent prompts describe Zero CLI instead of ZeroCLI', () => {
  expect(DEFAULT_AGENT_PROMPT).toContain('Zero CLI')
  expect(DEFAULT_AGENT_PROMPT).not.toContain('ZeroCLI')
  expect(DEFAULT_AGENT_PROMPT).not.toContain("Anthropic's official CLI for Claude")

  const generalPrompt = GENERAL_PURPOSE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(generalPrompt).toContain('Zero CLI')
  expect(generalPrompt).not.toContain('ZeroCLI')
  expect(generalPrompt).not.toContain("Anthropic's official CLI for Claude")

  const explorePrompt = EXPLORE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(explorePrompt).toContain('Zero CLI')
  expect(explorePrompt).not.toContain('ZeroCLI')
  expect(explorePrompt).not.toContain("Anthropic's official CLI for Claude")

  const planPrompt = PLAN_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(planPrompt).toContain('Zero CLI')
  expect(planPrompt).not.toContain('ZeroCLI')

  const statuslinePrompt = STATUSLINE_SETUP_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(statuslinePrompt).toContain('Zero CLI')
  expect(statuslinePrompt).not.toContain('ZeroCLI')

  const guidePrompt = CLAUDE_CODE_GUIDE_AGENT.getSystemPrompt({
    toolUseContext: {
      options: {
        commands: [],
        agentDefinitions: { activeAgents: [] },
        mcpClients: [],
      } as never,
    },
  })
  expect(guidePrompt).toContain('Zero CLI')
  expect(guidePrompt).toContain('You are the Zero CLI guide agent.')
  expect(guidePrompt).toContain('**Zero CLI** (the CLI tool)')
  expect(guidePrompt).not.toContain('You are the Claude guide agent.')
  expect(guidePrompt).not.toContain('**ZeroCLI** (the CLI tool)')
})
