import zoomSdk from '@zoom/appssdk';
import axios from 'axios';


(async () => {
  // Initialize Zoom Apps SDK, but fall back if unsupported
  try {
    const cfg = await zoomSdk.config({ capabilities: ['startRTMS', 'stopRTMS', 'setEmojiReaction'] });
    console.debug('Zoom SDK cfg:', cfg);
    if (cfg.runningContext === 'inMeeting') {
      var sdk = await zoomSdk.callZoomApi('startRTMS');

    }
  } catch (e) {
    console.warn('Zoom SDK unsupported; polling fallback:', e);
  }

  // Grab our status element
  const statusEl = document.getElementById('auth-status');
  // Function to fetch the latest status
  async function fetchStatus() {

    try {
      // let status1 = Math.random()<0.5? "✅":"❌"
      // zoomSdk.setEmojiReaction({emoji:status1})
    console.log('status')
      const resp = await axios.get('/api/status');
      let { status } = resp.data;
      // statusEl.textContent = status
      // console.log(status)
      // console.log(statusEl)
      // let get_user = status === 'human' ? '✔ Authentic voice' : '❌ Uncertain';
      // zoomSdk.setEmojiReaction({emoji:get_user})
      const emoji = status === 'human' ? '✅' : '❌';
      statusEl.textContent = status+emoji;

      
      zoomSdk.setEmojiReaction({ emoji });

    } catch (err) {
      console.error('Failed to fetch status:', err);
        
    }
  }

  // Kick off the polling loop
  await fetchStatus();
  setInterval(fetchStatus, 1000);
})();