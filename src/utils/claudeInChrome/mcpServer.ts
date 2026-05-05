/**
 * ZeroCLI Chrome MCP Server entrypoint.
 *
 * This file was refactored to remove the dependency on the internal
 * @ant/claude-for-chrome-mcp package. All browser tools are now implemented
 * in zeroCLIMcpServer.ts, which communicates with the ZeroCLI Browser Extension
 * via the Chrome Native Host Unix socket.
 */

import { enableConfigs } from '../config.js'
import { logForDebugging } from '../debug.js'
import { runZeroCLIChromeMcpServer } from './zeroCLIMcpServer.js'

export async function runZeroInChromeMcpServer(): Promise<void> {
  enableConfigs()
  logForDebugging('[ZeroCLI Chrome] Starting MCP server')
  await runZeroCLIChromeMcpServer()
}
