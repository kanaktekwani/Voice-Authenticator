// server/models/ZoomUser.js
import mongoose from 'mongoose';

const ZoomUserSchema = new mongoose.Schema({
  zoomUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('ZoomUser', ZoomUserSchema);
