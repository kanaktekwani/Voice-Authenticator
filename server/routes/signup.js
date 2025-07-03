import express from 'express';
const router = express.Router();

import db from '../helpers/db.js';

router.post('/signup', async (req, res) => {
  const { email, name, password, deviceId, isPremium } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO users (email, name, password, deviceId, isPremium) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [email, name, password, deviceId || null, isPremium]
    );

    console.log('✅ User signed up with ID:', result.rows[0].id);
    res.status(200).json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error('❌ Signup DB Error:', error.message);
    res.status(500).json({ error: 'Signup failed' });
  }
});

export default router;
