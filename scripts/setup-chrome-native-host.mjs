#!/usr/bin/env node
/**
 * ZeroCLI — Chrome Native Host Setup Script
 *
 * Registers the native messaging host for the ZeroCLI Browser Extension.
 * Run this ONCE before using the chrome extension:
 *
 *   node scripts/setup-chrome-native-host.mjs
 *   (or: bun scripts/setup-chrome-native-host.mjs)
 *
 * What it does:
 *   - Finds (or creates) the native host wrapper script
 *   - Writes the native host manifest JSON
 *   - On Windows: registers it in the Windows Registry
 *   - On macOS/Linux: writes to NativeMessagingHosts directories
 */

import { execSync, spawnSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { homedir, platform } from 'os'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const NATIVE_HOST_NAME = 'com.duheso.zerocli_browser_extension'
const ZEROCLI_EXTENSION_ID = 'ccmaidbdaocjoeceanhlkafcokhmiolf'

// ─── Find the zero executable ─────────────────────────────────────────────────

function findZeroExecutable() {
  // 1. Check if 'zero' is on PATH
  const which = platform() === 'win32'
    ? spawnSync('where', ['zero'], { shell: true })
    : spawnSync('which', ['zero'])
  if (which.status === 0) {
    return which.stdout.toString().trim().split('\n')[0].trim()
  }

  // 2. Check common global install locations
  const candidates = platform() === 'win32'
    ? [
        join(process.env.APPDATA ?? '', 'npm', 'zero.cmd'),
        join(process.env.APPDATA ?? '', 'npm', 'zero'),
        'C:\\Program Files\\nodejs\\zero.cmd',
      ]
    : [
        '/usr/local/bin/zero',
        '/usr/bin/zero',
        join(homedir(), '.local', 'bin', 'zero'),
      ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }

  // 3. Fall back to dist/cli.mjs in this repo (dev mode)
  const devCli = join(ROOT, 'dist', 'cli.mjs')
  if (existsSync(devCli)) {
    return `node "${devCli}"`
  }

  return null
}

// ─── Create wrapper script (Windows .cmd / Unix shell) ────────────────────────

function createWrapperScript(zeroExec) {
  const chromeDir = join(homedir(), '.zerocli', 'chrome')
  mkdirSync(chromeDir, { recursive: true })

  if (platform() === 'win32') {
    const wrapperPath = join(chromeDir, 'zerocli-native-host.cmd')
    const content = `@echo off\n"${zeroExec}" --chrome-native-host\n`
    writeFileSync(wrapperPath, content, 'utf8')
    console.log(`  ✓ Wrapper script: ${wrapperPath}`)
    return wrapperPath
  } else {
    const wrapperPath = join(chromeDir, 'zerocli-native-host.sh')
    const content = `#!/bin/sh\nexec ${zeroExec} --chrome-native-host\n`
    writeFileSync(wrapperPath, content, { encoding: 'utf8', mode: 0o755 })
    console.log(`  ✓ Wrapper script: ${wrapperPath}`)
    return wrapperPath
  }
}

// ─── Write manifest JSON ───────────────────────────────────────────────────────

function writeManifest(wrapperPath) {
  const manifest = {
    name: NATIVE_HOST_NAME,
    description: 'ZeroCLI Browser Extension Native Host',
    path: wrapperPath,
    type: 'stdio',
    allowed_origins: [
      `chrome-extension://${ZEROCLI_EXTENSION_ID}/`,
    ],
  }
  const manifestContent = JSON.stringify(manifest, null, 2)

  if (platform() === 'win32') {
    // On Windows, path is given directly via registry — we still write the JSON next to the wrapper
    const manifestPath = join(dirname(wrapperPath), `${NATIVE_HOST_NAME}.json`)
    writeFileSync(manifestPath, manifestContent, 'utf8')
    console.log(`  ✓ Manifest JSON: ${manifestPath}`)
    return manifestPath
  }

  // macOS / Linux: write to all browser NativeMessagingHosts dirs
  const dirs = getNativeMessagingDirs()
  let written = 0
  for (const dir of dirs) {
    try {
      mkdirSync(dir, { recursive: true })
      const manifestPath = join(dir, `${NATIVE_HOST_NAME}.json`)
      writeFileSync(manifestPath, manifestContent, 'utf8')
      console.log(`  ✓ Manifest: ${manifestPath}`)
      written++
    } catch (e) {
      console.warn(`  ⚠ Could not write to ${dir}: ${e.message}`)
    }
  }
  if (written === 0) throw new Error('Could not write manifest to any browser directory')
  return null
}

function getNativeMessagingDirs() {
  if (platform() === 'darwin') {
    return [
      join(homedir(), 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts'),
      join(homedir(), 'Library', 'Application Support', 'Microsoft Edge', 'NativeMessagingHosts'),
      join(homedir(), 'Library', 'Application Support', 'BraveSoftware', 'Brave-Browser', 'NativeMessagingHosts'),
      join(homedir(), 'Library', 'Application Support', 'Chromium', 'NativeMessagingHosts'),
    ]
  }
  // Linux
  return [
    join(homedir(), '.config', 'google-chrome', 'NativeMessagingHosts'),
    join(homedir(), '.config', 'microsoft-edge', 'NativeMessagingHosts'),
    join(homedir(), '.config', 'BraveSoftware', 'Brave-Browser', 'NativeMessagingHosts'),
    join(homedir(), '.config', 'chromium', 'NativeMessagingHosts'),
  ]
}

// ─── Windows Registry ─────────────────────────────────────────────────────────

function registerWindows(manifestJsonPath) {
  const browsers = {
    Chrome: `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${NATIVE_HOST_NAME}`,
    Edge:   `HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\${NATIVE_HOST_NAME}`,
    Brave:  `HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\${NATIVE_HOST_NAME}`,
  }

  for (const [browser, regKey] of Object.entries(browsers)) {
    try {
      const result = spawnSync('reg', [
        'add', regKey,
        '/ve',
        '/t', 'REG_SZ',
        '/d', manifestJsonPath,
        '/f',
      ], { shell: true })
      if (result.status === 0) {
        console.log(`  ✓ Registry (${browser}): ${regKey}`)
      } else {
        console.warn(`  ⚠ Registry (${browser}) failed: ${result.stderr?.toString()}`)
      }
    } catch (e) {
      console.warn(`  ⚠ Registry (${browser}) error: ${e.message}`)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n🔧 ZeroCLI Chrome Native Host Setup\n')

console.log('1. Locating zero executable...')
const zeroExec = findZeroExecutable()
if (!zeroExec) {
  console.error(`
  ✗ Could not find 'zero' executable.
  
  Options:
    a) Install globally:  npm install -g @duheso/zerocli
    b) Run from repo:     node dist/cli.mjs --chrome-native-host
    c) Set PATH to include the folder containing 'zero'
  `)
  process.exit(1)
}
console.log(`  ✓ Found: ${zeroExec}\n`)

console.log('2. Creating wrapper script...')
const wrapperPath = createWrapperScript(zeroExec)
console.log()

console.log('3. Writing native host manifest...')
const manifestJsonPath = writeManifest(wrapperPath)
console.log()

if (platform() === 'win32') {
  console.log('4. Registering in Windows Registry...')
  registerWindows(manifestJsonPath)
  console.log()
}

console.log(`✅ Setup complete!

Next steps:
  1. Make sure the ZeroCLI Browser Extension is loaded in Chrome:
     chrome://extensions → Developer mode ON → Load unpacked → select chrome-extension/
  
  2. Reload the extension (click the reload ↺ button on chrome://extensions)
  
  3. The extension popup should now show "Connected"
`)
