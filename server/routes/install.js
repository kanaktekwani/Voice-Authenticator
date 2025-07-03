import express from 'express';
const router = express.Router();

import db from '../helpers/db.js';

router.post('/install', async (req, res) => {
  const { email, name, password, isPremium, deviceId, meetingID } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO users (email, name, password, isPremium, deviceId, meetingID)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [email, name, password, isPremium, deviceId, meetingID]
    );

    console.log('✅ User inserted with ID', result.rows[0].id);
    res.status(200).json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error('❌ DB Insert Error:', error.message);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

export default router;
