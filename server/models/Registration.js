import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['volunteer', 'annadanam', 'event_participation', 'sponsorship', 'contact'],
    required: true,
    index: true
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  // generic
  participants: { type: Number, default: 1 },
  message: { type: String },
  // volunteer specific
  volunteerActivity: { type: String, enum: ['pooja_assistance', 'annadanam_service', 'crowd_management', 'decoration', 'cultural_coordination', 'nimajjanam_help', 'other', ''], default: '' },
  availableDates: [{ type: String }],
  // annadanam specific
  annadanamDate: { type: Date },
  annadanamPersons: { type: Number },
  // event participation
  eventName: { type: String },
  age: { type: Number },
  category: { type: String },
  // sponsorship
  sponsorshipType: { type: String, enum: ['title_sponsor', 'gold', 'silver', 'annadanam_sponsor', 'pooja_sponsor', 'other', ''], default: '' },
  amount: { type: String },
  company: { type: String },
  // meta
  status: { type: String, enum: ['pending', 'contacted', 'confirmed', 'cancelled'], default: 'pending' },
  // anti-spam
  source: { type: String, default: 'website' }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
