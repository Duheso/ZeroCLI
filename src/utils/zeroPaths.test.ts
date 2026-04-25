import { afterEach, describe, expect, mock, test } from 'bun:test'
import * as fsPromises from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'

const originalEnv = { ...process.env }
const originalArgv = [...process.argv]

async function importFreshEnvUtils() {
  return import(`./envUtils.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshSettings() {
  return import(`./settings/settings.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshLocalInstaller() {
  return import(`./localInstaller.ts?ts=${Date.now()}-${Math.random()}`)
}

afterEach(() => {
  process.env = { ...originalEnv }
  process.argv = [...originalArgv]
  mock.restore()
})

describe('Zero CLI paths', () => {
  test('defaults user config home to ~/.zero', async () => {
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
        openClaudeExists: true,
        legacyClaudeExists: false,
      }),
    ).toBe(join(homedir(), '.zero'))
  })

  test('falls back to ~/.claude when legacy config exists and ~/.zero does not', async () => {
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
        openClaudeExists: false,
        legacyClaudeExists: true,
      }),
    ).toBe(join(homedir(), '.claude'))
  })

  test('uses CLAUDE_CONFIG_DIR override when provided', async () => {
    process.env.CLAUDE_CONFIG_DIR = '/tmp/custom-zero'
    const { getClaudeConfigHomeDir, resolveClaudeConfigHomeDir } =
      await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/custom-zero')
    expect(
      resolveClaudeConfigHomeDir({
        configDirEnv: '/tmp/custom-zero',
      }),
    ).toBe('/tmp/custom-zero')
  })

  test('project and local settings paths use .zero', async () => {
    const { getRelativeSettingsFilePathForSource } = await importFreshSettings()

    expect(getRelativeSettingsFilePathForSource('projectSettings')).toBe(
      '.zero/settings.json',
    )
    expect(getRelativeSettingsFilePathForSource('localSettings')).toBe(
      '.zero/settings.local.json',
    )
  })

  test('local installer uses zero wrapper path', async () => {
    // Force .zero config home so the test doesn't fall back to
    // ~/.claude when ~/.zero doesn't exist on this machine.
    process.env.CLAUDE_CONFIG_DIR = join(homedir(), '.zero')
    const { getLocalClaudePath } = await importFreshLocalInstaller()

    expect(getLocalClaudePath()).toBe(
      join(homedir(), '.zero', 'local', 'zero'),
    )
  })

  test('local installation detection matches .zero path', async () => {
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.zero', 'local')}/node_modules/.bin/zero`,
      ),
    ).toBe(true)
  })

  test('local installation detection still matches legacy .claude path', async () => {
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.claude', 'local')}/node_modules/.bin/zero`,
      ),
    ).toBe(true)
  })

  test('candidate local install dirs include both zero and legacy claude paths', async () => {
    const { getCandidateLocalInstallDirs } = await importFreshLocalInstaller()

    expect(
      getCandidateLocalInstallDirs({
        configHomeDir: join(homedir(), '.zero'),
        homeDir: homedir(),
      }),
    ).toEqual([
      join(homedir(), '.zero', 'local'),
      join(homedir(), '.claude', 'local'),
    ])
  })

  test('legacy local installs are detected when they still expose the claude binary', async () => {
    mock.module('fs/promises', () => ({
      ...fsPromises,
      access: async (path: string) => {
        if (
          path === join(homedir(), '.claude', 'local', 'node_modules', '.bin', 'claude')
        ) {
          return
        }
        throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
      },
    }))

    const { getDetectedLocalInstallDir, localInstallationExists } =
      await importFreshLocalInstaller()

    expect(await localInstallationExists()).toBe(true)
    expect(await getDetectedLocalInstallDir()).toBe(
      join(homedir(), '.claude', 'local'),
    )
  })
})
