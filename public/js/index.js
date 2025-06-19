import zoomSdk from '@zoom/appssdk';
import axios from 'axios';

(async () => {
  try {
    // Initialize Zoom SDK with necessary capabilities
    await zoomSdk.config({
      capabilities: [
        'runRenderingContext',
        'openUrl',
        'startRTMS',
        'stopRTMS',
        'drawWebView',
        'clearWebView',
        'getRunningContext',
        'getMeetingContext',
        'getMeetingParticipants',
        'getUserContext',
        'getMeetingUUID',
        'postMessage',
        'drawImage',
        'closeRenderingContext',
        'setVirtualForeground',
        'removeVirtualForeground',
        'setEmojiReaction',
        'getEmojiConfiguration',
        'sendMessage',
      ],
    });

    // Check current rendering context
    const { context: runningCtx } = await zoomSdk.getRunningContext();
    console.log('🧭 Running context:', runningCtx);

    // Switch to Camera Mode if not already
    if (runningCtx !== 'inCamera') {
      try {
        await zoomSdk.runRenderingContext({ view: 'camera' });
        console.log('✅ Switched to Camera Mode');
      } catch (err) {
        console.error('❌ Failed to switch to Camera Mode:', err);
      }
    }

    // Draw WebView overlay on video
    await zoomSdk.drawWebView({
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
      zIndex: 2,
    });

    // Optionally start RTMS if needed (currently no emoji reaction used)
    // await zoomSdk.callZoomApi('startRTMS');

  } catch (e) {
    console.error('Zoom SDK init failed:', e);
  }

  // Elements reference
  const statusEl = document.getElementById('auth-status');
  const verifyBtn = document.getElementById('verify-btn');

  // Verify Me button handler (redirect to Zoom SDK page for testing)
  if (verifyBtn) {
  verifyBtn.onclick = async () => {
    let meetingId = 'unknown';
    try {
      const context = await zoomSdk.getMeetingContext();
      meetingId = context?.meetingUUID || 'unknown';
    } catch (e) {
      console.warn('Skipping context fetch due to permissions:', e.message);
    }

    try {
      await zoomSdk.openUrl({
        url: `https://appssdk.zoom.us`
      });
    } catch (err) {
      console.error('Failed to open URL with Zoom SDK:', err);
    }
  };
}



  // Function to update status and button color
  async function fetchStatus() {
    try {
      const resp = await axios.get('/api/status');
      const { status } = resp.data;

      // Update text status
      if (statusEl) statusEl.textContent = status;

      // Update button color based on status
      if (verifyBtn) {
        verifyBtn.style.backgroundColor = status === 'human' ? '#4CAF50' : '#f44336'; // Green or Red
        verifyBtn.style.color = '#ffffff'; // White text
      }

      // Temporarily stopped emoji reactions
      // const emoji = status === 'human' ? '✅' : '❌';
      // await zoomSdk.setEmojiReaction({ emoji });

    } catch (err) {
      console.error('❌ Failed to fetch status:', err);
    }
  }

  // Start polling status
  await fetchStatus();
  setInterval(fetchStatus, 1000);
})();
