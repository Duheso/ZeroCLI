// ZeroCLI Browser Extension — Background Service Worker
// Handles native messaging connection with ZeroCLI and routes browser automation tools

const NATIVE_HOST_NAME = 'com.duheso.zerocli_browser_extension';
const VERSION = '1.0.0';

let nativePort = null;
let isConnected = false;
let pendingRequests = new Map(); // requestId -> { resolve, reject, timeoutId }
let requestCounter = 0;
let debuggerAttachedTabs = new Set();
let consoleLogs = new Map(); // tabId -> [messages]
let networkRequests = new Map(); // tabId -> [requests]
let captureStreams = new Map(); // tabId -> MediaRecorder
let gifFrames = new Map(); // requestId -> [frames]

// ─── Debug Stats ──────────────────────────────────────────────────────────────

const debugStats = {
  connectAttempts: 0,
  connectSuccesses: 0,
  disconnects: 0,
  toolsDispatched: 0,
  toolErrors: 0,
  lastError: null,
  lastErrorTime: null,
  lastToolCall: null,
  lastToolCallTime: null,
  workerStartTime: Date.now(),
};

function dbg(msg, ...args) {
  const ts = new Date().toISOString();
  console.log(`[ZeroCLI ${ts}] ${msg}`, ...args);
}

function connectNativeHost() {
  debugStats.connectAttempts++;
  dbg(`Connecting to native host (attempt #${debugStats.connectAttempts})...`);
  try {
    nativePort = chrome.runtime.connectNative(NATIVE_HOST_NAME);
    isConnected = true;
    debugStats.connectSuccesses++;
    updateIcon(true);
    dbg('Native host connected successfully.');

    nativePort.onMessage.addListener((message) => {
      handleNativeMessage(message);
    });

    nativePort.onDisconnect.addListener(() => {
      // Read lastError to mark it as "checked" and suppress DevTools warning
      const err = chrome.runtime.lastError;
      const errMsg = err?.message ?? 'unknown reason';
      const hostNotFound = err && (
        err.message?.includes('not found') ||
        err.message?.includes('Cannot find native messaging host') ||
        err.message?.includes('Specified native messaging host not found')
      );
      debugStats.disconnects++;
      debugStats.lastError = errMsg;
      debugStats.lastErrorTime = Date.now();
      isConnected = false;
      nativePort = null;
      updateIcon(false);
      dbg(`Native host disconnected (total disconnects: ${debugStats.disconnects}): ${errMsg}`);
      // Reject all pending requests
      for (const [id, pending] of pendingRequests) {
        clearTimeout(pending.timeoutId);
        pending.reject(new Error(err?.message ?? 'Native host disconnected'));
      }
      pendingRequests.clear();
      if (hostNotFound) {
        // Native host not installed yet — retry slowly (every 30s)
        // User needs to run: zero --chrome  (to register the native host)
        console.warn('[ZeroCLI] Native messaging host not found. Run "zero --chrome" once to register it, then reload this extension.');
        setTimeout(connectNativeHost, 30000);
      } else {
        // Normal disconnect — reconnect after short delay
        setTimeout(connectNativeHost, 3000);
      }
    });

    // Send initial ping
    sendToNative({ type: 'ping' });
  } catch (err) {
    isConnected = false;
    updateIcon(false);
    debugStats.lastError = err?.message ?? String(err);
    debugStats.lastErrorTime = Date.now();
    console.warn('[ZeroCLI] connectNativeHost error:', err?.message);
    setTimeout(connectNativeHost, 30000);
  }
}

function sendToNative(message) {
  if (nativePort) {
    try {
      nativePort.postMessage(message);
    } catch (err) {
      console.error('[ZeroCLI] Failed to send to native host:', err);
    }
  }
}

async function handleNativeMessage(message) {
  if (!message || !message.type) return;

  switch (message.type) {
    case 'pong':
      dbg('Received pong from native host — connection healthy.');
      break;

    case 'status_response':
      // Native host status
      break;

    case 'tool_request': {
      const { method, params, id: requestId } = message;
      debugStats.toolsDispatched++;
      debugStats.lastToolCall = method;
      debugStats.lastToolCallTime = Date.now();
      dbg(`Tool request #${debugStats.toolsDispatched}: ${method} (id=${requestId})`);
      try {
        const result = await dispatchTool(method, params || {});
        dbg(`Tool success: ${method}`);
        sendToNative({
          type: 'tool_response',
          id: requestId,
          result,
        });
      } catch (err) {
        debugStats.toolErrors++;
        debugStats.lastError = `${method}: ${err.message}`;
        debugStats.lastErrorTime = Date.now();
        console.error(`[ZeroCLI] Tool error: ${method}:`, err.message);
        sendToNative({
          type: 'tool_response',
          id: requestId,
          error: { message: err.message || String(err) },
        });
      }
      break;
    }

    case 'mcp_connected':
      dbg('MCP client connected.');
      updateIcon(true);
      break;

    case 'mcp_disconnected':
      dbg('MCP client disconnected.');
      updateIcon(false);
      break;

    default:
      break;
  }
}

// ─── Tool Dispatcher ────────────────────────────────────────────────────────

async function dispatchTool(method, params) {
  switch (method) {
    case 'tabs_context_mcp':
      return toolTabsContext(params);
    case 'tabs_create_mcp':
      return toolTabsCreate(params);
    case 'navigate':
      return toolNavigate(params);
    case 'computer':
      return toolComputer(params);
    case 'javascript_tool':
      return toolJavascript(params);
    case 'read_page':
      return toolReadPage(params);
    case 'find':
      return toolFind(params);
    case 'form_input':
      return toolFormInput(params);
    case 'get_page_text':
      return toolGetPageText(params);
    case 'read_console_messages':
      return toolReadConsole(params);
    case 'read_network_requests':
      return toolReadNetwork(params);
    case 'gif_creator':
      return toolGifCreator(params);
    case 'resize_window':
      return toolResizeWindow(params);
    case 'upload_image':
      return toolUploadImage(params);
    case 'update_plan':
      return toolUpdatePlan(params);
    case 'shortcuts_list':
      return toolShortcutsList(params);
    case 'shortcuts_execute':
      return toolShortcutsExecute(params);
    case 'debug_info':
      return toolDebugInfo(params);
    default:
      throw new Error(`Unknown tool: ${method}`);
  }
}

// ─── Tool Implementations ───────────────────────────────────────────────────

async function toolTabsContext(_params) {
  const tabs = await chrome.tabs.query({});
  return {
    tabs: tabs.map((tab) => ({
      id: tab.id,
      url: tab.url,
      title: tab.title,
      active: tab.active,
      windowId: tab.windowId,
      index: tab.index,
      status: tab.status,
      favIconUrl: tab.favIconUrl,
    })),
  };
}

async function toolTabsCreate(params) {
  const { url, active = true } = params;
  const tab = await chrome.tabs.create({ url, active });
  // Wait for tab to load
  await waitForTabLoad(tab.id);
  const updatedTab = await chrome.tabs.get(tab.id);
  return {
    tabId: updatedTab.id,
    url: updatedTab.url,
    title: updatedTab.title,
  };
}

async function toolNavigate(params) {
  const { tabId, url } = params;
  await chrome.tabs.update(tabId, { url });
  await waitForTabLoad(tabId);
  const tab = await chrome.tabs.get(tabId);
  return {
    tabId: tab.id,
    url: tab.url,
    title: tab.title,
  };
}

async function toolComputer(params) {
  const { action, tabId, coordinate, ref, text, scroll_direction, scroll_distance, duration } = params;

  switch (action) {
    case 'screenshot': {
      const targetTabId = tabId || (await getActiveTabId());
      const dataUrl = await chrome.tabs.captureVisibleTab(null, {
        format: 'png',
      });
      return {
        image: {
          type: 'base64',
          media_type: 'image/png',
          data: dataUrl.replace(/^data:image\/png;base64,/, ''),
        },
      };
    }

    case 'left_click':
    case 'right_click':
    case 'double_click':
    case 'middle_click': {
      const targetTabId = tabId || (await getActiveTabId());
      const result = await executeInTab(targetTabId, performClick, [
        action,
        coordinate,
        ref,
      ]);
      return result;
    }

    case 'type': {
      const targetTabId = tabId || (await getActiveTabId());
      const result = await executeInTab(targetTabId, typeText, [text]);
      return result;
    }

    case 'key': {
      const targetTabId = tabId || (await getActiveTabId());
      const result = await executeInTab(targetTabId, pressKey, [text]);
      return result;
    }

    case 'scroll': {
      const targetTabId = tabId || (await getActiveTabId());
      const result = await executeInTab(targetTabId, scrollPage, [
        scroll_direction || 'down',
        scroll_distance || 3,
        coordinate,
      ]);
      return result;
    }

    case 'wait': {
      await new Promise((resolve) => setTimeout(resolve, (duration || 1) * 1000));
      return { success: true };
    }

    case 'left_click_drag': {
      const targetTabId = tabId || (await getActiveTabId());
      const { startCoordinate, endCoordinate } = params;
      const result = await executeInTab(targetTabId, performDrag, [
        startCoordinate,
        endCoordinate,
      ]);
      return result;
    }

    default:
      throw new Error(`Unknown computer action: ${action}`);
  }
}

async function toolJavascript(params) {
  const { tabId, code } = params;
  const targetTabId = tabId || (await getActiveTabId());
  const results = await chrome.scripting.executeScript({
    target: { tabId: targetTabId },
    func: (jsCode) => {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(jsCode);
        return { success: true, result: String(result) };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    args: [code],
  });
  return results[0]?.result || { success: false, error: 'No result' };
}

async function toolReadPage(params) {
  const { tabId, format = 'simplified' } = params;
  const targetTabId = tabId || (await getActiveTabId());
  const results = await executeInTab(targetTabId, getPageStructure, [format]);
  return results;
}

async function toolFind(params) {
  const { tabId, query, selector } = params;
  const targetTabId = tabId || (await getActiveTabId());
  const results = await executeInTab(targetTabId, findElements, [query, selector]);
  return results;
}

async function toolFormInput(params) {
  const { tabId, selector, ref, value, type = 'text' } = params;
  const targetTabId = tabId || (await getActiveTabId());
  const result = await executeInTab(targetTabId, fillFormField, [
    selector,
    ref,
    value,
    type,
  ]);
  return result;
}

async function toolGetPageText(params) {
  const { tabId } = params;
  const targetTabId = tabId || (await getActiveTabId());
  const results = await executeInTab(targetTabId, getVisibleText, []);
  return results;
}

async function toolReadConsole(params) {
  const { tabId, limit = 100, pattern } = params;
  const targetTabId = tabId || (await getActiveTabId());

  await ensureDebuggerAttached(targetTabId);

  const logs = consoleLogs.get(targetTabId) || [];
  let filtered = logs;

  if (pattern) {
    const regex = new RegExp(pattern, 'i');
    filtered = logs.filter((log) => regex.test(log.text));
  }

  return {
    messages: filtered.slice(-limit).map((log) => ({
      level: log.level,
      text: log.text,
      timestamp: log.timestamp,
      url: log.url,
      line: log.line,
    })),
  };
}

async function toolReadNetwork(params) {
  const { tabId, limit = 50, urlPattern } = params;
  const targetTabId = tabId || (await getActiveTabId());

  await ensureDebuggerAttached(targetTabId);

  const requests = networkRequests.get(targetTabId) || [];
  let filtered = requests;

  if (urlPattern) {
    const regex = new RegExp(urlPattern, 'i');
    filtered = requests.filter((req) => regex.test(req.url));
  }

  return {
    requests: filtered.slice(-limit).map((req) => ({
      url: req.url,
      method: req.method,
      status: req.status,
      type: req.type,
      timestamp: req.timestamp,
    })),
  };
}

async function toolGifCreator(params) {
  const { tabId, filename = 'recording.gif', duration = 5000 } = params;
  const targetTabId = tabId || (await getActiveTabId());

  // Capture frames via screenshot loop
  const frames = [];
  const interval = 200; // 5fps
  const frameCount = Math.ceil(duration / interval);
  const startTime = Date.now();

  for (let i = 0; i < frameCount; i++) {
    await new Promise((resolve) => setTimeout(resolve, interval));
    try {
      const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
      frames.push(dataUrl.replace(/^data:image\/png;base64,/, ''));
    } catch (e) {
      // Tab may have navigated, continue
    }
  }

  return {
    success: true,
    filename,
    frameCount: frames.length,
    duration: Date.now() - startTime,
    // Return first and last frame as preview
    preview: frames.length > 0 ? {
      type: 'base64',
      media_type: 'image/png',
      data: frames[frames.length - 1],
    } : null,
    message: `Recorded ${frames.length} frames over ${Date.now() - startTime}ms. GIF creation requires local processing; frames captured successfully.`,
  };
}

async function toolResizeWindow(params) {
  const { width, height, windowId } = params;
  const targetWindowId = windowId || chrome.windows.WINDOW_ID_CURRENT;
  await chrome.windows.update(targetWindowId, {
    width: Math.round(width),
    height: Math.round(height),
  });
  return { success: true, width, height };
}

async function toolUploadImage(params) {
  const { tabId, selector, imageData, mediaType = 'image/png' } = params;
  const targetTabId = tabId || (await getActiveTabId());

  const result = await executeInTab(targetTabId, setFileInputValue, [
    selector,
    imageData,
    mediaType,
  ]);
  return result;
}

async function toolUpdatePlan(params) {
  const { plan } = params;
  await chrome.storage.session.set({ currentPlan: plan });
  return { success: true };
}

async function toolShortcutsList(_params) {
  return {
    shortcuts: [
      { key: 'Ctrl+C', description: 'Copy' },
      { key: 'Ctrl+V', description: 'Paste' },
      { key: 'Ctrl+A', description: 'Select All' },
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Y', description: 'Redo' },
      { key: 'Ctrl+F', description: 'Find' },
      { key: 'Ctrl+R', description: 'Reload' },
      { key: 'F5', description: 'Reload' },
      { key: 'Tab', description: 'Next element' },
      { key: 'Enter', description: 'Submit/Confirm' },
      { key: 'Escape', description: 'Cancel/Close' },
    ],
  };
}

async function toolShortcutsExecute(params) {
  const { tabId, key } = params;
  const targetTabId = tabId || (await getActiveTabId());
  const result = await executeInTab(targetTabId, pressKey, [key]);
  return result;
}

async function toolDebugInfo(_params) {
  const uptimeMs = Date.now() - debugStats.workerStartTime;
  const tabs = await chrome.tabs.query({}).catch(() => []);
  return {
    version: VERSION,
    isConnected,
    nativePortAlive: nativePort !== null,
    uptime_ms: uptimeMs,
    uptime_human: `${Math.floor(uptimeMs / 60000)}m ${Math.floor((uptimeMs % 60000) / 1000)}s`,
    stats: {
      connectAttempts: debugStats.connectAttempts,
      connectSuccesses: debugStats.connectSuccesses,
      disconnects: debugStats.disconnects,
      toolsDispatched: debugStats.toolsDispatched,
      toolErrors: debugStats.toolErrors,
    },
    lastError: debugStats.lastError,
    lastErrorAgo: debugStats.lastErrorTime
      ? `${Math.round((Date.now() - debugStats.lastErrorTime) / 1000)}s ago`
      : null,
    lastToolCall: debugStats.lastToolCall,
    lastToolCallAgo: debugStats.lastToolCallTime
      ? `${Math.round((Date.now() - debugStats.lastToolCallTime) / 1000)}s ago`
      : null,
    openTabs: tabs.length,
    debuggerAttachedTabs: debuggerAttachedTabs.size,
  };
}

// ─── Helper Functions ────────────────────────────────────────────────────────

async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs[0]) throw new Error('No active tab');
  return tabs[0].id;
}

async function waitForTabLoad(tabId, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const listener = (changedTabId, changeInfo) => {
      if (changedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, timeoutMs);
  });
}

async function executeInTab(tabId, func, args) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func,
    args,
  });
  return results[0]?.result;
}

async function ensureDebuggerAttached(tabId) {
  if (debuggerAttachedTabs.has(tabId)) return;

  await chrome.debugger.attach({ tabId }, '1.3');
  debuggerAttachedTabs.add(tabId);

  if (!consoleLogs.has(tabId)) consoleLogs.set(tabId, []);
  if (!networkRequests.has(tabId)) networkRequests.set(tabId, []);

  await chrome.debugger.sendCommand({ tabId }, 'Console.enable');
  await chrome.debugger.sendCommand({ tabId }, 'Network.enable');

  chrome.debugger.onEvent.addListener((source, method, params) => {
    if (source.tabId !== tabId) return;

    if (method === 'Console.messageAdded') {
      const msg = params.message;
      const logs = consoleLogs.get(tabId) || [];
      logs.push({
        level: msg.level,
        text: msg.text,
        timestamp: Date.now(),
        url: msg.url,
        line: msg.line,
      });
      if (logs.length > 1000) logs.shift();
      consoleLogs.set(tabId, logs);
    }

    if (method === 'Network.responseReceived') {
      const requests = networkRequests.get(tabId) || [];
      requests.push({
        url: params.response.url,
        method: params.type,
        status: params.response.status,
        type: params.type,
        timestamp: Date.now(),
      });
      if (requests.length > 500) requests.shift();
      networkRequests.set(tabId, requests);
    }
  });

  chrome.tabs.onRemoved.addListener((removedTabId) => {
    if (removedTabId === tabId) {
      debuggerAttachedTabs.delete(tabId);
      consoleLogs.delete(tabId);
      networkRequests.delete(tabId);
    }
  });
}

function updateIcon(connected) {
  const path = connected ? 'icons/icon48.png' : 'icons/icon48.png';
  chrome.action.setIcon({ path }).catch(() => {});
  chrome.action.setBadgeText({ text: connected ? '' : '!' }).catch(() => {});
  chrome.action.setBadgeBackgroundColor({ color: connected ? '#22c55e' : '#ef4444' }).catch(() => {});
}

// ─── Content Script Functions (executed in page context) ──────────────────

function performClick(action, coordinate, ref) {
  let element = null;

  if (ref) {
    element = document.querySelector(`[data-ref="${ref}"]`) ||
              document.evaluate(ref, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  if (!element && coordinate) {
    const [x, y] = coordinate;
    element = document.elementFromPoint(x, y);
  }

  if (!element) {
    return { success: false, error: 'Element not found' };
  }

  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const eventProps = {
    bubbles: true,
    cancelable: true,
    clientX: cx,
    clientY: cy,
    screenX: cx,
    screenY: cy,
  };

  if (action === 'right_click') {
    element.dispatchEvent(new MouseEvent('contextmenu', { ...eventProps, button: 2 }));
  } else if (action === 'double_click') {
    element.dispatchEvent(new MouseEvent('mousedown', eventProps));
    element.dispatchEvent(new MouseEvent('mouseup', eventProps));
    element.dispatchEvent(new MouseEvent('click', eventProps));
    element.dispatchEvent(new MouseEvent('dblclick', eventProps));
  } else if (action === 'middle_click') {
    element.dispatchEvent(new MouseEvent('mousedown', { ...eventProps, button: 1 }));
    element.dispatchEvent(new MouseEvent('mouseup', { ...eventProps, button: 1 }));
    element.dispatchEvent(new MouseEvent('auxclick', { ...eventProps, button: 1 }));
  } else {
    element.dispatchEvent(new MouseEvent('mousedown', eventProps));
    element.dispatchEvent(new MouseEvent('mouseup', eventProps));
    element.dispatchEvent(new MouseEvent('click', eventProps));
    if (element.focus) element.focus();
  }

  return {
    success: true,
    element: element.tagName.toLowerCase(),
    text: element.textContent?.trim().slice(0, 100),
  };
}

function typeText(text) {
  const element = document.activeElement;
  if (!element) return { success: false, error: 'No focused element' };

  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      element.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(element, element.value + text);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } else if (element.isContentEditable) {
    document.execCommand('insertText', false, text);
  } else {
    for (const char of text) {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
    }
  }

  return { success: true };
}

function pressKey(keyString) {
  const keyMap = {
    'Return': 'Enter', 'Escape': 'Escape', 'Tab': 'Tab',
    'BackSpace': 'Backspace', 'Delete': 'Delete', 'Home': 'Home',
    'End': 'End', 'Page_Up': 'PageUp', 'Page_Down': 'PageDown',
    'Up': 'ArrowUp', 'Down': 'ArrowDown', 'Left': 'ArrowLeft', 'Right': 'ArrowRight',
    'F5': 'F5', 'F12': 'F12',
  };

  const parts = keyString.split('+');
  const key = keyMap[parts[parts.length - 1]] || parts[parts.length - 1];
  const ctrlKey = parts.includes('Ctrl') || parts.includes('ctrl');
  const shiftKey = parts.includes('Shift') || parts.includes('shift');
  const altKey = parts.includes('Alt') || parts.includes('alt');
  const metaKey = parts.includes('Meta') || parts.includes('meta');

  const target = document.activeElement || document.body;
  const eventProps = { key, ctrlKey, shiftKey, altKey, metaKey, bubbles: true, cancelable: true };

  target.dispatchEvent(new KeyboardEvent('keydown', eventProps));
  target.dispatchEvent(new KeyboardEvent('keypress', eventProps));
  target.dispatchEvent(new KeyboardEvent('keyup', eventProps));

  return { success: true };
}

function scrollPage(direction, distance, coordinate) {
  let target = document.body;

  if (coordinate) {
    const [x, y] = coordinate;
    const el = document.elementFromPoint(x, y);
    if (el) target = el;
  }

  const scrollAmount = distance * 100;

  switch (direction) {
    case 'up':
      target.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
      break;
    case 'down':
      target.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      break;
    case 'left':
      target.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      break;
    case 'right':
      target.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      break;
  }

  return { success: true, scrolled: direction, distance };
}

function performDrag(startCoordinate, endCoordinate) {
  if (!startCoordinate || !endCoordinate) {
    return { success: false, error: 'Start and end coordinates required' };
  }

  const [sx, sy] = startCoordinate;
  const [ex, ey] = endCoordinate;
  const startEl = document.elementFromPoint(sx, sy);
  const endEl = document.elementFromPoint(ex, ey);

  if (!startEl) return { success: false, error: 'Start element not found' };

  startEl.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: sy, bubbles: true }));
  startEl.dispatchEvent(new MouseEvent('mousemove', { clientX: (sx + ex) / 2, clientY: (sy + ey) / 2, bubbles: true }));

  const dropTarget = endEl || document.body;
  dropTarget.dispatchEvent(new MouseEvent('mousemove', { clientX: ex, clientY: ey, bubbles: true }));
  dropTarget.dispatchEvent(new MouseEvent('mouseup', { clientX: ex, clientY: ey, bubbles: true }));

  return { success: true };
}

function getPageStructure(format) {
  if (format === 'html') {
    return { html: document.documentElement.outerHTML };
  }

  // Simplified: extract semantic structure
  const result = [];

  function processNode(node, depth) {
    if (depth > 8) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) result.push({ type: 'text', content: text.slice(0, 200), depth });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node;
    const tag = el.tagName.toLowerCase();
    const skip = ['script', 'style', 'noscript', 'svg', 'path'];
    if (skip.includes(tag)) return;

    const attrs = {};
    if (el.id) attrs.id = el.id;
    if (el.className) attrs.class = typeof el.className === 'string' ? el.className.split(' ').filter(Boolean).slice(0, 3).join(' ') : '';
    if (el.href) attrs.href = el.href;
    if (el.src) attrs.src = el.src;
    if (el.type) attrs.type = el.type;
    if (el.name) attrs.name = el.name;
    if (el.value) attrs.value = el.value;
    if (el.placeholder) attrs.placeholder = el.placeholder;
    if (el.getAttribute('aria-label')) attrs['aria-label'] = el.getAttribute('aria-label');
    if (el.getAttribute('role')) attrs.role = el.getAttribute('role');

    result.push({ type: 'element', tag, attrs, depth });

    for (const child of el.childNodes) {
      processNode(child, depth + 1);
    }
  }

  processNode(document.body || document.documentElement, 0);
  return { structure: result.slice(0, 500), url: location.href, title: document.title };
}

function findElements(query, selector) {
  const results = [];

  if (selector) {
    const elements = document.querySelectorAll(selector);
    for (const el of Array.from(elements).slice(0, 20)) {
      const rect = el.getBoundingClientRect();
      results.push({
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim().slice(0, 100),
        selector,
        visible: rect.width > 0 && rect.height > 0,
        coords: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      });
    }
  } else if (query) {
    // Text-based search
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    const lowerQuery = query.toLowerCase();
    let node;
    while ((node = walker.nextNode()) && results.length < 20) {
      const el = node;
      const text = el.textContent?.trim() || '';
      const ariaLabel = el.getAttribute('aria-label') || '';
      if (text.toLowerCase().includes(lowerQuery) || ariaLabel.toLowerCase().includes(lowerQuery)) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          results.push({
            tag: el.tagName.toLowerCase(),
            text: text.slice(0, 100),
            ariaLabel,
            coords: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
          });
        }
      }
    }
  }

  return { elements: results, count: results.length };
}

function fillFormField(selector, ref, value, type) {
  let element = null;

  if (selector) {
    element = document.querySelector(selector);
  } else if (ref) {
    element = document.querySelector(`[data-ref="${ref}"]`) ||
              document.getElementById(ref) ||
              document.querySelector(`[name="${ref}"]`) ||
              document.querySelector(`[placeholder="${ref}"]`);
  }

  if (!element) {
    return { success: false, error: `Element not found: ${selector || ref}` };
  }

  if (element.focus) element.focus();

  if (element.tagName === 'SELECT') {
    const option = Array.from(element.options).find(
      (o) => o.value === value || o.text === value
    );
    if (option) {
      element.value = option.value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return { success: true, selected: option.text };
    }
    return { success: false, error: `Option not found: ${value}` };
  }

  if (element.type === 'checkbox' || element.type === 'radio') {
    const checked = value === true || value === 'true' || value === '1';
    element.checked = checked;
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return { success: true, checked };
  }

  const nativeSetter = Object.getOwnPropertyDescriptor(
    element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
    'value'
  )?.set;

  if (nativeSetter) {
    nativeSetter.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));

  return { success: true, value };
}

function getVisibleText() {
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName)) return '';
    return Array.from(node.childNodes).map(walk).join(' ');
  };

  const text = walk(document.body)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50000);

  return { text, url: location.href, title: document.title, length: text.length };
}

function setFileInputValue(selector, imageData, mediaType) {
  const input = document.querySelector(selector);
  if (!input || input.type !== 'file') {
    return { success: false, error: 'File input not found' };
  }

  try {
    const byteString = atob(imageData);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: mediaType });
    const file = new File([blob], 'upload.png', { type: mediaType });
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── Popup Status Query ──────────────────────────────────────────────────────

// Respond to popup (or any extension page) asking for current connection state.
// This avoids the popup spawning a second native host process just to check status.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'get_status') {
    sendResponse({
      isConnected,
      nativePortAlive: nativePort !== null,
      version: VERSION,
      stats: { ...debugStats },
    });
  }
  // Return false: we handled synchronously.
  return false;
});

// ─── Service Worker Keep-Alive (MV3) ─────────────────────────────────────────
//
// Chrome MV3 service workers are killed after ~30s of inactivity. We use the
// alarms API to wake the worker every 20 seconds, keeping the native messaging
// connection alive. Without this, the native host process exits, the Unix socket
// disappears, and all tool calls fail with "Browser extension is not connected".

chrome.alarms.create('zerocli-keepalive', { periodInMinutes: 0.33 }); // ~20 seconds

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'zerocli-keepalive') {
    if (!isConnected) {
      dbg('Keep-alive alarm: not connected, attempting reconnect...');
      connectNativeHost();
    } else {
      // Send a lightweight ping to verify the connection is still healthy
      sendToNative({ type: 'ping' });
    }
  }
});

// ─── Init ────────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  updateIcon(false);
  dbg('Extension installed/updated.');
});

chrome.runtime.onStartup.addListener(() => {
  dbg('Browser startup — connecting native host.');
  connectNativeHost();
});

// Connect when extension loads
dbg('Service worker started.');
connectNativeHost();
