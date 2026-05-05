/**
 * ZeroCLI Chrome MCP Server
 *
 * This module replaces the internal @ant/claude-for-chrome-mcp package.
 * It creates an MCP server that routes browser automation tool calls to the
 * ZeroCLI Browser Extension via the Chrome Native Host Unix socket.
 *
 * Architecture:
 *   ZeroCLI (MCP client) ←stdio→ [this MCP server] ←Unix socket→ ChromeNativeHost ←NativeMsg→ Extension
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createConnection } from 'net'
import { z } from 'zod'
import { logForDebugging } from '../debug.js'
import { getAllSocketPaths, getSecureSocketPath } from './common.js'

export const MCP_SERVER_NAME = 'ZeroCLI Browser Extension'
export const MCP_SERVER_VERSION = '1.0.0'

// ─── Tool definitions ─────────────────────────────────────────────────────────

/** List of all browser tools exposed by this MCP server. */
export const ZEROCLI_BROWSER_TOOLS: string[] = [
  'tabs_context_mcp',
  'tabs_create_mcp',
  'navigate',
  'computer',
  'javascript_tool',
  'read_page',
  'find',
  'form_input',
  'get_page_text',
  'read_console_messages',
  'read_network_requests',
  'gif_creator',
  'resize_window',
  'upload_image',
  'update_plan',
  'shortcuts_list',
  'shortcuts_execute',
]

// ─── Socket client ────────────────────────────────────────────────────────────

const MAX_MESSAGE_SIZE = 1024 * 1024

/**
 * Sends a tool request via the Unix socket to the Chrome Native Host,
 * which then forwards it to the ZeroCLI Browser Extension.
 * Returns the response from the extension.
 */
async function sendToolRequest(
  method: string,
  params: unknown,
): Promise<unknown> {
  const socketPaths = getAllSocketPaths()

  for (const socketPath of socketPaths) {
    try {
      const result = await sendViaSocket(socketPath, method, params)
      return result
    } catch (err) {
      logForDebugging(
        `[ZeroCLI Chrome] Socket ${socketPath} failed: ${err}`,
        { level: 'debug' },
      )
    }
  }

  throw new Error(
    'Browser extension is not connected. ' +
      'Ensure the ZeroCLI Browser Extension is installed in Chrome ' +
      '(chrome-extension/ directory, developer mode) and ZeroCLI is running with `zero --chrome`.',
  )
}

function sendViaSocket(
  socketPath: string,
  method: string,
  params: unknown,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const socket = createConnection(socketPath)
    let buffer = Buffer.alloc(0)
    let resolved = false

    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const request = JSON.stringify({ method, params, id: requestId })
    const requestBytes = Buffer.from(request, 'utf-8')
    const lengthBuf = Buffer.alloc(4)
    lengthBuf.writeUInt32LE(requestBytes.length, 0)
    const message = Buffer.concat([lengthBuf, requestBytes])

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true
        socket.destroy()
        reject(new Error(`Timeout waiting for tool response: ${method}`))
      }
    }, 30000)

    socket.on('connect', () => {
      socket.write(message)
    })

    socket.on('data', (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk])

      while (buffer.length >= 4) {
        const length = buffer.readUInt32LE(0)
        if (length === 0 || length > MAX_MESSAGE_SIZE) {
          reject(new Error(`Invalid response length: ${length}`))
          socket.destroy()
          return
        }
        if (buffer.length < 4 + length) break

        const messageBytes = buffer.subarray(4, 4 + length)
        buffer = buffer.subarray(4 + length)

        try {
          const response = JSON.parse(messageBytes.toString('utf-8')) as {
            id?: string
            result?: unknown
            error?: { message: string }
          }

          if (response.id === requestId || !response.id) {
            clearTimeout(timeout)
            resolved = true
            socket.destroy()

            if (response.error) {
              reject(new Error(response.error.message))
            } else {
              resolve(response.result ?? response)
            }
          }
        } catch (e) {
          clearTimeout(timeout)
          resolved = true
          socket.destroy()
          reject(new Error(`Failed to parse response: ${e}`))
        }
      }
    })

    socket.on('error', (err) => {
      if (!resolved) {
        clearTimeout(timeout)
        resolved = true
        reject(err)
      }
    })

    socket.on('close', () => {
      if (!resolved) {
        clearTimeout(timeout)
        resolved = true
        reject(new Error('Socket closed before receiving response'))
      }
    })
  })
}

// ─── MCP server factory ───────────────────────────────────────────────────────

/** Creates the ZeroCLI Chrome MCP server with all browser tools registered. */
export function createZeroCLIChromeMcpServer(): McpServer {
  const server = new McpServer({
    name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
  })

  const callTool = async (method: string, params: unknown) => {
    logForDebugging(`[ZeroCLI Chrome MCP] Calling tool: ${method}`, {
      level: 'debug',
    })
    const result = await sendToolRequest(method, params)
    logForDebugging(`[ZeroCLI Chrome MCP] Tool result: ${method}`, {
      level: 'debug',
    })
    return result
  }

  // ── tabs_context_mcp ──────────────────────────────────────────────────────
  server.tool(
    'tabs_context_mcp',
    'Get information about all currently open browser tabs. Call this first to understand what tabs are available before creating new ones.',
    {},
    async () => {
      const result = await callTool('tabs_context_mcp', {})
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── tabs_create_mcp ───────────────────────────────────────────────────────
  server.tool(
    'tabs_create_mcp',
    'Open a new browser tab, optionally navigating to a URL.',
    {
      url: z.string().optional().describe('URL to open in the new tab'),
      active: z
        .boolean()
        .optional()
        .describe('Whether to make the new tab active (default: true)'),
    },
    async (params) => {
      const result = await callTool('tabs_create_mcp', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── navigate ──────────────────────────────────────────────────────────────
  server.tool(
    'navigate',
    'Navigate a specific tab to a URL.',
    {
      tabId: z.number().describe('The tab ID to navigate'),
      url: z.string().describe('The URL to navigate to'),
    },
    async (params) => {
      const result = await callTool('navigate', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── computer ─────────────────────────────────────────────────────────────
  server.tool(
    'computer',
    'Perform computer-use actions in the browser: clicking, typing, scrolling, taking screenshots, and keyboard shortcuts.',
    {
      action: z
        .enum([
          'screenshot',
          'left_click',
          'right_click',
          'double_click',
          'middle_click',
          'type',
          'key',
          'scroll',
          'wait',
          'left_click_drag',
        ])
        .describe('The action to perform'),
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      coordinate: z
        .array(z.number())
        .length(2)
        .optional()
        .describe('[x, y] coordinates for click/scroll actions'),
      ref: z.string().optional().describe('CSS selector or XPath to target element'),
      text: z.string().optional().describe('Text to type or key to press'),
      scroll_direction: z
        .enum(['up', 'down', 'left', 'right'])
        .optional()
        .describe('Scroll direction'),
      scroll_distance: z
        .number()
        .optional()
        .describe('Scroll distance in units (default: 3)'),
      duration: z
        .number()
        .optional()
        .describe('Duration in seconds for wait action'),
      startCoordinate: z
        .array(z.number())
        .length(2)
        .optional()
        .describe('[x, y] start coordinates for drag'),
      endCoordinate: z
        .array(z.number())
        .length(2)
        .optional()
        .describe('[x, y] end coordinates for drag'),
    },
    async (params) => {
      const result = await callTool('computer', params)
      if (
        params.action === 'screenshot' &&
        result &&
        typeof result === 'object' &&
        'image' in result
      ) {
        const img = (result as { image: { type: string; media_type: string; data: string } }).image
        return {
          content: [
            {
              type: 'image' as const,
              mimeType: img.media_type as 'image/png',
              data: img.data,
            },
          ],
        }
      }
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── javascript_tool ───────────────────────────────────────────────────────
  server.tool(
    'javascript_tool',
    'Execute JavaScript code in a browser tab and return the result.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      code: z.string().describe('JavaScript code to execute'),
    },
    async (params) => {
      const result = await callTool('javascript_tool', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── read_page ─────────────────────────────────────────────────────────────
  server.tool(
    'read_page',
    'Read the structure/content of a web page. Returns a simplified DOM representation.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      format: z
        .enum(['simplified', 'html'])
        .optional()
        .describe('Output format: simplified DOM or full HTML (default: simplified)'),
    },
    async (params) => {
      const result = await callTool('read_page', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── find ──────────────────────────────────────────────────────────────────
  server.tool(
    'find',
    'Find elements on a web page by text content or CSS selector.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      query: z
        .string()
        .optional()
        .describe('Text to search for on the page'),
      selector: z
        .string()
        .optional()
        .describe('CSS selector to find elements'),
    },
    async (params) => {
      const result = await callTool('find', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── form_input ────────────────────────────────────────────────────────────
  server.tool(
    'form_input',
    'Fill a form field with a value. Supports text inputs, textareas, select dropdowns, checkboxes, and radio buttons.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      selector: z.string().optional().describe('CSS selector to target the form field'),
      ref: z
        .string()
        .optional()
        .describe('Element reference (id, name, placeholder, or data-ref)'),
      value: z
        .union([z.string(), z.boolean()])
        .describe('Value to set. For checkboxes, use true/false.'),
      type: z
        .string()
        .optional()
        .describe('Field type hint (text, select, checkbox, etc.)'),
    },
    async (params) => {
      const result = await callTool('form_input', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── get_page_text ─────────────────────────────────────────────────────────
  server.tool(
    'get_page_text',
    'Get all visible text content from a web page.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
    },
    async (params) => {
      const result = await callTool('get_page_text', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── read_console_messages ─────────────────────────────────────────────────
  server.tool(
    'read_console_messages',
    'Read console log messages from a browser tab. Attaches Chrome DevTools to capture logs.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      limit: z
        .number()
        .optional()
        .describe('Maximum number of messages to return (default: 100)'),
      pattern: z
        .string()
        .optional()
        .describe('Regex pattern to filter messages (e.g. "[MyApp]")'),
    },
    async (params) => {
      const result = await callTool('read_console_messages', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── read_network_requests ─────────────────────────────────────────────────
  server.tool(
    'read_network_requests',
    'Read network requests made by a browser tab.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      limit: z
        .number()
        .optional()
        .describe('Maximum number of requests to return (default: 50)'),
      urlPattern: z
        .string()
        .optional()
        .describe('Regex pattern to filter by URL'),
    },
    async (params) => {
      const result = await callTool('read_network_requests', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── gif_creator ───────────────────────────────────────────────────────────
  server.tool(
    'gif_creator',
    'Record a GIF of a browser tab by capturing frames over a duration.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      filename: z
        .string()
        .optional()
        .describe('Output filename for the GIF (default: recording.gif)'),
      duration: z
        .number()
        .optional()
        .describe('Recording duration in milliseconds (default: 5000)'),
    },
    async (params) => {
      const result = await callTool('gif_creator', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── resize_window ─────────────────────────────────────────────────────────
  server.tool(
    'resize_window',
    'Resize the browser window to specified dimensions.',
    {
      width: z.number().describe('Window width in pixels'),
      height: z.number().describe('Window height in pixels'),
      windowId: z
        .number()
        .optional()
        .describe('Window ID (uses current window if not specified)'),
    },
    async (params) => {
      const result = await callTool('resize_window', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── upload_image ──────────────────────────────────────────────────────────
  server.tool(
    'upload_image',
    'Upload an image to a file input element on the page.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      selector: z.string().describe('CSS selector for the file input element'),
      imageData: z.string().describe('Base64-encoded image data'),
      mediaType: z
        .string()
        .optional()
        .describe('MIME type of the image (default: image/png)'),
    },
    async (params) => {
      const result = await callTool('upload_image', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── update_plan ───────────────────────────────────────────────────────────
  server.tool(
    'update_plan',
    'Update the internal automation plan state.',
    {
      plan: z.string().describe('Plan content to store'),
    },
    async (params) => {
      const result = await callTool('update_plan', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── shortcuts_list ────────────────────────────────────────────────────────
  server.tool(
    'shortcuts_list',
    'List available keyboard shortcuts that can be executed in the browser.',
    {},
    async () => {
      const result = await callTool('shortcuts_list', {})
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  // ── shortcuts_execute ─────────────────────────────────────────────────────
  server.tool(
    'shortcuts_execute',
    'Execute a keyboard shortcut in a browser tab.',
    {
      tabId: z.number().optional().describe('Tab ID (uses active tab if not specified)'),
      key: z
        .string()
        .describe('Key combination (e.g. "Ctrl+C", "Enter", "Tab", "Escape")'),
    },
    async (params) => {
      const result = await callTool('shortcuts_execute', params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    },
  )

  return server
}

// ─── Entry point ──────────────────────────────────────────────────────────────

/** Run the ZeroCLI Chrome MCP server (called from entrypoint via --zero-in-chrome-mcp flag). */
export async function runZeroCLIChromeMcpServer(): Promise<void> {
  const server = createZeroCLIChromeMcpServer()
  const transport = new StdioServerTransport()

  let exiting = false
  const shutdownAndExit = async (): Promise<void> => {
    if (exiting) return
    exiting = true
    process.exit(0)
  }

  process.stdin.on('end', () => void shutdownAndExit())
  process.stdin.on('error', () => void shutdownAndExit())

  logForDebugging('[ZeroCLI Chrome] Starting MCP server')
  await server.connect(transport)
  logForDebugging('[ZeroCLI Chrome] MCP server started')
}
