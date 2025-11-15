# Halaman Public - Jadwal Lab

## Overview
Halaman public telah berhasil dibuat dengan 3 halaman utama:
1. **Beranda** - Landing page dengan informasi sistem
2. **Jadwal Lab** - Halaman jadwal dengan tab Kalender dan Tabel
3. **Tentang** - Informasi tentang sistem

## URL Routes
- `/` atau `/beranda` - Halaman Beranda
- `/jadwal-lab` - Halaman Jadwal Lab (tanpa perlu login)
- `/tentang` - Halaman Tentang

## Fitur yang Sudah Diimplementasikan

### 1. Public Layout (`resources/js/layouts/public-layout.tsx`)
- **Header** dengan:
  - Logo dan nama aplikasi
  - Navigasi desktop dan mobile
  - Tombol dark mode
  - Dropdown profil (jika sudah login) atau tombol login
  - Menu mobile responsive
- **Footer** dengan informasi lengkap

### 2. Halaman Beranda (`resources/js/Pages/Public/Beranda.tsx`)
- Hero section dengan semester aktif
- 6 fitur unggulan dalam card
- Call-to-action untuk melihat jadwal
- Tampilan modern dan responsive

### 3. Halaman Jadwal Lab (`resources/js/Pages/Public/Jadwal.tsx`)
**Tab Kalender:**
- Sama persis dengan jadwal di admin/dosen
- Filter per kampus
- Navigasi minggu
- Tampilan kalender dengan warna berbeda per dosen
- Badge status (Berlangsung, Sudah Lewat, Terjadwal, Booking, Tidak Masuk)
- Highlight hari ini
- Tampilan jam istirahat

**Tab Tabel:**
- Tabel data jadwal yang sama
- Filter:
  - Pencarian (mata kuliah, dosen, kelas, lab)
  - Filter kampus
  - Filter status
- Sorting otomatis
- Badge status warna-warni
- Responsive table

### 4. Halaman Tentang (`resources/js/Pages/Public/Tentang.tsx`)
- Visi dan Misi
- Penjelasan sistem
- Siapa yang menggunakan
- Fitur utama (6 card)
- Technology stack
- Call-to-action
- Contact information

## Controller (`app/Http/Controllers/PublicController.php`)
- `beranda()` - Menampilkan halaman beranda dengan data semester aktif
- `jadwal()` - Menampilkan jadwal dengan logic sama seperti JadwalController
- `tentang()` - Menampilkan halaman tentang

## Fitur Khusus

### Header Public
- Jika user sudah login, akan muncul dropdown profil dengan menu:
  - Nama dan email user
  - Dashboard
  - Pengaturan
  - Keluar
- Jika belum login, muncul tombol "Masuk"
- Tombol dark mode yang berfungsi sama seperti di dashboard

### Jadwal Lab Public
- **Tidak perlu login** untuk melihat jadwal
- **Sama persis** dengan tampilan di admin/dosen:
  - Warna gradient berbeda per dosen
  - Badge status lengkap
  - Icon tukar jadwal
  - Informasi lengkap (mata kuliah, kelas, dosen, lab, waktu, SKS)
  - Highlight hari ini dan jadwal yang sedang berlangsung
- **Fitur tambahan Tab Tabel:**
  - Lebih mudah untuk searching
  - Export-friendly (bisa dicopy)
  - Filter multiple

## Cara Menggunakan

### Untuk Mahasiswa/Umum:
1. Buka `http://localhost/beranda`
2. Klik "Lihat Jadwal" atau menu "Jadwal Lab"
3. Pilih semester
4. Navigasi minggu dengan tombol prev/next
5. Lihat jadwal per kampus di tab Kalender
6. Atau gunakan tab Tabel untuk pencarian dan filter

### Untuk User yang Sudah Login:
1. Header akan menampilkan dropdown profil
2. Bisa langsung ke dashboard lewat dropdown
3. Bisa logout dari halaman public

## Technical Details

### Data Flow:
1. `PublicController@jadwal` mengambil data yang sama dengan `JadwalController@index`
2. Data di-flatten untuk tab Tabel (`tableData`)
3. Data tetap dalam struktur nested untuk tab Kalender (`jadwalData`)
4. Semua fitur real-time (is_active, is_past) tetap berfungsi

### Performance:
- Same query optimization seperti jadwal utama
- Table filtering menggunakan useMemo untuk performa
- Responsive di semua ukuran layar

### Styling:
- Konsisten dengan design system (Tailwind + shadcn/ui)
- Dark mode support penuh
- Gradient colors yang sama dengan jadwal admin/dosen
- Smooth animations dan transitions

## Testing Checklist
- [x] Build frontend berhasil
- [ ] Akses `/beranda` - hero section tampil
- [ ] Akses `/jadwal-lab` - kalender tampil per kampus
- [ ] Tab Tabel berfungsi dengan filter
- [ ] Akses `/tentang` - informasi lengkap tampil
- [ ] Dark mode berfungsi di semua halaman
- [ ] Mobile responsive
- [ ] Header dropdown profil (jika login)
- [ ] Navigation mobile menu
- [ ] Footer tampil lengkap

## Next Steps (Optional)
1. SEO optimization (meta tags, descriptions)
2. Add sharing functionality
3. Print/Export jadwal PDF
4. Notifikasi jadwal hari ini
5. Integration dengan calendar apps (Google Calendar, iCal)
6. QR code untuk quick access
