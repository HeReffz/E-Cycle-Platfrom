# E-Cycle Platform

Platform e-waste management modern dengan fitur:
- 🗺️ **Drop Point Finder** — Peta interaktif lokasi pengumpulan e-waste
- 🤖 **AI-Powered Estimator** — Estimasi nilai perangkat bekas
- 📦 **Pickup Scheduling** — Jadwalkan penjemputan langsung ke rumah (dengan AI photo detection)
- 🌱 **Impact Dashboard** — Pantau dampak lingkungan dari daur ulang

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL (via Prisma ORM) |
| AI Feature | Claude API (Anthropic) |
| Maps | Leaflet.js |

---

## 🚀 Deployment ke Vercel

### 1. Deploy Backend

1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project** → Import repo
3. **Root Directory**: `backend`
4. **Framework**: Other (Node.js)
5. Tambahkan **Environment Variables**:
   - `DATABASE_URL` = connection string PostgreSQL/Supabase kamu
   - `FRONTEND_URL` = URL frontend setelah di-deploy (isi setelah deploy frontend)
6. **Deploy** → Catat URL backend (contoh: `https://e-cycle-backend.vercel.app`)

### 2. Deploy Frontend

1. **New Project** → Import repo yang sama
2. **Root Directory**: `frontend`
3. **Framework**: Vite
4. Tambahkan **Environment Variables**:
   - `VITE_API_URL` = URL backend dari langkah 1
5. **Deploy** → ✅ Frontend live!

### 3. Update CORS Backend

Setelah frontend deployed, kembali ke project backend di Vercel:
- Settings → Environment Variables
- Update `FRONTEND_URL` dengan URL frontend yang sebenarnya
- **Redeploy** backend

---

## 🛠️ Development Lokal

### Prerequisites
- Node.js 18+
- PostgreSQL (atau Supabase account)

### Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: set VITE_API_URL=http://localhost:5000
npm run dev
```

### Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: isi DATABASE_URL dengan connection string database kamu
npm run dev
```

### Database Setup
```bash
cd backend
npx prisma generate
npx prisma db push   # atau: npx prisma migrate dev
```

---

## 📁 Struktur Project

```
E-Cycle-Platform/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/   # Navbar, Footer, LoadingScreen, ScrollReveal
│   │   ├── pages/        # Home, DropPoints, Estimator, PickupSchedule, Impact
│   │   └── index.css     # Design system
│   └── vercel.json    # Vercel SPA routing config
│
└── backend/           # Express API
    ├── server.js      # Main server + API routes
    ├── prisma/        # Database schema
    └── vercel.json    # Vercel serverless config
```
