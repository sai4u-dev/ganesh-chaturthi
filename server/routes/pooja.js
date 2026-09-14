import express from 'express';
import Pooja from '../models/Pooja.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Pooja.find().sort({ order: 1, time: 1 });
  res.json(data);
});
router.post('/', protect, adminOnly, async (req, res) => {
  const doc = await Pooja.create(req.body);
  res.status(201).json(doc);
});
router.put('/:id', protect, adminOnly, async (req, res) => {
  const doc = await Pooja.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Pooja.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  const doc = await Pooja.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(doc);
});
export default router;
