# Operations Guide — Day-to-Day Production

## 1. Health Checks (5 min daily)

```bash
# backend
curl -s https://<api>.onrender.com/api/health | jq
# expect: {"status":"ok","env":"production","db":"connected","dbCode":1,...}

curl -s https://<api>.onrender.com/api/ping | jq
# expect: {"pong":true}

# frontend
curl -I https://<app>.vercel.app | head -n 5
# expect 200, cache headers

# Atlas
# Atlas Dashboard → Metrics → Connections, Ops, Storage < thresholds
```

Vercel Analytics and Render Metrics → check 4xx/5xx spikes, p95 latency.

**Alert if:** `db: disconnected` OR `dbCode !=1` for >2 min OR `/api/health` 5xx.

---

## 2. Logs

**Render:** Dashboard → Service → Logs (live, 7 days retention free). Filter `CORS blocked`, `UnhandledRejection`, `MongoDB Error`.

**Vercel:** Dashboard → Deployments → Runtime Logs (frontend is static, so mostly build logs; client errors in browser console/Sentry if added).

**Local tail:**
```bash
# backend local
pnpm --prefix server run dev
# morgan dev logs + console.log for JWT/MONGO

# prod-like locally
NODE_ENV=production pnpm --prefix server run start
```

---

## 3. Content Updates (via Admin Dashboard)

- **Festival Settings** (`PUT /api/settings`): marquee, hero, dates, contacts. Changing `startDate` updates Hero countdown automatically.
- **Schedule/Pooja/Annadanam/Promotions/Gallery/Committee**: CRUD via tabs. `order` field controls sort; `status` drives UI color (`utils.js statusColor`).
- **Nimarjanam**: singleton `PUT /api/nimarjanam` — route array, `currentLocation`, `status` (`planned→procession→immersed→completed`), map URLs.
- **Registrations**: filter by `type`/`status`, update to `contacted|confirmed|cancelled`.

Always verify on public site after save (hard refresh `Ctrl+Shift+R`).

---

## 4. Backups

**Atlas:** Enable **Cloud Backup** or **Continuous Backup** → daily snapshot, PIT restore. For free tier (no backup), run manual:

```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ganesh_chaturthi" --out=./dump-$(date +%F)
# store in encrypted S3 / Drive
mongorestore --uri="..." --drop ./dump-2026-09-10
```

**Before seed or bulk delete:** `mongodump` first — `seed.js` does `deleteMany` (destructive).

---

## 5. Env Var Changes

Changing **Render** env → **Manual Deploy** → **Deploy latest commit** (free tier takes ~2 min, cold start).

Changing **Vercel** `VITE_API_URL` → **Redeploy** (since baked at build). Vercel → Deployments → Redeploy with existing build cache off if needed.

Document changes in PR and `CHANGELOG.md`.

---

## 6. Dependency Updates

```bash
pnpm --prefix frontend outdated
pnpm --prefix server outdated
pnpm --prefix frontend update --interactive
pnpm --prefix server update --interactive
# then:
pnpm --prefix frontend run build && pnpm --prefix frontend run lint
node --check server/server.js
```

Pin `engines.node >=18`. Test locally before deploying.

---

## 7. Scaling Notes

- **Free tier Render** sleeps after 15m idle (cold ~30s). Keep alive via `GET /api/ping` cron (e.g., UptimeRobot every 5m hitting `/api/health`).
- **Vercel** CDN auto-scales; `Cache-Control: immutable` for assets already set.
- DB: Atlas free 512MB — monitor `dbStats`. If >400MB, TTL old registrations or upgrade.

---

## 8. Access Control

- Admin credentials in Render `ADMIN_EMAIL/PASSWORD` → seed creates `User`. Change password via `POST /api/auth/register` is closed after first user; to add editors, insert directly in Atlas or add admin route.
- Rotate `ADMIN_PASSWORD` regularly; see `RUNBOOK.md`.

---

## 9. On-Call Cheat Sheet

| Symptom | Quick Check | Fix |
|---|---|---|
| Site shows Demo mode | `curl /api/health` db disconnected | Check Atlas IP allowlist, `MONGO_URI` |
| Login 401 | `curl /api/auth/login` | Verify `ADMIN_*`, reset via `mongosh` |
| CORS error | Browser console `CORS blocked` | Add origin to `ALLOWED_ORIGINS` on Render |
| 429 Too many requests | Logs `Too many requests` | Wait 15m, or raise `max` in `server.js` temporarily |
| Vercel 404 on `/gallery` | Hard refresh fails | Check `vercel.json` rewrites deployed |

Full triage → `RUNBOOK.md` / `TROUBLESHOOTING.md`.

---

## 10. Checklist — Weekly

- [ ] Health `db: connected`, uptime trending
- [ ] No `UnhandledRejection` in Render logs
- [ ] Registrations pending <48h → contact
- [ ] Atlas storage <80%
- [ ] Dependencies `pnpm outdated` reviewed
- [ ] Backup snapshot <7 days old
