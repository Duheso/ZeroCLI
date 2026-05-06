/**
 * MCP Bridge Server for Zero CLI ↔ VS Code integration.
 *
 * Starts an SSE-based server that implements the MCP protocol subset needed
 * by the Zero CLI `/ide` command: openFile, getDiagnostics, openDiff,
 * close_tab, closeAllDiffTabs.
 *
 * On startup it writes a lockfile to `<configDir>/ide/<port>.lock` so the
 * CLI can discover and connect to this VS Code instance.
 */

const vscode = require('vscode');
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ── Config directory resolution (mirrors src/utils/envUtils.ts) ──────────

function resolveConfigHomeDir() {
  if (process.env.CLAUDE_CONFIG_DIR) {
    return process.env.CLAUDE_CONFIG_DIR;
  }
  const home = os.homedir();
  const openDir = path.join(home, '.zerocli');
  const legacyDir = path.join(home, '.claude');
  if (!fs.existsSync(openDir) && fs.existsSync(legacyDir)) {
    return legacyDir;
  }
  return openDir;
}

// ── SSE helpers ──────────────────────────────────────────────────────────

function sseWriteJson(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function sseWriteRaw(res, event, data) {
  res.write(`event: ${event}\ndata: ${data}\n\n`);
}

// ── MCP Tool Handlers ────────────────────────────────────────────────────

async function handleOpenFile(params) {
  const { filePath, preview, startText, endText, selectToEndOfLine, makeFrontmost } = params;
  if (!filePath) {
    return { content: [{ type: 'text', text: 'filePath is required' }], isError: true };
  }

  try {
    const uri = vscode.Uri.file(filePath.replace(/^file:\/\//, ''));
    const doc = await vscode.workspace.openTextDocument(uri);
    const viewColumn = makeFrontmost !== false ? vscode.ViewColumn.One : vscode.ViewColumn.Beside;
    const editor = await vscode.window.showTextDocument(doc, {
      preview: preview !== false,
      viewColumn,
      preserveFocus: makeFrontmost === false,
    });

    // Select text range if startText/endText provided
    if (startText && editor) {
      const text = doc.getText();
      const startIdx = text.indexOf(startText);
      if (startIdx >= 0) {
        const startPos = doc.positionAt(startIdx);
        let endPos;
        if (endText) {
          const endIdx = text.indexOf(endText, startIdx);
          if (endIdx >= 0) {
            endPos = doc.positionAt(endIdx + endText.length);
          }
        }
        if (!endPos) {
          if (selectToEndOfLine) {
            endPos = doc.lineAt(startPos.line).range.end;
          } else {
            endPos = doc.positionAt(startIdx + startText.length);
          }
        }
        editor.selection = new vscode.Selection(startPos, endPos);
        editor.revealRange(new vscode.Range(startPos, endPos), vscode.TextEditorRevealType.InCenter);
      }
    }

    return { content: [{ type: 'text', text: 'OK' }] };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
}

async function handleGetDiagnostics(params) {
  const { uri: filterUri } = params;

  const results = [];
  const diagnosticsByUri = vscode.languages.getDiagnostics();

  for (const [uri, diagnostics] of diagnosticsByUri) {
    if (filterUri) {
      const normalizedFilter = filterUri.replace(/^file:\/\//, '');
      const normalizedUri = uri.fsPath;
      if (normalizedUri !== normalizedFilter && uri.toString() !== filterUri) {
        continue;
      }
    }

    if (diagnostics.length === 0) continue;

    results.push({
      uri: uri.toString(),
      diagnostics: diagnostics.map(d => ({
        range: {
          start: { line: d.range.start.line, character: d.range.start.character },
          end: { line: d.range.end.line, character: d.range.end.character },
        },
        message: d.message,
        severity: d.severity,
        source: d.source || '',
        code: typeof d.code === 'object' ? d.code.value : d.code,
      })),
    });
  }

  return { content: [{ type: 'text', text: JSON.stringify(results) }] };
}

const DIFF_SCHEME = 'zerocli-diff';

async function handleOpenDiff(params) {
  const { old_file_path, new_file_path, new_file_contents, tab_name } = params;

  if (!old_file_path || new_file_contents === undefined) {
    return { content: [{ type: 'text', text: 'old_file_path and new_file_contents are required' }], isError: true };
  }

  try {
    const oldUri = vscode.Uri.file(old_file_path);
    const diffKey = crypto.randomUUID();
    const newUri = vscode.Uri.parse(`${DIFF_SCHEME}:${diffKey}?content=${encodeURIComponent(new_file_contents)}`);

    // Register a temporary content provider for the right-hand side
    const provider = new (class {
      provideTextDocumentContent() {
        return new_file_contents;
      }
    })();
    const reg = vscode.workspace.registerTextDocumentContentProvider(DIFF_SCHEME, provider);

    const title = tab_name || `Diff: ${path.basename(old_file_path)}`;
    await vscode.commands.executeCommand('vscode.diff', oldUri, newUri, title);

    // Keep the provider alive until the tab is closed
    const tabCloseListener = vscode.window.tabGroups.onDidChangeTabs(e => {
      const stillOpen = vscode.window.tabGroups.all.some(g =>
        g.tabs.some(t => {
          const input = t.input;
          return input && typeof input === 'object' && 'modified' in input &&
            input.modified && input.modified.toString() === newUri.toString();
        })
      );
      if (!stillOpen) {
        reg.dispose();
        tabCloseListener.dispose();
      }
    });

    return new Promise((resolve) => {
      // Wait for user to close the diff tab or save
      const watcher = vscode.window.tabGroups.onDidChangeTabs(e => {
        for (const closed of e.closed) {
          if (closed.label === title) {
            watcher.dispose();
            resolve({ content: [{ type: 'text', text: 'TAB_CLOSED' }] });
            return;
          }
        }
      });

      // Also listen for file saves
      const saveWatcher = vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.uri.fsPath === oldUri.fsPath) {
          watcher.dispose();
          saveWatcher.dispose();
          const savedContent = doc.getText();
          resolve({ content: [{ type: 'text', text: JSON.stringify({ saved: true, content: savedContent }) }] });
        }
      });
    });
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
}

async function handleCloseTab(params) {
  const { tab_name } = params;
  if (!tab_name) {
    return { content: [{ type: 'text', text: 'tab_name is required' }], isError: true };
  }

  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (tab.label === tab_name) {
        await vscode.window.tabGroups.close(tab);
        return { content: [{ type: 'text', text: 'TAB_CLOSED' }] };
      }
    }
  }

  return { content: [{ type: 'text', text: 'TAB_NOT_FOUND' }] };
}

async function handleCloseAllDiffTabs() {
  const closedTabs = [];
  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      const input = tab.input;
      if (input && typeof input === 'object' && 'modified' in input) {
        await vscode.window.tabGroups.close(tab);
        closedTabs.push(tab.label);
      }
    }
  }
  return { content: [{ type: 'text', text: `Closed ${closedTabs.length} diff tab(s)` }] };
}

// Tool dispatch table
const TOOLS = {
  openFile: handleOpenFile,
  getDiagnostics: handleGetDiagnostics,
  openDiff: handleOpenDiff,
  close_tab: handleCloseTab,
  closeAllDiffTabs: handleCloseAllDiffTabs,
};

// Tool metadata for tools/list
const TOOL_DEFINITIONS = [
  {
    name: 'openFile',
    description: 'Open a file in VS Code editor',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Absolute file path to open' },
        preview: { type: 'boolean', description: 'Open in preview mode' },
        startText: { type: 'string', description: 'Text to select from' },
        endText: { type: 'string', description: 'Text to select to' },
        selectToEndOfLine: { type: 'boolean' },
        makeFrontmost: { type: 'boolean' },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'getDiagnostics',
    description: 'Get language diagnostics (errors, warnings) from VS Code',
    inputSchema: {
      type: 'object',
      properties: {
        uri: { type: 'string', description: 'File URI to get diagnostics for. Omit to get all.' },
      },
    },
  },
  {
    name: 'openDiff',
    description: 'Open a diff view in VS Code',
    inputSchema: {
      type: 'object',
      properties: {
        old_file_path: { type: 'string' },
        new_file_path: { type: 'string' },
        new_file_contents: { type: 'string' },
        tab_name: { type: 'string' },
      },
      required: ['old_file_path', 'new_file_contents'],
    },
  },
  {
    name: 'close_tab',
    description: 'Close a tab by name',
    inputSchema: {
      type: 'object',
      properties: { tab_name: { type: 'string' } },
      required: ['tab_name'],
    },
  },
  {
    name: 'closeAllDiffTabs',
    description: 'Close all diff tabs',
    inputSchema: { type: 'object', properties: {} },
  },
];

// ── JSON-RPC + SSE-based MCP Server ──────────────────────────────────────

class McpBridgeServer {
  constructor() {
    this._server = null;
    this._port = 0;
    this._lockfilePath = null;
    this._sseClients = new Map(); // sessionId → response
    this._authToken = crypto.randomUUID();
  }

  get port() {
    return this._port;
  }

  async start() {
    const server = http.createServer((req, res) => this._handleRequest(req, res));
    this._server = server;

    await new Promise((resolve, reject) => {
      server.listen(0, '127.0.0.1', () => {
        this._port = server.address().port;
        resolve();
      });
      server.on('error', reject);
    });

    await this._writeLockfile();
    return this._port;
  }

  async stop() {
    // Remove lockfile
    if (this._lockfilePath) {
      try {
        fs.unlinkSync(this._lockfilePath);
      } catch { /* ignore */ }
    }

    // Close all SSE connections
    for (const [, res] of this._sseClients) {
      try {
        res.end();
      } catch { /* ignore */ }
    }
    this._sseClients.clear();

    // Close server
    if (this._server) {
      await new Promise((resolve) => {
        this._server.close(resolve);
      });
      this._server = null;
    }
  }

  async _writeLockfile() {
    const configDir = resolveConfigHomeDir();
    const ideDir = path.join(configDir, 'ide');

    // Ensure directory exists
    fs.mkdirSync(ideDir, { recursive: true });

    const lockData = {
      workspaceFolders: (vscode.workspace.workspaceFolders || []).map(f => f.uri.fsPath),
      pid: process.pid,
      ideName: 'VS Code',
      transport: 'sse',
      runningInWindows: process.platform === 'win32',
      authToken: this._authToken,
    };

    this._lockfilePath = path.join(ideDir, `${this._port}.lock`);
    fs.writeFileSync(this._lockfilePath, JSON.stringify(lockData, null, 2));
  }

  _handleRequest(req, res) {
    const url = new URL(req.url, `http://127.0.0.1:${this._port}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (url.pathname === '/sse' && req.method === 'GET') {
      this._handleSSE(req, res);
    } else if (url.pathname === '/message' && req.method === 'POST') {
      this._handleMessage(req, res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }

  _handleSSE(req, res) {
    const sessionId = crypto.randomUUID();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    // Send the endpoint event that tells the client where to POST messages
    sseWriteRaw(res, 'endpoint', `/message?sessionId=${sessionId}`);

    this._sseClients.set(sessionId, res);

    req.on('close', () => {
      this._sseClients.delete(sessionId);
    });

    // Keep alive
    const keepAlive = setInterval(() => {
      try {
        res.write(':keepalive\n\n');
      } catch {
        clearInterval(keepAlive);
      }
    }, 15000);

    req.on('close', () => clearInterval(keepAlive));
  }

  _handleMessage(req, res) {
    const url = new URL(req.url, `http://127.0.0.1:${this._port}`);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId || !this._sseClients.has(sessionId)) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid or missing sessionId' }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const message = JSON.parse(body);
        await this._processJsonRpc(sessionId, message);
        res.writeHead(202);
        res.end();
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }

  async _processJsonRpc(sessionId, message) {
    const sseRes = this._sseClients.get(sessionId);
    if (!sseRes) return;

    const { id, method, params } = message;

    // Handle notifications (no id)
    if (id === undefined || id === null) {
      if (method === 'notifications/initialized') {
        // Client finished initialization handshake — nothing to do
      } else if (method === 'ide_connected') {
        // CLI notifying us it connected
        const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
        statusBar.text = '$(plug) Zero CLI Connected';
        statusBar.tooltip = `Zero CLI process ${params?.pid || ''} connected`;
        statusBar.show();
        setTimeout(() => statusBar.dispose(), 5000);
      }
      return;
    }

    let response;

    switch (method) {
      case 'initialize':
        response = {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'zero-vscode-bridge',
              version: '0.2.0',
            },
          },
        };
        break;

      case 'tools/list':
        response = {
          jsonrpc: '2.0',
          id,
          result: {
            tools: TOOL_DEFINITIONS,
          },
        };
        break;

      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        const handler = TOOLS[toolName];

        if (!handler) {
          response = {
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
              isError: true,
            },
          };
        } else {
          try {
            const result = await handler(toolArgs);
            response = { jsonrpc: '2.0', id, result };
          } catch (err) {
            response = {
              jsonrpc: '2.0',
              id,
              result: {
                content: [{ type: 'text', text: `Tool error: ${err.message}` }],
                isError: true,
              },
            };
          }
        }
        break;
      }

      case 'resources/list':
        response = {
          jsonrpc: '2.0',
          id,
          result: { resources: [] },
        };
        break;

      case 'prompts/list':
        response = {
          jsonrpc: '2.0',
          id,
          result: { prompts: [] },
        };
        break;

      default:
        response = {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        };
    }

    sseWriteJson(sseRes, 'message', response);
  }

  dispose() {
    return this.stop();
  }
}

module.exports = { McpBridgeServer };
