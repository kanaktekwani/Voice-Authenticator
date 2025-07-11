import express from 'express';
import db from '../helpers/db.js';

const router = express.Router();

router.post('/storeMeetingId', async (req, res) => {
  const { meetingId } = req.body;

  console.log('📥 Incoming meetingId:', meetingId);
  console.log('📦 Session user:', req.session.user);

  if (!req.session.user) {
    console.warn('⚠️ No user in session. Rejecting.');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!meetingId) {
    console.warn('⚠️ No meetingId in request body. Rejecting.');
    return res.status(400).json({ error: 'Meeting ID is required' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET "meetingID" = $1 WHERE id = $2',
      [meetingId, req.session.user.id]
    );

    console.log(`✅ Successfully stored meetingId (${meetingId}) for user ID: ${req.session.user.id}`);
    console.log('🧾 DB result:', result.rowCount);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ DB update failed:', err.message);
    res.status(500).json({ error: 'Failed to store meeting ID' });
  }
});

export default router;
