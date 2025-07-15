import express from 'express';
import db from '../helpers/db.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// 🔹 Store or clear meeting UUID
router.post('/storeMeetingId', requireAuth, async (req, res) => {
  const { meetingId } = req.body;

  console.log('📥 Incoming meetingId:', meetingId);
  console.log('📦 Session user:', req.session.user);

  if (!req.session.user) {
    console.warn('⚠️ No user in session. Rejecting.');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET "meetingID" = $1 WHERE id = $2',
      [meetingId, req.session.user.id]
    );

    console.log(`✅ Successfully ${meetingId ? 'stored' : 'cleared'} meetingId for user ID: ${req.session.user.id}`);
    console.log('🧾 DB result:', result.rowCount);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ DB update failed:', err.message);
    res.status(500).json({ error: 'Failed to update meeting ID' });
  }
});

// 🔸 Serve participants page
router.get('/participants', requireAuth, (req, res) => {
  res.sendFile('participants.html', { root: './public' });
});

// 🔍 Get all participants in the same meeting
router.get('/meeting-participants', requireAuth, async (req, res) => {
  const currentUser = req.session.user;

  try {
    const result = await db.query(
      'SELECT name, email FROM users WHERE "meetingID" = (SELECT "meetingID" FROM users WHERE id = $1) AND "meetingID" IS NOT NULL',
      [currentUser.id]
    );

    res.status(200).json({ participants: result.rows });
  } catch (err) {
    console.error('❌ Failed to fetch meeting participants:', err.message);
    res.status(500).json({ error: 'Could not fetch participants' });
  }
});

export default router;
