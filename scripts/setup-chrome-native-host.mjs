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
  // Priority: use node + dist/cli.mjs directly, which is the most reliable
  // path for Chrome native messaging (avoids wrapper chain issues).

  // 1. dist/cli.mjs in this repo (dev mode / cloned repo)
  const devCli = join(ROOT, 'dist', 'cli.mjs')
  if (existsSync(devCli)) {
    return { node: process.execPath, cli: devCli }
  }

  // 2. Find globally installed @duheso/zerocli — locate its dist/cli.mjs
  //    by resolving from the zero bin script location
  const which = platform() === 'win32'
    ? spawnSync('where', ['zero'], { shell: true })
    : spawnSync('which', ['zero'])
  if (which.status === 0) {
    const zeroBin = which.stdout.toString().trim().split('\n')[0].trim()
      .replace(/\r/g, '')
    // zero bin is at: <pkg_root>/bin/zero(.cmd)
    // dist/cli.mjs is at: <pkg_root>/dist/cli.mjs
    const pkgRoot = resolve(dirname(zeroBin), '..')
    const globalCli = join(pkgRoot, 'dist', 'cli.mjs')
    if (existsSync(globalCli)) {
      return { node: process.execPath, cli: globalCli }
    }
    // On Windows, zero.cmd might be in %APPDATA%\npm\, and the actual package
    // might be in %APPDATA%\npm\node_modules\@duheso\zerocli\
    const winModules = join(dirname(zeroBin), 'node_modules', '@duheso', 'zerocli', 'dist', 'cli.mjs')
    if (existsSync(winModules)) {
      return { node: process.execPath, cli: winModules }
    }
  }

  // 3. Common Windows npm global path
  if (platform() === 'win32') {
    const appData = process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming')
    const winCli = join(appData, 'npm', 'node_modules', '@duheso', 'zerocli', 'dist', 'cli.mjs')
    if (existsSync(winCli)) {
      return { node: process.execPath, cli: winCli }
    }
  }

  return null
}

// ─── Create wrapper script (Windows .cmd / Unix shell) ────────────────────────

function createWrapperScript({ node, cli }) {
  const chromeDir = join(homedir(), '.zerocli', 'chrome')
  mkdirSync(chromeDir, { recursive: true })

  if (platform() === 'win32') {
    const wrapperPath = join(chromeDir, 'zerocli-native-host.cmd')
    const content = `@echo off\r\n"${node}" "${cli}" --chrome-native-host\r\n`
    writeFileSync(wrapperPath, content, 'utf8')
    console.log(`  ✓ Wrapper script: ${wrapperPath}`)
    return wrapperPath
  } else {
    const wrapperPath = join(chromeDir, 'zerocli-native-host.sh')
    const content = `#!/bin/sh\nexec "${node}" "${cli}" --chrome-native-host\n`
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

console.log('1. Locating ZeroCLI dist/cli.mjs...')
const found = findZeroExecutable()
if (!found) {
  console.error(`
  ✗ Could not find ZeroCLI dist/cli.mjs.
  
  Options:
    a) Run this script from the ZeroCLI repo root:  node scripts/setup-chrome-native-host.mjs
    b) Install globally:  npm install -g @duheso/zerocli
    c) Set PATH to include the folder containing 'zero'
  `)
  process.exit(1)
}
console.log(`  ✓ Node:       ${found.node}`)
console.log(`  ✓ CLI script: ${found.cli}\n`)

console.log('2. Creating wrapper script...')
const wrapperPath = createWrapperScript(found)
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
