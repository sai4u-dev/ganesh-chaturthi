# Changelog

All notable user-facing changes in `ganesh-chaturthi` (Khairatabad Ganesh Utsav).

Format follows Keep a Changelog + SemVer. Dates in IST (Asia/Kolkata).

---

## [1.0.0] — 2026-09-14

**Production-ready split deployment (Vercel + Render)**

### Added
- Frontend: React 19 + Vite, Tailwind v4, GSAP/ScrollTrigger + Lenis + Framer Motion, bilingual EN/TE, responsive sections: Hero (countdown), About, Schedule (timeline/calendar), PoojaTimings grid, Annadanam cards, Nimarjanam route+maps, Promotions tiers, Invitation share (WhatsApp/QR), Registration (5 types), Gallery (filters+lightbox), Committee, Contact, Footer, Navbar.
- Backend: Express 5 + Mongoose 8 REST API — 10 models (Settings, Pooja, Annadanam, Nimarjanam, Promotion, Gallery, Committee, Schedule, Registration, User), 10 route groups, JWT auth (7d), bcrypt, helmet, compression, morgan, rate-limit, CORS allowlist, health `/api/health` + `/api/ping`, graceful shutdown.
- Seed script with 70th-year demo data (7 poojas, 11 annadanam days, 5 promotions, 9 gallery, 4 committee, unified schedule).
- Fallback demo data so public site always renders (`fallback.js` + `Promise.allSettled` in `Home.jsx`).
- Admin dashboard (`/admin`) with 9 tabs, CRUD, status patches.
- Deploy: `frontend/vercel.json` (SPA rewrites, immutable assets), root `render.yaml` (Render Blueprint, `rootDir: server`, health check), env examples for both.
- Docs: README + 10 guides (ARCHITECTURE, DEVELOPMENT, DEPLOYMENT, CONFIGURATION, OPERATIONS, RUNBOOK, TROUBLESHOOTING, SECURITY, API, CHANGELOG) + sub-readmes + placeholder screenshots.

### Changed
- `frontend/package.json` scripts simplified to `dev/build/preview/lint`; removed `concurrently`/`nodemon` (frontend-only). `vite.config.js` now uses `loadEnv` for correct proxy `VITE_PROXY_TARGET`.
- `server/package.json` scripts to `dev/start/seed` (removed `start:prod` NODE_ENV prefix — Render sets env), removed `concurrently` from devDeps, added `engines.node >=18`.
- `server/server.js` cleaned for split deploy: removed `dist` static serving + `fs`/`path` hasFrontend logic; now API-only (`/` returns JSON). Simplified `dotenv.config()` and logs.
- `vercel.json` trimmed to essentials (framework vite, build, output, rewrites, headers).
- `render.yaml` moved from `frontend/` to repo root; `rootDir: server` correct for Blueprint.
- Removed `frontend/nodemon.json` + `dist` + `.vite` artifacts; cleaned `eslint.config.js` server override.

### Fixed
- `vite.config.js` proxy now respects `VITE_PROXY_TARGET` via `loadEnv` (was `process.env.VITE_PROXY_TARGET` unreliable in ESM).
- `server/.env` JWT quoting bug (`"secret"` → `secret`) and missing `NODE_ENV`.

---

## [0.0.0] — Pre-release

- Initial scaffold with concurrent dev, monolith `dist` serving, demo routes.

---

### How to update this file

- On each PR, add an entry under `## [Unreleased]` then move to version on release.
- Use `Added | Changed | Fixed | Removed | Security` subsections.

[1.0.0]: https://github.com/sai4u-dev/ganesh-chaturthi/releases/tag/v1.0.0
[Unreleased]: https://github.com/sai4u-dev/ganesh-chaturthi/compare/v1.0.0...HEAD
