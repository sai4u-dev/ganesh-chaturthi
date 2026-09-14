# Runbook — When Production Breaks

## General

- Stay calm. `Render` + `Vercel` + `Atlas` — most issues are env/cold start.
- Keep a second terminal with `curl https://<api>.onrender.com/api/health -s | jq` running.

---

## 1. API Down / 5xx / Health Fails

**Symptoms:** `/api/health` timeout, 502/503, Render logs `MongoDB Error`, frontend “Demo mode”.

**Steps:**
1. `curl -v https://<api>.onrender.com/api/health` — check `env`, `db`, status.
2. Render Dashboard → Logs → last 50 lines. Look for `JWT_SECRET must be set`, `connect ECONNREFUSED`, `UnhandledRejection`.
3. If `db: disconnected` → Atlas → Network Access → ensure `0.0.0.0/0` or Render IPs allowed; check `MONGO_URI` typo (Atlas `?retryWrites` params).
4. If `Server running on 10000 [production]` not seen → Build failed → `pnpm install --frozen-lockfile` error → check `pnpm-lock.yaml` committed.
5. Restart: Render → Manual Deploy → Deploy latest commit.
6. If still down → `mongosh "$MONGO_URI" --eval "db.runCommand({ping:1})"` from local to isolate DB vs app.
7. Last resort: promote previous Render deploy (Deploys → Rollback).

**Mitigation:** frontend still serves via fallback; announce “Live updates paused” if needed.

---

## 2. Frontend Blank / 404 on Refresh

**Symptoms:** `/` loads but `/gallery` refresh 404, or white screen.

**Steps:**
1. `curl -I https://<app>.vercel.app/gallery` → should be 200 (rewrites). If 404 → `frontend/vercel.json` not deployed → redeploy Vercel.
2. Browser console → `Failed to fetch` → check `VITE_API_URL` in Vercel env (should be `https://<api>.onrender.com/api`, no trailing slash duplication).
3. `pnpm --prefix frontend run build` locally → check `dist/index.html` contains `src="/assets/..."`.
4. Vercel → Redeploy with **Clear cache**.

---

## 3. CORS Blocked

**Symptoms:** Browser console `⛔ CORS blocked: https://<app>.vercel.app`, API 403 `CORS not allowed`.

**Steps:**
1. Server logs show `CORS blocked: <origin>`.
2. Render → Environment → verify `FRONTEND_URL=https://<app>.vercel.app` (exact, https, no slash) and `ALLOWED_ORIGINS` includes it plus any preview URL.
3. `*.vercel.app` is wildcard-allowed — if custom domain (`khairatabadganesh.com`), must add to `ALLOWED_ORIGINS`.
4. After env change → Manual Deploy.
5. Temp hotfix (not for long): set `ALLOWED_ORIGINS` empty in non-prod? In prod, code warns and allows if `allowedOrigins.length===0` — but fix properly.

---

## 4. Login Fails (401 Invalid credentials)

**Steps:**
1. `curl -X POST https://<api>.onrender.com/api/auth/login -H "Content-Type: application/json" -d '{"email":"...","password":"..."}'`
2. If `Invalid credentials` → check Atlas `users` collection: `db.users.findOne({email:"admin@..."})` — compare `ADMIN_EMAIL` on Render vs DB.
3. Reset password:
   ```bash
   mongosh "$MONGO_URI" --eval 'db.users.deleteOne({email:"admin@ganeshutsav.com"})'
   # then re-seed locally with correct ADMIN_EMAIL/PASSWORD:
   ADMIN_EMAIL=admin@ganeshutsav.com ADMIN_PASSWORD=NewStrong123 MONGO_URI="mongodb+srv://..." pnpm --prefix server run seed
   ```
   Or direct bcrypt: `node -e "import bcrypt from 'bcryptjs'; bcrypt.hash('NewPass',10).then(h=>console.log(h))"` then `db.users.updateOne({email:"..."},{$set:{password:h}})`.
4. If `JWT_SECRET` changed, old tokens invalid → re-login.

---

## 5. DB Storage Full / Atlas Free Limit

**Symptoms:** `MongoServerError: free tier limit`, writes fail.

**Steps:**
1. Atlas → Metrics → Storage → check 512MB.
2. `mongosh` → `db.registrations.countDocuments()` and `db.gallery.countDocuments()`.
3. Archive old registrations:
   ```bash
   mongodump --uri="..." --collection=registrations --out=./archive
   mongosh "$MONGO_URI" --eval 'db.registrations.deleteMany({createdAt:{$lt: ISODate("2026-08-01")}})'
   ```
4. Consider TTL index: `db.registrations.createIndex({createdAt:1},{expireAfterSeconds: 7776000})` (90 days) — document first.
5. Upgrade Atlas tier if needed.

---

## 6. Rate Limit 429

**Symptoms:** `{"message":"Too many requests"}`.

**Steps:**
1. Check if abuse or legitimate bulk edit. Wait 15 min window.
2. If need immediate: Render → Shell → edit `server.js` `max: isProd ? 1000 : 300` temporarily and redeploy, or add IP to `skip` logic.
3. For auth 20/15m, advise admin to slow down.

---

## 7. Render Cold Start / Sleep

Free tier sleeps after 15m idle (30s wake).

**Mitigation:**
- UptimeRobot cron every 5m → `GET https://<api>.onrender.com/api/ping`.
- Or upgrade to Starter ($7/mo) for no sleep.

---

## 8. Vercel Build Fails

**Logs:** `pnpm build` error, `vite: command not found`.

**Steps:**
1. Check `pnpm-lock.yaml` committed, `frontend/package.json` `engines` ok.
2. Vercel settings: Root `frontend`, Build `pnpm build` — if using root, change to `pnpm --prefix frontend build`.
3. Clear cache redeploy.

---

## 9. Incident Template

```
Title: [INCIDENT] <brief> — 2026-09-14 12:30 IST
Impact: Public site / Admin / Registrations
Root: ...
Timeline:
  12:30 detected /api/health 500
  12:32 checked Render logs → Mongo disconnect
  12:35 fixed MONGO_URI, redeployed
  12:38 health green
Action items: ...
```

Postmortem → update `CHANGELOG.md` + `TROUBLESHOOTING.md`.

---

## 10. Emergency Contacts

- On-call dev: <your-phone>
- Atlas support / Vercel support / Render support
- Committee: `info@khairatabadganesh.com`, `+91 98765 43210`
