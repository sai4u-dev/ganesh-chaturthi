# Configuration

Never commit secrets. All secrets are via env vars (local `.env`, Vercel dashboard, Render dashboard). `.env.example` files are the source of truth.

## 1. Frontend — `frontend/.env` / `frontend/.env.example`

| Variable | Required | Default | Where | Description |
|---|---|---|---|---|
| `VITE_API_URL` | Yes | `/api` | Vercel + local | Base URL for API. Local: `/api` (Vite proxies to backend). Production Vercel: `https://<render>.onrender.com/api` |
| `VITE_PROXY_TARGET` | No | `http://localhost:5000` | Local only | Where Vite dev server proxies `/api`. Used in `vite.config.js` via `loadEnv`. Example: `http://localhost:5001` |

**Example `frontend/.env.example`:**
```
VITE_API_URL=/api
# Vercel prod:
# VITE_API_URL=https://khairatabad-ganesh-api.onrender.com/api
# VITE_PROXY_TARGET=http://localhost:5000
```

**Notes:**
- `VITE_` prefix is required — Vite only exposes `VITE_*` to client (`import.meta.env`).
- `VITE_API_URL` is **baked at build time** — changing it needs `pnpm build` / Vercel redeploy.
- Client reads it as `API_BASE` in `frontend/src/lib/utils.js` → `frontend/src/api/client.js` `baseURL`.

## 2. Backend — `server/.env` / `server/.env.example`

| Variable | Required | Default | Where | Description |
|---|---|---|---|---|
| `NODE_ENV` | Yes (prod) | `development` | Render → `production` | `production` enables `helmet`, `combined` logs, strict CORS, rate-limit 300, JWT fail-fast |
| `PORT` | No | `5000` | Render auto `10000` | Server listens on `process.env.PORT || 5000` with `0.0.0.0` |
| `MONGO_URI` | Yes (prod) | `mongodb://localhost:27017/ganesh_chaturthi` | Render Atlas | Mongo connection string. Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/ganesh_chaturthi?retryWrites=true&w=majority` |
| `JWT_SECRET` | Yes (prod) | fallback dev secret | Render | HS256 secret ≥32 chars. In prod, server exits if missing. Fallback `ganesh_bappa_morya_fallback...` only for dev with warning |
| `FRONTEND_URL` | Yes (prod) | `http://localhost:5173` | Render | Exact origin for CORS allowlist (no trailing slash). Must match Vercel prod URL |
| `ALLOWED_ORIGINS` | No | — | Render | Comma-separated extra origins: `https://a.vercel.app,https://b.vercel.app`. Merged with `FRONTEND_URL` + localhosts |
| `ADMIN_EMAIL` | No | `admin@ganeshutsav.com` | Render | Seeded admin email (`seed/seed.js`) |
| `ADMIN_PASSWORD` | No | `Admin@123` | Render | Seeded admin password (bcrypt-hashed). Change in prod! |

**Example `server/.env.example`:**
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ganesh_chaturthi
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ganesh_chaturthi?retryWrites=true&w=majority
JWT_SECRET=replace_with_super_secret_min_32_chars
ADMIN_EMAIL=admin@ganeshutsav.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:5173
# ALLOWED_ORIGINS=https://your-app.vercel.app
```

**CORS logic (`server/server.js`):**
- `!origin` (curl, health checks) → allow
- `*.vercel.app` → allow (preview deploys)
- `allowedOrigins.includes(origin)` → allow
- `!isProd` → allow all (dev convenience)
- `isProd && allowedOrigins.length===0` → warn + allow (so you don’t lock yourself out)
- else → `CORS blocked: <origin>` + 403

## 3. Configuration Files

| File | Purpose |
|---|---|
| `frontend/vite.config.js` | `defineConfig(({mode})=>loadEnv)`, `plugins: [react(), tailwindcss()]`, `server.proxy['/api'].target = VITE_PROXY_TARGET`, `preview` on 4173, `build.sourcemap false` |
| `frontend/vercel.json` | Vercel Vite preset, `rewrites` SPA fallback, `headers` immutable for `/assets/*` |
| `render.yaml` (root) | Render Blueprint: `rootDir: server`, `build: pnpm install --frozen-lockfile`, `start: pnpm start`, `healthCheckPath: /api/health` |
| `frontend/eslint.config.js` | `globals.browser`, `reactHooks` + `reactRefresh`, ignores `dist` |
| `server/nodemon.json` | Watch `.` `js,json` ignore `node_modules`, exec `node server.js` with `NODE_ENV=development` |
| `frontend/.nvmrc` | `20` |
| `server/config/db.js` | `mongoose.connect(MONGO_URI)` |

## 4. Secrets Management

- **Never** put real `MONGO_URI`/`JWT_SECRET` in repo, screenshots, or logs.
- Local: keep `server/.env` gitignored (see `.gitignore`).
- Render: set via Dashboard → Environment → sync `false` (encrypted at rest).
- Vercel: set `VITE_API_URL` via Project Settings → Environment Variables → Production.
- Rotation: see `SECURITY.md` and `OPERATIONS.md`.

## 5. Validation

Backend logs on start:
```
JWT_SECRET loaded | MONGO_URI loaded | ENV: production
```
If `ENV: production` + `JWT_SECRET` missing → process exits 1. If fallback used in dev → warning. `/api/health` returns `db: connected|disconnected` and `env`.
