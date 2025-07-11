import express from "express";
import db from "../helpers/db.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/api/store-meeting-id", requireAuth, async (req, res) => {
  const userId = res.locals.user.id;
  const { meetingID } = req.body;

  if (!meetingID) {
    return res.status(400).json({ error: "Meeting ID is required" });
  }

  try {
    await db.query(
      "UPDATE users SET meetingID = $1 WHERE id = $2",
      [meetingID, userId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error storing meeting ID:", error);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
