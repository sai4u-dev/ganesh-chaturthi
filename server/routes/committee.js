import express from 'express';
import Committee from '../models/Committee.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Committee.find().sort({ order: 1 });
  res.json(data);
});
router.post('/', protect, adminOnly, async (req, res) => {
  const doc = await Committee.create(req.body);
  res.status(201).json(doc);
});
router.put('/:id', protect, adminOnly, async (req, res) => {
  const doc = await Committee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Committee.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
export default router;
