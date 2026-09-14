import mongoose from 'mongoose';

const committeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Committee', committeeSchema);
