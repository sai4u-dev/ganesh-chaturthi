# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| `1.x` (main) | ✅ |
| `<1.0` | ❌ |

We support the latest `main` — please update before reporting.

---

## Security Practices — This Project

**Backend (`server/server.js`):**
- `helmet` (HSTS, XSS, noSniff, crossOriginResourcePolicy) — CSP off for Vite inline styles.
- `compression`, `morgan` (no sensitive body logging), `express-rate-limit` (300/15m global, 20/15m auth).
- `cors` allowlist (`FRONTEND_URL` + `ALLOWED_ORIGINS` + `*.vercel.app`), `trust proxy: 1` for Render.
- `express.json({limit:"10mb"})`, central error handler hides stack in prod (`isProd ? {} : {stack}`).
- `bcryptjs` cost 10, JWT 7d HS256 via `JWT_SECRET` (fail-fast if missing in prod), `protect` + `adminOnly` on all writes.
- Honeypot `website` field on `POST /api/registrations`.

**Frontend:**
- `axios` with `Bearer` from `localStorage`; no `httpOnly` cookie (SPA tradeoff — keep XSS low by updating deps).
- No `dangerouslySetInnerHTML` with user content; map embeds via `iframe` sanitized URL.

**Data:**
- No PII beyond `Registration` (name/phone/email). Store minimal, no payments.
- Atlas: use strong password, `0.0.0.0/0` only if needed; prefer Render IPs + rotation.

**Dependencies:**
- `pnpm audit`, `npm audit`, `dependabot` recommended. Keep `mongoose`, `express`, `jsonwebtoken`, `axios` updated.

**Secrets:**
- `.env` files are gitignored (see root + `frontend/.gitignore` + `server/.gitignore`). `.env.example` has placeholders only.
- Render/Vercel env vars are encrypted at rest. Rotate on leak.

---

## Reporting a Vulnerability

**Do NOT open a public issue.**

Email: **security@khairatabadganesh.com** (or `info@khairatabadganesh.com` if security@ not set) with:
- Description, impact, steps to reproduce, PoC (no exploit on prod), suggested fix, your contact.

We will:
1. Acknowledge within 48h.
2. Triage and fix, credit you if desired.
3. Release patch, note in `CHANGELOG.md` (without exploit details until users update).

**Scope:** `server/` auth/CORS/rate-limit, `frontend/` XSS via registrations/gallery, `seed` admin creation.

**Out of scope:** Unsplash image hotlink, free-tier Render cold start, Vercel 404 if misconfigured (see `TROUBLESHOOTING.md`).

---

## Secrets Rotation

If `JWT_SECRET`, `MONGO_URI`, or `ADMIN_PASSWORD` leaked:

1. Generate new `JWT_SECRET`: `openssl rand -base64 48`.
2. Update Render → Environment → new `JWT_SECRET` → Manual Deploy (all existing tokens invalid — users re-login).
3. Atlas → Database Access → edit user → new password → update `MONGO_URI` on Render → redeploy.
4. `ADMIN_PASSWORD`: `mongosh` → `db.users.updateOne({email:"admin@..."},{$set:{password: await bcrypt.hash("new",10)}})` or delete + `pnpm seed` with new env.
5. Vercel: rotate `VITE_API_URL` only if backend URL changed → redeploy.

Invalidate git history if secret committed: `git filter-repo` or BFG, then force push + rotate.

---

## Hardening Checklist (Production)

- [ ] `JWT_SECRET` ≥32 chars, random, not in repo
- [ ] `ADMIN_PASSWORD` strong, not `Admin@123`
- [ ] Atlas IP allowlist minimal, user least privilege
- [ ] `NODE_ENV=production`, `helmet` enabled
- [ ] CORS `FRONTEND_URL` exact, `ALLOWED_ORIGINS` minimal
- [ ] Rate limits at defaults, not disabled
- [ ] `pnpm audit` clean or triaged
- [ ] Logs contain no tokens or `MONGO_URI`
