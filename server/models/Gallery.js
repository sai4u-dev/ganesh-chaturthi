import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String, enum: ['darshan', 'pooja', 'nimarjanam', 'annadanam', 'making', 'crowd', 'ganesh', 'idols'], default: 'ganesh' },
  year: { type: Number, default: 2026 },
  isFeatured: { type: Boolean, default: false },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
