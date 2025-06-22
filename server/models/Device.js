import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  zoomUserId: { type: String },
  email: { type: String },
  meetingId: { type: String },
  hasActivated: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Device', DeviceSchema);
