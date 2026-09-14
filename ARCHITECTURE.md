# Architecture

## 1. Overview

`ganesh-chaturthi` is a two-tier festival platform:

- **Frontend (Vercel)** — React 19 SPA via Vite, Tailwind v4, GSAP/Framer/Lenis. No SSR. Talks to backend over HTTPS (`VITE_API_URL`).
- **Backend (Render)** — Express 5 REST API, Mongoose 8, JWT auth, MongoDB Atlas. Stateless, horizontally scalable, health-checked.

Split deployment removes the monolith coupling; frontend and backend scale and deploy independently.

```
Browser
  ├─ GET /  → Vercel CDN → frontend/dist/index.html → React hydrates
  └─ /api/* → fetch(VITE_API_URL/*) → Render → Express → Mongoose → Atlas
                                         ↘ fallback.js if API fails
```

Local dev: Vite proxies `/api` → `http://localhost:5000` (`vite.config.js` `loadEnv` + `VITE_PROXY_TARGET`).

---

## 2. Major Components

### 2.1 Frontend — `frontend/src`

- **App.jsx** — React Router: `/` (Home), `/gallery`, `/admin`, `/admin/dashboard` (guarded by `ganesh_token`).
- **Pages:**
  - `Home.jsx` — orchestrator: `Promise.allSettled` 7 resources, merges API data over fallback, bilingual toggle, smooth scroll (`useSmoothScroll` → Lenis), status banner.
  - `Gallery.jsx`, `AdminLogin.jsx`, `AdminDashboard.jsx` (9 tabs, CRUD).
- **Components (13):** `Navbar`, `Hero` (countdown to `Settings.startDate`), `AboutSection`, `ScheduleSection` (timeline/calendar, category filter), `PoojaTimings` (grid, `statusColor`), `AnnadanamSection`, `NimarjanamSection` (route + map embeds), `Promotions` (tier pills), `InvitationSection` (share/QR), `RegistrationSection` (5 types), `GallerySection`, `ContactSection`, `Footer`.
- **API layer `api/client.js`:**
  ```js
  baseURL = API_BASE = import.meta.env.VITE_API_URL || '/api'
  axios + Bearer token from localStorage
  ```
  Exports `getSettings`, `getPooja`/`patchPoojaStatus`, `getAnnadanam`, `getNimarjanam`/`updateNimarjanam`, `getPromotions`, `getGallery`, `getCommittee`, `getSchedule`, `submitRegistration`/`getRegistrations`, `login`/`me`, `health`.
- **Lib:** `utils.js` (`cn`, `API_BASE`, `formatDate`, `timeToMinutes`, `statusColor`); `i18n.js` (en/te translations, `useT`).
- **Data:** `data/fallback.js` — full demo dataset mirroring Atlas shape; used when `fetch` fails or returns empty.
- **Styling:** `index.css` + Tailwind v4 (`@tailwindcss/vite`), `postcss`, `autoprefixer`.

### 2.2 Backend — `server/`

- **Entry `server.js`:**
  - `dotenv.config()`, `NODE_ENV`, JWT fallback check (fail-fast in prod), `express()`, `trust proxy 1`.
  - Middleware: `helmet` (CSP off for inline Tailwind), `compression`, `morgan` (`combined` prod / `dev`), global `rateLimit` (300/15m prod, 1000 dev) on `/api/`, stricter `authLimiter` (20/15m) on `/api/auth`.
  - CORS allowlist: `FRONTEND_URL`, `ALLOWED_ORIGINS` (comma), `localhost:*`, `*.vercel.app`, `!origin` allowed, credentials true.
  - JSON limit 10mb, health routes (`/`, `/api`, `/api/health` with mongoose readyState, `/api/ping`), 10 REST routers, 404 splash, central error handler, graceful `SIGTERM/SIGINT` + `unhandledRejection`.
- **DB `config/db.js`:** `mongoose.connect(MONGO_URI || localhost)`; on error, logs and continues (frontend fallback).
- **Middleware `middleware/auth.js`:** `protect` verifies `Bearer` JWT via `JWT_SECRET`, `adminOnly` checks `role===admin`.
- **Models (10):**
  - `Settings` (singleton: festivalName, dates, hero\*, marquee, contacts)
  - `Pooja` (title, titleTelugu, time/endTime, dayLabel, category `nitya|special|aarti|abhishekam`, status `upcoming|live|completed|cancelled`, order, icon)
  - `Annadanam` (date, dayLabel, mealType, time, menu[], sponsor, expected/served, status `scheduled|preparing|serving|completed|cancelled`)
  - `Nimarjanam` (singleton: title, date, route[], mapEmbedUrl, liveLocationUrl, status `planned|procession|immersed|completed`, currentLocation)
  - `Promotion` (tier `title|platinum|gold|silver|community`, category `sponsor|partner|event|stall|promo`, isActive/isFeatured, order)
  - `Gallery` (category `ganesh|idols|making|pooja|annadanam|nimarjanam|crowd` etc, year, isFeatured)
  - `Committee` (name, role, phone, image, order)
  - `Schedule` (unified timeline: category `pran_pratishtha|daily_pooja|special_pooja|aarti|cultural|annadanam|nimajjanam|other`, isMainEvent, status, order)
  - `Registration` (type `volunteer|annadanam|event_participation|sponsorship|contact`, polymorphic fields, status)
  - `User` (bcrypt pre-save, `comparePassword`, role `admin|editor`)
- **Routes (10):** REST, `protect+adminOnly` on writes, public reads, `GET /api/registrations` admin-filtered, `POST /api/registrations` public with honeypot (`website` field) and validation.
- **Seed `seed/seed.js`:** idempotent `deleteMany` + `insertMany` for all collections + admin user.

---

## 3. Data Flow

### Public read

```
Home mount → useEffect → api.getSettings() … getSchedule() (parallel)
  → success: setState → sections re-render
  → failure/empty: keep fallback → banner "Demo mode"
```

Each section is pure: `data` prop → map → cards. No direct DB access.

### Admin write

```
Login POST /api/auth/login → {token, user} → localStorage
Dashboard load → GET /api/* (7) + GET /api/registrations (auth)
Edit → PUT /api/settings or POST /api/pooja etc. with Authorization → Mongoose save → refetch or optimistic update → public site next fetch sees new data
```

### Registration (public)

```
POST /api/registrations {type,name,phone,...} → validation → create → 201 {id}
Admin later GET /api/registrations?type=volunteer&status=pending → PUT /:id {status:'confirmed'}
```

---

## 4. Important Technical Decisions

| Decision                             | Rationale                                                                                  | Tradeoff                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Split Vercel+Render vs monolith      | Independent scaling, CDN for SPA, Render free tier for API, simpler CORS vs serving `dist` | Two deploys, env sync needed                                                                         |
| Fallback demo data                   | Always renders, good DX, survives Atlas cold start/outage                                  | Stale data risk; banner mitigates                                                                    |
| Vite proxy `/api`                    | Avoids CORS in dev, single `VITE_API_URL` switch                                           | Proxy target env needed                                                                              |
| JWT 7d, localStorage                 | Simple, no httpOnly cookie needed for SPA; 7d matches festival duration                    | XSS risk if script injection; mitigated by helmet CSP off but XSS still possible — keep deps updated |
| Helmet `contentSecurityPolicy:false` | Allows Vite inline styles + Tailwind                                                       | Slightly weaker CSP; ok for static festival site                                                     |
| Rate limits 300/15m + 20 auth        | Prevents brute force, abuse                                                                | May throttle legitimate bulk admin edits (rare)                                                      |
| CORS `*.vercel.app` wildcard         | Supports preview deploys automatically                                                     | Open to any Vercel preview of any project; limited by auth on writes                                 |
| Mongoose continue-on-error           | Frontend still works without DB                                                            | API returns empty; fallback hides issue — monitor `/api/health` `dbCode`                             |
| `loadEnv` in vite.config             | Correctly reads `.env` in ESM context                                                      | Needs `mode` param                                                                                   |
| pnpm                                 | Fast, strict, Vercel/Render cache friendly                                                 | Requires `pnpm` on CI                                                                                |

---

## 5. Deployment Architecture

- **Vercel:** `vercel.json` → `framework: vite`, `build: pnpm build`, `output: dist`, rewrites `/(.*) → /index.html` (SPA), `Cache-Control: immutable` for `/assets/*`. Env `VITE_API_URL` injected at build time (must rebuild on change).
- **Render:** `render.yaml` at root → `rootDir: server`, `build: pnpm install --frozen-lockfile`, `start: pnpm start`, `healthCheckPath: /api/health`, `autoDeploy: false`. Env `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `ALLOWED_ORIGINS`, `ADMIN_*`. `PORT` auto-injected (10000).
- **DB:** Atlas `mongodb+srv://` with `retryWrites=true&w=majority`. Local `mongodb://localhost:27017/ganesh_chaturthi` for dev.

---

## 6. Non-Functional

- **Performance:** Vite chunk 1000kb warning limit, `compression` gzip, Vercel CDN immutable assets.
- **Observability:** `morgan combined`, `console.log` for JWT/MONGO load, `/api/health` + `/api/ping` for Render.
- **Resilience:** Graceful shutdown closes HTTP + mongoose, `unhandledRejection` logged not crashed, fallback data.
- **Security:** See `SECURITY.md`; CORS, helmet, rate-limit, bcrypt 10, JWT verify, honeypot.

---

## 7. Future Considerations

- Add httpOnly cookies + CSRF, pagination for Gallery/Registrations (currently limit 500), S3 for image uploads (currently URL strings), i18n Hindi, Playwright e2e, OpenAPI spec generation.
