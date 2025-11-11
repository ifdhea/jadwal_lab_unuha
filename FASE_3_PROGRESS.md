# PROGRESS FASE 3 - SISTEM JADWAL LAB UNUHA
## Pengembangan Fitur Tukar Jadwal & Booking Lab

### 📅 Tanggal Mulai: 11 November 2025

---

## 🎯 OBJECTIVES

### Fase 3A: Perbaikan Error & Setup Dasar ✅
- [x] Fix error BookingLaboratorium Index (filters undefined)
- [x] Fix navigation sidebar dosen (sudah ada logic by role)
- [x] Fix path resolution Pages folder (case sensitivity)
- [x] Halaman sudah ada (TukarJadwal/Index.tsx, BookingLaboratorium/Index.tsx)
- [x] Build frontend berhasil tanpa error

### Fase 3B: Dashboard Improvements 
- [x] Dashboard Dosen - Tambahkan Jadwal Hari Ini (DONE)
- [ ] Dashboard Super Admin - Statistik Lengkap (sudah ada)
- [ ] Halaman Jadwal Final (Admin) - Tambahkan tanggal di atas hari
- [ ] Halaman Jadwal (Dosen) - Tambahkan tanggal di atas hari

### Fase 3C: Mekanisme Status Jadwal
- [x] Implementasi status sesi_jadwal:
  - `terjadwal` - Default jadwal
  - `berlangsung` - Sedang berjalan
  - `selesai` - Sudah selesai
  - `tidak_masuk` - Dosen tidak hadir
  - `dibatalkan` - Dibatalkan
- [x] Auto update status based on time
- [x] Mekanisme lapor dosen tidak hadir (admin)
- [x] Service JadwalStatusService dengan method:
  - updateStatusOtomatis() - Update otomatis setiap 5 menit
  - tandaiDosenTidakHadir() - Admin tandai dosen tidak hadir
  - batalkanJadwal() - Admin batalkan jadwal
  - getSlotTersediaBooking() - Cek slot kosong untuk booking
  - getStatistikStatus() - Statistik status jadwal
- [x] Console Command jadwal:update-status
- [x] Scheduler: Run setiap 5 menit
- [x] Controller methods untuk tandai tidak hadir & batalkan
- [x] Routes untuk admin actions

### Fase 3D: Booking Laboratorium
- [ ] Create Controller dengan fungsi:
  - [x] index() - List booking
  - [ ] create() - Form booking baru
  - [ ] store() - Simpan booking
  - [ ] approve() - Admin approve
  - [ ] reject() - Admin tolak
  - [ ] cancel() - Dosen batalkan
- [ ] Create View Kalender-style untuk booking
- [ ] Implementasi Tab:
  - [ ] Tab Jadwal/Kalender (untuk klik booking slot kosong)
  - [ ] Tab Request Booking (list request)
- [ ] Validasi:
  - [ ] Slot harus kosong
  - [ ] Jam selesai tidak menimpa jadwal lain
  - [ ] Laboratorium tersedia

### Fase 3E: Tukar Jadwal
- [ ] Create Controller dengan fungsi:
  - [ ] index() - List permintaan
  - [ ] create() - Form tukar
  - [ ] store() - Simpan permintaan tukar
  - [ ] approve() - Mitra setuju
  - [ ] reject() - Mitra tolak
  - [ ] cancel() - Pemohon batalkan
- [ ] Create View Kalender-style untuk drag & drop
- [ ] Implementasi Tab:
  - [ ] Tab Jadwal (untuk drag & drop)
  - [ ] Tab Request Tukar (request yang dikirim)
  - [ ] Tab Request Masuk (request dari orang lain)
- [ ] Drag & Drop functionality:
  - [ ] Drag jadwal sendiri ke jadwal orang lain (tukar)
  - [ ] Drag jadwal sendiri ke slot kosong (pindah)
- [ ] Validasi:
  - [ ] Bisa tukar dengan jadwal yang ada
  - [ ] Bisa pindah ke slot kosong
  - [ ] Perubahan hanya berlaku untuk 1 pertemuan

### Fase 3F: Jam Istirahat
- [ ] Highlight slot_waktu istirahat (11:45-13:15) dengan warna abu-abu
- [ ] Merge horizontal cell istirahat
- [ ] Skip cell istirahat saat ada jadwal melintasi jam istirahat

### Fase 3G: Generate Jadwal Enhancement
- [ ] Saat generate jadwal, reset semua data:
  - [ ] Hapus data tukar_jadwal
  - [ ] Hapus data booking_laboratorium
  - [ ] Reset sesi_jadwal
- [ ] Auto-detect konflik dan generate pola rolling

### Fase 3H: Navigasi & UI/UX
- [ ] Fix sidebar navigation by role:
  - [ ] Super Admin: Full menu
  - [ ] Dosen: Menu dosen saja
- [ ] Breadcrumb di semua halaman
- [ ] Page title consistency
- [ ] Auto-scroll to current date di kalender
- [ ] Highlight hari ini di kalender

---

## ✅ COMPLETED TASKS

### 11 Nov 2025, 08:00 WIB
- ✅ Fixed BookingLaboratorium Index error (filters undefined)
  - Added default value `filters = {}` di props
  
### 11 Nov 2025, 08:30 WIB
- ✅ Fixed path resolution di app.tsx (pages -> Pages)
- ✅ Verified sidebar navigation sudah ada logic by role
- ✅ Build successful tanpa error
- 🎯 Next: Test akses halaman dan implementasi dashboard dosen

### 11 Nov 2025, 09:00 WIB
- ✅ Implementasi Jadwal Hari Ini di Dashboard Dosen
  - Added jadwalHariIni to DashboardController
  - Updated dosen-dashboard.tsx dengan section prioritas
  - Styling khusus untuk jadwal hari ini (primary color, bigger fonts)
- 🎯 Next: Test aplikasi dan mulai implementasi mekanisme status jadwal

---

## 🐛 BUGS TO FIX

### High Priority
1. ❌ Sidebar navigation tidak menyesuaikan role dosen
2. ❌ Halaman TukarJadwal/Index.tsx missing (404)
3. ❌ BookingLaboratorium blank page

### Medium Priority
1. ⚠️ Tanggal tidak tampil di atas hari di kalender
2. ⚠️ Jadwal Master edit tidak auto-fill semester & hari

### Low Priority
1. 🔵 Dashboard dosen belum tampil jadwal hari ini

---

## 📝 NOTES

### Database Structure
**Tabel tukar_jadwal:**
- pemohon_id (dosen)
- sesi_jadwal_pemohon_id
- mitra_id (dosen, nullable)
- sesi_jadwal_mitra_id (nullable untuk slot kosong)
- status (menunggu, disetujui, ditolak, dibatalkan)
- alasan_pemohon
- alasan_penolakan

**Tabel booking_laboratorium:**
- dosen_id
- laboratorium_id
- tanggal
- slot_waktu_mulai_id
- slot_waktu_selesai_id
- durasi_slot
- keperluan
- keterangan
- status (menunggu, disetujui, ditolak, selesai, dibatalkan)
- catatan_admin
- diproses_oleh (user_id admin)

### Business Logic
1. **Booking Lab:** Hanya bisa jika slot kosong ATAU dosen tidak hadir
2. **Tukar Jadwal:** Bisa tukar dengan jadwal lain ATAU pindah ke slot kosong
3. **Status Auto Update:** Jadwal yang sudah lewat otomatis status = selesai
4. **Generate Ulang:** Reset semua booking & tukar jadwal

---

## 🎯 NEXT STEPS

1. ✅ Fix BookingLaboratorium error
2. ⏭️ Fix sidebar navigation untuk role dosen
3. ⏭️ Buat halaman TukarJadwal/Index.tsx
4. ⏭️ Implementasi mekanisme status jadwal
5. ⏭️ Implementasi booking lab dengan kalender
6. ⏭️ Implementasi tukar jadwal dengan drag & drop

---

## 📊 PROGRESS METRICS

- Fase 3A: 100% ✅
- Fase 3B: 25% ⏳
- Fase 3C: 0%
- Fase 3D: 10% (Controller index done)
- Fase 3E: 0%
- Fase 3F: 0%
- Fase 3G: 0%
- Fase 3H: 0%

**Overall Progress: 15%**

---

_Last Updated: 11 November 2025, 09:15 WIB_
