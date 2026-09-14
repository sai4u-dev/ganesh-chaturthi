import express from 'express';
import Nimarjanam from '../models/Nimarjanam.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  let data = await Nimarjanam.findOne().sort({ createdAt: -1 });
  if (!data) data = await Nimarjanam.create({ date: new Date('2026-09-24'), route: ['Khairatabad', 'Raj Bhavan Road', 'Tank Bund', 'Hussain Sagar'] });
  res.json(data);
});
router.put('/', protect, adminOnly, async (req, res) => {
  let doc = await Nimarjanam.findOne().sort({ createdAt: -1 });
  if (!doc) doc = await Nimarjanam.create(req.body);
  else { Object.assign(doc, req.body); await doc.save(); }
  res.json(doc);
});
export default router;
