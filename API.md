# API Reference

Base URL: `https://<api>.onrender.com` locally `http://localhost:5000`

Frontend uses `VITE_API_URL` (`/api` local, `https://<api>.onrender.com/api` prod) via `frontend/src/api/client.js` (`axios`, `baseURL: API_BASE`, `Authorization: Bearer <token>` from `localStorage.ganesh_token`, timeout 8s).

All JSON. CORS allowlist (see CONFIGURATION.md). Rate-limit: 300/15m global, 20/15m for `/api/auth`.

---

## Health

### `GET /` and `GET /api`

```json
{
  "message": "Ganesh Chaturthi API — Ganpati Bappa Morya!",
  "version": "1.0.0",
  "env": "production",
  "uptime": 1234.56,
  "endpoints": ["/api/auth","/api/settings","/api/pooja", "..."]
}
```

### `GET /api/health`

```bash
curl https://<api>.onrender.com/api/health
```
```json
{
  "status": "ok",
  "env": "production",
  "db": "connected",
  "dbCode": 1,
  "uptime": 123.45,
  "time": "2026-09-14T12:00:00.000Z",
  "version": "1.0.0"
}
```
`dbCode`: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting.

### `GET /api/ping`

```json
{ "pong": true, "time": 1726310400000 }
```
Lightweight — use for Render keep-alive / UptimeRobot.

---

## Auth

### `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ganeshutsav.com","password":"Admin@123"}'
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "Super Admin", "email": "admin@ganeshutsav.com", "role": "admin" }
}
```
Errors: `401 {message:"Invalid credentials"}`

### `POST /api/auth/register`

Only allowed when no users exist (first admin). Otherwise `403 {message:"Registration closed..."}`.

### `GET /api/auth/me`

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me
```
```json
{ "_id":"...", "name":"Super Admin", "email":"admin@ganeshutsav.com", "role":"admin" }
```
Errors: `401 {message:"No token"}` / `401 {message:"Invalid token"}`

Header: `Authorization: Bearer <JWT>` (7d expiry, HS256 `JWT_SECRET`).

---

## Settings (singleton)

### `GET /api/settings`

Public. Creates default if none.

```json
{
  "_id":"...",
  "festivalName":"Khairatabad Ganesh Utsav 2026",
  "tagline":"70 Years of Divine Legacy — Bappa is Coming",
  "venue":"Khairatabad, Hyderabad, Telangana",
  "startDate":"2026-09-14T00:00:00.000Z",
  "endDate":"2026-09-24T00:00:00.000Z",
  "nimarjanamDate":"2026-09-24T00:00:00.000Z",
  "heroTitle":"॥ Ganpati Bappa Morya ॥",
  "heroSubtitle":"70 Feet Maha Ganesh — Ekadasha Rudra Avatar",
  "announcement":"✨ Laddu Prasadam Auction Sep 20 • Free Annadanam Daily 12PM • Cultural Programs Daily ✨",
  "marqueeText":"✦ Ganpati Bappa Morya ✦ ...",
  "contactPhone":"+91 98765 43210",
  "contactEmail":"info@khairatabadganesh.com"
}
```

### `PUT /api/settings` 🔒 admin

```bash
curl -X PUT http://localhost:5000/api/settings \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"announcement":"Updated!"}'
```
Returns updated settings.

---

## Pooja

### `GET /api/pooja` — public

```json
[
  { "_id":"...", "title":"Suprabhata Seva", "titleTelugu":"సుప్రభాత సేవ", "time":"05:30 AM", "endTime":"06:00 AM", "dayLabel":"Daily", "category":"nitya", "status":"upcoming", "order":1, "icon":"🌅", "isSpecial":false }
]
```
Sort: `order, time`.

### `POST /api/pooja` 🔒 admin

```json
{ "title":"New Pooja", "time":"06:00 AM", "category":"nitya", "dayLabel":"Daily", "description":"...", "icon":"🪔", "status":"upcoming" }
```

### `PUT /api/pooja/:id` 🔒 admin

### `DELETE /api/pooja/:id` 🔒 admin

### `PATCH /api/pooja/:id/status` 🔒 admin

```bash
curl -X PATCH http://localhost:5000/api/pooja/<id>/status \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"live"}'
```
`status`: `upcoming|live|completed|cancelled`.

---

## Annadanam

### `GET /api/annadanam` — public (sort `date, time`)
### `POST /api/annadanam` 🔒 admin
### `PUT /api/annadanam/:id` 🔒 admin
### `DELETE /api/annadanam/:id` 🔒 admin

Payload: `{date, dayLabel, mealType:"lunch", time, menu:[], sponsor, expectedCount, servedCount, status, isTodaySpecial, venue }`

`status`: `scheduled|preparing|serving|completed|cancelled`.

---

## Nimarjanam (singleton)

### `GET /api/nimarjanam` — public (creates default if none)

```json
{
  "title":"Maha Nimarjanam — Hussain Sagar",
  "date":"2026-09-24T00:00:00.000Z",
  "route":["Khairatabad Temple","Raj Bhavan Road","NTR Gardens","Tank Bund","Hussain Sagar - Crane #3"],
  "status":"planned",
  "currentLocation":"Khairatabad Mandapam",
  "expectedCrowd":"15+ Lakhs",
  "mapEmbedUrl":"https://www.google.com/maps/embed?...",
  "liveLocationUrl":"https://share.google/...",
  "startTime":"05:00 AM"
}
```

### `PUT /api/nimarjanam` 🔒 admin — upsert singleton.

`status`: `planned|preparing|procession|immersed|completed`.

---

## Promotions

### `GET /api/promotions?active=true` — public

Query `active=true` filters `isActive=true`. Sort `order, createdAt desc`.

```json
[{ "title":"Title Sponsor — Gold Winner", "brand":"Malabar Gold & Diamonds", "category":"sponsor", "tier":"title", "image":"https://...", "offer":"Free Gold Coin...", "isFeatured":true, "isActive":true, "order":1 }]
```
`category`: `sponsor|partner|event|stall|promo`; `tier`: `title|platinum|gold|silver|community`.

### `POST /api/promotions` 🔒 admin
### `PUT /api/promotions/:id` 🔒 admin
### `DELETE /api/promotions/:id` 🔒 admin

---

## Gallery

### `GET /api/gallery` — public (sort `createdAt desc`)

```json
[{ "title":"70ft Idol", "imageUrl":"https://...", "category":"idols", "year":2026, "isFeatured":true }]
```
`category`: `darshan|pooja|nimarjanam|annadanam|making|crowd|ganesh|idols`.

### `POST /api/gallery` 🔒 admin — `{title, imageUrl (required), category, year, isFeatured}`
### `DELETE /api/gallery/:id` 🔒 admin

---

## Committee

### `GET /api/committee` — public (sort `order`)
### `POST /api/committee` 🔒 admin — `{name, role, phone, image, order}`
### `PUT /api/committee/:id` 🔒 admin
### `DELETE /api/committee/:id` 🔒 admin

---

## Schedule (unified timeline)

### `GET /api/schedule` — public (sort `date, order, time`)
### `POST /api/schedule` 🔒 admin
### `PUT /api/schedule/:id` 🔒 admin
### `DELETE /api/schedule/:id` 🔒 admin
### `PATCH /api/schedule/:id/status` 🔒 admin

Payload: `{date, time, title, titleTelugu, description, category, icon, venue, isMainEvent, status, order}`

`category`: `pran_pratishtha|daily_pooja|special_pooja|aarti|cultural|annadanam|nimajjanam|other`

---

## Registrations

### `POST /api/registrations` — public (honeypot `website` must be empty)

Types (`type` required): `volunteer | annadanam | event_participation | sponsorship | contact`

```bash
# volunteer
curl -X POST http://localhost:5000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "type":"volunteer",
    "name":"Ravi",
    "phone":"+919876543210",
    "email":"ravi@example.com",
    "volunteerActivity":"crowd_management",
    "availableDates":["2026-09-14","2026-09-15"],
    "participants":1,
    "message":"Happy to serve"
  }'

# success
{ "message":"Registration received", "id":"..." }
```
Errors: `400 {message:"Name, phone and type are required"}` or `400 {message:"Invalid"}` (honeypot).

### `GET /api/registrations?type=volunteer&status=pending` 🔒 admin (limit 500, sort new first)
### `GET /api/registrations/counts` — public counts by type

```json
[{ "_id":"volunteer", "count":12 }, { "_id":"sponsorship", "count":3 }]
```

### `PUT /api/registrations/:id` 🔒 admin — `{status, ...}`
`status`: `pending|contacted|confirmed|cancelled`

### `DELETE /api/registrations/:id` 🔒 admin

---

## Errors — Standard Shape

```json
// 401
{ "message":"Not authorized, no token" }
{ "message":"Not authorized, token failed" }
{ "message":"Invalid credentials" }
// 403
{ "message":"Admin only" }
{ "message":"CORS not allowed: https://evil.com" }
// 404
{ "message":"API route not found: /api/xyz" }
// 429
{ "message":"Too many requests, please try again later." }
{ "message":"Too many login attempts, try again after 15 minutes." }
// 500
{ "message":"Server Error", "stack":"..." } // stack only if NODE_ENV != production
```

In prod, stack is hidden; check Render logs.

---

## Auth Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Frontend stores as `ganesh_token`, `ganesh_user`. All `🔒 admin` routes need this.

See `frontend/src/api/client.js` for typed wrappers.
