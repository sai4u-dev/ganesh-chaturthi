# Deployment Guide

This repo uses **split deployment**: Frontend on **Vercel**, Backend on **Render**. No monolith.

## 1. Environments

| Env | Frontend URL | Backend URL | DB |
|---|---|---|---|
| Local | http://localhost:5173 | http://localhost:5000 | mongodb://localhost:27017/ganesh_chaturthi |
| Staging (optional) | https://<app>-staging.vercel.app | https://<api>-staging.onrender.com | Atlas staging cluster |
| Production | https://<app>.vercel.app | https://<api>.onrender.com | Atlas prod cluster |

`VITE_API_URL` is baked at **build time** — changing it requires a Vercel redeploy.

---

## 2. Build

**Frontend**
```bash
cd frontend
pnpm install --frozen-lockfile
pnpm build   # → dist/ (vite, sourcemap false, 1000kb chunk limit)
pnpm preview --host 0.0.0.0 --port 4173  # local prod preview
```

**Backend**
```bash
cd server
pnpm install --frozen-lockfile
node --check server.js
# no build step — plain Node
```

CI should run `pnpm lint` (frontend) and `node --check server.js`.

---

## 3. Deploy — Backend to Render

### 3.1 Blueprint (recommended)

Repo root has `render.yaml`:
```yaml
services:
  - type: web
    name: khairatabad-ganesh-api
    runtime: node
    region: singapore
    plan: free
    rootDir: server
    buildCommand: pnpm install --frozen-lockfile
    startCommand: pnpm start
    healthCheckPath: /api/health
    autoDeploy: false
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      # ... FRONTEND_URL, ALLOWED_ORIGINS, ADMIN_*
```

Steps:
1. Push to GitHub `main`.
2. Render → **New → Blueprint** → select repo → Apply (or **New → Web Service** manually: Root `server`, Build `pnpm install --frozen-lockfile`, Start `pnpm start`, Health `/api/health`).
3. In Render Dashboard → Environment, set:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ganesh_chaturthi?retryWrites=true&w=majority
   JWT_SECRET=<32+ random chars — e.g., openssl rand -base64 48>
   FRONTEND_URL=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ADMIN_EMAIL=admin@ganeshutsav.com
   ADMIN_PASSWORD=<strong>
   ```
   Render injects `PORT=10000` automatically — do **not** set it.
4. Deploy → logs should show:
   ```
   JWT_SECRET loaded | MONGO_URI loaded | ENV: production
   MongoDB Connected: cluster0...
   Server running on http://0.0.0.0:10000 [production]
   Health at http://localhost:10000/api/health
   ```
5. Seed once (via Render Shell or locally with Atlas URI):
   ```bash
   MONGO_URI=mongodb+srv://... pnpm --prefix server run seed
   # or in Render Shell:
   pnpm seed
   ```
6. Verify: `curl https://<api>.onrender.com/api/health` → `{"status":"ok","db":"connected"}`

### 3.2 Staging

Duplicate service as `khairatabad-ganesh-api-staging`, point `FRONTEND_URL` to staging Vercel, use staging Atlas DB. Keep `autoDeploy: false` and deploy via Render button.

---

## 4. Deploy — Frontend to Vercel

`frontend/vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{ "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }]
}
```

Steps:
1. Vercel → **New Project** → Import same repo.
2. Settings:
   - Framework Preset: Vite
   - Root Directory: `frontend` (if monorepo) **or** leave root and set Build `pnpm --prefix frontend build` etc. This repo uses `frontend/` as project root — set it in Vercel.
   - Build Command: `pnpm build`
   - Output: `dist`
   - Install: `pnpm install`
3. Environment Variables (Production):
   ```
   VITE_API_URL=https://khairatabad-ganesh-api.onrender.com/api
   ```
4. Deploy → Vercel builds `dist/` and serves SPA with fallback.
5. After both deploys: open `https://<app>.vercel.app/health`? Actually `https://<app>.vercel.app/admin` → login → verify writes hit Atlas.
6. Set `FRONTEND_URL` on Render to your new Vercel URL if not already, redeploy backend.

**Local prod test of split:**
```bash
# in frontend/.env.production or Vercel env:
VITE_API_URL=https://<api>.onrender.com/api
pnpm build && pnpm preview  # hit real Render
```

---

## 5. Rollback

**Vercel:**
- Dashboard → Deployments → previous successful → **Promote to Production** (instant).
- Or `vercel rollback` via CLI.

**Render:**
- Dashboard → Deploys → previous → **Rollback**.
- If DB migration seeded bad data: `mongosh $MONGO_URI` → restore dump or re-run `pnpm seed` (destructive — `deleteMany` first). For non-destructive, take `mongodump` before seed and `mongorestore` on rollback.

Keep `autoDeploy: false` so pushes don’t auto-promote.

---

## 6. CI/CD Suggestion

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm --prefix frontend install --frozen-lockfile
      - run: pnpm --prefix frontend run lint
      - run: pnpm --prefix frontend run build
      - run: pnpm --prefix server install --frozen-lockfile
      - run: node --check server/server.js
```

Vercel and Render handle CD after CI passes.

---

## 7. Checklist Before Production

- [ ] `JWT_SECRET` ≥32 chars, not default, rotated from `.env.example`
- [ ] `MONGO_URI` is Atlas `mongodb+srv://` with IP allowlist 0.0.0.0/0 (or Render IPs)
- [ ] `FRONTEND_URL` = exact Vercel prod URL (https, no trailing slash)
- [ ] `ALLOWED_ORIGINS` includes any preview domains if needed
- [ ] `VITE_API_URL` = `https://<render>/api` (no trailing slash beyond `/api`)
- [ ] `https://<render>/api/health` returns `connected`
- [ ] `https://<vercel>/admin` login works, edit Settings → refresh public site shows change
- [ ] `vercel.json` rewrites + asset headers active
- [ ] Seed run once, `ADMIN_PASSWORD` strong, not `Admin@123`
- [ ] Render `autoDeploy: false` if you want manual promotion
