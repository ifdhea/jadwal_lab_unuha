# 🎓 Sistem Penjadwalan Laboratorium UNUHA

> **Laravel 12 + React 18 + Inertia.js + TypeScript + Tailwind CSS**

Sistem manajemen penjadwalan laboratorium komputer untuk Universitas Nurul Huda Al-Islami (UNUHA) dengan fitur tukar jadwal antar dosen dan booking laboratorium.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Konfigurasi](#️-konfigurasi)
- [Penggunaan](#-penggunaan)
- [Struktur Project](#-struktur-project)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Dokumentasi](#-dokumentasi)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Fitur Utama

### 🎯 Core Features
- ✅ **Multi-Role Authentication** (Super Admin, Dosen)
- ✅ **Dashboard Berbasis Role** dengan statistik real-time
- ✅ **Manajemen Master Data Lengkap** (11 entitas)
- ✅ **Jadwal Master** dengan deteksi konflik otomatis
- ✅ **Generator Jadwal Final** dengan resolusi konflik
- ✅ **Sistem Tukar Jadwal** antar dosen
- ✅ **Sistem Booking Laboratorium** untuk kegiatan non-kuliah
- ✅ **Responsive Design** dengan dark mode support

### 🚀 Advanced Features
- Real-time availability check
- Auto-calculate durasi slot
- AJAX dynamic data loading
- Konflik resolution dengan pola minggu
- Status tracking dengan notifikasi
- Export-ready jadwal
- Protected routes dengan middleware

---

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **Inertia.js** - Modern monolith (SPA without API)
- **MySQL 8** - Relational Database
- **Carbon** - Date/Time manipulation

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/UI** - Component Library
- **Lucide React** - Icon Library

---

## 📦 Instalasi

### Prerequisites
```
- PHP >= 8.2
- Composer >= 2.6
- Node.js >= 18
- MySQL >= 8.0
- Git
```

### 1. Clone Repository
```bash
git clone https://github.com/your-username/jadwal-lab-unuha.git
cd jadwal-lab-unuha
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE jadwal_lab;
EXIT;

# Configure .env
# DB_DATABASE=jadwal_lab
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# (Optional) Seed sample data
php artisan db:seed
```

### 5. Build Assets
```bash
# Development
npm run dev

# Production
npm run build
```

### 6. Run Application
```bash
# Start Laravel server
php artisan serve

# Access: http://localhost:8000
```

---

## ⚙️ Konfigurasi

### Database Configuration
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jadwal_lab
DB_USERNAME=root
DB_PASSWORD=
```

### Application Configuration
```env
APP_NAME="Jadwal Lab UNUHA"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
```

### Mail Configuration (Opsional)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

---

## 📖 Penggunaan

### Default Login Credentials

#### Super Admin
```
Email: admin@unuha.ac.id
Password: password
```

#### Dosen
```
Email: ahmad.hidayat@unuha.ac.id
Password: password

Email: siti.fatimah@unuha.ac.id
Password: password
```

### Workflow Penjadwalan

#### 1. Setup Master Data (Super Admin)
```
1. Buat Tahun Ajaran & Semester
2. Buat Kampus & Laboratorium
3. Buat Program Studi
4. Buat Kelas per angkatan
5. Buat Mata Kuliah
6. Buat Kelas Mata Kuliah (relasi)
7. Buat Slot Waktu
8. Buat Data Dosen
```

#### 2. Buat Jadwal Master (Super Admin)
```
1. Navigate ke Jadwal Master
2. Tambah jadwal untuk setiap kelas-matkul
3. Input: Dosen, Lab, Hari, Waktu
4. Sistem deteksi konflik otomatis
5. Set pola minggu jika konflik
```

#### 3. Generate Jadwal Final (Super Admin)
```
1. Klik button "Generate Jadwal"
2. Pilih semester & total pertemuan
3. Sistem generate sesi_jadwal
4. Konflik ter-resolve otomatis
5. Jadwal siap digunakan!
```

#### 4. Tukar Jadwal (Dosen)
```
Dosen A:
1. Navigate ke Tukar Jadwal
2. Pilih jadwal yang ingin ditukar
3. Pilih dosen mitra (Dosen B)
4. Pilih jadwal mitra di tanggal sama
5. Submit permintaan

Dosen B:
6. Lihat permintaan masuk
7. Setujui atau Tolak
8. Jika disetujui → Jadwal otomatis tertukar
```

#### 5. Booking Lab (Dosen)
```
1. Navigate ke Booking Lab
2. Pilih lab, tanggal, waktu
3. Sistem cek ketersediaan real-time
4. Isi keperluan
5. Submit → Menunggu approval

Admin:
6. Review permintaan
7. Setujui atau Tolak
```

---

## 📁 Struktur Project

```
jadwal-lab/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── DashboardController.php
│   │   │   ├── TukarJadwalController.php
│   │   │   ├── BookingLaboratoriumController.php
│   │   │   ├── JadwalController.php
│   │   │   ├── JadwalMasterController.php
│   │   │   └── [Master Data Controllers...]
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   │   ├── TukarJadwal.php
│   │   ├── BookingLaboratorium.php
│   │   ├── JadwalMaster.php
│   │   ├── SesiJadwal.php
│   │   └── [Other Models...]
│   └── Services/
│       └── JadwalGeneratorService.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── js/
│   │   ├── pages/
│   │   │   ├── dashboard.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── super-admin-dashboard.tsx
│   │   │   │   └── dosen-dashboard.tsx
│   │   │   ├── TukarJadwal/
│   │   │   │   ├── Index.tsx
│   │   │   │   └── Create.tsx
│   │   │   ├── BookingLaboratorium/
│   │   │   │   ├── Index.tsx
│   │   │   │   └── Create.tsx
│   │   │   └── [Other Pages...]
│   │   ├── components/
│   │   ├── layouts/
│   │   └── lib/
│   └── css/
├── routes/
│   └── web.php
├── public/
├── tests/
├── .env.example
├── composer.json
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🧪 Testing

### Run Tests
```bash
# PHP Unit Tests
php artisan test

# Feature Tests
php artisan test --testsuite=Feature

# Unit Tests
php artisan test --testsuite=Unit
```

### Manual Testing
Lihat [TESTING_GUIDE.md](TESTING_GUIDE.md) untuk skenario testing lengkap.

---

## 🚀 Deployment

### Production Build
```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

### Server Requirements
- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js (untuk build)
- Web Server (Apache/Nginx)

### Deployment Steps
1. Clone repository ke server
2. Install dependencies (`composer install --optimize-autoloader --no-dev`)
3. Configure `.env`
4. Run migrations
5. Build assets (`npm run build`)
6. Set permissions (storage & cache)
7. Configure web server
8. SSL certificate (Let's Encrypt)

---

## 📚 Dokumentasi

### Dokumentasi Lengkap
- **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** - Dokumentasi fitur lengkap
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Panduan testing
- **[app_summary.md](app_summary.md)** - Konsep & desain sistem

### API Endpoints
Sistem ini menggunakan Inertia.js, jadi tidak ada REST API. Semua route ada di `routes/web.php`.

### Database Schema
Lihat folder `database/migrations/` untuk struktur database lengkap.

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache
npm run dev -- --force
php artisan optimize:clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Reset database
php artisan migrate:fresh --seed

# Check connection
php artisan tinker
>>> DB::connection()->getPdo();
```

### Permission Errors
```bash
# Linux/Mac
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Windows
# Jalankan cmd sebagai Administrator
# icacls storage /grant Users:F /T
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary software for UNUHA.

---

## 👥 Team

**Developer**: Claude (AI Assistant)
**Institution**: Universitas Nurul Huda Al-Islami (UNUHA)
**Year**: 2024/2025

---

## 📞 Support

Jika ada pertanyaan atau issues:
1. Buka GitHub Issues
2. Email: support@unuha.ac.id
3. WhatsApp: +62-xxx-xxxx-xxxx

---

## 🎉 Acknowledgments

- Laravel Framework
- React Community
- Inertia.js
- Shadcn/UI
- Tailwind CSS
- Lucide Icons

---

**Built with ❤️ for UNUHA**
