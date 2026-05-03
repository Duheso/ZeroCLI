/**
 * REPL integration hook for `claude ssh` sessions.
 *
 * Sibling to useDirectConnect — same shape (isRemoteMode/sendMessage/
 * cancelRequest/disconnect), same REPL wiring, but drives an SSH child
 * process instead of a WebSocket. Kept separate rather than generalizing
 * useDirectConnect because the lifecycle differs: the ssh process and auth
 * proxy are created BEFORE this hook runs (during startup, in main.tsx) and
 * handed in; useDirectConnect creates its WebSocket inside the effect.
 */

import { randomUUID } from 'crypto'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { ToolUseConfirm } from '../components/permissions/PermissionRequest.js'
import {
  createSyntheticAssistantMessage,
  createToolStub,
} from '../remote/remotePermissionBridge.js'
import {
  convertSDKMessage,
  isSessionEndMessage,
} from '../remote/sdkMessageAdapter.js'
import type { SDKMessage } from '../entrypoints/sdk/coreTypes.js'
import type { SDKControlPermissionRequest } from '../entrypoints/sdk/controlTypes.js'
import type { SSHSession } from '../ssh/createSSHSession.js'
import type { SSHSessionManager } from '../ssh/SSHSessionManager.js'
import type { Tool } from '../Tool.js'
import { findToolByName } from '../Tool.js'
import type { Message as MessageType } from '../types/message.js'
import type { PermissionAskDecision } from '../types/permissions.js'
import type { PermissionUpdate } from '../utils/permissions/PermissionUpdateSchema.js'
import { logForDebugging } from '../utils/debug.js'
import { gracefulShutdown } from '../utils/gracefulShutdown.js'
import type { RemoteMessageContent } from '../utils/teleport/api.js'

type UseSSHSessionResult = {
  isRemoteMode: boolean
  sendMessage: (content: RemoteMessageContent) => Promise<boolean>
  cancelRequest: () => void
  disconnect: () => void
}

type UseSSHSessionProps = {
  session: SSHSession | undefined
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
  setIsLoading: (loading: boolean) => void
  setToolUseConfirmQueue: React.Dispatch<React.SetStateAction<ToolUseConfirm[]>>
  tools: Tool[]
}

export function useSSHSession({
  session,
  setMessages,
  setIsLoading,
  setToolUseConfirmQueue,
  tools,
}: UseSSHSessionProps): UseSSHSessionResult {
  const isRemoteMode = !!session

  const managerRef = useRef<SSHSessionManager | null>(null)
  const hasReceivedInitRef = useRef(false)
  const isConnectedRef = useRef(false)

  const toolsRef = useRef(tools)
  useEffect(() => {
    toolsRef.current = tools
  }, [tools])

  useEffect(() => {
    if (!session) return

    hasReceivedInitRef.current = false
    logForDebugging('[useSSHSession] wiring SSH session manager')

    const manager = session.createManager({
      onMessage: (sdkMessage: SDKMessage) => {
        if (isSessionEndMessage(sdkMessage)) {
          setIsLoading(false)
        }

        // Skip duplicate init messages (one per turn from stream-json mode).
        if (sdkMessage.type === 'system' && sdkMessage.subtype === 'init') {
          if (hasReceivedInitRef.current) return
          hasReceivedInitRef.current = true
        }

        const converted = convertSDKMessage(sdkMessage, {
          convertToolResults: true,
        })
        if (converted.type === 'message') {
          setMessages(prev => [...prev, converted.message])
        }
      },
      onPermissionRequest: (request: SDKControlPermissionRequest, requestId: string) => {
        const toolName = request.tool_name ?? 'unknown'
        logForDebugging(
          `[useSSHSession] permission request: ${toolName}`,
        )

        const tool =
          findToolByName(toolsRef.current, toolName) ??
          createToolStub(toolName)

        const syntheticMessage = createSyntheticAssistantMessage(
          request,
          requestId,
        )

        const permissionResult: PermissionAskDecision = {
          behavior: 'ask',
          message:
            request.description ?? `${toolName} requires permission`,
          suggestions: request.permission_suggestions as PermissionUpdate[] | undefined,
          blockedPath: request.blocked_path,
        }

        const toolUseID = request.tool_use_id ?? ''
        const toolUseConfirm: ToolUseConfirm = {
          assistantMessage: syntheticMessage,
          tool,
          description:
            request.description ?? `${toolName} requires permission`,
          input: request.input as { [key: string]: unknown },
          toolUseContext: {} as ToolUseConfirm['toolUseContext'],
          toolUseID,
          permissionResult,
          permissionPromptStartTimeMs: Date.now(),
          onUserInteraction() {},
          onAbort() {
            manager.respondToPermissionRequest(requestId, {
              behavior: 'deny',
              message: 'User aborted',
            })
            setToolUseConfirmQueue(q =>
              q.filter(i => i.toolUseID !== toolUseID),
            )
          },
          onAllow(updatedInput) {
            manager.respondToPermissionRequest(requestId, {
              behavior: 'allow',
              updatedInput,
            })
            setToolUseConfirmQueue(q =>
              q.filter(i => i.toolUseID !== toolUseID),
            )
            setIsLoading(true)
          },
          onReject(feedback) {
            manager.respondToPermissionRequest(requestId, {
              behavior: 'deny',
              message: feedback ?? 'User denied permission',
            })
            setToolUseConfirmQueue(q =>
              q.filter(i => i.toolUseID !== toolUseID),
            )
          },
          async recheckPermission() {},
        }

        setToolUseConfirmQueue(q => [...q, toolUseConfirm])
        setIsLoading(false)
      },
      onConnected: () => {
        logForDebugging('[useSSHSession] connected')
        isConnectedRef.current = true
      },
      onReconnecting: (attempt: number, max: number) => {
        logForDebugging(
          `[useSSHSession] ssh dropped, reconnecting (${attempt}/${max})`,
        )
        isConnectedRef.current = false
        // Surface a transient system message in the transcript so the user
        // knows what's happening — the next onConnected clears the state.
        // Any in-flight request is lost; the remote's --continue reloads
        // history but there's no turn in progress to resume.
        setIsLoading(false)
        const msg: MessageType = {
          type: 'system',
          subtype: 'informational',
          content: `SSH connection dropped — reconnecting (attempt ${attempt}/${max})...`,
          timestamp: new Date().toISOString(),
          uuid: randomUUID(),
          level: 'warning',
          isMeta: false,
        }
        setMessages(prev => [...prev, msg])
      },
      onDisconnected: () => {
        logForDebugging('[useSSHSession] ssh process exited (giving up)')
        const stderr = session.getStderrTail().trim()
        const connected = isConnectedRef.current
        const exitCode = session.proc.exitCode
        isConnectedRef.current = false
        setIsLoading(false)

        let msg = connected
          ? 'Remote session ended.'
          : 'SSH session failed before connecting.'
        // Surface remote stderr if it looks like an error (pre-connect always,
        // post-connect only on nonzero exit — normal --verbose noise otherwise).
        if (stderr && (!connected || exitCode !== 0)) {
          msg += `\nRemote stderr (exit ${exitCode ?? 'signal ' + session.proc.signalCode}):\n${stderr}`
        }
        void gracefulShutdown(1, 'other', { finalMessage: msg })
      },
      onError: (error: unknown) => {
        const errMsg = error instanceof Error ? error.message : String(error)
        logForDebugging(`[useSSHSession] error: ${errMsg}`)
      },
    })

    managerRef.current = manager
    manager.connect()

    return () => {
      logForDebugging('[useSSHSession] cleanup')
      manager.disconnect()
      session.proxy.stop()
      managerRef.current = null
    }
  }, [session, setMessages, setIsLoading, setToolUseConfirmQueue])

  const sendMessage = useCallback(
    async (content: RemoteMessageContent): Promise<boolean> => {
      const m = managerRef.current
      if (!m) return false
      setIsLoading(true)
      return m.sendMessage(content)
    },
    [setIsLoading],
  )

  const cancelRequest = useCallback(() => {
    managerRef.current?.sendInterrupt()
    setIsLoading(false)
  }, [setIsLoading])

  const disconnect = useCallback(() => {
    managerRef.current?.disconnect()
    managerRef.current = null
    isConnectedRef.current = false
  }, [])

  return useMemo(
    () => ({ isRemoteMode, sendMessage, cancelRequest, disconnect }),
    [isRemoteMode, sendMessage, cancelRequest, disconnect],
  )
}
