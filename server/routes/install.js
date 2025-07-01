import express from 'express';
const router = express.Router();

import db from '../helpers/db.js';

router.post('/install', async (req, res) => {
  const { username, name, password, isPremium, deviceId } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO users (username, name, password, isPremium, deviceId) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [username, name, password, isPremium, deviceId]
    );

    console.log('✅ User inserted with ID', result.rows[0].id);
    res.status(200).json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error('❌ DB Insert Error:', error.message);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

export default router;
