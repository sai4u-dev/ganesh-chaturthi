import express from 'express';
import Settings from '../models/Settings.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  res.json(s);
});

router.put('/', protect, adminOnly, async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create(req.body);
  else {
    Object.assign(s, req.body);
    await s.save();
  }
  res.json(s);
});

export default router;
