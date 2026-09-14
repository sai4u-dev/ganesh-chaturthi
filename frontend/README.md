# Frontend — Khairatabad Ganesh Utsav 2026

React 19 + Vite SPA deployed on **Vercel**. Talks to Render backend via `VITE_API_URL`.

> **Repo:** `https://github.com/sai4u-dev/ganesh-chaturthi.git`
> ```bash
> git clone https://github.com/sai4u-dev/ganesh-chaturthi.git && cd ganesh-chaturthi/frontend
> ```

## Stack

- React 19, React Router 7, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), GSAP 3 + ScrollTrigger, Framer Motion, Lenis, lucide-react, axios
- Node 20, pnpm 8+

## Scripts

```bash
pnpm install          # install
pnpm dev              # vite on http://localhost:5173 (proxies /api → :5000)
pnpm build            # vite build → dist/
pnpm preview          # preview on :4173
pnpm lint             # eslint
```

## Env

Copy `cp .env.example .env`:

```
VITE_API_URL=/api                            # local (Vite proxies)
# VITE_API_URL=https://<render>.onrender.com/api  # Vercel prod — set in Vercel dashboard
# VITE_PROXY_TARGET=http://localhost:5000    # optional override
```

`vite.config.js` uses `loadEnv(mode)` → `VITE_PROXY_TARGET` or `http://localhost:5000`.

## Project Structure

```
src/
  api/client.js         # axios baseURL = API_BASE, Bearer token
  components/           # Navbar, Hero, AboutSection, ScheduleSection, PoojaTimings, AnnadanamSection, NimarjanamSection, Promotions, InvitationSection, RegistrationSection, GallerySection, ContactSection, Footer
  pages/                # Home.jsx (fallback merge), Gallery.jsx, AdminLogin.jsx, AdminDashboard.jsx (9 tabs)
  data/fallback.js      # demo data if API offline
  lib/{utils,i18n}.js   # API_BASE, statusColor, translations en/te
  hooks/useSmoothScroll.js # Lenis
  assets/hero.png
  App.jsx, main.jsx, index.css
public/ favicon.svg, icons.svg
vercel.json  # SPA rewrites + immutable assets
vite.config.js
```

## Key Behaviors

- `Home.jsx` does `Promise.allSettled` for 7 resources; any fulfilled array replaces fallback, otherwise demo stays + banner “Demo mode”.
- `api/client.js` timeout 8s, injects `ganesh_token` from localStorage.
- `i18n.js` `useT(lang)` — add keys there for new languages.
- Bento/pill UI, grain, glass nav, marquee via Tailwind.

## Deploy to Vercel

1. Import repo, set **Root Directory = `frontend`** (monorepo).
2. Build `pnpm build`, Output `dist`, Framework `Vite`.
3. Env `VITE_API_URL=https://<render>.onrender.com/api`.
4. Deploy — `vercel.json` handles `/(.*) → /index.html` and `Cache-Control: immutable` for `/assets/*`.
5. Update Render `FRONTEND_URL` to your Vercel URL and redeploy backend.

See root `DEPLOYMENT.md` for full split-deploy walkthrough and `CONFIGURATION.md` for env details.

## Screenshots

Live captures (1920×1080, 9 images) in [`../screenshots/`](../screenshots/) mirrored in [`../docs/images/`](../docs/images/):

| Hero | About | Schedule |
| --- | --- | --- |
| ![Hero](../screenshots/01-hero.png) | ![About](../screenshots/02-about-the-utsav.png) | ![Schedule](../screenshots/02-schedule.png) |

| Pooja | Annadanam | Gallery |
| --- | --- | --- |
| ![Pooja](../screenshots/03-pooja.png) | ![Annadanam](../screenshots/04-annadanam.png) | ![Gallery](../screenshots/05-gallery.png) |

| Admin | Nimarjanam | Invitation |
| --- | --- | --- |
| ![Admin](../screenshots/06-admin.png) | ![Nimarjanam](../screenshots/07-maha-nimarjanam.png) | ![Invitation](../screenshots/08-digital-invitation.png) |

## Troubleshooting

- `404 on /gallery refresh` → check `vercel.json` rewrites.
- `CORS blocked` → check Render `FRONTEND_URL`/`ALLOWED_ORIGINS`.
- `Network Error` → check `VITE_API_URL` (Vercel needs full Render URL, local needs `/api`).

See root `TROUBLESHOOTING.md`.

