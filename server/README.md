# Backend — Khairatabad Ganesh Utsav 2026

Express 5 + Mongoose 8 REST API deployed on **Render** (MongoDB Atlas). API-only — frontend is on Vercel.

> **Repo:** `https://github.com/sai4u-dev/ganesh-chaturthi.git`
> ```bash
> git clone https://github.com/sai4u-dev/ganesh-chaturthi.git && cd ganesh-chaturthi/server
> ```

## Stack

- Node 20, Express 5, Mongoose 8, JWT + bcryptjs, cors, helmet, compression, morgan, express-rate-limit, dotenv
- pnpm 8+, nodemon for dev

## Scripts

```bash
pnpm install           # install
pnpm dev               # nodemon server.js on :5000 (NODE_ENV=development)
pnpm start             # node server.js (Render uses this)
pnpm seed              # node seed/seed.js — reseed demo data + admin
node --check server.js # syntax check
```

## Env

Copy `cp .env.example .env`:

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

Render sets `NODE_ENV=production`, injects `PORT=10000`, and requires `JWT_SECRET`, `MONGO_URI`, `FRONTEND_URL` via Dashboard. See root `CONFIGURATION.md`.

## Project Structure

```
server.js              # entry: helmet, cors, rate-limit, health, 10 routers, graceful shutdown
config/db.js           # mongoose.connect
middleware/auth.js     # protect + adminOnly (JWT)
models/                # Settings, Pooja, Annadanam, Nimarjanam, Promotion, Gallery, Committee, Schedule, Registration, User
routes/                # auth, settings, pooja, annadanam, nimarjanam, promotions, gallery, committee, schedule, registrations
seed/seed.js           # deleteMany + insertMany (7 poojas, 11 annadanam, etc.) + admin user
nodemon.json           # watch js,json
package.json
```

## API Summary

Base `http://localhost:5000` prod `https://<render>.onrender.com`.

- `GET /`, `GET /api` → message + endpoints
- `GET /api/health` → `{status, env, db, dbCode}` (Render healthCheckPath)
- `GET /api/ping` → `{pong}` (keep-alive)
- `POST /api/auth/login` → `{token, user}` ; `GET /api/auth/me` → user
- `GET /api/settings` `PUT /api/settings` (admin)
- `GET/POST/PUT/DELETE /api/pooja` + `PATCH /:id/status` ; `/api/annadanam` ; `/api/promotions?active=true` ; `/api/gallery` ; `/api/committee` ; `/api/schedule` (all admin writes)
- `GET /api/nimarjanam` `PUT /api/nimarjanam` (singleton)
- `POST /api/registrations` (public) `GET /api/registrations` (admin) `PUT/DELETE /:id`

Auth: `Authorization: Bearer <JWT>` 7d. Rate-limit 300/15m + 20/15m auth. See root `API.md` for payloads/examples.

## Deploy to Render

### Blueprint (root `render.yaml`)

```yaml
rootDir: server
buildCommand: pnpm install --frozen-lockfile
startCommand: pnpm start
healthCheckPath: /api/health
```

1. Push to GitHub, Render → **New → Blueprint** → select repo → Apply.
2. Set env vars in Dashboard: `NODE_ENV=production`, `MONGO_URI` (Atlas), `JWT_SECRET`, `FRONTEND_URL` (Vercel URL), optional `ALLOWED_ORIGINS`, `ADMIN_*`.
3. Deploy → logs `Server running on 0.0.0.0:10000 [production]` + `MongoDB Connected`.
4. Seed once: `MONGO_URI=... pnpm seed` via Render Shell or local.
5. Verify `curl https://<render>/api/health`.

See root `DEPLOYMENT.md` for full steps, staging, rollback, and `OPERATIONS.md` for day-to-day.

## Health & Ops

```bash
curl http://localhost:5000/api/health | jq
curl http://localhost:5000/api/ping | jq
```

- Logs: `morgan combined` in prod, `dev` in development.
- CORS: allowlist `FRONTEND_URL` + `ALLOWED_ORIGINS` + `*.vercel.app` + `!origin`.
- Graceful shutdown: `SIGTERM/SIGINT` closes HTTP + mongoose.

See root `RUNBOOK.md` / `TROUBLESHOOTING.md` for incidents.

## Security

- JWT fail-fast if `JWT_SECRET` missing in prod.
- bcrypt cost 10, honeypot `website` field on registrations.
- `helmet` (CSP off for inline Tailwind), `express-rate-limit`.

See root `SECURITY.md` for reporting and rotation.
