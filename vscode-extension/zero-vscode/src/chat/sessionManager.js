/**
 * sessionManager — reads JSONL session history from disk, lists sessions,
 * and provides metadata for the session list UI.
 *
 * Session files live under:
 *   ~/.zerocli/projects/<sanitized-cwd>/<sessionId>.jsonl
 *
 * Falls back to ~/.claude/projects/ for legacy installs.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const MAX_SANITIZED_LENGTH = 80;

function sanitizePath(name) {
  const sanitized = name.replace(/[^a-zA-Z0-9]/g, '-');
  if (sanitized.length <= MAX_SANITIZED_LENGTH) return sanitized;
  const hash = simpleHash(name);
  return sanitized.slice(0, MAX_SANITIZED_LENGTH) + '-' + hash;
}

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function resolveConfigDir() {
  const envDir = process.env.CLAUDE_CONFIG_DIR;
  if (envDir) return envDir;
  const home = os.homedir();
  const openZeroDir = path.join(home, '.zerocli');
  const legacyDir = path.join(home, '.claude');
  if (!fs.existsSync(openZeroDir) && fs.existsSync(legacyDir)) {
    return legacyDir;
  }
  return openZeroDir;
}

function getProjectsDir() {
  return path.join(resolveConfigDir(), 'projects');
}

function getProjectDir(cwd) {
  return path.join(getProjectsDir(), sanitizePath(cwd));
}

/**
 * Parse XML-style tags from local command output in session history.
 * Converts tags like <local-command-caveat>, <command-name>, etc. into structured data.
 */
function parseLocalCommandXml(text) {
  if (!text || typeof text !== 'string') return null;
  
  // Check if text contains local command XML tags
  const hasLocalCommand = /<local-command-caveat>|<command-name>|<local-command-stdout>/.test(text);
  if (!hasLocalCommand) return null;

  const result = {
    type: 'local_command',
    caveat: null,
    commandName: null,
    commandMessage: null,
    commandArgs: null,
    stdout: null,
    rawText: text,
  };

  // Extract each tag's content
  const caveatMatch = text.match(/<local-command-caveat>([\s\S]*?)<\/local-command-caveat>/);
  if (caveatMatch) result.caveat = caveatMatch[1].trim();

  const nameMatch = text.match(/<command-name>([\s\S]*?)<\/command-name>/);
  if (nameMatch) result.commandName = nameMatch[1].trim();

  const msgMatch = text.match(/<command-message>([\s\S]*?)<\/command-message>/);
  if (msgMatch) result.commandMessage = msgMatch[1].trim();

  const argsMatch = text.match(/<command-args>([\s\S]*?)<\/command-args>/);
  if (argsMatch) result.commandArgs = argsMatch[1].trim();

  const stdoutMatch = text.match(/<local-command-stdout>([\s\S]*?)<\/local-command-stdout>/);
  if (stdoutMatch) result.stdout = stdoutMatch[1].trim();

  return result;
}

/**
 * Clean text by removing XML tags and returning readable content
 */
function cleanXmlTags(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Remove known XML tags but keep their content readable
  return text
    .replace(/<local-command-caveat>[\s\S]*?<\/local-command-caveat>/g, '')
    .replace(/<command-name>([\s\S]*?)<\/command-name>/g, '/$1')
    .replace(/<command-message>[\s\S]*?<\/command-message>/g, '')
    .replace(/<command-args>([\s\S]*?)<\/command-args>/g, ' $1')
    .replace(/<local-command-stdout>([\s\S]*?)<\/local-command-stdout>/g, '\nOutput: $1')
    .trim();
}

class SessionManager {
  constructor() {
    this._cwd = null;
  }

  setCwd(cwd) {
    this._cwd = cwd;
  }

  async listSessions() {
    const projectDir = this._cwd
      ? getProjectDir(this._cwd)
      : null;

    const dirs = projectDir
      ? [projectDir]
      : await this._allProjectDirs();

    const sessions = [];
    for (const dir of dirs) {
      const items = await this._readSessionDir(dir);
      sessions.push(...items);
    }

    sessions.sort((a, b) => b.timestamp - a.timestamp);
    return sessions;
  }

  async _allProjectDirs() {
    const base = getProjectsDir();
    if (!fs.existsSync(base)) return [];
    try {
      const entries = await fsp.readdir(base, { withFileTypes: true });
      return entries
        .filter(e => e.isDirectory())
        .map(e => path.join(base, e.name));
    } catch {
      return [];
    }
  }

  async _readSessionDir(dir) {
    if (!fs.existsSync(dir)) return [];
    try {
      const files = await fsp.readdir(dir);
      const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
      const results = [];

      for (const file of jsonlFiles) {
        const filePath = path.join(dir, file);
        try {
          const meta = await this._extractSessionMeta(filePath);
          if (meta) results.push(meta);
        } catch { /* skip unreadable */ }
      }

      return results;
    } catch {
      return [];
    }
  }

  async _extractSessionMeta(filePath) {
    const sessionId = path.basename(filePath, '.jsonl');
    const stat = await fsp.stat(filePath);
    // Read a larger head because JSONL files often start with system/snapshot
    // entries before the first user message.
    const head = await this._readHead(filePath, 65536);
    const lines = head.split('\n').filter(Boolean);

    let title = null;
    let preview = '';
    let timestamp = stat.mtimeMs;
    let firstTimestamp = null;

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);

        if (!preview && entry.type === 'user' && entry.message) {
          const content = entry.message.content;
          if (typeof content === 'string') {
            preview = content.slice(0, 120);
          } else if (Array.isArray(content)) {
            const textBlock = content.find(b => b.type === 'text');
            preview = textBlock ? (textBlock.text || '').slice(0, 120) : '';
          }
        }

        if (entry.type === 'custom-title' || entry.type === 'session-title') {
          title = entry.title || entry.name || null;
        }

        if (entry.type === 'summary' && entry.summary && !title) {
          title = entry.summary;
        }

        if (entry.timestamp && !firstTimestamp) {
          const t = typeof entry.timestamp === 'number'
            ? entry.timestamp
            : new Date(entry.timestamp).getTime();
          if (t && !isNaN(t)) firstTimestamp = t;
        }
      } catch { /* skip bad line */ }
    }

    if (firstTimestamp) timestamp = firstTimestamp;
    const timeLabel = formatRelativeTime(timestamp);

    return {
      id: sessionId,
      title: title || preview.slice(0, 60) || 'Untitled session',
      preview: preview || '',
      timestamp,
      timeLabel,
      filePath,
    };
  }

  async loadSession(sessionId) {
    const projectDir = this._cwd ? getProjectDir(this._cwd) : null;
    const dirs = projectDir ? [projectDir] : await this._allProjectDirs();

    for (const dir of dirs) {
      const filePath = path.join(dir, `${sessionId}.jsonl`);
      if (fs.existsSync(filePath)) {
        return this._parseSessionFile(filePath);
      }
    }
    return null;
  }

  async _parseSessionFile(filePath) {
    const content = await fsp.readFile(filePath, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    const messages = [];
    const toolResults = new Map();

    // First pass: collect tool results from user messages
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type === 'user' && entry.message && Array.isArray(entry.message.content)) {
          for (const block of entry.message.content) {
            if (block.type === 'tool_result' && block.tool_use_id) {
              const resultText = typeof block.content === 'string'
                ? block.content
                : Array.isArray(block.content)
                  ? block.content.map(b => b.text || '').join('')
                  : '';
              toolResults.set(String(block.tool_use_id), {
                content: resultText.slice(0, 2000),
                isError: block.is_error || false,
              });
            }
          }
        }
      } catch { /* skip */ }
    }

    // Second pass: build messages with tool use details
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type === 'user' && entry.message) {
          const c = entry.message.content;
          // Skip tool result messages (they're user messages with tool_result blocks)
          if (Array.isArray(c) && c.length > 0 && c[0].type === 'tool_result') continue;
          let text = typeof c === 'string'
            ? c
            : Array.isArray(c)
              ? c.filter(b => b.type === 'text').map(b => b.text).join('')
              : '';
          
          // Check for local command XML tags and parse them
          const localCmd = parseLocalCommandXml(text);
          if (localCmd) {
            messages.push({
              role: 'user',
              text: cleanXmlTags(text),
              localCommand: localCmd,
            });
          } else if (text) {
            messages.push({ role: 'user', text });
          }
        } else if (entry.type === 'assistant' && entry.message) {
          const c = entry.message.content;
          let text = typeof c === 'string'
            ? c
            : Array.isArray(c)
              ? c.filter(b => b.type === 'text').map(b => b.text).join('')
              : '';
          
          // Clean any XML tags in assistant messages too
          const localCmd = parseLocalCommandXml(text);
          if (localCmd) {
            text = cleanXmlTags(text);
          }
          
          const toolUses = Array.isArray(c)
            ? c.filter(b => b.type === 'tool_use').map(tu => {
                const result = toolResults.get(String(tu.id));
                return {
                  id: tu.id,
                  name: tu.name,
                  input: tu.input || null,
                  status: result ? (result.isError ? 'error' : 'complete') : 'complete',
                  result: result ? result.content : null,
                  isError: result ? result.isError : false,
                };
              })
            : [];
          messages.push({ role: 'assistant', text, toolUses, localCommand: localCmd || undefined });
        }
      } catch { /* skip */ }
    }

    return messages;
  }

  async _readHead(filePath, bytes) {
    const fd = await fsp.open(filePath, 'r');
    try {
      const buf = Buffer.alloc(bytes);
      const { bytesRead } = await fd.read(buf, 0, bytes, 0);
      return buf.slice(0, bytesRead).toString('utf8');
    } finally {
      await fd.close();
    }
  }
}

function formatRelativeTime(ts) {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const date = new Date(ts);
  return date.toLocaleDateString();
}

module.exports = { SessionManager };
