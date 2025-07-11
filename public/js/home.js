window.addEventListener("DOMContentLoaded", async () => {
  try {
    // ✅ Load Zoom SDK only inside Zoom client
    if (window.zoomSdk) {
      await zoomSdk.config({
        capabilities: ['getMeetingContext'],
        version: '1.9.0',
      });

      const context = await zoomSdk.getMeetingContext();
      console.log("✅ Meeting Context:", context);

      // Send meetingID to backend
      await fetch("/api/storeMeetingId", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ meetingId: context.meetingID }), // 🔥 lowercase "d"!
});


      console.log("📨 Sent meeting ID to backend:", context.meetingID);
    } else {
      console.warn("⚠️ Not running inside Zoom client. SDK not available.");
    }
  } catch (err) {
    console.error("❌ Error getting meeting ID:", err);
  }

  // (Optional) Leave IP fetch active but remove from UI
  try {
    const res = await fetch('/whoami');
    const data = await res.json();
    console.log("🌐 IP Info (for debug):", data);
  } catch (err) {
    console.error('❌ Failed to fetch IP address:', err);
  }
});
