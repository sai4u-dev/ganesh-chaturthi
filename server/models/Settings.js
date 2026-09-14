import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  festivalName: { type: String, default: 'Khairatabad Ganesh Utsav 2026' },
  tagline: { type: String, default: 'Ganpati Bappa Morya — 70th Year Celebration' },
  venue: { type: String, default: 'Khairatabad, Hyderabad, Telangana 500004' },
  startDate: { type: Date, default: () => new Date('2026-09-14') },
  endDate: { type: Date, default: () => new Date('2026-09-24') },
  nimarjanamDate: { type: Date, default: () => new Date('2026-09-24') },
  heroTitle: { type: String, default: '॥ Ganpati Bappa Morya ॥' },
  heroSubtitle: { type: String, default: '70 Feet Khairatabad Maha Ganesh — Ekadasha Rudra Avatar' },
  heroDescription: { type: String, default: 'Experience the divine grandeur of Hyderabad’s most iconic Ganesh — where devotion meets art, and 70 years of tradition comes alive.' },
  contactPhone: { type: String, default: '+91 98765 43210' },
  contactEmail: { type: String, default: 'info@khairatabadganesh.com' },
  marqueeText: { type: String, default: '✦ Ganpati Bappa Morya ✦ Mangal Murti Morya ✦ Khairatabad Maha Ganesh 2026 ✦ 70 Years of Divine Legacy ✦' },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  isAnnadanamLive: { type: Boolean, default: true },
  announcement: { type: String, default: '📢 Laddu Auction on Sep 20 — Don’t Miss the Divine Prasadam!' },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
