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
| AI Feature | Gemini API (Google) |
| Maps | Leaflet.js |

---

## 🛠️ Cara Menjalankan Aplikasi Lokal (Step by Step)

### Prerequisites
Pastikan kamu sudah menginstall:
- [Node.js](https://nodejs.org/en/) (minimal versi 18)
- Database PostgreSQL (Disarankan menggunakan [Supabase](https://supabase.com/))
- Akun Google AI Studio untuk mendapatkan API Key Gemini

### 1. Clone Repository
```bash
git clone https://github.com/HeReffz/E-Cycle-Platfrom.git
cd E-Cycle-Platfrom
```

### 2. Setup Backend
Backend bertanggung jawab untuk API, koneksi database, dan memproses AI.
```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file environment (.env)
cp .env.example .env
```
Buka file `backend/.env` dan sesuaikan nilainya:
- `DATABASE_URL`: Connection string PostgreSQL dari Supabase kamu (harus ada `?pgbouncer=true` jika menggunakan Supabase)
- `DIRECT_URL`: Connection string PostgreSQL tanpa pgbouncer
- `GEMINI_API_KEY`: API Key dari [Google AI Studio](https://aistudio.google.com/)
- `PORT`: 5000
- `JWT_SECRET`: Secret key bebas (misalnya `supersecretkey`)

**Setup Database & Prisma:**
```bash
# Generate Prisma client
npx prisma generate

# Sinkronisasi schema ke database
npx prisma db push
```

**Jalankan Backend:**
```bash
npm run dev
```
*(Backend akan berjalan di `http://localhost:5000`)*

### 3. Setup Frontend
Frontend adalah antarmuka web yang dilihat oleh pengguna.
Buka terminal baru, biarkan terminal backend tetap berjalan.
```bash
# Masuk ke folder frontend dari root folder
cd frontend

# Install dependencies
npm install

# Buat file environment lokal
cp .env.example .env.local
```
Buka file `frontend/.env.local` dan set URL API backend:
```env
VITE_API_URL=http://localhost:5000
```

**Jalankan Frontend:**
```bash
npm run dev
```
*(Frontend akan berjalan di `http://localhost:5173`)*

Aplikasi E-Cycle siap digunakan di browser!

---

## 🚀 Deployment ke Vercel

### 1. Deploy Backend

1. Push kode ke GitHub.
2. Buka [vercel.com](https://vercel.com) → **Add New** → **Project** → Import repository `E-Cycle-Platfrom`.
3. Di bagian **Framework Preset**, pilih `Other` (untuk Node.js).
4. Di bagian **Root Directory**, pilih folder `backend`.
5. Buka dropdown **Environment Variables** dan tambahkan:
   - `DATABASE_URL` = (Connection string dari Supabase)
   - `DIRECT_URL` = (Connection string direct ke db)
   - `GEMINI_API_KEY` = (API key Gemini kamu)
   - `JWT_SECRET` = (Secret key kamu)
6. Klik **Deploy** → Tunggu sampai selesai dan catat URL backend kamu (misal: `https://e-cycle-backend.vercel.app`).

### 2. Deploy Frontend

1. Buka dashboard Vercel → **Add New** → **Project** → Import repository yang sama.
2. Di bagian **Framework Preset**, pilih `Vite`.
3. Di bagian **Root Directory**, pilih folder `frontend`.
4. Buka dropdown **Environment Variables** dan tambahkan:
   - `VITE_API_URL` = (Masukkan URL Backend yang didapat dari langkah sebelumnya, tanpa `/` di akhir, contoh: `https://e-cycle-backend.vercel.app`)
5. Klik **Deploy** → Aplikasi Frontend live!

### 3. Update CORS Backend
Agar frontend dan backend bisa berkomunikasi secara aman:
1. Kembali ke project backend di dashboard Vercel.
2. Buka **Settings** → **Environment Variables**.
3. Tambahkan variable baru:
   - `FRONTEND_URL` = (URL Frontend kamu, misal: `https://e-cycle-frontend.vercel.app`)
4. Buka menu **Deployments**, klik titik tiga di deployment terbaru, pilih **Redeploy**.

---

## 📁 Struktur Project

```
E-Cycle-Platform/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/   # UI Components (Navbar, LoadingScreen, etc)
│   │   ├── pages/        # Main Pages (Home, Dashboard, DropPoints, dll)
│   │   └── index.css     # Global styles & Design system
│   └── vercel.json       # Vercel SPA routing config
│
└── backend/           # Node.js + Express API
    ├── server.js      # Main server logic + API routes
    ├── prisma/        # Database schema models
    └── vercel.json    # Vercel serverless configuration
```
