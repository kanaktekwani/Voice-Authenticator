import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

import db from '../helpers/db.js';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt:', email);

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // ✅ Store entire user object in session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: user.ispremium,
      deviceId: user.deviceid,
    };

    return res.status(200).json({
      success: true,
      userId: user.id,
      name: user.name,
      isPremium: user.ispremium,
    });

  } catch (error) {
    console.error('❌ Login DB Error:', error.message);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
