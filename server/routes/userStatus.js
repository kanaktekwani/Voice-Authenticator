import express from 'express';
import { registerDevice } from '../controllers/userStatusController.js'; // Import the controller

const router = express.Router();

// Existing GET route
router.get('/', (req, res) => {
  const userId = req.session?.zoomUserId || null;
  const hasPaidPlan = req.session?.hasPaidPlan || false;

  res.json({
    userId,
    paid: hasPaidPlan,
  });
});

// ✅ New POST route for device registration
router.post('/register', registerDevice);

export default router;
