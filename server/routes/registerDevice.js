import express from 'express';
import Device from '../models/Device.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { deviceId, zoomUserId, email, meetingId } = req.body;

  if (!deviceId || !zoomUserId || !email || !meetingId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let device = await Device.findOne({ deviceId });

    if (device && device.hasActivated) {
      return res.status(409).json({ error: 'Device already registered' });
    }

    if (!device) {
      device = new Device({ deviceId, zoomUserId, email, meetingId, hasActivated: true });
    } else {
      device.zoomUserId = zoomUserId;
      device.email = email;
      device.meetingId = meetingId;
      device.hasActivated = true;
    }

    await device.save();
    return res.status(200).json({ success: true, message: 'Device registered' });

  } catch (err) {
    console.error('Error registering device:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
