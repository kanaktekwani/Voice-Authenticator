import express from 'express';

const router = express.Router();

router.post('/api/probabilities', (req, res) => {
  const { device_id, probability, timestamp } = req.body;

  if (!device_id || typeof probability !== 'number' || !timestamp) {
    console.log("❌ Invalid body:", req.body);
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  console.log("📩 Probability received:", {
    device_id,
    probability,
    timestamp,
  });

  // You can later store this in your DB if needed

  return res.status(200).json({ success: true });
});

export default router;
