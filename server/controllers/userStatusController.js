import Device from '../models/Device.js';

export async function registerDevice(req, res) {
  const { deviceId, zoomUserId, email, meetingId } = req.body;

  if (!deviceId || !zoomUserId || !email || !meetingId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingDevice = await Device.findOne({ deviceId });

    if (existingDevice?.hasActivated) {
      return res.status(409).json({ error: 'Device already registered' });
    }

    const updatedDevice = await Device.findOneAndUpdate(
      { deviceId },
      {
        deviceId,
        zoomUserId,
        email,
        meetingId,
        hasActivated: true,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Device registered successfully', device: updatedDevice });
  } catch (error) {
    console.error('❌ Error registering device:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
