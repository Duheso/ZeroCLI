// ZeroCLI Browser Extension — Popup Script

const NATIVE_HOST_NAME = 'com.duheso.zerocli_browser_extension';

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

  // Check connection status by probing native host
  setStatus('checking', 'Checking...', 'Testing connection to ZeroCLI...');

  try {
    const port = chrome.runtime.connectNative(NATIVE_HOST_NAME);

    let responded = false;
    const timeout = setTimeout(() => {
      if (!responded) {
        port.disconnect();
        setStatus('disconnected', 'Disconnected', 'ZeroCLI native host not responding. Run: zero --chrome');
        nativeHostStatus.textContent = 'Not running';
        setupInstructions.style.display = 'block';
      }
    }, 2000);

    port.onMessage.addListener((msg) => {
      if (msg.type === 'pong' && !responded) {
        responded = true;
        clearTimeout(timeout);
        port.disconnect();
        setStatus('connected', 'Connected', 'ZeroCLI is connected and ready for browser automation.');
        nativeHostStatus.textContent = 'Running';
        infoSection.style.display = 'flex';
        setupInstructions.style.display = 'none';
      }
    });

    port.onDisconnect.addListener(() => {
      if (!responded) {
        clearTimeout(timeout);
        const err = chrome.runtime.lastError?.message || 'Native host not found';
        setStatus('disconnected', 'Disconnected', `Native host error: ${err}`);
        nativeHostStatus.textContent = 'Not found';
        infoSection.style.display = 'flex';
        setupInstructions.style.display = 'block';
      }
    });

    port.postMessage({ type: 'ping' });
  } catch (err) {
    setStatus('disconnected', 'Error', `Could not connect: ${err.message}`);
    nativeHostStatus.textContent = 'Error';
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
