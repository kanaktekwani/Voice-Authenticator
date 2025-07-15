window.addEventListener("DOMContentLoaded", async () => {
  try {
    if (window.zoomSdk) {
      await zoomSdk.config({
        capabilities: ['getMeetingUUID', 'onMeeting'],
        version: '1.9.0',
      });

      // 🔹 Get meeting UUID instead of meeting ID
      const { meetingUUID } = await zoomSdk.getMeetingUUID();
      console.log("📎 Meeting UUID from Zoom SDK:", meetingUUID);

      // 🔸 Send meetingUUID to backend as "meetingID"
      await fetch("/api/store-meeting-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingID: meetingUUID }),
      });

      console.log("📨 Stored meetingUUID as meetingID:", meetingUUID);

      // 🔻 Listen for meeting end and clear meetingID
      zoomSdk.onMeeting(async (event) => {
        if (event.action === "ended") {
          console.log("🛑 Meeting ended, clearing meetingID");

          await fetch("/api/store-meeting-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ meetingID: null }),
          });
        }
      });
    } else {
      console.warn("⚠️ Zoom SDK not available (not in Zoom client).");
    }
  } catch (err) {
    console.error("❌ Error with Zoom SDK:", err);
  }

  // Optional IP fetch for logging/debug
  try {
    const res = await fetch('/whoami');
    const data = await res.json();
    console.log("🌐 IP Info (debug):", data);
  } catch (err) {
    console.error('❌ Failed to fetch IP address:', err);
  }
});
