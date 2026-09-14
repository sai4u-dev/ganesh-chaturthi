import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String },
  category: { type: String, enum: ['sponsor', 'partner', 'event', 'stall', 'promo'], default: 'sponsor' },
  tier: { type: String, enum: ['title', 'platinum', 'gold', 'silver', 'community'], default: 'gold' },
  image: { type: String },
  description: { type: String },
  offer: { type: String },
  ctaText: { type: String, default: 'Know More' },
  ctaLink: { type: String },
  validFrom: { type: Date },
  validTo: { type: Date },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Promotion', promotionSchema);
