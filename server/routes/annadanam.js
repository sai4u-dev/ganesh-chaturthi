import express from 'express';
import Annadanam from '../models/Annadanam.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Annadanam.find().sort({ date: 1, time: 1 });
  res.json(data);
});
router.post('/', protect, adminOnly, async (req, res) => {
  const doc = await Annadanam.create(req.body);
  res.status(201).json(doc);
});
router.put('/:id', protect, adminOnly, async (req, res) => {
  const doc = await Annadanam.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Annadanam.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
export default router;
