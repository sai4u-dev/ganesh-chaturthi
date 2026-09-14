import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, default: '' },
  endTime: { type: String },
  title: { type: String, required: true },
  titleTelugu: { type: String },
  description: { type: String },
  category: {
    type: String,
    enum: ['pran_pratishtha', 'daily_pooja', 'special_pooja', 'aarti', 'cultural', 'annadanam', 'nimajjanam', 'other'],
    default: 'other'
  },
  icon: { type: String, default: '🪔' },
  venue: { type: String, default: 'Khairatabad Mandapam' },
  isMainEvent: { type: Boolean, default: false },
  status: { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);
