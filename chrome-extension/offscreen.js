// ZeroCLI Browser Extension — Offscreen Document
// Used for GIF creation and other off-screen processing tasks.
// This document runs in an offscreen context and can use canvas/media APIs.

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'create_gif') {
    handleCreateGif(message.frames, message.options)
      .then((result) => sendResponse({ success: true, ...result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function handleCreateGif(frames, options = {}) {
  const { width = 800, height = 600, fps = 5 } = options;

  // Note: Full GIF encoding requires a GIF encoder library (e.g. gif.js).
  // This implementation captures frames and returns metadata.
  // For production GIF generation, integrate gif.js or ffmpeg.wasm.

  return {
    frameCount: frames.length,
    width,
    height,
    fps,
    message: `Processed ${frames.length} frames at ${fps}fps`,
  };
}
