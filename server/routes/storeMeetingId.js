import express from "express";
import db from "../helpers/db.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/api/store-meeting-id", requireAuth, async (req, res) => {
  const userId = res.locals.user.id;
  const { meetingID } = req.body;

  try {
    const result = await db.query(
      'UPDATE users SET "meetingID" = $1 WHERE id = $2',
      [meetingID, userId]
    );
    console.log(`✅ Updated meetingUUID for user ${userId}:`, meetingID);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update meetingUUID:", err.message);
    res.status(500).json({ error: "Failed to store meeting UUID" });
  }
});

export default router;
