import { afterEach, beforeEach, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const originalEnv = {
  CLAUDE_CONFIG_DIR: process.env.CLAUDE_CONFIG_DIR,
  CLAUDE_CODE_CUSTOM_OAUTH_URL: process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL,
  USER_TYPE: process.env.USER_TYPE,
}

let tempDir: string

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'zero-env-test-'))
  process.env.CLAUDE_CONFIG_DIR = tempDir
  delete process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL
  delete process.env.USER_TYPE
})

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true })
  if (originalEnv.CLAUDE_CONFIG_DIR === undefined) {
    delete process.env.CLAUDE_CONFIG_DIR
  } else {
    process.env.CLAUDE_CONFIG_DIR = originalEnv.CLAUDE_CONFIG_DIR
  }
  if (originalEnv.CLAUDE_CODE_CUSTOM_OAUTH_URL === undefined) {
    delete process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL
  } else {
    process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL = originalEnv.CLAUDE_CODE_CUSTOM_OAUTH_URL
  }
  if (originalEnv.USER_TYPE === undefined) {
    delete process.env.USER_TYPE
  } else {
    process.env.USER_TYPE = originalEnv.USER_TYPE
  }
})

async function importFreshEnvModule() {
  return import(`./env.js?ts=${Date.now()}-${Math.random()}`)
}

// getGlobalZeroFile — three migration branches

test('getGlobalZeroFile: new install returns .zerocli.json when neither file exists', async () => {
  const { getGlobalZeroFile } = await importFreshEnvModule()
  expect(getGlobalZeroFile()).toBe(join(tempDir, '.zerocli.json'))
})

test('getGlobalZeroFile: existing user keeps .claude.json when only legacy file exists', async () => {
  writeFileSync(join(tempDir, '.claude.json'), '{}')
  const { getGlobalZeroFile } = await importFreshEnvModule()
  expect(getGlobalZeroFile()).toBe(join(tempDir, '.claude.json'))
})

test('getGlobalZeroFile: migrated user uses .zerocli.json when both files exist', async () => {
  writeFileSync(join(tempDir, '.claude.json'), '{}')
  writeFileSync(join(tempDir, '.zerocli.json'), '{}')
  const { getGlobalZeroFile } = await importFreshEnvModule()
  expect(getGlobalZeroFile()).toBe(join(tempDir, '.zerocli.json'))
})
