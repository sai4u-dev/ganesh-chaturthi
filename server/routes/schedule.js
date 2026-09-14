import express from 'express';
import Schedule from '../models/Schedule.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Schedule.find().sort({ date: 1, order: 1, time: 1 });
  res.json(data);
});

router.post('/', protect, adminOnly, async (req, res) => {
  const doc = await Schedule.create(req.body);
  res.status(201).json(doc);
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const doc = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  const doc = await Schedule.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(doc);
});

export default router;
