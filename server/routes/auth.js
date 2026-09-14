import express from 'express';
import jwt from 'jsonwebtoken';
import process from 'node:process';
import User from '../models/User.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'ganesh_bappa_morya_fallback_secret_2026_secure_key_xYz123_change_in_production';
const genToken = (user) => jwt.sign({ id: user._id, email: user.email, role: user.role }, getJwtSecret(), { expiresIn: '7d' });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: genToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/register', async (req, res) => {
  // Allow first admin creation only if no users exist, else need existing admin token ideally
  const { name, email, password } = req.body;
  try {
    const count = await User.countDocuments();
    if (count > 0) return res.status(403).json({ message: 'Registration closed. Contact admin.' });
    const user = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ token: genToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (_e) { res.status(401).json({ message: 'Invalid token' }); }
});

export default router;
