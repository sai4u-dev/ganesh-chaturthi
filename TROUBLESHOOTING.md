# Troubleshooting — Common Errors & Solutions

## Frontend

| Error | Cause | Fix |
|---|---|---|
| `Vite proxy 504` on `/api/*` | Backend not running or `VITE_PROXY_TARGET` wrong | `curl http://localhost:5000/api/health`; set `VITE_PROXY_TARGET=http://localhost:5000` in `frontend/.env`, restart `pnpm dev` |
| `Network Error` / `ERR_CONNECTION_REFUSED` | `VITE_API_URL` points to wrong host | Local: `VITE_API_URL=/api`; Vercel: `https://<render>.onrender.com/api` (check Vercel env, redeploy) |
| Blank page, console `Uncaught ReferenceError: process is not defined` | Using `process.env` in Vite client code | Use `import.meta.env.VITE_API_URL` (already via `lib/utils.js`) |
| `404 on refresh /gallery` | Missing SPA fallback | Ensure `frontend/vercel.json` has `"rewrites":[{"source":"/(.*)","destination":"/index.html"}]` and redeploy |
| `ganesh_token` 401 after 7d | JWT expired | Re-login at `/admin`; token stored in localStorage, no refresh |
| Images not loading (Unsplash 403) | Hotlink blocked | Replace with your own CDN/S3 URLs in Admin → Gallery/Promotions |
| `pnpm build` fails `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` | CI env not set | `CI=true pnpm build` or `pnpm config set confirmModulesPurge false` |
| ESLint `reactHooks/rules-of-hooks` error | Hook called conditionally | Move hook above `if` / `return` |

## Backend

| Error | Cause | Fix |
|---|---|---|
| `JWT_SECRET must be set in production` + exit 1 | `JWT_SECRET` not set on Render with `NODE_ENV=production` | Set `JWT_SECRET` (≥32 chars) in Render Dashboard → redeploy |
| `MongoDB Error: authentication failed` | Wrong Atlas user/pass or `MONGO_URI` typo | `mongosh "mongodb+srv://user:pass@cluster..."` test; fix `MONGO_URI` |
| `MongoServerError: IP not whitelisted` | Atlas Network Access blocks Render | Atlas → Network Access → Add `0.0.0.0/0` or Render outbound IPs |
| `CORS not allowed: https://...` + 403 | `FRONTEND_URL`/`ALLOWED_ORIGINS` mismatch | Set `FRONTEND_URL=https://<vercel>.vercel.app` (no slash), add custom domain to `ALLOWED_ORIGINS`, redeploy |
| `Too many requests, please try again later.` (429) | Global `apiLimiter` 300/15m hit | Wait, or raise `max` in `server.js` |
| `Too many login attempts` (429) | `authLimiter` 20/15m | Wait 15m, use correct credentials |
| `API route not found: /api/xyz` (404) | Typo or missing route | Check `server/server.js` routers, `curl /api` lists endpoints |
| `Not authorized, no token` (401) | Missing `Authorization: Bearer <token>` | Login again, set header; `api/client.js` does automatically |
| `Admin only` (403) | JWT role not `admin` | Check `db.users.findOne({email})` → `role: "admin"` |
| `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` | Local `mongod` not running | `mongod --dbpath /data/db` or use Atlas URI |
| `EADDRINUSE: address already in use :::5000` | Port 5000 taken | `lsof -i :5000; kill -9 <pid>` or `PORT=5001 pnpm dev` |

## Seed / DB

| Error | Cause | Fix |
|---|---|---|
| `seed` creates duplicates | Ran twice without `deleteMany` | Expected — `seed.js` does `deleteMany` then `insertMany`; run once |
| `E11000 duplicate key email` | Admin already exists | `db.users.deleteMany({})` then `pnpm seed` or change `ADMIN_EMAIL` |
| `ValidationError: Promotion validation failed` | Missing required field on create | Check `models/Promotion.js` schema — `title` required, `tier` enum etc. |

## Deployment

| Error | Cause | Fix |
|---|---|---|
| Render build `pnpm: command not found` | Render runtime `node` but pnpm not preinstalled | `buildCommand: npm install -g pnpm && pnpm install --frozen-lockfile` or switch to `npm install` |
| Vercel build `sh: vite: not found` | `node_modules` cache miss | Vercel → Redeploy → Clear cache; ensure `pnpm-lock.yaml` committed |
| Vercel shows old `VITE_API_URL` | Env changed but not rebuilt | Vercel → Redeploy (env baked at build) |
| `dist` not found on Vercel | `outputDirectory` wrong | `frontend/vercel.json` → `dist`, ensure `frontend/package.json` `build: vite build` |
| Render health check fails | `healthCheckPath` 404 | Must be `/api/health` (exists in `server.js`); check logs for `Server running on ...` |

## Quick Diagnostics

```bash
# frontend health
curl -s https://<vercel>.vercel.app/api/health || echo "frontend is static, use backend url"

# backend health
curl -s https://<render>.onrender.com/api/health | jq
curl -s https://<render>.onrender.com/api/ping | jq

# auth
curl -s -X POST https://<render>.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ganeshutsav.com","password":"Admin@123"}' | jq

# CORS check (browser-like)
curl -s -H "Origin: https://<vercel>.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS https://<render>.onrender.com/api/health -i | head -n 20

# local
curl http://localhost:5000/api/health | jq
curl http://localhost:5173 -I | head -n 10
lsof -i :5000 -i :5173
```

If still stuck, see `RUNBOOK.md` or open an issue with logs + `curl -v` output.
