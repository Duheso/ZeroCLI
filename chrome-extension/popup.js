// ZeroCLI Browser Extension — Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const statusDot = document.getElementById('statusDot');
  const statusLabel = document.getElementById('statusLabel');
  const statusDescription = document.getElementById('statusDescription');
  const infoSection = document.getElementById('infoSection');
  const setupInstructions = document.getElementById('setupInstructions');
  const nativeHostStatus = document.getElementById('nativeHostStatus');
  const extensionIdEl = document.getElementById('extensionId');
  const extensionVersionEl = document.getElementById('extensionVersion');

  // Show extension info
  const manifest = chrome.runtime.getManifest();
  const extId = chrome.runtime.id;
  extensionIdEl.textContent = extId.slice(0, 20) + '...';
  extensionIdEl.title = extId;
  extensionVersionEl.textContent = manifest.version;

  setStatus('checking', 'Checking...', 'Testing connection to ZeroCLI...');

  // Ask the background service worker for status — no second native host process needed
  try {
    const response = await chrome.runtime.sendMessage({ type: 'get_status' });
    if (response?.isConnected) {
      setStatus('connected', 'Connected', 'ZeroCLI is connected and ready for browser automation.');
      nativeHostStatus.textContent = 'Running';
      infoSection.style.display = 'flex';
      setupInstructions.style.display = 'none';
    } else {
      setStatus('disconnected', 'Disconnected', 'ZeroCLI native host not responding. Run: zero --chrome');
      nativeHostStatus.textContent = 'Not running';
      infoSection.style.display = 'flex';
      setupInstructions.style.display = 'block';
    }
  } catch (err) {
    // Background not yet active (e.g. browser just started)
    setStatus('disconnected', 'Disconnected', 'ZeroCLI native host not responding. Run: zero --chrome');
    nativeHostStatus.textContent = 'Not running';
    infoSection.style.display = 'flex';
    setupInstructions.style.display = 'block';
  }

  function setStatus(state, label, description) {
    statusDot.className = `status-dot ${state}`;
    statusLabel.className = `status-label ${state}`;
    statusLabel.textContent = label;
    statusDescription.textContent = description;
  }
});
