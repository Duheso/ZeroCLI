import React, { useEffect, useState } from 'react'
import type { CommandResultDisplay } from '../../commands.js'
import { Box, Text } from '../../ink.js'
import { PressEnterToContinue } from '../../components/PressEnterToContinue.js'
import { useExitOnCtrlCDWithKeybindings } from '../../hooks/useExitOnCtrlCDWithKeybindings.js'
import { getLatestVersion, type InstallStatus, installGlobalPackage } from '../../utils/autoUpdater.js'
import { getCurrentInstallationType } from '../../utils/doctorDiagnostic.js'
import { installOrUpdateZeroPackage, localInstallationExists } from '../../utils/localInstaller.js'
import { getInitialSettings } from '../../utils/settings/settings.js'
import { gte } from '../../utils/semver.js'
import type { LocalJSXCommandCall } from '../../types/command.js'

type UpdateState =
  | { type: 'checking' }
  | { type: 'up-to-date'; version: string }
  | { type: 'updating'; from: string; to: string }
  | { type: 'success'; from: string; to: string }
  | { type: 'failed'; error: string }
  | { type: 'dev-build' }

function UpdateScreen({ onDone }: {
  onDone: (result: string, options?: { display?: CommandResultDisplay }) => void
}) {
  const [state, setState] = useState<UpdateState>({ type: 'checking' })
  useExitOnCtrlCDWithKeybindings()

  useEffect(() => {
    void (async () => {
      try {
        const installationType = await getCurrentInstallationType()

        if (installationType === 'development') {
          setState({ type: 'dev-build' })
          return
        }

        const currentVersion = MACRO.VERSION
        const channel = getInitialSettings()?.autoUpdatesChannel ?? 'latest'
        const latestVersion = await getLatestVersion(channel)

        if (!latestVersion) {
          setState({ type: 'failed', error: 'Failed to fetch latest version from npm registry' })
          return
        }

        if (gte(currentVersion, latestVersion)) {
          setState({ type: 'up-to-date', version: currentVersion })
          return
        }

        setState({ type: 'updating', from: currentVersion, to: latestVersion })

        let installStatus: InstallStatus
        if (installationType === 'npm-local') {
          installStatus = await installOrUpdateZeroPackage(channel)
        } else {
          installStatus = await installGlobalPackage()
        }

        if (installStatus === 'success') {
          setState({ type: 'success', from: currentVersion, to: latestVersion })
        } else {
          setState({ type: 'failed', error: `Update failed (${installStatus}). Try: npm i -g ${MACRO.PACKAGE_URL}` })
        }
      } catch (err) {
        setState({ type: 'failed', error: String(err) })
      }
    })()
  }, [])

  const handleDone = () => {
    switch (state.type) {
      case 'success':
        onDone(`Updated from ${state.from} to ${state.to}. Restart to apply.`, { display: 'system' })
        break
      case 'up-to-date':
        onDone(`Already up to date (${state.version})`, { display: 'system' })
        break
      case 'failed':
        onDone(state.error, { display: 'system' })
        break
      case 'dev-build':
        onDone('Cannot update development build', { display: 'system' })
        break
      default:
        onDone('Update dismissed', { display: 'system' })
    }
  }

  return (
    <Box flexDirection="column">
      {state.type === 'checking' && (
        <Text dimColor>Checking for updates…</Text>
      )}
      {state.type === 'up-to-date' && (
        <>
          <Text color="green">✓ ZeroCLI is up to date ({state.version})</Text>
          <PressEnterToContinue onEnter={handleDone} />
        </>
      )}
      {state.type === 'updating' && (
        <Text dimColor>Updating {state.from} → {state.to}…</Text>
      )}
      {state.type === 'success' && (
        <>
          <Text color="green">✓ Updated {state.from} → {state.to}</Text>
          <Text dimColor>Restart ZeroCLI to apply the update.</Text>
          <PressEnterToContinue onEnter={handleDone} />
        </>
      )}
      {state.type === 'failed' && (
        <>
          <Text color="red">✗ {state.error}</Text>
          <PressEnterToContinue onEnter={handleDone} />
        </>
      )}
      {state.type === 'dev-build' && (
        <>
          <Text color="yellow">Cannot update a development build.</Text>
          <PressEnterToContinue onEnter={handleDone} />
        </>
      )}
    </Box>
  )
}

export const call: LocalJSXCommandCall = (onDone, _context, _args) => {
  return Promise.resolve(<UpdateScreen onDone={onDone} />)
}
