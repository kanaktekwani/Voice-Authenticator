import express from 'express';
const router = express.Router();
import db from '../helpers/db.js';

router.post('/signup', async (req, res) => {
  const { username, name, password, deviceId, isPremium = false } = req.body;

  try {
    // Check if user already exists
    const existing = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (username, name, password, deviceId, isPremium)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [username, name, password, deviceId, isPremium]
    );

    res.status(201).json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    res.status(500).json({ error: 'Signup failed' });
  }
});

export default router;
