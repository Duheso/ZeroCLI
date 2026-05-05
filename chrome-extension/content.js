// ZeroCLI Browser Extension — Content Script
// This script is injected into all pages. It listens for messages from the background worker.

(function () {
  if (window.__zerocliContentScriptLoaded) return;
  window.__zerocliContentScriptLoaded = true;

  // Content scripts can receive messages from background via chrome.runtime.onMessage
  // All DOM operations are delegated to the background via scripting.executeScript,
  // which runs functions directly in page context.
  // This content script is a lightweight shim for any additional cross-origin needs.

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'ping') {
      sendResponse({ type: 'pong', url: location.href });
      return true;
    }

    if (message.type === 'get_url') {
      sendResponse({ url: location.href, title: document.title });
      return true;
    }

    return false;
  });
})();
