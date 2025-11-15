# Testing Guide - Halaman Public

## Akses Website
Pastikan Laragon sudah running, kemudian buka browser dan akses:

### 1. Halaman Beranda
**URL:** `http://localhost/beranda` atau `http://localhost/`

**Yang Harus Dicek:**
- [ ] Hero section dengan judul "Sistem Jadwal Laboratorium"
- [ ] Badge semester aktif di bagian atas
- [ ] 6 card fitur unggulan:
  - Jadwal Real-time
  - Multi Kampus
  - Informasi Lengkap
  - Akses 24/7
  - Untuk Semua
  - Mudah Digunakan
- [ ] Tombol "Lihat Jadwal" dan "Pelajari Lebih Lanjut"
- [ ] Footer dengan 3 kolom (About, Quick Links, Contact)

**Interaksi:**
- Klik "Lihat Jadwal" → harus redirect ke `/jadwal-lab`
- Klik "Pelajari Lebih Lanjut" → harus redirect ke `/tentang`
- Test dark mode toggle di header
- Test mobile menu (resize browser)

### 2. Halaman Jadwal Lab
**URL:** `http://localhost/jadwal-lab`

#### Tab Kalender
**Yang Harus Dicek:**
- [ ] Dropdown semester berfungsi
- [ ] Navigation minggu (prev/next) berfungsi
- [ ] Menampilkan minggu saat ini otomatis
- [ ] Tab kampus berfungsi (A, B, C, dst)
- [ ] Kalender mingguan tampil dengan 6 hari (Senin-Sabtu)
- [ ] Highlight hari ini (background primary dan ring)
- [ ] Jam istirahat (11:45-13:15) ditampilkan dengan overlay "ISTIRAHAT"

**Jadwal Card:**
- [ ] Warna gradient berbeda untuk setiap dosen
- [ ] Icon mata kuliah (BookOpen)
- [ ] Nama mata kuliah bold
- [ ] Badge kelas
- [ ] Info dosen dengan icon User
- [ ] Info lab dengan icon MapPin
- [ ] Info waktu dengan icon Clock
- [ ] Badge SKS
- [ ] Icon tukar jadwal (jika ada yang ditukar)
- [ ] Badge status:
  - **Berlangsung** (kuning) - jika jadwal sedang berlangsung
  - **Sudah Lewat** (secondary) - jika jadwal sudah lewat
  - **Terjadwal** (biru) - jadwal normal
  - **Booking** (orange) - booking lab
  - **Tidak Masuk** (outline) - dosen tidak masuk

**Cell Behavior:**
- [ ] Rowspan untuk jadwal multi-slot
- [ ] Empty cell menampilkan "-"
- [ ] Hover effect pada card jadwal

#### Tab Tabel
**Yang Harus Dicek:**
- [ ] Search box berfungsi (cari mata kuliah, dosen, kelas, lab)
- [ ] Filter kampus berfungsi
- [ ] Filter status berfungsi
- [ ] Tabel menampilkan kolom:
  - Tanggal (format: Rab, 13 Nov)
  - Waktu (format: 07:30 - 09:00)
  - Mata Kuliah
  - Kelas (badge)
  - Dosen
  - Lab
  - Kampus
  - SKS
  - Status (badge warna)
- [ ] Summary "Menampilkan X dari Y jadwal" di bawah tabel

**Filter Testing:**
1. Ketik "Basis Data" di search → harus filter mata kuliah
2. Pilih kampus tertentu → harus filter per kampus
3. Pilih status "Booking" → harus show booking saja
4. Kombinasi filter → harus work

### 3. Halaman Tentang
**URL:** `http://localhost/tentang`

**Yang Harus Dicek:**
- [ ] Hero section "Sistem Informasi Jadwal Laboratorium"
- [ ] 2 card: Visi dan Misi
- [ ] Card "Tentang Sistem" dengan penjelasan
- [ ] Card "Siapa yang Menggunakan" dengan 3 kolom:
  - Mahasiswa
  - Dosen
  - Administrator
- [ ] 6 card "Fitur Utama"
- [ ] Card "Teknologi yang Digunakan" dengan 4 tech stack:
  - Laravel
  - React
  - Inertia.js
  - Tailwind CSS
- [ ] CTA card "Siap Menggunakan Sistem?"
- [ ] Contact information

**Interaksi:**
- Klik "Lihat Jadwal" → redirect ke `/jadwal-lab`
- Klik "Login Sistem" → redirect ke `/login`

### 4. Header & Navigation (Semua Halaman)

#### Header Desktop
**Yang Harus Dicek:**
- [ ] Logo dengan icon Calendar
- [ ] Nama "Jadwal Lab - Universitas Nurul Huda"
- [ ] Menu navigasi: Beranda, Jadwal Lab, Tentang
- [ ] Tombol dark mode (Sun/Moon icon)
- [ ] Tombol "Masuk" (jika belum login)
- [ ] Dropdown profil (jika sudah login)

#### Header Mobile
**Yang Harus Dicek:**
- [ ] Logo tetap tampil
- [ ] Tombol hamburger menu
- [ ] Klik hamburger → menu expand dengan list:
  - Beranda
  - Jadwal Lab
  - Tentang

#### Header (Jika Sudah Login)
1. Login dulu ke `/login`
2. Kembali ke halaman public
3. Cek:
   - [ ] Icon User muncul (bukan tombol "Masuk")
   - [ ] Klik icon → dropdown menu tampil:
     - Nama user
     - Email user
     - Dashboard
     - Pengaturan
     - Keluar
   - [ ] Klik "Dashboard" → redirect ke `/dashboard`
   - [ ] Klik "Keluar" → logout dan redirect

### 5. Footer (Semua Halaman)

**Yang Harus Dicek:**
- [ ] 3 kolom grid (desktop) / 1 kolom (mobile)
- [ ] Kolom 1: About dengan deskripsi
- [ ] Kolom 2: Quick Links dengan navigasi
- [ ] Kolom 3: Contact information
- [ ] Copyright dengan tahun otomatis

**Interaksi:**
- Klik link navigasi di footer → harus redirect

### 6. Dark Mode (Semua Halaman)

**Testing:**
1. Klik tombol dark mode di header
2. Cek perubahan:
   - [ ] Background berubah dark
   - [ ] Text berubah light
   - [ ] Card background berubah
   - [ ] Border berubah
   - [ ] Icon berubah (Sun ↔ Moon)
3. Refresh page → dark mode tetap persist
4. Navigate ke halaman lain → dark mode tetap
5. Toggle back ke light mode → harus kembali normal

### 7. Responsive Design

#### Desktop (> 1024px)
- [ ] Full layout dengan sidebar navigation
- [ ] 3 kolom footer
- [ ] Tabel full width
- [ ] Card grid 3 kolom

#### Tablet (768px - 1024px)
- [ ] 2 kolom card grid
- [ ] Navigation menu collapse
- [ ] Tabel scrollable horizontal

#### Mobile (< 768px)
- [ ] 1 kolom card grid
- [ ] Hamburger menu
- [ ] Footer 1 kolom stack
- [ ] Tabel scrollable dengan fixed column
- [ ] Touch-friendly buttons

### 8. Performance & UX

**Loading:**
- [ ] Page load < 3 detik
- [ ] Smooth transitions
- [ ] No layout shift

**Navigation:**
- [ ] Browser back/forward berfungsi
- [ ] Active link highlighted
- [ ] Breadcrumbs (jika ada)

**Accessibility:**
- [ ] Keyboard navigation berfungsi
- [ ] Focus states visible
- [ ] Alt text pada images
- [ ] Proper heading hierarchy

### 9. Data Accuracy

**Jadwal Tab Kalender:**
1. Buka `/jadwal` (authenticated)
2. Catat beberapa jadwal di minggu tertentu
3. Buka `/jadwal-lab` (public)
4. Cek:
   - [ ] Jadwal yang sama tampil
   - [ ] Waktu sama
   - [ ] Dosen sama
   - [ ] Lab sama
   - [ ] Status sama
   - [ ] Badge sama

**Jadwal Tab Tabel:**
1. Filter kampus tertentu
2. Hitung jumlah jadwal
3. Compare dengan tab kalender
4. Cek:
   - [ ] Jumlah data match
   - [ ] Semua field sama

### 10. Edge Cases

**Semester Kosong:**
1. Set semua semester is_aktif = false
2. Refresh `/jadwal-lab`
3. Cek:
   - [ ] Menampilkan pesan "Belum ada semester aktif"
   - [ ] Tidak error
   - [ ] Kalender kosong gracefully

**Minggu Tanpa Jadwal:**
1. Pilih minggu di akhir semester (kosong)
2. Cek:
   - [ ] Semua cell menampilkan "-"
   - [ ] Tidak error
   - [ ] Tab tabel menampilkan "Tidak ada jadwal"

**Search Tidak Ada Hasil:**
1. Di tab tabel, search "XXXXXXX"
2. Cek:
   - [ ] Menampilkan "Tidak ada jadwal ditemukan"
   - [ ] Summary "Menampilkan 0 dari X jadwal"

## Bug Reporting Template

Jika menemukan bug, laporkan dengan format:

```
**Halaman:** [Beranda / Jadwal Lab / Tentang]
**Tab/Section:** [Tab Kalender / Tab Tabel / Header / Footer / dll]
**Browser:** [Chrome / Firefox / Safari / Edge]
**Device:** [Desktop / Tablet / Mobile]
**Screen Size:** [1920x1080 / dll]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[Apa yang seharusnya terjadi]

**Actual Behavior:**
[Apa yang benar-benar terjadi]

**Screenshot:**
[Attach screenshot jika ada]

**Console Error:**
[Copy error dari browser console jika ada]
```

## Success Criteria

✅ **Semua checklist di atas terpenuhi**
✅ **Tidak ada error di console**
✅ **Dark mode berfungsi sempurna**
✅ **Responsive di semua ukuran layar**
✅ **Data akurat sama dengan jadwal admin/dosen**
✅ **Filter dan search berfungsi dengan baik**
✅ **Navigation smooth tanpa broken link**
