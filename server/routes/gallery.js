import express from 'express';
import Gallery from '../models/Gallery.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Gallery.find().sort({ createdAt: -1 });
  res.json(data);
});
router.post('/', protect, adminOnly, async (req, res) => {
  const doc = await Gallery.create(req.body);
  res.status(201).json(doc);
});
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
export default router;
