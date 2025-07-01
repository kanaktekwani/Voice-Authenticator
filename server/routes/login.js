import express from 'express';
import db from '../helpers/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ success: true, user: result.rows[0] });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
