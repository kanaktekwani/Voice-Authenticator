import zoomSdk from '@zoom/appssdk';
import axios from 'axios';

(async () => {
  try {
    // Initialize Zoom SDK with required capabilities
    await zoomSdk.config({
      capabilities: [
        'runRenderingContext',
        'drawWebView',
        'getRunningContext',
        'getMeetingContext',
        'startRTMS',
        'stopRTMS',
        'setEmojiReaction',
      ],
    });

    // Get the current rendering context
    const { context: runningCtx } = await zoomSdk.getRunningContext();
    console.log('🧭 Running context:', runningCtx);

    // If not already in Camera Mode, switch to it
    if (runningCtx !== 'inCamera') {
      try {
        await zoomSdk.runRenderingContext({ view: 'camera' });
        console.log('✅ Switched to Camera Mode');
      } catch (err) {
        console.error('❌ Failed to switch to Camera Mode:', err);
      }
    }

    // Draw your app's UI as a WebView overlay on your video
    await zoomSdk.drawWebView({
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
      zIndex: 2,
    });

    // Start RTMS for emoji reactions
    await zoomSdk.callZoomApi('startRTMS');

  } catch (e) {
    console.error('Zoom SDK init failed:', e);
  }

  // Reference to status display element
  const statusEl = document.getElementById('auth-status');
  const verifyBtn = document.getElementById('verify-btn');

  // Handle Verify Me button click
  if (verifyBtn) {
  verifyBtn.onclick = async () => {
    try {
      const context = await zoomSdk.getMeetingContext();
      const meetingId = context?.meetingUUID || 'unknown';
      // Redirects the WebView overlay to Google (for testing)
      window.location.href = `https://appssdk.zoom.us/`;
    } catch (e) {
      console.error('Failed to get meeting context:', e);
    }
  };
}


  // Function to fetch status and update UI + emoji
  async function fetchStatus() {
    try {
      const resp = await axios.get('/api/status');
      const { status } = resp.data;
      const emoji = status === 'human' ? '✅' : '❌';
      if (statusEl) statusEl.textContent = `${status} ${emoji}`;
      zoomSdk.setEmojiReaction({ emoji });
    } catch (err) {
      console.error('❌ Failed to fetch status:', err);
    }
  }

  // Start polling loop
  await fetchStatus();
  setInterval(fetchStatus, 1000);
})();
