import mongoose from 'mongoose';

const poojaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleTelugu: { type: String },
  time: { type: String, required: true }, // e.g., "05:30 AM"
  endTime: { type: String },
  date: { type: Date },
  dayLabel: { type: String }, // e.g., "Day 1 - Aug 27"
  description: { type: String },
  icon: { type: String, default: '🪔' },
  category: { type: String, enum: ['nitya', 'special', 'aarti', 'abhishekam'], default: 'nitya' },
  isSpecial: { type: Boolean, default: false },
  status: { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Pooja', poojaSchema);
