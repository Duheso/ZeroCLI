# ZeroCLI Browser Extension

A Chrome extension that connects your browser to ZeroCLI for automated browser control, screenshots, web automation, and more.

## Extension ID

`ccmaidbdaocjoeceanhlkafcokhmiolf`

This ID is stable because it's derived from the included RSA key in `manifest.json`.

## Installation

### Prerequisites

- [ZeroCLI](https://github.com/Duheso/ZeroCLI) installed
- Google Chrome (or any Chromium-based browser)

### Steps

1. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `chrome-extension/` directory from this repository

4. **Verify installation**
   - The ZeroCLI extension should appear with ID: `ccmaidbdaocjoeceanhlkafcokhmiolf`
   - The extension icon (⚡) will appear in your toolbar

5. **Connect to ZeroCLI**
   - Start ZeroCLI with Chrome support: `zero --chrome`
   - ZeroCLI will automatically install the native messaging host
   - Click the extension icon to verify the "Connected" status

## Native Messaging Host

The extension communicates with ZeroCLI via Chrome Native Messaging. The native host identifier is:

```
com.duheso.zerocli_browser_extension
```

ZeroCLI automatically installs the native host manifest when you run `zero --chrome`.

## Supported Tools

The extension implements the following browser automation tools:

| Tool | Description |
|------|-------------|
| `tabs_context_mcp` | Get information about all open browser tabs |
| `tabs_create_mcp` | Open a new browser tab |
| `navigate` | Navigate a tab to a URL |
| `computer` | Click, type, scroll, keyboard shortcuts, screenshots |
| `javascript_tool` | Execute JavaScript in a tab |
| `read_page` | Read the page's DOM structure |
| `find` | Find elements by text or CSS selector |
| `form_input` | Fill form fields (text, select, checkbox) |
| `get_page_text` | Get all visible text from a page |
| `read_console_messages` | Read browser console logs |
| `read_network_requests` | Read network requests |
| `gif_creator` | Capture frames for GIF recording |
| `resize_window` | Resize the browser window |
| `upload_image` | Upload an image via file input |
| `shortcuts_list` | List available keyboard shortcuts |
| `shortcuts_execute` | Execute a keyboard shortcut |

## Usage in ZeroCLI

Once connected, use the `/chrome` command in ZeroCLI or pass `--chrome` flag:

```bash
# Start ZeroCLI with Chrome support
zero --chrome

# Use /chrome command inside ZeroCLI session
/chrome
```

The `claude-in-chrome` skill will be automatically available.

## Permissions

The extension requires these Chrome permissions:

- `tabs` — Access tab information
- `activeTab` — Access the currently active tab
- `scripting` — Inject scripts for DOM automation
- `debugger` — Access Chrome DevTools Protocol (for console/network monitoring)
- `nativeMessaging` — Communicate with ZeroCLI
- `tabCapture` — Capture tab content for screenshots/GIF
- `storage` — Store settings
- `windows` — Manage browser windows
- `<all_urls>` — Access content on all pages

## Troubleshooting

### "Disconnected" status in popup

1. Ensure ZeroCLI is running: `zero --chrome`
2. Check that the native host was installed:
   - Linux: `~/.config/google-chrome/NativeMessagingHosts/com.duheso.zerocli_browser_extension.json`
   - macOS: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.duheso.zerocli_browser_extension.json`
3. Try reloading the extension at `chrome://extensions/`

### Extension ID mismatch

If you modify the `key` in `manifest.json`, the extension ID will change. Update the `allowed_origins` in ZeroCLI's native host manifest accordingly.

## Architecture

```
ZeroCLI (main process)
    └── MCP Client (stdio)
            │
    ZeroCLI Chrome MCP Server (subprocess)
            │ Unix socket
    Chrome Native Host (chromeNativeHost.ts)
            │ Chrome Native Messaging (stdin/stdout)
    ZeroCLI Browser Extension (this extension)
            │ Chrome Extension APIs
    Chrome Browser
```
