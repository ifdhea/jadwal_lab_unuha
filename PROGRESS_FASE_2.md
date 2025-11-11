# PROGRESS FASE 2 - Sistem Jadwal Lab

## Status: ✅ Fase 2A Selesai | 🔄 Fase 2B Progress 50%

### Tanggal: 11 November 2025

---

## ✅ SELESAI - Fase 2A: Mekanisme Status "Tidak Masuk"

### 1. Database & Backend ✅
- [x] Migration untuk tambah status 'tidak_masuk' di enum sesi_jadwal
- [x] Controller `SesiJadwalController` dengan method:
  - `updateStatus()` - Set status tidak masuk
  - `resetStatus()` - Kembalikan ke terjadwal
- [x] Routes untuk update status (dosen only):
  - `POST /sesi-jadwal/{id}/update-status`
  - `POST /sesi-jadwal/{id}/reset-status`
- [x] Validasi kepemilikan jadwal (hanya dosen pemilik)
- [x] Validasi waktu (tidak bisa ubah jadwal yang sudah lewat)

### 2. Frontend (Jadwal/Index.tsx) ✅
- [x] Update interface `JadwalCell` dengan field baru
- [x] Update `JadwalController` untuk kirim data tambahan
- [x] Tampilkan status dengan label yang jelas
- [x] Button "Tidak Masuk" (conditional)
- [x] Button "Reset Status" (conditional)
- [x] Build successful

---

## 🔄 PROGRESS - Fase 2B: Booking Lab (50%)

### Backend ✅
- [x] Method `BookingLaboratoriumController::calendar()` 
  - Return jadwal data (reuse dari JadwalController)
  - Return availableSlots (slot kosong atau dosen tidak masuk)
  - Return bookings (yang sudah disetujui)
- [x] Routes update:
  - `GET /booking-lab` → calendar (halaman utama)
  - `GET /booking-lab/requests` → index (tab requests)
- [x] Data structure ready untuk frontend

### Frontend 🔄 
- [ ] Backup file Index.tsx existing
- [ ] Create new Index.tsx dengan 2 tabs:
  - Tab 1: Kalender (grid booking)
  - Tab 2: Requests (list existing)
- [ ] Implement grid rendering (copy from Jadwal/Index.tsx)
- [ ] Add click handler untuk cell kosong/available
- [ ] Create BookingDialog component
- [ ] Visual indicator untuk:
  - Slot available (kosong)

### Konsep Booking Lab:
1. **Syarat Booking:**
   - Lab kosong (tidak ada jadwal terjadwal)
   - ATAU lab ada jadwal tapi status = 'tidak_masuk' (dosen tidak masuk)
   - Tidak boleh overlap dengan jadwal yang sedang berlangsung

2. **Fitur yang Harus Dibuat:**
   - [ ] Halaman `BookingLaboratorium/Index.tsx` dengan 2 tab:
     - Tab 1: Kalender booking (grid seperti jadwal final)
     - Tab 2: Daftar request booking saya
   - [ ] Klik cell kosong → Form booking
   - [ ] Controller untuk:
     - Check availability (cek slot kosong)
     - Store booking
     - Approve/reject (admin)
   - [ ] Update tampilan jadwal untuk highlight slot yang bisa di-booking
   - [ ] Badge "Booking" dengan warna berbeda

---

## 🔄 BELUM DIKERJAKAN - Fase 2C: Tukar Jadwal

### Konsep Tukar Jadwal:
1. **Cara Tukar:**
   - Drag jadwal sendiri ke jadwal dosen lain → Tukar dengan dosen lain
   - Drag jadwal sendiri ke slot kosong → Pindah jadwal

2. **Fitur yang Harus Dibuat:**
   - [ ] Halaman `TukarJadwal/Index.tsx` dengan 3 tab:
     - Tab 1: Kalender (drag & drop)
     - Tab 2: Request saya
     - Tab 3: Request masuk dari dosen lain
   - [ ] Drag & drop functionality
   - [ ] Pop-up konfirmasi dengan form alasan
   - [ ] Auto-submit dengan data lengkap (pemohon_id, mitra_id, sesi_id, dll)
   - [ ] Controller untuk:
     - Store tukar jadwal
     - Approve/reject dari mitra
     - Cancel request
   - [ ] Notifikasi ke dosen mitra

---

## 🔄 BELUM DIKERJAKAN - Fase 2D: Dashboard Dosen

### Fitur Dashboard:
- [ ] Jadwal hari ini (card list)
- [ ] Quick stats:
  - Total jadwal minggu ini
  - Jadwal tidak masuk bulan ini
  - Pending tukar jadwal
- [ ] Upcoming schedule (3 hari ke depan)
- [ ] Quick action buttons:
  - Lihat jadwal lengkap
  - Ajukan tukar jadwal
  - Booking lab

---

## 🔄 BELUM DIKERJAKAN - Fase 2E: Jadwal Grid Enhancement

### Fitur Tambahan:
- [ ] Tambah tanggal di header kolom hari
- [ ] Jam istirahat (11:45-13:15):
  - Background abu-abu
  - Merge horizontal
  - Tulisan "ISTIRAHAT"
  - Jadwal yang melewati istirahat skip cell istirahat
- [ ] Auto scroll ke minggu saat ini saat buka halaman
- [ ] Highlight tanggal hari ini
- [ ] Filter jadwal berdasarkan dosen (untuk dosen)

---

## 🔄 BELUM DIKERJAKAN - Fase 2F: Auto Update Status Jadwal

### Logic Background:
- [ ] Command/Job untuk auto update status:
  - Jadwal yang tanggalnya sudah lewat → status = 'selesai'
  - Jadwal hari ini yang sedang berlangsung → status = 'berlangsung'
- [ ] Schedule di `app/Console/Kernel.php`

---

## 🔄 BELUM DIKERJAKAN - Fase 2G: Generate Jadwal Cleanup

### Saat Generate Ulang:
- [ ] Hapus semua data di `tukar_jadwal`
- [ ] Hapus semua data di `booking_laboratorium`
- [ ] Konfirmasi dialog sebelum generate
- [ ] Warning bahwa semua tukar jadwal & booking akan hilang

---

## 🔄 BELUM DIKERJAKAN - Fase 2H: CRUD Dosen (Super Admin)

### Fitur yang Belum Ada:
- [ ] Halaman `Dosen/Create.tsx`
- [ ] Halaman `Dosen/Edit.tsx`  
- [ ] Auto create user saat create dosen
- [ ] Update user saat edit dosen
- [ ] Form lengkap dengan:
  - User (nama, email, password)
  - NIDN, NIP
  - Program Studi
  - Kampus Utama
  - Gelar depan/belakang
  - Kontak

---

## 🔄 BELUM DIKERJAKAN - Fase 2I: Edit Jadwal Master Enhancement

### Fitur yang Perlu Diperbaiki:
- [ ] Auto fill semester saat edit
- [ ] Auto fill hari saat edit
- [ ] Pre-select dropdown values

---

## 📝 CATATAN PENTING

### Struktur Jadwal:
- `jadwal_master` = Data mentah (bisa konflik)
- `sesi_jadwal` = Jadwal final hasil generate (tidak konflik)
- **Semua operasional menggunakan `sesi_jadwal`**, bukan `jadwal_master`

### Status Sesi Jadwal:
- `terjadwal` = Normal, akan dilaksanakan
- `berlangsung` = Sedang berlangsung (auto update)
- `selesai` = Sudah selesai (auto update)
- `tidak_masuk` = Dosen tidak masuk (manual)
- `dibatalkan` = Dibatalkan

### Permissions:
- **Dosen**: Update status, tukar jadwal, booking lab
- **Admin/Super Admin**: Approve booking, generate jadwal, CRUD master data

---

## 🎯 NEXT STEPS (Prioritas)

1. ✅ **[SELESAI]** Test fitur "Tidak Masuk" 
2. **[LANJUT]** Buat halaman BookingLaboratorium dengan kalender
3. Buat halaman TukarJadwal dengan drag & drop
4. Update Dashboard Dosen
5. Enhancement jadwal grid (tanggal, istirahat)
6. CRUD Dosen lengkap
7. Auto update status
8. Cleanup saat generate

---

**Last Update:** 11 Nov 2025 07:56 WIB
**Next Session:** Lanjut ke Fase 2B (Booking Lab)
