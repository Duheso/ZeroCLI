/**
 * chatRenderer — produces the full self-contained HTML document for the chat
 * webview.  All CSS and JS are inlined (no external bundles).
 *
 * The webview JS communicates with the extension host via postMessage.
 * Incoming messages update the DOM incrementally so streaming feels fluid.
 */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderChatHtml({ nonce, platform }) {
  const modKey = platform === 'darwin' ? 'Cmd' : 'Ctrl';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    :root {
      /* ZeroChat Theme - Black/Purple/Cyan */
      --zc-bg: #0a0a0f;
      --zc-panel: #0f0f18;
      --zc-panel-strong: #141420;
      --zc-panel-soft: #1a1a28;
      --zc-border: #3d3d5c;
      --zc-border-soft: rgba(138,130,200,0.14);
      --zc-text: #e8e8f5;
      --zc-text-dim: #b0b0cc;
      --zc-text-soft: #7878a0;
      --zc-accent: #8b5cf6;
      --zc-accent-bright: #a78bfa;
      --zc-accent-soft: rgba(139,92,246,0.18);
      --zc-cyan: #22d3ee;
      --zc-cyan-soft: rgba(34,211,238,0.15);
      --zc-positive: #4ade80;
      --zc-warning: #fbbf24;
      --zc-critical: #f87171;
      --zc-focus: #c4b5fd;
      --zc-user-bg: rgba(139,92,246,0.12);
      --zc-user-border: rgba(139,92,246,0.28);
      --zc-assistant-bg: rgba(34,211,238,0.05);
      --zc-assistant-border: rgba(34,211,238,0.12);
      --zc-code-bg: #12121c;
      --zc-code-border: rgba(138,130,200,0.15);
      --zc-tool-bg: rgba(139,92,246,0.06);
      --zc-tool-border: rgba(139,92,246,0.22);
      --zc-perm-bg: rgba(248,113,113,0.08);
      --zc-perm-border: rgba(248,113,113,0.35);
      /* Legacy aliases for compatibility */
      --oc-bg: var(--zc-bg);
      --oc-panel: var(--zc-panel);
      --oc-panel-strong: var(--zc-panel-strong);
      --oc-panel-soft: var(--zc-panel-soft);
      --oc-border: var(--zc-border);
      --oc-border-soft: var(--zc-border-soft);
      --oc-text: var(--zc-text);
      --oc-text-dim: var(--zc-text-dim);
      --oc-text-soft: var(--zc-text-soft);
      --oc-accent: var(--zc-accent);
      --oc-accent-bright: var(--zc-accent-bright);
      --oc-accent-soft: var(--zc-accent-soft);
      --oc-positive: var(--zc-positive);
      --oc-warning: var(--zc-warning);
      --oc-critical: var(--zc-critical);
      --oc-focus: var(--zc-focus);
      --oc-user-bg: var(--zc-user-bg);
      --oc-user-border: var(--zc-user-border);
      --oc-assistant-bg: var(--zc-assistant-bg);
      --oc-assistant-border: var(--zc-assistant-border);
      --oc-code-bg: var(--zc-code-bg);
      --oc-code-border: var(--zc-code-border);
      --oc-tool-bg: var(--zc-tool-bg);
      --oc-tool-border: var(--zc-tool-border);
      --oc-perm-bg: var(--zc-perm-bg);
      --oc-perm-border: var(--zc-perm-border);
      --oc-success: var(--zc-positive);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    body {
      font-family: var(--vscode-font-family, "Segoe UI", system-ui, sans-serif);
      font-size: 13px;
      color: var(--oc-text);
      background: var(--oc-bg);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* ── Header ── */
    .chat-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--oc-border-soft);
      background: var(--oc-panel);
      flex-shrink: 0;
    }
    .chat-header .brand {
      font-weight: 700;
      font-size: 14px;
      color: var(--oc-text);
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chat-header .brand-accent { color: var(--zc-cyan); }
    .header-btn {
      border: 1px solid var(--oc-border-soft);
      border-radius: 6px;
      background: rgba(255,255,255,0.04);
      color: var(--oc-text-dim);
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }
    .header-btn:hover { border-color: var(--oc-accent); color: var(--oc-text); }
    .header-btn.danger { border-color: var(--oc-critical); color: var(--oc-critical); }
    .header-btn.danger:hover { background: rgba(255,138,108,0.12); }
    #abortBtn { display: none; }

    /* ── Status bar ── */
    .status-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      font-size: 11px;
      color: var(--oc-text-soft);
      border-bottom: 1px solid var(--oc-border-soft);
      background: var(--oc-panel);
      flex-shrink: 0;
    }
    .status-bar .status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--oc-text-soft);
      flex-shrink: 0;
    }
    .status-bar .status-dot.connected { background: var(--oc-positive); }
    .status-bar .status-dot.streaming { background: var(--oc-accent-bright); animation: pulse 1s infinite; }
    .status-bar .status-dot.error { background: var(--oc-critical); }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
    .status-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .status-usage { color: var(--oc-text-soft); }

    /* ── Message list ── */
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .messages::-webkit-scrollbar { width: 6px; }
    .messages::-webkit-scrollbar-track { background: transparent; }
    .messages::-webkit-scrollbar-thumb { background: rgba(220,195,170,0.18); border-radius: 3px; }

    /* ── Welcome screen ── */
    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      text-align: center;
      padding: 32px 16px;
      gap: 16px;
    }
    .welcome-title { font-size: 20px; font-weight: 700; color: var(--oc-text); }
    .welcome-title .accent { color: var(--zc-cyan); }
    .welcome-sub { font-size: 13px; color: var(--oc-text-dim); max-width: 36ch; }
    .welcome-hint { font-size: 11px; color: var(--oc-text-soft); }
    .welcome-hint kbd {
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--oc-border-soft);
      background: rgba(255,255,255,0.04);
      font-family: inherit;
      font-size: 11px;
    }

    /* ── User message ── */
    .msg-user {
      align-self: flex-end;
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px 14px 4px 14px;
      background: var(--oc-user-bg);
      border: 1px solid var(--oc-user-border);
      word-break: break-word;
      white-space: pre-wrap;
    }

    /* ── Assistant message ── */
    .msg-assistant {
      align-self: flex-start;
      max-width: 95%;
      padding: 10px 14px;
      border-radius: 4px 14px 14px 14px;
      background: var(--oc-assistant-bg);
      border: 1px solid var(--oc-assistant-border);
      word-break: break-word;
    }
    .msg-assistant .md-content { line-height: 1.55; }
    .msg-assistant .md-content:empty { display: none; }
    .msg-assistant .md-content p { margin-bottom: 8px; }
    .msg-assistant .md-content p:last-child { margin-bottom: 0; }
    .msg-assistant .md-content ul,
    .msg-assistant .md-content ol { padding-left: 20px; margin-bottom: 8px; }
    .msg-assistant .md-content li { margin-bottom: 4px; }
    .msg-assistant .md-content h1,
    .msg-assistant .md-content h2,
    .msg-assistant .md-content h3 {
      color: var(--oc-text);
      margin: 12px 0 6px;
      font-size: 14px;
      font-weight: 700;
    }
    .msg-assistant .md-content h1 { font-size: 16px; }
    .msg-assistant .md-content a { color: var(--oc-accent-bright); text-decoration: underline; }
    .msg-assistant .md-content strong { color: var(--oc-text); font-weight: 700; }
    .msg-assistant .md-content em { font-style: italic; color: var(--oc-text-dim); }
    .msg-assistant .md-content blockquote {
      border-left: 3px solid var(--oc-accent);
      padding: 4px 12px;
      margin: 8px 0;
      color: var(--oc-text-dim);
    }
    .msg-assistant .md-content hr {
      border: none;
      border-top: 1px solid var(--oc-border-soft);
      margin: 12px 0;
    }

    /* inline code */
    .md-content code:not(.code-block code) {
      padding: 1px 5px;
      border-radius: 4px;
      background: var(--oc-code-bg);
      border: 1px solid var(--oc-code-border);
      font-family: var(--vscode-editor-font-family, Consolas, monospace);
      font-size: 12px;
      color: var(--oc-accent-bright);
    }

    /* fenced code */
    .code-wrapper {
      position: relative;
      margin: 8px 0;
      border-radius: 8px;
      border: 1px solid var(--oc-code-border);
      background: var(--oc-code-bg);
      overflow: hidden;
    }
    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 10px;
      font-size: 11px;
      color: var(--oc-text-soft);
      border-bottom: 1px solid var(--oc-code-border);
      background: rgba(255,255,255,0.02);
    }
    .code-copy-btn {
      border: none;
      background: transparent;
      color: var(--oc-text-soft);
      cursor: pointer;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .code-copy-btn:hover { background: rgba(255,255,255,0.08); color: var(--oc-text); }
    .code-block {
      display: block;
      padding: 10px 12px;
      overflow-x: auto;
      font-family: var(--vscode-editor-font-family, Consolas, monospace);
      font-size: 12px;
      line-height: 1.5;
      white-space: pre;
      color: var(--oc-text-dim);
    }
    .code-block::-webkit-scrollbar { height: 4px; }
    .code-block::-webkit-scrollbar-thumb { background: rgba(220,195,170,0.2); border-radius: 2px; }

    /* keyword highlighting */
    .hl-keyword { color: #c586c0; }
    .hl-string { color: #ce9178; }
    .hl-comment { color: #6a9955; font-style: italic; }
    .hl-number { color: #b5cea8; }
    .hl-func { color: #dcdcaa; }
    .hl-type { color: #4ec9b0; }

    /* ── Tool use card ── */
    .tool-card {
      margin: 8px 0;
      border-radius: 8px;
      border: 1px solid var(--oc-tool-border);
      background: var(--oc-tool-bg);
      overflow: hidden;
    }
    .tool-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 10px;
      cursor: pointer;
      user-select: none;
    }
    .tool-icon { font-size: 14px; flex-shrink: 0; }
    .tool-name { font-weight: 600; font-size: 12px; color: var(--oc-text); flex: 1; }
    .tool-status { font-size: 11px; color: var(--oc-text-soft); }
    .tool-status.running { color: var(--oc-accent-bright); }
    .tool-status.error { color: var(--oc-critical); }
    .tool-status.complete { color: var(--oc-positive); }
    .tool-chevron {
      font-size: 10px;
      color: var(--oc-text-soft);
      transition: transform 150ms;
    }
    .tool-card.expanded .tool-chevron { transform: rotate(90deg); }
    .tool-body {
      display: none;
      padding: 0 10px 10px;
      font-size: 12px;
      border-top: 1px solid var(--oc-tool-border);
    }
    .tool-card.expanded .tool-body { display: block; }
    .tool-input-label,
    .tool-output-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--oc-text-soft);
      margin: 8px 0 4px;
    }
    .tool-input-content,
    .tool-output-content {
      padding: 6px 8px;
      border-radius: 6px;
      background: rgba(0,0,0,0.2);
      font-family: var(--vscode-editor-font-family, Consolas, monospace);
      font-size: 11px;
      color: var(--oc-text-dim);
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 200px;
      overflow-y: auto;
    }
    .tool-output-content.error { color: var(--oc-critical); }
    .tool-path {
      font-weight: 400;
      color: var(--oc-text-soft);
      font-size: 11px;
      margin-left: 4px;
    }
    .file-link {
      color: var(--oc-accent-bright);
      cursor: pointer;
      text-decoration: none;
      border-bottom: 1px dotted var(--oc-accent);
      transition: color 120ms, border-color 120ms;
    }
    .file-link:hover {
      color: var(--oc-focus);
      border-bottom-color: var(--oc-focus);
    }
    .tool-input-content.tool-diff-old {
      border-left: 3px solid var(--oc-critical);
      padding-left: 10px;
      color: #ff9e8a;
      text-decoration: line-through;
      opacity: 0.7;
    }
    .tool-input-content.tool-diff-new {
      border-left: 3px solid var(--oc-positive);
      padding-left: 10px;
      color: #c8e6a0;
    }
    .tool-diff-btn {
      margin-top: 6px;
      border: 1px solid var(--oc-accent);
      border-radius: 6px;
      background: rgba(240,148,100,0.08);
      color: var(--oc-accent-bright);
      padding: 4px 10px;
      font-size: 11px;
      cursor: pointer;
    }
    .tool-diff-btn:hover { background: rgba(240,148,100,0.16); }

    /* ── Permission card ── */
    .perm-card {
      margin: 8px 0;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--oc-perm-border);
      background: var(--oc-perm-bg);
    }
    .perm-title { font-weight: 700; font-size: 12px; color: var(--oc-critical); margin-bottom: 6px; }
    .perm-desc { font-size: 12px; color: var(--oc-text-dim); margin-bottom: 8px; }
    .perm-input {
      padding: 6px 8px;
      margin-bottom: 8px;
      border-radius: 6px;
      background: rgba(0,0,0,0.2);
      font-family: var(--vscode-editor-font-family, Consolas, monospace);
      font-size: 11px;
      color: var(--oc-text-dim);
      white-space: pre-wrap;
      max-height: 120px;
      overflow-y: auto;
    }
    .perm-actions { display: flex; gap: 6px; }
    .perm-btn {
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid;
    }
    .perm-btn.allow {
      background: rgba(232,184,107,0.14);
      border-color: var(--oc-positive);
      color: var(--oc-positive);
    }
    .perm-btn.deny {
      background: rgba(255,138,108,0.1);
      border-color: var(--oc-critical);
      color: var(--oc-critical);
    }
    .perm-btn.allow-session {
      background: rgba(232,184,107,0.08);
      border-color: rgba(232,184,107,0.4);
      color: var(--oc-text-dim);
    }
    .perm-btn:hover { filter: brightness(1.15); }

    /* ── Status pill ── */
    .msg-status {
      align-self: center;
      font-size: 11px;
      color: var(--oc-text-soft);
      padding: 4px 12px;
      border-radius: 999px;
      border: 1px solid var(--oc-border-soft);
      background: rgba(255,255,255,0.02);
    }

    /* ── Rate limit ── */
    .msg-rate-limit {
      align-self: center;
      font-size: 11px;
      color: var(--oc-warning);
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid rgba(243,201,105,0.3);
      background: rgba(243,201,105,0.06);
    }

    /* ── Thinking block ── */
    .thinking-block {
      display: none;
      align-self: flex-start;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid rgba(200,160,255,0.25);
      background: rgba(160,120,220,0.08);
      margin: 4px 0;
      gap: 6px;
      flex-direction: column;
    }
    .thinking-block.visible { display: flex; }
    .thinking-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #c4a0ff;
      font-weight: 600;
    }
    .thinking-spinner {
      width: 12px; height: 12px;
      border: 2px solid rgba(200,160,255,0.3);
      border-top-color: #c4a0ff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .thinking-meta {
      font-size: 11px;
      color: var(--oc-text-soft);
    }

    /* ── Typing indicator ── */
    .typing-indicator {
      display: none;
      align-self: flex-start;
      padding: 10px 14px;
      gap: 4px;
    }
    .typing-indicator.visible { display: flex; }
    .typing-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--oc-accent);
      animation: typingBounce 1.2s infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    /* ── Input area ── */
    .input-area {
      display: flex;
      gap: 8px;
      padding: 10px 12px;
      border-top: 1px solid var(--oc-border-soft);
      background: var(--oc-panel);
      flex-shrink: 0;
      align-items: flex-end;
    }
    .input-area textarea {
      flex: 1;
      min-height: 36px;
      max-height: 160px;
      padding: 8px 12px;
      border: 1px solid var(--oc-border-soft);
      border-radius: 10px;
      background: rgba(255,255,255,0.04);
      color: var(--oc-text);
      font-family: inherit;
      font-size: 13px;
      resize: none;
      outline: none;
      line-height: 1.4;
    }
    .input-area textarea::placeholder { color: var(--oc-text-soft); }
    .input-area textarea:focus { border-color: var(--oc-accent); }
    .send-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid var(--zc-accent);
      background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.12));
      color: var(--zc-accent-bright);
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .send-btn:hover { background: rgba(139,92,246,0.25); }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── Tips rotativas ── */
    .tips-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      font-size: 11px;
      color: var(--zc-text-soft);
      background: rgba(139,92,246,0.04);
      border-top: 1px solid var(--zc-border-soft);
    }
    .tips-bar .tip-label {
      color: var(--zc-cyan);
      font-weight: 600;
    }
    .tips-bar .tip-cmd {
      color: var(--zc-accent-bright);
      font-family: var(--vscode-editor-font-family, Consolas, monospace);
    }
    .tips-bar .tip-desc {
      color: var(--zc-text-dim);
    }

    /* ── Footer com modelo/tokens/mode ── */
    .footer-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      font-size: 11px;
      color: var(--zc-text-soft);
      background: var(--zc-panel);
      border-top: 1px solid var(--zc-border-soft);
      flex-shrink: 0;
    }
    .footer-settings-btn {
      border: none;
      background: transparent;
      color: var(--zc-text-dim);
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 4px;
      font-size: 13px;
    }
    .footer-settings-btn:hover { background: rgba(255,255,255,0.06); color: var(--zc-text); }
    .footer-mode-select {
      padding: 4px 8px;
      border: 1px solid var(--zc-border-soft);
      border-radius: 6px;
      background: rgba(255,255,255,0.04);
      color: var(--zc-text-dim);
      font-size: 11px;
      cursor: pointer;
      outline: none;
    }
    .footer-mode-select:hover { border-color: var(--zc-accent); }
    .footer-model-info {
      flex: 1;
      text-align: right;
      color: var(--zc-text-soft);
      font-family: var(--vscode-editor-font-family, Consolas, monospace);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .footer-model-info .model-name { color: var(--zc-cyan); }
    .footer-model-info .token-usage { color: var(--zc-text-dim); }

    /* ── Attachments area ── */
    .attachments-area {
      display: none;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px 12px;
      border-top: 1px solid var(--zc-border-soft);
      background: var(--zc-panel-soft);
    }
    .attachments-area.visible { display: flex; }
    .attachment-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(34,211,238,0.1);
      border: 1px solid rgba(34,211,238,0.2);
      font-size: 11px;
      color: var(--zc-text-dim);
    }
    .attachment-badge .att-icon { font-size: 12px; }
    .attachment-badge .att-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .attachment-badge .att-remove {
      border: none;
      background: transparent;
      color: var(--zc-text-soft);
      cursor: pointer;
      padding: 0 2px;
      font-size: 12px;
    }
    .attachment-badge .att-remove:hover { color: var(--zc-critical); }
    .attachment-preview {
      position: relative;
      max-width: 120px;
      max-height: 80px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--zc-border-soft);
      cursor: pointer;
    }
    .attachment-preview img { width: 100%; height: 100%; object-fit: cover; }
    .attachment-preview .att-remove {
      position: absolute;
      top: 2px;
      right: 2px;
      background: rgba(0,0,0,0.6);
      border: none;
      color: #fff;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 10px;
    }

    /* ── Settings Modal ── */
    .settings-modal {
      display: none;
      position: absolute;
      inset: 0;
      z-index: 200;
      background: rgba(5,5,10,0.95);
      flex-direction: column;
    }
    .settings-modal.visible { display: flex; }
    .settings-modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--zc-border-soft);
    }
    .settings-modal-header h2 { font-size: 15px; font-weight: 700; flex: 1; color: var(--zc-text); }
    .settings-modal-close {
      border: none;
      background: transparent;
      color: var(--zc-text-dim);
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
    }
    .settings-modal-close:hover { color: var(--zc-text); }
    .settings-tabs {
      display: flex;
      gap: 0;
      padding: 0 16px;
      border-bottom: 1px solid var(--zc-border-soft);
    }
    .settings-tab {
      padding: 10px 16px;
      border: none;
      background: transparent;
      color: var(--zc-text-soft);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }
    .settings-tab:hover { color: var(--zc-text-dim); }
    .settings-tab.active { color: var(--zc-accent-bright); border-bottom-color: var(--zc-accent); }
    .settings-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    .settings-section { margin-bottom: 20px; }
    .settings-section h3 { font-size: 12px; font-weight: 700; color: var(--zc-text-dim); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
    .settings-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-radius: 8px;
      background: rgba(255,255,255,0.02);
      margin-bottom: 6px;
    }
    .settings-item:hover { background: rgba(255,255,255,0.04); }
    .settings-item-label { font-size: 13px; color: var(--zc-text); }
    .settings-item-desc { font-size: 11px; color: var(--zc-text-soft); margin-top: 2px; }
    .settings-toggle {
      position: relative;
      width: 36px;
      height: 20px;
      border-radius: 10px;
      background: var(--zc-panel-strong);
      border: 1px solid var(--zc-border-soft);
      cursor: pointer;
      transition: background 150ms;
    }
    .settings-toggle.on { background: var(--zc-accent); border-color: var(--zc-accent); }
    .settings-toggle::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--zc-text);
      transition: transform 150ms;
    }
    .settings-toggle.on::after { transform: translateX(16px); }
    .settings-select {
      padding: 6px 10px;
      border: 1px solid var(--zc-border-soft);
      border-radius: 6px;
      background: var(--zc-panel-strong);
      color: var(--zc-text-dim);
      font-size: 12px;
      outline: none;
    }
    .settings-select:hover { border-color: var(--zc-accent); }
    
    /* Shortcuts list */
    .shortcuts-list { display: grid; gap: 6px; }
    .shortcut-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(255,255,255,0.02);
    }
    .shortcut-item:hover { background: rgba(139,92,246,0.06); }
    .shortcut-cmd {
      font-family: var(--vscode-editor-font-family, Consolas, monospace);
      font-size: 12px;
      color: var(--zc-cyan);
      min-width: 100px;
    }
    .shortcut-desc { font-size: 12px; color: var(--zc-text-dim); }

    /* Image preview modal */
    .image-preview-modal {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 300;
      background: rgba(0,0,0,0.9);
      align-items: center;
      justify-content: center;
    }
    .image-preview-modal.visible { display: flex; }
    .image-preview-modal img { max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; }
    .image-preview-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
    }

    /* ── Session list overlay ── */
    .session-overlay {
      display: none;
      position: absolute;
      inset: 0;
      z-index: 100;
      background: rgba(5,5,5,0.92);
      flex-direction: column;
    }
    .session-overlay.visible { display: flex; }
    .session-overlay-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--oc-border-soft);
    }
    .session-overlay-header h2 { font-size: 14px; font-weight: 700; flex: 1; }
    .session-search {
      margin: 8px 12px;
      padding: 8px 10px;
      border: 1px solid var(--oc-border-soft);
      border-radius: 8px;
      background: rgba(255,255,255,0.04);
      color: var(--oc-text);
      font-size: 13px;
      outline: none;
    }
    .session-search:focus { border-color: var(--oc-accent); }
    .session-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 12px;
    }
    .session-group-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--oc-text-soft);
      padding: 8px 0 4px;
    }
    .session-item {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      margin-bottom: 4px;
    }
    .session-item:hover { background: rgba(255,255,255,0.04); border-color: var(--oc-border-soft); }
    .session-item-title { font-weight: 600; font-size: 13px; color: var(--oc-text); margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .session-item-preview { font-size: 11px; color: var(--oc-text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .session-item-time { font-size: 10px; color: var(--oc-text-soft); margin-top: 2px; }
    .session-empty { text-align: center; padding: 32px; color: var(--oc-text-soft); }
  </style>
</head>
<body>
  <div class="chat-header">
    <div class="brand">Zero<span class="brand-accent">Chat</span></div>
    <button class="header-btn" id="settingsBtn" title="Settings">⚙</button>
    <button class="header-btn" id="historyBtn" title="Session history">History</button>
    <button class="header-btn" id="newChatBtn" title="New chat">+ New</button>
    <button class="header-btn danger" id="abortBtn" title="Abort generation">Stop</button>
  </div>
  <div class="status-bar">
    <span class="status-dot" id="statusDot"></span>
    <span class="status-text" id="statusText">Ready</span>
    <span class="status-usage" id="statusUsage"></span>
  </div>

  <div class="messages" id="messages">
    <div class="welcome" id="welcomeScreen">
      <div class="welcome-title">Zero<span class="accent">Chat</span></div>
      <div class="welcome-sub">Ask a question, request a code change, or start a new task.</div>
      <div class="welcome-hint">Press <kbd>${escapeHtml(modKey)}+L</kbd> to focus input</div>
    </div>
  </div>

  <div class="thinking-block" id="thinkingBlock">
    <div class="thinking-header">
      <div class="thinking-spinner"></div>
      <span id="thinkingLabel">Thinking...</span>
    </div>
    <div class="thinking-meta" id="thinkingMeta"></div>
  </div>

  <div class="typing-indicator" id="typingIndicator">
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  </div>

  <!-- Attachments area (for drag&drop files and pasted images) -->
  <div class="attachments-area" id="attachmentsArea"></div>

  <div class="input-area">
    <textarea id="chatInput" placeholder="Message ZeroChat..." rows="1"></textarea>
    <button class="send-btn" id="sendBtn" title="Send message">&#x27A4;</button>
  </div>

  <!-- Tips bar -->
  <div class="tips-bar" id="tipsBar">
    <span class="tip-label">Tip:</span>
    <span class="tip-cmd" id="tipCmd">/help</span>
    <span class="tip-desc" id="tipDesc">— Ver todos os comandos disponíveis</span>
  </div>

  <!-- Footer with mode, model, tokens -->
  <div class="footer-bar">
    <button class="footer-settings-btn" id="footerSettingsBtn" title="Settings">⚙</button>
    <select class="footer-mode-select" id="modeSelect" title="Permission mode">
      <option value="default">Normal</option>
      <option value="acceptEdits" selected>Accepts Edit on</option>
      <option value="bypassPermissions">Autopilot</option>
      <option value="plan">Plan</option>
    </select>
    <div class="footer-model-info" id="footerModelInfo">
      <span class="model-name">—</span> · <span class="token-usage">0/0 tokens</span>
    </div>
  </div>

  <!-- Settings Modal -->
  <div class="settings-modal" id="settingsModal">
    <div class="settings-modal-header">
      <h2>⚙ Configurações</h2>
      <button class="settings-modal-close" id="settingsModalClose">✕</button>
    </div>
    <div class="settings-tabs">
      <button class="settings-tab active" data-tab="shortcuts">Atalhos</button>
      <button class="settings-tab" data-tab="config">Config</button>
      <button class="settings-tab" data-tab="providers">Providers</button>
    </div>
    <div class="settings-content" id="settingsContent">
      <!-- Content loaded dynamically -->
    </div>
  </div>

  <!-- Image preview modal -->
  <div class="image-preview-modal" id="imagePreviewModal">
    <button class="image-preview-close" id="imagePreviewClose">✕</button>
    <img id="imagePreviewImg" src="" alt="Preview" />
  </div>

  <!-- Session list overlay -->
  <div class="session-overlay" id="sessionOverlay">
    <div class="session-overlay-header">
      <h2>Session History</h2>
      <button class="header-btn" id="closeSessionsBtn">Close</button>
    </div>
    <input class="session-search" id="sessionSearch" type="text" placeholder="Search sessions..." />
    <div class="session-list" id="sessionList">
      <div class="session-empty">No sessions found</div>
    </div>
  </div>

<script nonce="${nonce}">
(function() {
  const vscode = acquireVsCodeApi();

  const messagesEl = document.getElementById('messages');
  const welcomeEl = document.getElementById('welcomeScreen');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const abortBtn = document.getElementById('abortBtn');
  const newChatBtn = document.getElementById('newChatBtn');
  const historyBtn = document.getElementById('historyBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const statusUsage = document.getElementById('statusUsage');
  const typingIndicator = document.getElementById('typingIndicator');
  const sessionOverlay = document.getElementById('sessionOverlay');
  const closeSessionsBtn = document.getElementById('closeSessionsBtn');
  const sessionSearch = document.getElementById('sessionSearch');
  const sessionList = document.getElementById('sessionList');
  
  // New elements
  const attachmentsArea = document.getElementById('attachmentsArea');
  const tipsBar = document.getElementById('tipsBar');
  const tipCmd = document.getElementById('tipCmd');
  const tipDesc = document.getElementById('tipDesc');
  const modeSelect = document.getElementById('modeSelect');
  const footerModelInfo = document.getElementById('footerModelInfo');
  const footerSettingsBtn = document.getElementById('footerSettingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const settingsModalClose = document.getElementById('settingsModalClose');
  const settingsContent = document.getElementById('settingsContent');
  const imagePreviewModal = document.getElementById('imagePreviewModal');
  const imagePreviewClose = document.getElementById('imagePreviewClose');
  const imagePreviewImg = document.getElementById('imagePreviewImg');

  let isStreaming = false;
  let currentAssistantEl = null;
  let currentTextEl = null;
  const toolResultMap = {};
  
  // Attachments state
  const attachments = [];
  
  // Tips rotation
  const TIPS = [
    { cmd: '/help', desc: 'Ver todos os comandos disponíveis' },
    { cmd: '/context', desc: 'Adicionar arquivos ao contexto' },
    { cmd: '/compact', desc: 'Compactar histórico da conversa' },
    { cmd: '/debug', desc: 'Ver informações de debug' },
    { cmd: '/config', desc: 'Abrir configurações' },
    { cmd: '/clear', desc: 'Limpar conversa atual' },
    { cmd: '/copy', desc: 'Copiar última resposta' },
    { cmd: '/model', desc: 'Trocar modelo de IA' },
    { cmd: '/provider', desc: 'Configurar provedor' },
    { cmd: '/resume', desc: 'Resumir sessão anterior' },
    { cmd: '/plan', desc: 'Entrar no modo planejamento' },
    { cmd: '/permissions', desc: 'Gerenciar permissões' },
    { cmd: '/memory', desc: 'Memória contextual' },
    { cmd: '/diff', desc: 'Ver diferenças de arquivos' },
    { cmd: '/rewind', desc: 'Voltar para checkpoint anterior' },
    { cmd: '/tasks', desc: 'Gerenciar tarefas' },
    { cmd: '/cost', desc: 'Ver custos da sessão' },
    { cmd: '/status', desc: 'Ver status do sistema' },
  ];
  let tipIndex = 0;
  
  function rotateTip() {
    tipIndex = (tipIndex + 1) % TIPS.length;
    const tip = TIPS[tipIndex];
    tipCmd.textContent = tip.cmd;
    tipDesc.textContent = '— ' + tip.desc;
  }
  setInterval(rotateTip, 8000);

  // Settings modal tabs content
  const SHORTCUTS_CONTENT = \`
    <div class="shortcuts-list">
      <div class="shortcut-item"><span class="shortcut-cmd">/help</span><span class="shortcut-desc">Ver todos os comandos disponíveis</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/context</span><span class="shortcut-desc">Adicionar arquivos ao contexto da conversa</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/compact</span><span class="shortcut-desc">Compactar histórico para economizar tokens</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/debug</span><span class="shortcut-desc">Mostrar informações de debug</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/config</span><span class="shortcut-desc">Abrir configurações do Zero CLI</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/clear</span><span class="shortcut-desc">Limpar conversa atual</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/copy</span><span class="shortcut-desc">Copiar última resposta para clipboard</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/model</span><span class="shortcut-desc">Trocar modelo de IA</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/provider</span><span class="shortcut-desc">Configurar provedor de API</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/resume</span><span class="shortcut-desc">Resumir sessão anterior</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/plan</span><span class="shortcut-desc">Entrar no modo planejamento (read-only)</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/permissions</span><span class="shortcut-desc">Gerenciar permissões de ferramentas</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/memory</span><span class="shortcut-desc">Gerenciar memória contextual</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/diff</span><span class="shortcut-desc">Ver diferenças de arquivos</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/rewind</span><span class="shortcut-desc">Voltar para checkpoint anterior</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/tasks</span><span class="shortcut-desc">Gerenciar lista de tarefas</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/cost</span><span class="shortcut-desc">Ver custos da sessão atual</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/status</span><span class="shortcut-desc">Ver status do sistema</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/files</span><span class="shortcut-desc">Listar arquivos no contexto</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/theme</span><span class="shortcut-desc">Trocar tema do terminal</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/doctor</span><span class="shortcut-desc">Diagnosticar problemas</span></div>
      <div class="shortcut-item"><span class="shortcut-cmd">/exit</span><span class="shortcut-desc">Sair do Zero CLI</span></div>
    </div>
  \`;

  const CONFIG_CONTENT = \`
    <div class="settings-section">
      <h3>Geral</h3>
      <div class="settings-item">
        <div><div class="settings-item-label">Auto-compact</div><div class="settings-item-desc">Compactar automaticamente histórico longo</div></div>
        <button class="settings-toggle on" data-setting="autoCompact"></button>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Tool history compression</div><div class="settings-item-desc">Comprimir resultados de ferramentas</div></div>
        <button class="settings-toggle on" data-setting="toolCompression"></button>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Show tips</div><div class="settings-item-desc">Exibir dicas rotativas</div></div>
        <button class="settings-toggle on" data-setting="showTips"></button>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Reduce motion</div><div class="settings-item-desc">Reduzir animações</div></div>
        <button class="settings-toggle" data-setting="reduceMotion"></button>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Thinking mode</div><div class="settings-item-desc">Mostrar processo de pensamento</div></div>
        <button class="settings-toggle on" data-setting="thinkingMode"></button>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Rewind code (checkpoints)</div><div class="settings-item-desc">Habilitar pontos de restauração</div></div>
        <button class="settings-toggle on" data-setting="checkpoints"></button>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Verbose output</div><div class="settings-item-desc">Saída detalhada</div></div>
        <button class="settings-toggle" data-setting="verbose"></button>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Show turn duration</div><div class="settings-item-desc">Mostrar tempo de cada turno</div></div>
        <button class="settings-toggle on" data-setting="turnDuration"></button>
      </div>
    </div>
    <div class="settings-section">
      <h3>Aparência</h3>
      <div class="settings-item">
        <div><div class="settings-item-label">Theme</div></div>
        <select class="settings-select" data-setting="theme">
          <option value="dark" selected>Dark mode</option>
          <option value="light">Light mode</option>
          <option value="system">System</option>
        </select>
      </div>
      <div class="settings-item">
        <div><div class="settings-item-label">Language</div></div>
        <select class="settings-select" data-setting="language">
          <option value="pt-BR" selected>Português (BR)</option>
          <option value="en-US">English (US)</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>
  \`;

  const PROVIDERS_CONTENT = \`
    <div class="settings-section">
      <h3>Provedores Configurados</h3>
      <div class="settings-item">
        <div>
          <div class="settings-item-label">Anthropic (Claude)</div>
          <div class="settings-item-desc">claude-3-5-sonnet, claude-3-opus, etc.</div>
        </div>
        <span style="color: var(--zc-positive);">● Conectado</span>
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-item-label">OpenAI</div>
          <div class="settings-item-desc">gpt-4o, gpt-4-turbo, etc.</div>
        </div>
        <span style="color: var(--zc-text-soft);">○ Não configurado</span>
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-item-label">Ollama (Local)</div>
          <div class="settings-item-desc">llama3, qwen, mistral, etc.</div>
        </div>
        <span style="color: var(--zc-text-soft);">○ Não configurado</span>
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-item-label">OpenRouter</div>
          <div class="settings-item-desc">Acesso a múltiplos modelos</div>
        </div>
        <span style="color: var(--zc-text-soft);">○ Não configurado</span>
      </div>
    </div>
    <div class="settings-section">
      <h3>Configurar Provider</h3>
      <p style="color: var(--zc-text-soft); font-size: 12px;">
        Use o comando <code style="color: var(--zc-cyan);">/provider</code> no chat para configurar novos provedores.
      </p>
    </div>
  \`;

  // Settings modal
  function openSettings(tab = 'shortcuts') {
    settingsModal.classList.add('visible');
    setSettingsTab(tab);
  }
  function closeSettings() {
    settingsModal.classList.remove('visible');
  }
  function setSettingsTab(tab) {
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(\`.settings-tab[data-tab="\${tab}"]\`).classList.add('active');
    if (tab === 'shortcuts') settingsContent.innerHTML = SHORTCUTS_CONTENT;
    else if (tab === 'config') settingsContent.innerHTML = CONFIG_CONTENT;
    else if (tab === 'providers') settingsContent.innerHTML = PROVIDERS_CONTENT;
    // Add toggle event listeners
    settingsContent.querySelectorAll('.settings-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('on');
        const setting = btn.dataset.setting;
        vscode.postMessage({ type: 'setting_changed', setting, value: btn.classList.contains('on') });
      });
    });
  }
  settingsBtn.addEventListener('click', () => openSettings());
  footerSettingsBtn.addEventListener('click', () => openSettings());
  settingsModalClose.addEventListener('click', closeSettings);
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => setSettingsTab(tab.dataset.tab));
  });

  // Mode select
  modeSelect.addEventListener('change', () => {
    vscode.postMessage({ type: 'mode_changed', mode: modeSelect.value });
  });

  // Image preview modal
  function openImagePreview(src) {
    imagePreviewImg.src = src;
    imagePreviewModal.classList.add('visible');
  }
  function closeImagePreview() {
    imagePreviewModal.classList.remove('visible');
    imagePreviewImg.src = '';
  }
  imagePreviewClose.addEventListener('click', closeImagePreview);
  imagePreviewModal.addEventListener('click', (e) => {
    if (e.target === imagePreviewModal) closeImagePreview();
  });

  // Attachments management
  function addAttachment(file) {
    const id = 'att-' + Math.random().toString(36).slice(2, 8);
    const isImage = file.type && file.type.startsWith('image/');
    attachments.push({ id, file, isImage });
    renderAttachments();
    return id;
  }
  function removeAttachment(id) {
    const idx = attachments.findIndex(a => a.id === id);
    if (idx >= 0) attachments.splice(idx, 1);
    renderAttachments();
  }
  function renderAttachments() {
    if (attachments.length === 0) {
      attachmentsArea.classList.remove('visible');
      attachmentsArea.innerHTML = '';
      return;
    }
    attachmentsArea.classList.add('visible');
    attachmentsArea.innerHTML = attachments.map(att => {
      if (att.isImage && att.dataUrl) {
        return \`<div class="attachment-preview" data-id="\${att.id}">
          <img src="\${att.dataUrl}" alt="Preview" />
          <button class="att-remove" data-id="\${att.id}">✕</button>
        </div>\`;
      }
      return \`<div class="attachment-badge" data-id="\${att.id}">
        <span class="att-icon">📎</span>
        <span class="att-name">\${escapeForMd(att.file.name || att.file.path || 'file')}</span>
        <button class="att-remove" data-id="\${att.id}">✕</button>
      </div>\`;
    }).join('');
    // Event listeners
    attachmentsArea.querySelectorAll('.att-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeAttachment(btn.dataset.id);
      });
    });
    attachmentsArea.querySelectorAll('.attachment-preview').forEach(el => {
      el.addEventListener('click', () => {
        const att = attachments.find(a => a.id === el.dataset.id);
        if (att && att.dataUrl) openImagePreview(att.dataUrl);
      });
    });
  }

  // Drag and drop
  inputEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    inputEl.style.borderColor = 'var(--zc-cyan)';
  });
  inputEl.addEventListener('dragleave', () => {
    inputEl.style.borderColor = '';
  });
  inputEl.addEventListener('drop', (e) => {
    e.preventDefault();
    inputEl.style.borderColor = '';
    const files = Array.from(e.dataTransfer.files);
    const uris = e.dataTransfer.getData('text/uri-list');
    if (uris) {
      uris.split('\\n').filter(u => u).forEach(uri => {
        const path = uri.replace('file://', '');
        addAttachment({ name: path.split('/').pop(), path });
        vscode.postMessage({ type: 'attach_file', path });
      });
    }
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const id = addAttachment(file);
          const att = attachments.find(a => a.id === id);
          if (att) att.dataUrl = reader.result;
          renderAttachments();
        };
        reader.readAsDataURL(file);
      } else {
        addAttachment(file);
      }
    });
  });

  // Paste image (Ctrl+V)
  inputEl.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const id = addAttachment(file);
            const att = attachments.find(a => a.id === id);
            if (att) att.dataUrl = reader.result;
            renderAttachments();
          };
          reader.readAsDataURL(file);
        }
      }
    }
  });

  // Update footer model info
  function updateModelInfo(model, inputTokens, maxTokens) {
    const modelSpan = footerModelInfo.querySelector('.model-name');
    const tokenSpan = footerModelInfo.querySelector('.token-usage');
    modelSpan.textContent = model || '—';
    if (inputTokens !== undefined && maxTokens) {
      const pct = Math.round((inputTokens / maxTokens) * 100);
      tokenSpan.textContent = \`\${inputTokens.toLocaleString()}/\${(maxTokens/1000).toFixed(0)}k tokens (\${pct}%)\`;
    }
  }

  /* ── Markdown renderer ── */
  function renderMarkdown(text) {
    if (!text) return '';
    let html = escapeForMd(text);

    // fenced code blocks
    html = html.replace(/\`\`\`(\\w*?)\\n([\\s\\S]*?)\`\`\`/g, (_, lang, code) => {
      const langLabel = lang || 'text';
      const highlighted = highlightCode(code, langLabel);
      const id = 'cb-' + Math.random().toString(36).slice(2, 8);
      return '<div class="code-wrapper"><div class="code-header">' +
        '<span>' + langLabel + '</span>' +
        '<button class="code-copy-btn" data-copy-id="' + id + '">Copy</button></div>' +
        '<code class="code-block" id="' + id + '">' + highlighted + '</code></div>';
    });

    // inline code
    html = html.replace(/\`([^\`]+?)\`/g, '<code>$1</code>');

    // headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // hr
    html = html.replace(/^---$/gm, '<hr/>');

    // bold / italic
    html = html.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
    html = html.replace(/\\*(.+?)\\*/g, '<em>$1</em>');

    // links
    html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" title="$2">$1</a>');

    // unordered lists (simple)
    html = html.replace(/^[\\-\\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\\/li>\\n?)+)/g, '<ul>$1</ul>');

    // ordered lists
    html = html.replace(/^\\d+\\. (.+)$/gm, '<li>$1</li>');

    // paragraphs (double newline)
    html = html.replace(/\\n\\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\\/p>/g, '');
    html = html.replace(/<p>(<h[123]>)/g, '$1');
    html = html.replace(/(<\\/h[123]>)<\\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\\/ul>)<\\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\\/blockquote>)<\\/p>/g, '$1');
    html = html.replace(/<p>(<hr\\/>)/g, '$1');
    html = html.replace(/(<hr\\/>)<\\/p>/g, '$1');
    html = html.replace(/<p>(<div class="code-wrapper">)/g, '$1');
    html = html.replace(/(<\\/div>)<\\/p>/g, '$1');

    return html;
  }

  function escapeForMd(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightCode(code, lang) {
    let result = code;
    const kwPattern = /\\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|typeof|instanceof|switch|case|break|default|continue|do|in|of|yield|void|delete|true|false|null|undefined|this|super|extends|implements|interface|type|enum|public|private|protected|static|readonly|abstract|def|print|self|elif|except|finally|with|as|lambda|pass|raise|None|True|False)\\b/g;
    const strPattern = /(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|'[^']*?'|"[^"]*?")/g;
    const commentPattern = /(\\/{2}.*$|#.*$)/gm;
    const numPattern = /\\b(\\d+\\.?\\d*)\\b/g;

    result = result.replace(commentPattern, '<span class="hl-comment">$1</span>');
    result = result.replace(strPattern, '<span class="hl-string">$1</span>');
    result = result.replace(kwPattern, '<span class="hl-keyword">$1</span>');
    result = result.replace(numPattern, '<span class="hl-number">$1</span>');

    return result;
  }

  /* ── DOM helpers ── */
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  function hideWelcome() {
    if (welcomeEl) welcomeEl.style.display = 'none';
  }

  function showWelcome() {
    if (welcomeEl) welcomeEl.style.display = 'flex';
  }

  function setStreaming(val, label) {
    isStreaming = val;
    abortBtn.style.display = val ? 'block' : 'none';
    sendBtn.disabled = val;
    typingIndicator.classList.toggle('visible', val);
    statusDot.className = 'status-dot ' + (val ? 'streaming' : 'connected');
    statusText.textContent = label || (val ? 'Generating...' : 'Ready');
  }

  function setStatusLabel(label) {
    statusText.textContent = label;
  }

  function appendUserMessage(text) {
    hideWelcome();
    const el = document.createElement('div');
    el.className = 'msg-user';
    el.textContent = text;
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function getOrCreateAssistantEl() {
    if (!currentAssistantEl) {
      hideWelcome();
      currentAssistantEl = document.createElement('div');
      currentAssistantEl.className = 'msg-assistant';
      currentTextEl = document.createElement('div');
      currentTextEl.className = 'md-content';
      currentAssistantEl.appendChild(currentTextEl);
      messagesEl.appendChild(currentAssistantEl);
    }
    return { container: currentAssistantEl, textEl: currentTextEl };
  }

  function finalizeAssistant() {
    // Hide the text div if it's empty (model went straight to tool use)
    if (currentTextEl && !currentTextEl.textContent.trim()) {
      currentTextEl.style.display = 'none';
    }
    // Remove the entire bubble if it has no visible content at all
    if (currentAssistantEl) {
      const hasText = currentTextEl && currentTextEl.textContent.trim();
      const hasToolCards = currentAssistantEl.querySelector('.tool-card');
      if (!hasText && !hasToolCards) {
        currentAssistantEl.remove();
      }
    }
    currentAssistantEl = null;
    currentTextEl = null;
  }

  function appendToolCard(toolUse) {
    const { container } = getOrCreateAssistantEl();
    const card = document.createElement('div');
    card.className = 'tool-card expanded';
    card.dataset.toolId = toolUse.id || '';
    const statusClass = toolUse.status || 'running';
    const statusLabel = statusClass === 'running' ? 'Running...'
      : statusClass === 'error' ? 'Error' : 'Done';

    var inputSummary = '';
    if (toolUse.input && typeof toolUse.input === 'object') {
      if (toolUse.input.file_path || toolUse.input.path) {
        inputSummary = (toolUse.input.file_path || toolUse.input.path);
      }
      if (toolUse.input.command) {
        inputSummary = toolUse.input.command;
      }
    }
    if (!inputSummary) inputSummary = toolUse.inputPreview || '';

    var inputDetail = '';
    if (toolUse.input && typeof toolUse.input === 'object') {
      if (toolUse.input.new_string || toolUse.input.content) {
        var content = toolUse.input.new_string || toolUse.input.content || '';
        if (content.length > 500) content = content.slice(0, 500) + '... (truncated)';
        inputDetail = '<div class="tool-input-label">Changes</div>' +
          '<div class="tool-input-content">' + escapeForMd(content) + '</div>';
      }
      if (toolUse.input.old_string && toolUse.input.new_string) {
        var oldStr = toolUse.input.old_string;
        var newStr = toolUse.input.new_string;
        if (oldStr.length > 300) oldStr = oldStr.slice(0, 300) + '...';
        if (newStr.length > 300) newStr = newStr.slice(0, 300) + '...';
        inputDetail = '<div class="tool-input-label">Replace</div>' +
          '<div class="tool-input-content tool-diff-old">' + escapeForMd(oldStr) + '</div>' +
          '<div class="tool-input-label">With</div>' +
          '<div class="tool-input-content tool-diff-new">' + escapeForMd(newStr) + '</div>';
      }
    }

    var isFileTool = inputSummary && !toolUse.input?.command;
    var fileLink = isFileTool
      ? '<a class="file-link" data-filepath="' + escapeForMd(inputSummary) + '" title="Open in editor">' + escapeForMd(inputSummary.split(/[\\/]/).pop() || inputSummary) + '</a>'
      : (inputSummary ? escapeForMd(inputSummary.split(/[\\/]/).pop() || inputSummary) : '');
    var pathDisplay = isFileTool
      ? '<div class="tool-input-label">Path</div><div class="tool-input-content"><a class="file-link" data-filepath="' + escapeForMd(inputSummary) + '" title="Open in editor">' + escapeForMd(inputSummary) + '</a></div>'
      : (inputSummary ? '<div class="tool-input-label">' + (toolUse.input?.command ? 'Command' : 'Path') + '</div><div class="tool-input-content">' + escapeForMd(inputSummary) + '</div>' : '');

    card.innerHTML =
      '<div class="tool-header">' +
        '<span class="tool-icon">' + (toolUse.icon || '') + '</span>' +
        '<span class="tool-name">' + escapeForMd(toolUse.displayName || toolUse.name || 'Tool') +
          (fileLink ? ' <span class="tool-path">' + fileLink + '</span>' : '') +
        '</span>' +
        '<span class="tool-status ' + statusClass + '">' + statusLabel + '</span>' +
        '<span class="tool-chevron">&#9654;</span>' +
      '</div>' +
      '<div class="tool-body">' +
        pathDisplay +
        inputDetail +
        '<div class="tool-output-label">Output</div>' +
        '<div class="tool-output-content" data-tool-output="' + (toolUse.id || '') + '">Running...</div>' +
      '</div>';
    card.querySelector('.tool-header').addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
    container.appendChild(card);
    scrollToBottom();
    return card;
  }

  function updateToolResult(toolUseId, content, isError) {
    const outputEl = document.querySelector('[data-tool-output="' + toolUseId + '"]');
    if (outputEl) {
      outputEl.textContent = content || '(done)';
      if (isError) outputEl.classList.add('error');
    }
    const card = document.querySelector('[data-tool-id="' + toolUseId + '"]');
    if (card) {
      const statusEl = card.querySelector('.tool-status');
      if (statusEl) {
        statusEl.className = 'tool-status ' + (isError ? 'error' : 'complete');
        statusEl.textContent = isError ? 'Error' : 'Done';
      }
    }
  }

  function updateToolProgress(toolUseId, content) {
    const outputEl = document.querySelector('[data-tool-output="' + toolUseId + '"]');
    if (outputEl && (outputEl.textContent === 'Waiting...' || outputEl.textContent === 'Running...')) {
      outputEl.textContent = content || '';
    }
  }

  function updateToolInput(toolUseId, input, toolName) {
    const card = document.querySelector('[data-tool-id="' + toolUseId + '"]');
    if (!card) return;
    const body = card.querySelector('.tool-body');
    if (!body) return;

    if (!input || typeof input !== 'object') return;

    // Update the header with clickable file path
    const nameEl = card.querySelector('.tool-name');
    if (nameEl && (input.file_path || input.path)) {
      const fp = input.file_path || input.path;
      const shortName = fp.split(/[\\/]/).pop() || fp;
      if (!nameEl.querySelector('.tool-path')) {
        nameEl.insertAdjacentHTML('beforeend', ' <span class="tool-path"><a class="file-link" data-filepath="' + escapeForMd(fp) + '" title="Open in editor">' + escapeForMd(shortName) + '</a></span>');
      }
    }

    // Update path display
    var pathHtml = '';
    if (input.file_path || input.path) {
      var fp = input.file_path || input.path;
      pathHtml = '<div class="tool-input-label">Path</div><div class="tool-input-content">' +
        '<a class="file-link" data-filepath="' + escapeForMd(fp) + '" title="Open in editor">' + escapeForMd(fp) + '</a></div>';
    }
    if (input.command) {
      pathHtml = '<div class="tool-input-label">Command</div><div class="tool-input-content">' +
        escapeForMd(input.command) + '</div>';
    }

    // Build diff display for edit operations
    var diffHtml = '';
    if (input.old_string && input.new_string) {
      var oldStr = input.old_string;
      var newStr = input.new_string;
      if (oldStr.length > 500) oldStr = oldStr.slice(0, 500) + '... (truncated)';
      if (newStr.length > 500) newStr = newStr.slice(0, 500) + '... (truncated)';
      diffHtml = '<div class="tool-input-label">Replace</div>' +
        '<div class="tool-input-content tool-diff-old">' + escapeForMd(oldStr) + '</div>' +
        '<div class="tool-input-label">With</div>' +
        '<div class="tool-input-content tool-diff-new">' + escapeForMd(newStr) + '</div>';
    } else if (input.content || input.new_string) {
      var content = input.content || input.new_string || '';
      if (content.length > 800) content = content.slice(0, 800) + '... (truncated)';
      diffHtml = '<div class="tool-input-label">Content</div>' +
        '<div class="tool-input-content tool-diff-new">' + escapeForMd(content) + '</div>';
    }

    // Keep the output element
    const outputEl = body.querySelector('[data-tool-output]');
    const outputHtml = outputEl ? outputEl.outerHTML : '';
    const outputLabel = '<div class="tool-output-label">Output</div>';

    body.innerHTML = pathHtml + diffHtml + outputLabel + outputHtml;
    card.classList.add('expanded');
    scrollToBottom();
  }

  function appendPermissionCard(perm) {
    hideWelcome();
    const el = document.createElement('div');
    el.className = 'perm-card';
    el.dataset.requestId = perm.requestId || '';
    el.innerHTML =
      '<div class="perm-title">Permission Required: ' + escapeForMd(perm.displayName || perm.toolName || 'Tool') + '</div>' +
      (perm.description ? '<div class="perm-desc">' + escapeForMd(perm.description) + '</div>' : '') +
      (perm.inputPreview ? '<div class="perm-input">' + escapeForMd(perm.inputPreview) + '</div>' : '') +
      '<div class="perm-actions">' +
        '<button class="perm-btn allow" data-action="allow">Allow</button>' +
        '<button class="perm-btn deny" data-action="deny">Deny</button>' +
        '<button class="perm-btn allow-session" data-action="allow-session">Allow for session</button>' +
      '</div>';
    el.querySelectorAll('.perm-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        vscode.postMessage({
          type: 'permission_response',
          requestId: perm.requestId,
          toolUseId: perm.toolUseId || null,
          input: perm.input || {},
          action: action,
        });
        el.remove();
      });
    });
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function appendStatusMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg-status';
    el.textContent = text;
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function appendRateLimitMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg-rate-limit';
    el.textContent = text;
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  /* ── Thinking block ── */
  const thinkingBlock = document.getElementById('thinkingBlock');
  const thinkingLabel = document.getElementById('thinkingLabel');
  const thinkingMeta = document.getElementById('thinkingMeta');

  function showThinkingBlock() {
    thinkingBlock.classList.add('visible');
    thinkingLabel.textContent = 'Thinking...';
    thinkingMeta.textContent = '';
    setStatusLabel('Thinking...');
    scrollToBottom();
  }

  function updateThinkingBlock(tokens, elapsed) {
    const elapsedStr = elapsed >= 60
      ? Math.floor(elapsed / 60) + 'm ' + (elapsed % 60) + 's'
      : elapsed + 's';
    thinkingLabel.textContent = 'Thinking...';
    thinkingMeta.textContent = elapsedStr + ' · ~' + tokens + ' tokens';
    setStatusLabel('Thinking... (' + elapsedStr + ')');
  }

  function hideThinkingBlock() {
    thinkingBlock.classList.remove('visible');
    setStatusLabel('Generating...');
  }

  /* ── Session list ── */
  function renderSessionList(sessions) {
    if (!sessions || sessions.length === 0) {
      sessionList.innerHTML = '<div class="session-empty">No sessions found</div>';
      return;
    }
    const groups = groupByDate(sessions);
    let html = '';
    for (const [label, items] of groups) {
      html += '<div class="session-group-label">' + escapeForMd(label) + '</div>';
      for (const s of items) {
        html += '<div class="session-item" data-session-id="' + (s.id || '') + '">' +
          '<div class="session-item-title">' + escapeForMd(s.title || s.id || 'Untitled') + '</div>' +
          '<div class="session-item-preview">' + escapeForMd(s.preview || '') + '</div>' +
          '<div class="session-item-time">' + escapeForMd(s.timeLabel || '') + '</div>' +
        '</div>';
      }
    }
    sessionList.innerHTML = html;
    sessionList.querySelectorAll('.session-item').forEach(el => {
      el.addEventListener('click', () => {
        vscode.postMessage({ type: 'resume_session', sessionId: el.dataset.sessionId });
        sessionOverlay.classList.remove('visible');
      });
    });
  }

  function groupByDate(sessions) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const weekAgo = today - 604800000;
    const groups = new Map();
    for (const s of sessions) {
      const t = s.timestamp || 0;
      let label;
      if (t >= today) label = 'Today';
      else if (t >= yesterday) label = 'Yesterday';
      else if (t >= weekAgo) label = 'This Week';
      else label = 'Older';
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(s);
    }
    return groups;
  }

  /* ── Input handling ── */
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isStreaming) return;
    appendUserMessage(text);
    vscode.postMessage({ type: 'send_message', text });
    inputEl.value = '';
    autoResizeInput();
    setStreaming(true);
  }

  function autoResizeInput() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + 'px';
  }

  inputEl.addEventListener('input', autoResizeInput);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  sendBtn.addEventListener('click', sendMessage);
  abortBtn.addEventListener('click', () => vscode.postMessage({ type: 'abort' }));
  newChatBtn.addEventListener('click', () => vscode.postMessage({ type: 'new_session' }));
  historyBtn.addEventListener('click', () => {
    sessionOverlay.classList.toggle('visible');
    if (sessionOverlay.classList.contains('visible')) {
      vscode.postMessage({ type: 'request_sessions' });
      sessionSearch.focus();
    }
  });
  closeSessionsBtn.addEventListener('click', () => sessionOverlay.classList.remove('visible'));
  sessionSearch.addEventListener('input', () => {
    const q = sessionSearch.value.toLowerCase();
    sessionList.querySelectorAll('.session-item').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // Copy code handler (event delegation)
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.code-copy-btn');
    if (copyBtn) {
      const id = copyBtn.dataset.copyId;
      const codeEl = document.getElementById(id);
      if (codeEl) {
        const text = codeEl.textContent;
        vscode.postMessage({ type: 'copy_code', text });
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
      }
      return;
    }

    const fileLink = e.target.closest('.file-link');
    if (fileLink) {
      e.preventDefault();
      e.stopPropagation();
      const filepath = fileLink.dataset.filepath;
      if (filepath) {
        vscode.postMessage({ type: 'open_file', path: filepath });
      }
      return;
    }
  });

  /* ── Message handling from extension ── */
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg) return;

    switch (msg.type) {
      case 'stream_start':
        setStreaming(true, 'Generating...');
        getOrCreateAssistantEl();
        break;

      case 'stream_delta': {
        setStatusLabel('Generating...');
        const { textEl } = getOrCreateAssistantEl();
        textEl.innerHTML = renderMarkdown(msg.text || '');
        scrollToBottom();
        break;
      }

      case 'stream_end':
        if (msg.text) {
          const { textEl } = getOrCreateAssistantEl();
          textEl.innerHTML = renderMarkdown(msg.text);
        }
        finalizeAssistant();
        if (msg.usage) {
          const u = msg.usage;
          statusUsage.textContent = (u.input_tokens || 0) + ' in / ' + (u.output_tokens || 0) + ' out';
        }
        if (msg.final) {
          setStreaming(false);
        }
        scrollToBottom();
        break;

      case 'tool_use':
        appendToolCard(msg.toolUse);
        setStatusLabel('Running: ' + (msg.toolUse.displayName || msg.toolUse.name || 'tool') + '...');
        break;

      case 'tool_result':
        updateToolResult(msg.toolUseId, msg.content, msg.isError);
        break;

      case 'tool_input_ready':
        updateToolInput(msg.toolUseId, msg.input, msg.name);
        break;

      case 'tool_progress':
        updateToolProgress(msg.toolUseId, msg.content);
        break;

      case 'permission_request':
        appendPermissionCard(msg);
        break;

      case 'status':
        setStatusLabel(msg.content || 'Working...');
        break;

      case 'rate_limit':
        appendRateLimitMessage(msg.message || 'Rate limited');
        break;

      case 'thinking_start':
        showThinkingBlock();
        break;

      case 'thinking_delta':
        updateThinkingBlock(msg.tokens || 0, msg.elapsed || 0);
        break;

      case 'thinking_end':
        hideThinkingBlock();
        break;

      case 'system_info':
        if (msg.model) {
          statusUsage.textContent = msg.model;
        }
        break;

      case 'model_info':
        updateModelInfo(msg.model, msg.inputTokens, msg.maxTokens);
        break;

      case 'error':
        setStreaming(false);
        finalizeAssistant();
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Error: ' + (msg.message || 'Unknown error');
        break;

      case 'session_list':
        renderSessionList(msg.sessions);
        break;

      case 'session_cleared':
        messagesEl.innerHTML = '';
        if (welcomeEl) {
          messagesEl.appendChild(welcomeEl);
          showWelcome();
        }
        currentAssistantEl = null;
        currentTextEl = null;
        statusUsage.textContent = '';
        statusDot.className = 'status-dot connected';
        statusText.textContent = 'Ready';
        break;

      case 'restore_messages':
        hideWelcome();
        if (msg.messages) {
          for (const m of msg.messages) {
            if (m.role === 'user') {
              appendUserMessage(m.text || '');
            } else if (m.role === 'assistant') {
              const { textEl } = getOrCreateAssistantEl();
              textEl.innerHTML = renderMarkdown(m.text || '');
              if (m.toolUses && m.toolUses.length > 0) {
                for (const tu of m.toolUses) {
                  var displayName = tu.name || 'Tool';
                  var icon = '';
                  var inputPreview = '';
                  if (tu.input && typeof tu.input === 'object') {
                    inputPreview = tu.input.file_path || tu.input.path || tu.input.command || '';
                  }
                  var card = appendToolCard({
                    id: tu.id,
                    name: tu.name,
                    displayName: displayName,
                    icon: icon,
                    inputPreview: inputPreview,
                    input: tu.input,
                    status: tu.status || 'complete',
                  });
                  if (tu.input) {
                    updateToolInput(String(tu.id), tu.input, tu.name);
                  }
                  if (tu.result !== undefined && tu.result !== null) {
                    updateToolResult(String(tu.id), tu.result, tu.isError || false);
                  } else {
                    updateToolResult(String(tu.id), '(done)', false);
                  }
                }
              }
              finalizeAssistant();
            }
          }
        }
        scrollToBottom();
        break;

      case 'connected':
        setStreaming(false);
        statusDot.className = 'status-dot connected';
        statusText.textContent = msg.message || 'Connected';
        break;

      default:
        break;
    }
  });

  // Focus input on Ctrl/Cmd+L
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      inputEl.focus();
    }
  });

  // Restore state
  const prevState = vscode.getState();
  if (prevState && prevState.hasMessages) {
    vscode.postMessage({ type: 'restore_request' });
  }

  // Notify ready
  vscode.postMessage({ type: 'webview_ready' });
})();
</script>
</body>
</html>`;
}

module.exports = { renderChatHtml };
