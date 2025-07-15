import express from "express";
import db from "../helpers/db.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/api/participants-in-meeting", requireAuth, async (req, res) => {
  const userMeetingID = req.session.user?.meetingID;

  if (!userMeetingID) {
    return res.status(400).json({ error: "User is not in a meeting" });
  }

  try {
    const result = await db.query(
      `SELECT id, name, email, isPremium, deviceid
       FROM users
       WHERE "meetingID" = $1`,
      [userMeetingID]
    );

    res.json({ participants: result.rows });
  } catch (err) {
    console.error("❌ Failed to fetch participants:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
