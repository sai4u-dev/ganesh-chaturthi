import express from 'express';
import Registration from '../models/Registration.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public: create any registration/contact
router.post('/', async (req, res) => {
  try {
    // simple honeypot: if website field filled, reject
    if (req.body.website) return res.status(400).json({ message: 'Invalid' });
    // basic validation
    if (!req.body.name || !req.body.phone || !req.body.type) {
      return res.status(400).json({ message: 'Name, phone and type are required' });
    }
    const doc = await Registration.create(req.body);
    res.status(201).json({ message: 'Registration received', id: doc._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Public: get counts (optional)
router.get('/counts', async (req, res) => {
  const counts = await Registration.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);
  res.json(counts);
});

// Admin: list with filter
router.get('/', protect, adminOnly, async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  const data = await Registration.find(filter).sort({ createdAt: -1 }).limit(500);
  res.json(data);
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const doc = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
