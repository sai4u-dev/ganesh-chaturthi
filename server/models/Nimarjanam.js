import mongoose from 'mongoose';

const nimarjanamSchema = new mongoose.Schema({
  title: { type: String, default: 'Maha Nimarjanam 2026' },
  date: { type: Date, required: true },
  startTime: { type: String, default: '06:00 AM' },
  route: [{ type: String }], // array of stops
  mapEmbedUrl: { type: String },
  liveLocationUrl: { type: String },
  description: { type: String },
  status: { type: String, enum: ['planned', 'preparing', 'procession', 'immersed', 'completed'], default: 'planned' },
  currentLocation: { type: String, default: 'Khairatabad Temple' },
  expectedCrowd: { type: String, default: '10+ Lakhs' },
  permissions: { type: String },
  contactForNimarjanam: { type: String }
}, { timestamps: true });

export default mongoose.model('Nimarjanam', nimarjanamSchema);
