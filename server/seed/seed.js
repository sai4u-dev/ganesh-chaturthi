import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Settings from '../models/Settings.js';
import Pooja from '../models/Pooja.js';
import Annadanam from '../models/Annadanam.js';
import Nimarjanam from '../models/Nimarjanam.js';
import Promotion from '../models/Promotion.js';
import Gallery from '../models/Gallery.js';
import Committee from '../models/Committee.js';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'ganesh_bappa_morya_fallback_secret_2026_secure_key_xYz123_change_in_production';
}

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/ganesh_chaturthi';

const seed = async () => {
  await mongoose.connect(MONGO);
  console.log('Seeding...');

  await Promise.all([
    Settings.deleteMany({}),
    Pooja.deleteMany({}),
    Annadanam.deleteMany({}),
    Nimarjanam.deleteMany({}),
    Promotion.deleteMany({}),
    Gallery.deleteMany({}),
    Committee.deleteMany({}),
    Schedule.deleteMany({}),
  ]);

  await Settings.create({
    festivalName: 'Khairatabad Ganesh Utsav 2026',
    tagline: '70 Years of Divine Legacy — Bappa is Coming',
    venue: 'Khairatabad, Hyderabad, Telangana',
    startDate: new Date('2026-09-14'),
    endDate: new Date('2026-09-24'),
    nimarjanamDate: new Date('2026-09-24'),
    heroTitle: '॥ Ganpati Bappa Morya ॥',
    heroSubtitle: '70 Feet Maha Ganesh — Ekadasha Rudra Avatar',
    heroDescription: 'Hyderabad’s iconic 70-ft Khairatabad Ganesh returns in his most divine avatar. 11 days of devotion, culture, and celebration.',
    announcement: '✨ Laddu Prasadam Auction Sep 20 • Free Annadanam Daily 12PM • Cultural Programs Daily ✨'
  });

  await Pooja.insertMany([
    { title: 'Suprabhata Seva', titleTelugu: 'సుప్రభాత సేవ', time: '05:30 AM', endTime: '06:00 AM', dayLabel: 'Daily', description: 'Wake up the Lord with Vedic chants', icon: '🌅', category: 'nitya', order: 1 },
    { title: 'Ganapati Atharvashirsha Parayanam', time: '06:00 AM', endTime: '07:30 AM', dayLabel: 'Daily', description: '108 recitations by Vedic pandits', icon: '📿', category: 'abhishekam', isSpecial: true, order: 2 },
    { title: 'Maha Abhishekam', titleTelugu: 'మహా అభిషేకం', time: '08:00 AM', endTime: '09:30 AM', dayLabel: 'Daily', description: 'Panchamrita abhishekam with 1008 modaks', icon: '🪔', category: 'abhishekam', order: 3 },
    { title: 'Madhyahna Aarti', time: '12:00 PM', endTime: '12:30 PM', dayLabel: 'Daily', description: 'Mid-day aarti with dhols & nagaras', icon: '🔔', category: 'aarti', status: 'upcoming', order: 4 },
    { title: 'Sahasra Modaka Alankaram', time: '04:00 PM', endTime: '05:00 PM', dayLabel: 'Sep 15 Special', description: 'Special decoration with 1008 modaks', icon: '🍯', category: 'special', isSpecial: true, order: 5 },
    { title: 'Maha Aarti & Cultural Program', time: '07:00 PM', endTime: '10:00 PM', dayLabel: 'Daily', description: 'Grand aarti followed by classical dance & bhajans', icon: '✨', category: 'aarti', isSpecial: true, order: 6 },
    { title: 'Ekanta Seva', time: '10:30 PM', endTime: '11:00 PM', dayLabel: 'Daily', description: 'Final seva — devotees darshan closes', icon: '🌙', category: 'nitya', order: 7 },
  ]);

  const dates = Array.from({ length: 11 }, (_, i) => new Date(2026, 8, 14 + i)); // Sep 14-24
  for (let i = 0; i < dates.length; i++) {
    await Annadanam.create({
      date: dates[i],
      dayLabel: `Day ${i+1} — ${dates[i].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`,
      mealType: 'lunch',
      time: '12:00 PM - 3:00 PM',
      menu: i === 0 ? ['Pulihora', 'Sambar Rice', 'Curd Rice', 'Laddu', 'Vada'] : i === 5 ? ['Biryani', 'Raita', 'Double ka Meetha', 'Modak'] : ['Pulihora', 'Dal Rice', 'Curd Rice', 'Laddu'],
      sponsor: i % 3 === 0 ? 'Shri Balaji Jewellers' : i % 3 === 1 ? 'Kowshik Foundation' : 'Hyderabad Devotees',
      expectedCount: 8000 + i * 500,
      status: i === 0 ? 'serving' : i < 0 ? 'completed' : 'scheduled',
      isTodaySpecial: i === 5,
      venue: 'Annadanam Mandapam, Near Khairatabad Temple'
    });
  }

  await Nimarjanam.create({
    title: 'Maha Nimarjanam — Hussain Sagar',
    date: new Date('2026-09-24'),
    startTime: '05:00 AM',
    route: ['Khairatabad Temple', 'Raj Bhavan Road', 'NTR Gardens', 'Tank Bund', 'Hussain Sagar - Crane #3'],
    description: 'The grand farewell procession of our beloved Bappa. 70ft idol on 60-ton trailer with 12 cranes. Expected 15 lakh devotees.',
    status: 'planned',
    currentLocation: 'Khairatabad Mandapam',
    expectedCrowd: '15+ Lakhs',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.123!2d78.45!3d17.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97b000000001%3A0x123!2sKhairatabad%20Ganesh!5e0!3m2!1sen!2sin!4v123',
    liveLocationUrl: 'https://share.google/live-location-demo'
  });

  await Promotion.insertMany([
    { title: 'Title Sponsor — Gold Winner', brand: 'Malabar Gold & Diamonds', category: 'sponsor', tier: 'title', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', description: 'Presenting the 70th year grandeur', offer: 'Free Gold Coin on Purchase above ₹1L', isFeatured: true, order: 1, isActive: true },
    { title: 'Cultural Nights Live', brand: 'Utsav Events', category: 'event', tier: 'platinum', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', description: 'Classical, Folk & Bollywood — Every evening 7 PM', offer: 'Free Entry • Passes at Counter', isFeatured: true, order: 2, isActive: true },
    { title: 'Prasadam Stalls & Food Court', brand: '50+ Stalls', category: 'stall', tier: 'community', image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600', description: 'Hyderabadi biryani to Modaks — taste the fest', offer: 'Annadanam FREE • Stalls 10AM-11PM', isFeatured: false, order: 3, isActive: true },
    { title: 'Official Photography Partner', brand: 'Pixel Lens Studio', category: 'partner', tier: 'gold', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600', description: 'Capture your darshan — instant prints', offer: 'Free Digital Photo with Donation', isFeatured: true, order: 4, isActive: true },
    { title: 'Laddu Auction 2026', brand: 'Khairatabad Committee', category: 'promo', tier: 'platinum', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600', description: '21kg Maha Laddu — Bid for Bappa’s blessings', offer: 'Sep 20 • 11 AM • Starting ₹1,11,116', isFeatured: true, order: 5, isActive: true },
  ]);

  await Gallery.insertMany([
    { title: 'Maha Ganesh Darshan 2025', imageUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800', category: 'ganesh', year: 2025, isFeatured: true },
    { title: '70ft Idol — Front View', imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800', category: 'idols', year: 2026, isFeatured: true },
    { title: 'Ganesh Close-up — Ornaments', imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800', category: 'ganesh', year: 2026, isFeatured: true },
    { title: 'Making of 70ft Idol', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', category: 'making', year: 2026, isFeatured: true },
    { title: 'Aarti at Night', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', category: 'pooja', year: 2025 },
    { title: 'Annadanam Serving', imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', category: 'annadanam' },
    { title: 'Nimarjanam Procession', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', category: 'nimarjanam' },
    { title: 'Devotee Crowd', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', category: 'crowd' },
    { title: 'Idol Side View — 70ft Grandeur', imageUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800', category: 'idols', year: 2025, isFeatured: true },
  ]);

  await Committee.insertMany([
    { name: 'Sri Karthik Kowshik', role: 'Utsav Chairman', phone: '+91 98765 43210', image: 'https://i.pravatar.cc/300?img=12', order: 1 },
    { name: 'Sri Ramesh Yadav', role: 'Treasurer', phone: '+91 98765 43211', image: 'https://i.pravatar.cc/300?img=15', order: 2 },
    { name: 'Smt. Lakshmi Devi', role: 'Annadanam In-charge', phone: '+91 98765 43212', image: 'https://i.pravatar.cc/300?img=32', order: 3 },
    { name: 'Sri Suresh Kumar', role: 'Pooja Committee Head', phone: '+91 98765 43213', image: 'https://i.pravatar.cc/300?img=18', order: 4 },
  ]);

  // Unified Schedule timeline — includes all important dates
  const scheduleBase = [
    { date: new Date('2026-09-14'), time: '05:30 AM', title: 'Ganesh Idol Installation — Pran Pratishtha', titleTelugu: 'ప్రాణ ప్రతిష్ట', description: 'Grand unveiling of 70ft Ekadasha Rudra Avatar with Vedic chanting', category: 'pran_pratishtha', icon: '🕉️', isMainEvent: true, status: 'upcoming', order: 1 },
    { date: new Date('2026-09-14'), time: '08:00 AM', title: 'Maha Abhishekam & First Aarti', description: 'Panchamrita abhishekam with 1008 modaks', category: 'special_pooja', icon: '🪔', order: 2 },
    { date: new Date('2026-09-15'), time: '06:00 AM', title: 'Daily Pooja Begins', description: 'Suprabhata Seva → Atharvashirsha → Abhishekam', category: 'daily_pooja', icon: '🌅', order: 3 },
    { date: new Date('2026-09-15'), time: '07:00 PM', title: 'Cultural Program — Classical Dance', description: 'Bharatanatyam & Kuchipudi by local academies', category: 'cultural', icon: '💃', order: 4 },
    { date: new Date('2026-09-16'), time: '12:00 PM', title: 'Annadanam Maha Prasadam Begins', description: 'Free lunch for all devotees daily 12PM-3PM', category: 'annadanam', icon: '🍛', isMainEvent: true, order: 5 },
    { date: new Date('2026-09-18'), time: '04:00 PM', title: 'Special Pooja — Sahasra Modaka Alankaram', description: 'Adorning Bappa with 1008 modaks', category: 'special_pooja', icon: '🍯', isMainEvent: true, order: 6 },
    { date: new Date('2026-09-20'), time: '11:00 AM', title: 'Laddu Auction — 21kg Maha Laddu', description: 'Bid for Bappa\'s blessings — starting ₹1,11,116', category: 'special_pooja', icon: '🍬', isMainEvent: true, order: 7 },
    { date: new Date('2026-09-20'), time: '07:00 PM', title: 'Musical Night — Bhajans & Dhol', description: 'Dhol-tasha & devotional songs', category: 'cultural', icon: '🥁', order: 8 },
    { date: new Date('2026-09-24'), time: '05:00 AM', title: 'Nimajjanam / Visarjanam Procession', titleTelugu: 'నిమజ్జనం', description: 'Grand farewell to Hussain Sagar via Tank Bund — 15 lakh devotees', category: 'nimajjanam', icon: '🌊', isMainEvent: true, order: 9 },
  ];
  await Schedule.insertMany(scheduleBase.map(s => ({ ...s, venue: 'Khairatabad Mandapam' })) );

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ganeshutsav.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({ name: 'Super Admin', email: adminEmail, password: adminPass, role: 'admin' });
    console.log(`✅ Admin created: ${adminEmail} / ${adminPass}`);
  }

  console.log('✅ Seed Complete');
  await mongoose.disconnect();
};

seed().catch(e => { console.error(e); process.exit(1); });
