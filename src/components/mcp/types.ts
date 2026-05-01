import type {
  ConfigScope,
  MCPServerConnection,
  McpClaudeAIProxyServerConfig,
  McpHTTPServerConfig,
  McpSSEServerConfig,
  McpStdioServerConfig,
} from '../../services/mcp/types.js'

// Agent MCP Server Info — extracted from agent frontmatter
export type AgentMcpServerInfo = {
  name: string
  sourceAgents: string[]
} & (
  | {
      transport: 'stdio'
      command: string
      needsAuth: false
    }
  | {
      transport: 'sse' | 'http'
      url: string
      needsAuth: boolean
    }
  | {
      transport: 'ws'
      url: string
      needsAuth: boolean
    }
)

// Server Info types — built in MCPSettings.tsx prepareServers()
export type StdioServerInfo = {
  name: string
  client: MCPServerConnection
  scope: ConfigScope
  transport: 'stdio'
  config: McpStdioServerConfig
}

export type SSEServerInfo = {
  name: string
  client: MCPServerConnection
  scope: ConfigScope
  transport: 'sse'
  isAuthenticated: boolean | undefined
  config: McpSSEServerConfig
}

export type HTTPServerInfo = {
  name: string
  client: MCPServerConnection
  scope: ConfigScope
  transport: 'http'
  isAuthenticated: boolean | undefined
  config: McpHTTPServerConfig
}

export type ClaudeAIServerInfo = {
  name: string
  client: MCPServerConnection
  scope: ConfigScope
  transport: 'claudeai-proxy'
  isAuthenticated: false
  config: McpClaudeAIProxyServerConfig
}

export type ServerInfo =
  | StdioServerInfo
  | SSEServerInfo
  | HTTPServerInfo
  | ClaudeAIServerInfo

// MCPViewState — tracked in MCPSettings.tsx
export type MCPViewState =
  | { type: 'list'; defaultTab?: string }
  | { type: 'server-menu'; server: ServerInfo }
  | { type: 'server-tools'; server: ServerInfo }
  | {
      type: 'server-tool-detail'
      server: ServerInfo
      toolIndex: number
    }
  | { type: 'agent-server-menu'; agentServer: AgentMcpServerInfo }
