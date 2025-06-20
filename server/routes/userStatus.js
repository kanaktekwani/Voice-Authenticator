import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const userId = req.session?.zoomUserId || null;
  const hasPaidPlan = req.session?.hasPaidPlan || false;

  res.json({
    userId,
    paid: hasPaidPlan,
  });
});

export default router;
