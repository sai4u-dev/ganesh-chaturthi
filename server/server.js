import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

// Validate critical secrets in production
if (isProd && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be set in production (Render env vars)');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'ganesh_bappa_morya_fallback_secret_2026_secure_key_xYz123_change_in_production';
  console.warn('JWT_SECRET not set — using fallback dev secret (DO NOT use in production)');
}
console.log(`JWT_SECRET ${process.env.JWT_SECRET ? 'loaded' : 'MISSING'} | MONGO_URI ${process.env.MONGO_URI ? 'loaded' : 'using default'} | ENV: ${NODE_ENV}`);

import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import poojaRoutes from './routes/pooja.js';
import annadanamRoutes from './routes/annadanam.js';
import nimarjanamRoutes from './routes/nimarjanam.js';
import promotionRoutes from './routes/promotions.js';
import galleryRoutes from './routes/gallery.js';
import committeeRoutes from './routes/committee.js';
import scheduleRoutes from './routes/schedule.js';
import registrationRoutes from './routes/registrations.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(morgan(isProd ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, try again after 15 minutes.' },
});

// CORS — allow Vercel frontend + local dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean),
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
].flat().filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    try {
      if (/\.vercel\.app$/.test(new URL(origin).hostname)) return cb(null, true);
    } catch {}
    if (allowedOrigins.includes(origin) || !isProd) return cb(null, true);
    if (isProd && allowedOrigins.length === 0) {
      console.warn(`CORS: allowing unknown origin in prod (set ALLOWED_ORIGINS): ${origin}`);
      return cb(null, true);
    }
    console.warn(`CORS blocked: ${origin}`);
    return cb(new Error(`CORS not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API info + health — frontend is on Vercel, backend only serves API
app.get('/', (req, res) => {
  res.json({
    message: 'Ganesh Chaturthi API — Ganpati Bappa Morya!',
    version: '1.0.0',
    env: NODE_ENV,
    uptime: process.uptime(),
    endpoints: ['/api/auth', '/api/settings', '/api/pooja', '/api/annadanam', '/api/nimarjanam', '/api/promotions', '/api/gallery', '/api/committee', '/api/schedule', '/api/registrations'],
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Ganesh Chaturthi API — Ganpati Bappa Morya!',
    version: '1.0.0',
    env: NODE_ENV,
    uptime: process.uptime(),
    endpoints: ['/api/auth', '/api/settings', '/api/pooja', '/api/annadanam', '/api/nimarjanam', '/api/promotions', '/api/gallery', '/api/committee', '/api/schedule', '/api/registrations'],
  });
});

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbLabel = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : dbState === 3 ? 'disconnecting' : 'disconnected';
  res.json({
    status: 'ok',
    env: NODE_ENV,
    db: dbLabel,
    dbCode: dbState,
    uptime: process.uptime(),
    time: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/api/ping', (req, res) => res.json({ pong: true, time: Date.now() }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pooja', poojaRoutes);
app.use('/api/annadanam', annadanamRoutes);
app.use('/api/nimarjanam', nimarjanamRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/registrations', registrationRoutes);

// 404 for unknown API routes (Express 5: use named wildcard)
app.use('/api/*splash', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} —`, err.message);
  if (err.message?.startsWith('CORS not allowed')) {
    return res.status(403).json({ message: err.message });
  }
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Server Error',
    ...(isProd ? {} : { stack: err.stack }),
  });
});

let server;

const start = async () => {
  await connectDB();

  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${NODE_ENV}]`);
    console.log(`Health at http://localhost:${PORT}/api/health`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    try {
      if (server) {
        await new Promise((resolve) => server.close(resolve));
        console.log('HTTP server closed');
      }
      await mongoose.connection.close(false);
      console.log('Mongo connection closed');
      process.exit(0);
    } catch (e) {
      console.error('Shutdown error:', e);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    console.error('UnhandledRejection:', err);
  });
  process.on('uncaughtException', (err) => {
    console.error('UncaughtException:', err);
    shutdown('uncaughtException');
  });
};

start();

export default app;
