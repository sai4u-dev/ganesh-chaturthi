import mongoose from 'mongoose';

const annadanamSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayLabel: { type: String },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'prasadam'], default: 'lunch' },
  time: { type: String, required: true },
  menu: [{ type: String }],
  sponsor: { type: String },
  sponsorLogo: { type: String },
  expectedCount: { type: Number, default: 5000 },
  servedCount: { type: Number, default: 0 },
  venue: { type: String, default: 'Annadanam Mandapam, Near Temple' },
  status: { type: String, enum: ['scheduled', 'preparing', 'serving', 'completed', 'cancelled'], default: 'scheduled' },
  isTodaySpecial: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Annadanam', annadanamSchema);
