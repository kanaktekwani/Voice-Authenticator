import express from 'express';
import bcrypt from 'bcrypt';         // 🔒 import bcrypt for password hashing
const router = express.Router();

import db from '../helpers/db.js';

router.post('/signup', async (req, res) => {
  const { email, name, password, deviceId, isPremium } = req.body;

  try {
    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📝 Insert into DB
    const result = await db.query(
      `INSERT INTO users (email, name, password, deviceId, isPremium)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [email, name, hashedPassword, deviceId || null, isPremium]
    );

    console.log('✅ User signed up with ID:', result.rows[0].id);
    res.status(200).json({ success: true, userId: result.rows[0].id });

  } catch (error) {
    console.error('❌ Signup DB Error:', error.message);
    res.status(500).json({ error: 'Signup failed' });
  }
});

export default router;
