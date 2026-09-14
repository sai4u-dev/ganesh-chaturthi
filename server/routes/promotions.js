import express from 'express';
import Promotion from '../models/Promotion.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.active === 'true') filter.isActive = true;
  const data = await Promotion.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(data);
});
router.post('/', protect, adminOnly, async (req, res) => {
  const doc = await Promotion.create(req.body);
  res.status(201).json(doc);
});
router.put('/:id', protect, adminOnly, async (req, res) => {
  const doc = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Promotion.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
export default router;
