# E-Cycle Platform — Claude Documentation

> Dibuat otomatis untuk menjaga konteks antar sesi. Update setiap kali ada perubahan besar.

---

## 🗂️ Struktur Project

```
E-Cycle-Platfrom/          ← root (typo intentional, sudah terlanjur)
├── frontend/              ← React + Vite SPA
│   ├── src/
│   │   ├── App.jsx              — router + LoadingScreen logic
│   │   ├── index.css            — design system utama (~1032 baris)
│   │   ├── main.jsx
│   │   ├── assets/
│   │   │   └── hero.png         — foto hero section
│   │   ├── components/
│   │   │   ├── Navbar.jsx       — sticky navbar + mobile hamburger menu
│   │   │   ├── Footer.jsx       — dark footer 4-kolom
│   │   │   ├── LoadingScreen.jsx — loading screen animasi + progress bar
│   │   │   └── ScrollReveal.jsx — wrapper animasi scroll (slideUp/fadeIn/scale/dll)
│   │   └── pages/
│   │       ├── Home.jsx         — hero + stats + feature cards + impact section
│   │       ├── DropPoints.jsx   — peta Leaflet + sidebar daftar lokasi
│   │       ├── Estimator.jsx    — form estimasi nilai perangkat
│   │       ├── Impact.jsx       — dashboard dampak lingkungan
│   │       └── PickupSchedule.jsx — form penjemputan + AI photo detection
│   ├── vercel.json              — SPA routing (rewrites ke /index.html)
│   └── .env.example             — template env vars
│
├── backend/               ← Express API (Node.js)
│   ├── server.js          — main server, routes, CORS, Prisma
│   ├── prisma/            — schema database
│   ├── vercel.json        — serverless deployment config
│   └── .env.example       — template DATABASE_URL, FRONTEND_URL, PORT
│
├── prisma/                ← root-level prisma config (legacy)
├── .env                   — DATABASE_URL local (gitignored)
├── .gitignore
└── README.md              — deployment guide lengkap
```

---

## 🛣️ Routes

| Path | Component | Keterangan |
|------|-----------|-----------|
| `/` | `Home` | Landing page |
| `/drop-points` | `DropPoints` | Peta e-waste + daftar lokasi |
| `/estimator` | `Estimator` | Form estimasi nilai perangkat |
| `/pickup` | `PickupSchedule` | Form jadwal penjemputan + AI |
| `/impact` | `Impact` | Dashboard dampak lingkungan |

---

## 🎨 Design System (`index.css`)

### CSS Variables
```css
--bg-color: #f7f4ea        /* latar belakang utama (cream) */
--bg-color-alt: #eeeadc    /* latar belakang alternatif */
--primary: #2ed371         /* hijau utama */
--primary-hover: #22c264
--primary-subtle: rgba(46, 211, 113, 0.1)
--text-main: #1a1a1a
--text-muted: #6b7280
--card-bg: #ffffff
--border-color: rgba(0,0,0,0.07)
--shadow-sm / --shadow-md / --shadow-lg / --shadow-green
--border-radius: 24px
--transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)
```

### Komponen CSS Utama
- `.container` — max-width 1200px, centered
- `.pill-btn` / `.pill-btn.outline` / `.pill-btn.light` — tombol utama
- `.icon-btn` — tombol ikon bulat 40px
- `.card` / `.card.highlight` — kartu konten
- `.tag-badge` — label kategori hijau kecil
- `.cards-grid` — 3-kolom grid (responsive)
- `.navbar` / `.hamburger-btn` / `.mobile-menu` / `.mobile-menu-backdrop`
- `.droppoints-layout` — sidebar + map split layout
- `.device-type-grid` — 3-kolom grid untuk estimator
- `.impact-section` / `.impact-number`
- `.footer` / `.footer-content` / `.footer-bottom`
- `.hover-highlight` — hover state untuk list items
- Animations: `fadeIn`, `slideUpFade`, `slideLeftFade`, `slideRightFade`, `popIn`, `shimmer`

### Breakpoints
- `@media (max-width: 992px)` — tablet
- `@media (max-width: 768px)` — mobile (hamburger muncul)
- `@media (max-width: 480px)` — small mobile
- `@media (max-width: 400px)` — iPhone SE

---

## 🧩 Komponen Penting

### Navbar (`Navbar.jsx`)
- Sticky top, z-index 200
- Desktop: logo + nav-links + phone btn + schedule btn
- Mobile: logo + hamburger btn
- Hamburger state: scroll-lock (fixed body), backdrop (z-index 190), slide-down menu (z-index 195)
- Close: backdrop click, Escape key, route change
- **CRITICAL**: `pointer-events: none` pada backdrop dan menu saat tertutup agar tidak memblokir klik

### LoadingScreen (`LoadingScreen.jsx`)
- Muncul saat pertama kali app di-load
- Duration 1800ms dengan easing cubic (1 - (1-x)^3)
- Logo + progress bar + dots animation
- Fade out setelah selesai, `onFinish()` callback ke App.jsx

### ScrollReveal (`ScrollReveal.jsx`)
- Menggunakan IntersectionObserver
- Props: `animation` (slideUp/fadeIn/scale/slideLeft/slideRight), `delay`, `duration`, `threshold`

### DropPoints (`DropPoints.jsx`)
- Fetch dari `/api/droppoints`, fallback ke dummy data
- Leaflet map dengan custom icon
- `MapUpdater` component untuk `flyTo` saat klik lokasi
- GPS geolocation + jarak real-time (haversine formula)
- Layout: `droppoints-layout` (1fr 2fr desktop → 1fr mobile)

### Estimator (`Estimator.jsx`)
- 3 device types: Smartphone, Laptop, TV/Monitor
- Pilih brand + kondisi → hitung estimasi lokal (bukan API)
- Formula: `baseValue × conditionMultiplier × 15000`
- Layout: 2-kolom (form | result), collapse ke 1-kolom di mobile

### PickupSchedule (`PickupSchedule.jsx`)
- AI Photo Detector: upload → Claude API → auto-fill form
- Form: name, phone, address, city, postalCode, date, time, deviceTypes, kondisi, notes, priority
- Submit ke `POST /api/pickups`
- Success state dengan detail konfirmasi
- Layout: 2-kolom (form | sidebar info)

---

## 🔌 API Endpoints (Backend)

| Method | Path | Keterangan |
|--------|------|-----------|
| GET | `/` | Info API |
| GET | `/health` | Health check |
| GET | `/api/droppoints` | List drop points dari DB |
| POST | `/api/pickups` | Simpan jadwal penjemputan |
| POST | `/api/estimate` | Mock estimasi nilai (belum dipakai frontend) |

---

## 🗄️ Database (PostgreSQL via Prisma)

### Tables
- `DropPoint` — id, name, address, latitude, longitude, operatingHours
- `submissions` — id, submission_code, user_id, method, devices_detail (JSON), user_notes
- `pickups` — id, submission_id, user_id, scheduled_date, scheduled_time_start, scheduled_time_end, pickup_address, pickup_city, notes, courier_name, courier_phone

---

## 🚀 Deployment

### Frontend (Vercel)
- Root dir: `frontend`
- Framework: Vite
- Env var: `VITE_API_URL` = URL backend

### Backend (Vercel)
- Root dir: `backend`
- Framework: Other
- Env vars: `DATABASE_URL`, `FRONTEND_URL`, `PORT`
- `vercel.json` mendelegasikan semua ke `server.js`

### CORS Setup
Backend membaca `FRONTEND_URL` env var untuk allowedOrigins.
Setelah frontend deploy → update `FRONTEND_URL` di backend Vercel → redeploy backend.

---

## ⚠️ Known Issues & Fixes Selesai

1. ✅ Hamburger menu memblokir klik saat tertutup → Fixed dengan `pointer-events: none` + `visibility: hidden`
2. ✅ Scroll-lock saat mobile menu buka → Fixed dengan `position: fixed` + save/restore `scrollY`
3. ✅ Debug log `DATABASE_URL` di server.js → Sudah dihapus
4. ✅ CORS terlalu longgar di backend → Fixed dengan allowedOrigins list
5. ✅ Tidak ada `vercel.json` di backend → Sudah dibuat

---

## 📝 History Sesi

### Sesi 1 (2026-05-04)
- Setup React + Vite frontend
- Setup Express + Prisma backend
- Koneksi ke Supabase/PostgreSQL
- Pembuatan halaman dasar

### Sesi 2 (2026-05-05~06)
- Modernisasi UI seluruh halaman
- Fix hamburger menu blocking interaction
- Implementasi scroll-lock mobile menu
- AI Photo Detection di PickupSchedule
- Persiapan deployment Vercel
- Dokumentasi README lengkap

### Sesi 3 (2026-05-06)
- Simpan dokumentasi ke `claude.md` ✅
- UI/UX overhaul menyeluruh ✅:
  - Rewrite `index.css` total dengan premium design system (CSS tokens, Inter font, better shadows)
  - `--primary` diubah dari `#2ed371` → `#22c55e` (lebih vibrant)
  - Navbar: scroll-shadow, underline active state, backdrop-filter glassmorphism
  - LoadingScreen: logo box dengan pulse+glow, tagline
  - Home: extracted ke constants array, bahasa Indonesia
  - Impact: metric icon circles, gradient dark CTA card, `metrics-grid-override` responsive
  - CSS responsive diperbaiki untuk semua breakpoint (400/700/768/992px)
  - Build berhasil `✓` tanpa error

### Sesi 4 (2026-05-06)
- **Navbar Premium Enhancement** ✅:
  - Dual scroll state: `navbar--scrolled` (solid glass) + `navbar--compact` (shrink padding)
  - Logo icon box dengan rotate animation on hover
  - `nav-link` refactor: background fill + animated underline bar
  - CTA button `nav-cta` hitam dengan multi-layer shadow
  - WhatsApp button `nav-wa-btn` → hover ke hijau WA + glow
  - Custom 3-line hamburger icon dengan animasi X (CSS spans)
  - Mobile: backdrop blur 5px, slide-down smooth 0.38s
  - Build `✓` tanpa error

- **AI Photo Detector — Root Cause Fix** ✅:
  - **Bug**: Frontend memanggil `api.anthropic.com` langsung → CORS block + no API key
  - **Fix**: Tambah endpoint `POST /api/ai/analyze` di backend sebagai secure proxy
  - Backend membaca `ANTHROPIC_API_KEY` dari env (tidak pernah expose ke frontend)
  - Validasi media type, strip markdown fences dari JSON response
  - Model diubah ke `claude-opus-4-5`
  - Tambah `ANTHROPIC_API_KEY=your_key_here` di `backend/.env`
  - **TODO**: Isi `ANTHROPIC_API_KEY` dengan API key asli dari console.anthropic.com
  - **TODO**: Rewrite `AIPhotoDetector` component agar fetch ke `${VITE_API_URL}/api/ai/analyze`

- **Deployment Notes**:
  - Backend `vercel.json` sudah ada — siap deploy
  - Setelah deploy backend, set `ANTHROPIC_API_KEY` di Vercel Dashboard → Environment Variables
  - Frontend `VITE_API_URL` harus diset ke URL backend production

### ⚠️ Pending Tasks
1. ~~Isi API Key~~ ✅ Done (`AIzaSyBepgJUeMoZY5DzE-NvKtcTpshJ0EmyZmg`)
2. ~~Rewrite AIPhotoDetector~~ ✅ Done — fetch ke `${apiUrl}/api/ai/analyze`
3. ~~Test AI flow~~ ✅ Done — Smartphone terdeteksi "Kondisi baik", confidence "tinggi"
4. **Deploy**: Push ke GitHub → deploy backend+frontend ke Vercel
   - Set `GEMINI_API_KEY` di Vercel backend environment variables

### Sesi 5 (2026-05-06) — AI Debugging Complete
- Root cause 1: Model `gemini-1.5-flash` → 404 (tidak tersedia di API key ini)
- Root cause 2: API key lama quota habis (429 Too Many Requests)  
- Root cause 3: JSON parsing gagal karena Gemini wrap extra text → fixed dengan regex `{...}` extraction
- **Fix**: Model diubah ke `gemini-flash-latest` → `gemini-2.0-flash` → `gemini-2.0-flash-lite` (fallback chain)
- **Fix**: New API key: `AIzaSyBepgJUeMoZY5DzE-NvKtcTpshJ0EmyZmg`
- **Fix**: JSON extraction pakai `.match(/\{[\s\S]*\}/)` sebagai fallback
- **Test**: Upload foto 4 smartphone → AI detect "Smartphone", "Kondisi baik", confidence "tinggi" ✅
- Build frontend `✓` tanpa error

