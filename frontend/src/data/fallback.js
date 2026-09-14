export const fallbackSettings = {
  festivalName: 'Khairatabad Ganesh Utsav 2026',
  tagline: '70 Years of Divine Legacy — Bappa is Coming',
  venue: 'Khairatabad, Hyderabad, Telangana',
  startDate: '2026-09-14T00:00:00.000Z',
  endDate: '2026-09-24T00:00:00.000Z',
  nimarjanamDate: '2026-09-24T00:00:00.000Z',
  heroTitle: '॥ Ganpati Bappa Morya ॥',
  heroSubtitle: '70 Feet Maha Ganesh — Ekadasha Rudra Avatar',
  heroDescription: 'Hyderabad’s iconic 70-ft Khairatabad Ganesh returns in his most divine avatar. 11 days of devotion, culture, and celebration.',
  announcement: '✨ Laddu Prasadam Auction Sep 20 • Free Annadanam Daily 12PM • Cultural Programs Daily ✨',
  marqueeText: '✦ Ganpati Bappa Morya ✦ Mangal Murti Morya ✦ Khairatabad Maha Ganesh 2026 ✦ 70 Years of Divine Legacy ✦',
  contactPhone: '+91 98765 43210',
  contactEmail: 'info@khairatabadganesh.com',
  status: 'upcoming',
};

export const fallbackPooja = [
  { _id: '1', title: 'Suprabhata Seva', titleTelugu: 'సుప్రభాత సేవ', time: '05:30 AM', endTime: '06:00 AM', dayLabel: 'Daily', description: 'Wake up the Lord with Vedic chants', icon: '🌅', category: 'nitya', status: 'upcoming' },
  { _id: '2', title: 'Ganapati Atharvashirsha Parayanam', time: '06:00 AM', endTime: '07:30 AM', dayLabel: 'Daily', description: '108 recitations by Vedic pandits', icon: '📿', category: 'abhishekam', isSpecial: true, status: 'upcoming' },
  { _id: '3', title: 'Maha Abhishekam', titleTelugu: 'మహా అభిషేకం', time: '08:00 AM', endTime: '09:30 AM', dayLabel: 'Daily', description: 'Panchamrita abhishekam with 1008 modaks', icon: '🪔', category: 'abhishekam', status: 'upcoming' },
  { _id: '4', title: 'Madhyahna Aarti', time: '12:00 PM', endTime: '12:30 PM', dayLabel: 'Daily', description: 'Mid-day aarti with dhols & nagaras', icon: '🔔', category: 'aarti', status: 'upcoming' },
  { _id: '5', title: 'Sahasra Modaka Alankaram', time: '04:00 PM', endTime: '05:00 PM', dayLabel: 'Sep 15 Special', description: 'Special decoration with 1008 modaks', icon: '🍯', category: 'special', isSpecial: true, status: 'upcoming' },
  { _id: '6', title: 'Maha Aarti & Cultural Program', time: '07:00 PM', endTime: '10:00 PM', dayLabel: 'Daily', description: 'Grand aarti followed by classical dance & bhajans', icon: '✨', category: 'aarti', isSpecial: true, status: 'upcoming' },
  { _id: '7', title: 'Ekanta Seva', time: '10:30 PM', endTime: '11:00 PM', dayLabel: 'Daily', description: 'Final seva — devotees darshan closes', icon: '🌙', category: 'nitya', status: 'upcoming' },
];

export const fallbackAnnadanam = Array.from({ length: 6 }, (_, i) => ({
  _id: String(i+1),
  date: new Date(2026, 8, 14 + i).toISOString(),
  dayLabel: `Day ${i+1} — Sep ${14+i}`,
  mealType: 'lunch',
  time: '12:00 PM - 3:00 PM',
  menu: i === 0 ? ['Pulihora', 'Sambar Rice', 'Curd Rice', 'Laddu', 'Vada'] : ['Pulihora', 'Dal Rice', 'Curd Rice', 'Laddu'],
  sponsor: i % 2 === 0 ? 'Shri Balaji Jewellers' : 'Kowshik Foundation',
  expectedCount: 8000,
  status: i === 0 ? 'serving' : 'scheduled',
  isTodaySpecial: i === 2,
}));

export const fallbackNimarjanam = {
  title: 'Maha Nimarjanam — Hussain Sagar',
  date: '2026-09-24T00:00:00.000Z',
  startTime: '05:00 AM',
  route: ['Khairatabad Temple', 'Raj Bhavan Road', 'NTR Gardens', 'Tank Bund', 'Hussain Sagar - Crane #3'],
  description: 'The grand farewell procession of our beloved Bappa. 70ft idol on 60-ton trailer with 12 cranes. Expected 15 lakh devotees.',
  status: 'planned',
  currentLocation: 'Khairatabad Mandapam',
  expectedCrowd: '15+ Lakhs',
};

export const fallbackPromotions = [
  { _id: '1', title: 'Title Sponsor — Gold Winner', brand: 'Malabar Gold & Diamonds', category: 'sponsor', tier: 'title', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', description: 'Presenting the 70th year grandeur', offer: 'Free Gold Coin on Purchase above ₹1L', isFeatured: true },
  { _id: '2', title: 'Cultural Nights Live', brand: 'Utsav Events', category: 'event', tier: 'platinum', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', description: 'Classical, Folk & Bollywood — Every evening 7 PM', offer: 'Free Entry • Passes at Counter', isFeatured: true },
  { _id: '3', title: 'Prasadam Stalls & Food Court', brand: '50+ Stalls', category: 'stall', tier: 'community', image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600', description: 'Hyderabadi biryani to Modaks — taste the fest', offer: 'Annadanam FREE • Stalls 10AM-11PM' },
  { _id: '4', title: 'Laddu Auction 2026', brand: 'Khairatabad Committee', category: 'promo', tier: 'platinum', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600', description: '21kg Maha Laddu — Bid for Bappa’s blessings', offer: 'Sep 20 • 11 AM • Starting ₹1,11,116', isFeatured: true },
];

export const fallbackSchedule = [
  { _id: 's1', date: '2026-09-14T00:00:00.000Z', time: '05:30 AM', title: 'Ganesh Idol Installation — Pran Pratishtha', titleTelugu: 'ప్రాణ ప్రతిష్ట', description: 'Grand unveiling of 70ft Ekadasha Rudra Avatar', category: 'pran_pratishtha', icon: '🕉️', isMainEvent: true, status: 'upcoming', venue: 'Khairatabad Mandapam' },
  { _id: 's2', date: '2026-09-16T00:00:00.000Z', time: '12:00 PM', title: 'Annadanam Begins — Free Meals for All', description: 'Daily 12PM-3PM, 8000+ plates', category: 'annadanam', icon: '🍛', isMainEvent: true, status: 'upcoming', venue: 'Annadanam Mandapam' },
  { _id: 's3', date: '2026-09-20T00:00:00.000Z', time: '11:00 AM', title: 'Laddu Auction — 21kg Maha Laddu', description: 'Bid for Bappa\'s blessings', category: 'special_pooja', icon: '🍬', isMainEvent: true, status: 'upcoming', venue: 'Main Stage' },
  { _id: 's4', date: '2026-09-24T00:00:00.000Z', time: '05:00 AM', title: 'Nimajjanam / Visarjanam — Hussain Sagar', titleTelugu: 'నిమజ్జనం', description: 'Grand farewell via Tank Bund — 15 lakh devotees', category: 'nimajjanam', icon: '🌊', isMainEvent: true, status: 'upcoming', venue: 'Khairatabad → Hussain Sagar' },
  { _id: 's5', date: '2026-09-15T00:00:00.000Z', time: '07:00 PM', title: 'Cultural Program — Classical Dance', description: 'Bharatanatyam & Kuchipudi', category: 'cultural', icon: '💃', status: 'upcoming', venue: 'Cultural Stage' },
];

export const fallbackGallery = [
  { _id: '1', title: 'Maha Ganesh Darshan 2025', imageUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800', category: 'ganesh', year: 2025 },
  { _id: '2', title: '70ft Idol — Front View', imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800', category: 'idols', year: 2026 },
  { _id: '3', title: 'Ganesh Close-up — Ornaments', imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800', category: 'ganesh', year: 2026 },
  { _id: '4', title: 'Making of 70ft Idol', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', category: 'making', year: 2026 },
  { _id: '5', title: 'Aarti at Night', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', category: 'pooja', year: 2025 },
  { _id: '6', title: 'Annadanam Serving', imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', category: 'annadanam', year: 2025 },
  { _id: '7', title: 'Visarjanam Highlights 2024', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', category: 'nimarjanam', year: 2024, videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0' },
  { _id: '8', title: 'Cultural Night — Devotee Crowd', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', category: 'crowd', year: 2025 },
  { _id: '9', title: 'Idol Side View — 70ft Grandeur', imageUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800', category: 'idols', year: 2025 },
];
