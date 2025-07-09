import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { name, email } = req.session.user;
  res.json({ message: `Welcome, ${name}!`, email });
});

export default router;
