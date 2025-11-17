# Sistem Penjadwalan Laboratorium

Sistem manajemen penjadwalan laboratorium berbasis web yang dibangun menggunakan Laravel dan React dengan Inertia.js. Aplikasi ini memudahkan pengelolaan jadwal laboratorium, booking ruangan, pertukaran jadwal antar dosen, dan monitoring aktivitas secara real-time.

## 🚀 Fitur Utama

### 📊 Dashboard & Monitoring
- Dashboard interaktif dengan statistik real-time
- Monitoring aktivitas dan notifikasi terbaru
- Tampilan kalender jadwal laboratorium

### 👥 Manajemen Pengguna
- Sistem autentikasi dengan Laravel Fortify
- Role-based access control (Super Admin, Admin, Dosen)
- Manajemen profil pengguna

### 📅 Penjadwalan
- **Jadwal Master**: Template jadwal untuk semester/tahun ajaran
- **Generate Jadwal**: Otomatis membuat jadwal berdasarkan template
- **Kalender Interaktif**: Visualisasi jadwal dalam bentuk kalender
- **Slot Waktu**: Pengaturan waktu sesi laboratorium

### 🔄 Tukar Jadwal
- Dosen dapat mengajukan pertukaran jadwal
- Notifikasi real-time untuk persetujuan
- Riwayat pertukaran jadwal
- Approval workflow untuk dosen mitra

### 🏢 Booking Laboratorium
- Sistem booking ruang laboratorium
- Pengecekan ketersediaan ruangan otomatis
- Approval workflow untuk admin
- Batalkan booking dengan mudah
- Dashboard admin untuk approve/reject booking

### 📝 Status Kehadiran
- Tandai dosen tidak hadir
- Update status sesi jadwal
- Riwayat kehadiran dosen

### 📢 Notifikasi & Activity Log
- Notifikasi real-time untuk semua aktivitas penting
- Activity log publik untuk transparansi
- Tandai notifikasi sebagai sudah dibaca

### 🗂️ Master Data
Kelola data master seperti:
- Tahun Ajaran
- Semester
- Kampus
- Laboratorium
- Program Studi
- Kelas
- Mata Kuliah
- Kelas Mata Kuliah
- Dosen

## 🛠️ Teknologi

### Backend
- **Laravel 12**: PHP Framework
- **Inertia.js**: Modern monolith approach
- **Laravel Fortify**: Authentication
- **SQLite/MySQL**: Database

### Frontend
- **React 19**: UI Library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **Vite**: Fast build tool

### UI Components
- Headless UI
- shadcn/ui components
- Next Themes (dark mode support)
- Sonner (toast notifications)
- AOS (Animate On Scroll)

## 📋 Prasyarat

Pastikan sistem Anda telah terinstall:

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM atau Yarn
- Database (SQLite/MySQL/PostgreSQL)

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd jadwal_lab
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### 3. Konfigurasi Environment

```bash
# Copy file environment
copy .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Konfigurasi Database

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=sqlite
# atau untuk MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=jadwal_lab
# DB_USERNAME=root
# DB_PASSWORD=
```

### 5. Migrasi Database

```bash
# Jalankan migrasi
php artisan migrate

# (Opsional) Jalankan seeder untuk data dummy
php artisan db:seed
```

### 6. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

## 🚀 Menjalankan Aplikasi

### Mode Development

#### Opsi 1: Menggunakan Composer Script (Recommended)
```bash
composer run dev
```

Ini akan menjalankan secara bersamaan:
- Laravel development server (port 8000)
- Queue worker
- Laravel Pail (log monitoring)
- Vite development server

#### Opsi 2: Manual

Terminal 1 - Laravel Server:
```bash
php artisan serve
```

Terminal 2 - Vite Dev Server:
```bash
npm run dev
```

Terminal 3 - Queue Worker (opsional):
```bash
php artisan queue:work
```

### Mode Production

```bash
# Build assets untuk production
npm run build

# Jalankan dengan web server (Apache/Nginx)
# atau menggunakan Laravel's built-in server
php artisan serve --host=0.0.0.0 --port=8000
```

### Mode SSR (Server-Side Rendering)

```bash
composer run dev:ssr
```

## 👤 Akun Default

Setelah menjalankan seeder, Anda dapat login dengan akun berikut:

**Super Admin:**
- Email: admin@example.com
- Password: password

**Dosen:**
- Email: dosen@example.com
- Password: password

## 📚 Struktur Folder

```
jadwal_lab/
├── app/
│   ├── Actions/          # Business logic actions
│   ├── Http/
│   │   └── Controllers/  # Controllers
│   ├── Models/           # Eloquent models
│   └── Services/         # Service classes
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/   # React components
│   │   ├── pages/        # Inertia pages
│   │   └── types/        # TypeScript types
│   └── views/            # Blade templates
├── routes/
│   ├── web.php           # Web routes
│   └── settings.php      # Settings routes
└── public/               # Public assets
```

## 🔐 Role & Permissions

### Super Admin
- Akses penuh ke semua fitur
- Kelola semua master data
- Approve/reject booking lab
- Kelola pengguna

### Admin
- Kelola master data
- Approve/reject booking lab
- Tandai kehadiran dosen
- Lihat semua jadwal

### Dosen
- Lihat jadwal pribadi
- Ajukan tukar jadwal
- Booking laboratorium
- Update status kehadiran sendiri
- Lihat notifikasi

## 🧪 Testing

```bash
# Jalankan test
php artisan test

# atau
composer run test
```

## 📝 Scripts Tersedia

### Composer Scripts
```bash
composer run setup    # Setup lengkap aplikasi
composer run dev      # Jalankan development environment
composer run dev:ssr  # Jalankan dengan SSR
composer run test     # Jalankan PHPUnit tests
```

### NPM Scripts
```bash
npm run dev           # Vite dev server
npm run build         # Build untuk production
npm run build:ssr     # Build dengan SSR
npm run lint          # Lint JavaScript/TypeScript
npm run format        # Format kode dengan Prettier
npm run format:check  # Cek format kode
npm run types         # Check TypeScript types
```

## 🔧 Konfigurasi

### Queue Configuration

Aplikasi menggunakan database queue driver. Pastikan queue worker berjalan:

```bash
php artisan queue:work
```

Atau gunakan supervisor untuk production environment.

### Cache Configuration

Clear cache saat deployment:

```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

## 🌐 Deployment

### Persiapan Production

1. Set environment ke production:
```env
APP_ENV=production
APP_DEBUG=false
```

2. Optimize aplikasi:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

3. Setup web server (Nginx/Apache)
4. Setup supervisor untuk queue worker
5. Setup cron job untuk scheduler

### Cron Job

Tambahkan ke crontab:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## 🐛 Troubleshooting

### Error: "No application encryption key"
```bash
php artisan key:generate
```

### Error: Permission denied pada storage
```bash
chmod -R 775 storage bootstrap/cache
```

### Error: Vite tidak dapat connect
Pastikan port 5173 tidak digunakan atau ubah konfigurasi di `vite.config.ts`

### Error: Database connection
Periksa konfigurasi `.env` dan pastikan database service berjalan

## 🤝 Kontribusi

Contributions, issues, dan feature requests sangat diterima!

## 📄 Lisensi

MIT License

## 👨‍💻 Developer

Dikembangkan dengan ❤️ untuk manajemen laboratorium yang lebih baik

## 📞 Kontak & Support

Untuk bantuan atau pertanyaan, silakan buat issue di repository ini.

---

**Happy Coding!** 🎉
