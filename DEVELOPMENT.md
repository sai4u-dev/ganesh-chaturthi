# Development Guide

## 1. Prerequisites

- Node 20 (`cat frontend/.nvmrc`), pnpm 8+ (`npm -g pnpm`)
- MongoDB: local `mongod` or Atlas free cluster
- Git, VS Code (recommended)

Verify:
```bash
node -v # v20.x
pnpm -v # 8.x or 9.x
mongosh --eval "db.runCommand({ping:1})" # or Atlas compass
```

---

## 2. First-Time Setup

```bash
git clone https://github.com/sai4u-dev/ganesh-chaturthi.git && cd ganesh-chaturthi

# env
cp frontend/.env.example frontend/.env
cp server/.env.example server/.env
# then edit server/.env: MONGO_URI, JWT_SECRET (≥32 chars), FRONTEND_URL, ADMIN_*

# install
pnpm --prefix frontend install
pnpm --prefix server install

# db
mongod --dbpath /data/db --fork --logpath /tmp/mongod.log  # if local
pnpm --prefix server run seed

# run
pnpm --prefix server run dev    # :5000
pnpm --prefix frontend run dev  # :5173
```

Open `http://localhost:5173` and `http://localhost:5000/api/health`.

---

## 3. Running Locally

| Command | Where | What |
|---|---|---|
| `pnpm dev` | `frontend/` | Vite HMR on 5173, proxies `/api` → `VITE_PROXY_TARGET` or `http://localhost:5000` |
| `pnpm build && pnpm preview` | `frontend/` | Production build preview on 4173 — set `VITE_API_URL=https://<render>/api` to test prod API |
| `pnpm lint` | `frontend/` | ESLint (ignores `dist`) |
| `pnpm dev` | `server/` | Nodemon watch, `NODE_ENV=development`, logs `combined` vs `dev` |
| `pnpm start` | `server/` | Plain node, respects `PORT`/`MONGO_URI` |
| `pnpm seed` | `server/` | Re-creates demo collections + admin |

**Concurrent:** no root `dev:all` — run two terminals. If you want one: `npx concurrently "pnpm --prefix server run dev" "pnpm --prefix frontend run dev"` (install `concurrently` separately).

Vite proxy: `frontend/vite.config.js` uses `loadEnv(mode)` → `VITE_PROXY_TARGET`. Override in `frontend/.env`:
```
VITE_PROXY_TARGET=http://localhost:5001
```

---

## 4. Project Conventions

- **JS only, ESM** (`"type":"module"` both packages).
- **Tailwind v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed; utilities in `frontend/src/index.css`.
- **i18n** — `frontend/src/lib/i18n.js` `translations[en|te]`, `useT(lang)(path)`. Add keys there, pass `t` prop.
- **API client** — always use `frontend/src/api/client.js` `api.*`; it injects `Bearer` from `localStorage.ganesh_token`.
- **Fallback** — edit `frontend/src/data/fallback.js` for offline demo content; `Home.jsx` merges API over fallback.
- **Commit style:** `feat:`, `fix:`, `docs:`, `chore:`.

---

## 5. Debugging

**Frontend:**
- Vite HMR not updating? Check `frontend/.env` syntax, restart `pnpm dev`.
- CORS error in console → backend `FRONTEND_URL` must include `http://localhost:5173` or run with `NODE_ENV=development` (allows all).
- API 401 → `localStorage.getItem('ganesh_token')` expired (7d) → re-login at `/admin`.

**Backend:**
- `MongoDB Error: connect ECONNREFUSED` → `mongod` not running or `MONGO_URI` wrong. Check `mongosh $MONGO_URI`.
- `JWT_SECRET must be set in production` → set `JWT_SECRET` in env or run with `NODE_ENV=development`.
- `CORS blocked: https://...` → add origin to `ALLOWED_ORIGINS` or `FRONTEND_URL` and restart.
- Use `curl -i http://localhost:5000/api/health` and `curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/settings`.

**Logs:** backend uses `morgan` + `console.log` for startup; frontend uses browser console + Vite overlay.

---

## 6. Testing (manual — no test suite yet)

```bash
# health
curl http://localhost:5000/api/health | jq
curl http://localhost:5000/api/ping | jq

# auth
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@ganeshutsav.com","password":"Admin@123"}'

# read
curl http://localhost:5000/api/pooja | jq '.[0]'

# write (needs token)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@ganeshutsav.com","password":"Admin@123"}' | jq -r .token)
curl -X PUT http://localhost:5000/api/settings -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"announcement":"Test from dev"}' | jq
```

Recommended: add Vitest + Supertest later; see Operations.

---

## 7. Contributing

1. Branch from `main`: `git checkout -b feat/pooja-filter`
2. Keep changes small, run `pnpm lint` in frontend.
3. Verify `pnpm build` in frontend and `node --check server.js` pass.
4. Update docs if env vars or routes change.
5. PR → review → squash merge. No direct `main` pushes.

**Code review checklist:**
- No secrets in diff (`git diff | grep -i jwt`).
- CORS/helmet unchanged unless needed.
- New route has `protect`/`adminOnly` if write.
- Fallback data updated if schema changes.

---

## 8. Useful Snippets

```bash
# nvm
nvm use 20

# fresh install
rm -rf frontend/node_modules server/node_modules && pnpm --prefix frontend install && pnpm --prefix server install

# reset db
mongosh ganesh_chaturthi --eval "db.dropDatabase()"
pnpm --prefix server run seed

# check ports
lsof -i :5000 -i :5173
kill -9 <pid>
```
