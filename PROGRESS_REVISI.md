# 📝 PROGRESS REVISI SISTEM JADWAL LAB

**Tanggal Mulai**: 11 November 2025  
**Status**: 🟡 IN PROGRESS

---

## 📋 DAFTAR REVISI YANG HARUS DIKERJAKAN

### **FASE 1: FIX CRUD & BASIC FIXES** 
**Target**: Fix bug dan perbaikan dasar

#### ✅ Task 1.1: Fix CRUD Dosen - **SELESAI**
- [x] Tambah field `program_studi_id` di controller
- [x] Tambah field `gelar_depan` & `gelar_belakang` di controller  
- [x] Tambah field `alamat` di controller
- [x] Update validation di `store()` method
- [x] Update validation di `update()` method
- [x] Pass `programStudi` ke view Create
- [x] Pass `programStudi` ke view Edit
- [x] Update form Create.tsx dengan field lengkap
- [ ] Update form Edit.tsx dengan field lengkap (NEXT)

**File Modified**:
- ✅ `app/Http/Controllers/DosenController.php`
- ✅ `resources/js/pages/Dosen/Create.tsx`
- ⏳ `resources/js/pages/Dosen/Edit.tsx` (belum)

---

#### ⏳ Task 1.2: Fix Edit Jadwal Master (Auto-fill)
**Masalah**: Saat edit jadwal master, field semester dan hari kosong

**Solusi**:
- [ ] Fix JadwalMasterController@edit - load relasi lengkap
- [ ] Fix Edit.tsx - set nilai default dari data yang ada

**File Target**:
- `app/Http/Controllers/JadwalMasterController.php`
- `resources/js/pages/JadwalMaster/Edit.tsx`

---

### **FASE 2: STATUS MANAGEMENT**
**Target**: Tambah mekanisme status jadwal

#### ⏳ Task 2.1: Update Enum Status Sesi Jadwal
**Current**: `terjadwal, berlangsung, selesai, dibatalkan`  
**New**: `terjadwal, berlangsung, selesai, tidak_masuk, dibatalkan`

**Steps**:
- [ ] Buat migration untuk alter enum status
- [ ] Update model SesiJadwal
- [ ] Buat command untuk auto-update status berdasarkan tanggal

---

#### ⏳ Task 2.2: Mekanisme Dosen Tidak Masuk
**Fitur**: Dosen bisa set status "tidak masuk" pada jadwalnya

**Steps**:
- [ ] Tambah button "Tidak Masuk" di halaman Jadwal Dosen
- [ ] Buat route & method untuk update status
- [ ] Validasi: hanya bisa set untuk jadwal hari ini atau yang akan datang
- [ ] Update UI: tampilkan status di grid jadwal

---

### **FASE 3: KALENDER GRID IMPROVEMENTS**
**Target**: Perbaiki tampilan kalender jadwal

#### ⏳ Task 3.1: Tambah Tanggal di Header Hari
**Before**: `Senin | Selasa | Rabu`  
**After**: 
```
Senin, 11 Nov    Selasa, 12 Nov    Rabu, 13 Nov
```

**File Target**:
- `resources/js/pages/Jadwal/Index.tsx`
- `resources/js/pages/dashboard/dosen-dashboard.tsx`

---

#### ⏳ Task 3.2: Auto Scroll ke Tanggal Hari Ini
**Fitur**: Saat buka halaman jadwal, otomatis fokus ke kolom hari ini

**Steps**:
- [ ] Tambah ref ke kolom hari ini
- [ ] useEffect untuk scroll ke ref saat mount
- [ ] Highlight kolom hari ini dengan background berbeda

---

#### ⏳ Task 3.3: Styling Jam Istirahat
**Fitur**: Cell jam 11:45-13:15 abu-abu, merge horizontal

**Steps**:
- [ ] Tambah logic untuk detect slot istirahat
- [ ] Merge cell horizontal dengan colspan
- [ ] Background abu-abu + text "ISTIRAHAT"
- [ ] Mata kuliah yang meloncati istirahat: skip cell istirahat

---

### **FASE 4: DASHBOARD DOSEN IMPROVEMENTS**

#### ⏳ Task 4.1: Tambah Jadwal Hari Ini
**Fitur**: Tampilkan jadwal dosen hari ini di dashboard

**Steps**:
- [ ] Update DashboardController - query jadwal hari ini
- [ ] Update dosen-dashboard.tsx - tampilkan jadwal hari ini
- [ ] Highlight jadwal dosen sendiri

---

### **FASE 5: BOOKING LAB - INTERACTIVE CALENDAR**
**Target**: Ubah UI booking jadi kalender interaktif

#### ⏳ Task 5.1: Redesign UI Booking Lab
**Konsep**: 2 Tab - Tab Kalender & Tab Request

**Steps**:
- [ ] Buat komponen Tab untuk switch view
- [ ] Tab 1: Kalender Grid (copy dari Jadwal Final)
- [ ] Tab 2: List Request Booking (existing)
- [ ] Tambah logic untuk cek slot kosong
- [ ] Tambah logic untuk cek dosen tidak masuk

---

#### ⏳ Task 5.2: Click Cell untuk Booking
**Fitur**: Klik cell kosong → popup booking

**Steps**:
- [ ] Tambah onClick handler di cell kosong
- [ ] Disable click untuk cell yang sudah terisi (dosen masuk)
- [ ] Enable click untuk cell yang dosen tidak masuk
- [ ] Popup dialog konfirmasi booking
- [ ] Form: keperluan & keterangan
- [ ] Submit booking langsung dari dialog

---

#### ⏳ Task 5.3: Validasi Booking
**Syarat Booking**:
1. Slot kosong (tidak ada jadwal) ATAU
2. Jadwal ada tapi dosen status "tidak_masuk"
3. Jam selesai tidak menimpa jam mulai jadwal lain

**Steps**:
- [ ] Buat method `checkBookingAvailability()` di controller
- [ ] Validasi di backend sebelum save
- [ ] Tampilkan error jika tidak valid

---

### **FASE 6: TUKAR JADWAL - DRAG & DROP**
**Target**: Ubah UI tukar jadwal jadi drag & drop

#### ⏳ Task 6.1: Redesign UI Tukar Jadwal
**Konsep**: 3 Tab - Kalender, Request Saya, Request Masuk

**Steps**:
- [ ] Install library drag & drop (react-dnd atau react-beautiful-dnd)
- [ ] Buat Tab 1: Kalender dengan drag & drop
- [ ] Buat Tab 2: Request Saya (existing)
- [ ] Buat Tab 3: Request Masuk (existing)

---

#### ⏳ Task 6.2: Drag Jadwal ke Jadwal Lain (Tukar)
**Fitur**: Drag jadwal sendiri → drop ke jadwal dosen lain

**Steps**:
- [ ] Make cell jadwal sendiri draggable
- [ ] Make cell jadwal dosen lain droppable
- [ ] OnDrop → popup konfirmasi tukar
- [ ] Form: alasan tukar
- [ ] Submit request tukar jadwal

---

#### ⏳ Task 6.3: Drag Jadwal ke Slot Kosong (Pindah)
**Fitur**: Drag jadwal sendiri → drop ke slot kosong

**Steps**:
- [ ] Make cell kosong droppable
- [ ] OnDrop → popup konfirmasi pindah
- [ ] Form: alasan pindah
- [ ] Submit request (tetap di tabel tukar_jadwal, tapi mitra_id null)

---

#### ⏳ Task 6.4: Validasi Tukar/Pindah
**Syarat Tukar**:
- Kedua jadwal status "terjadwal"
- Tidak bisa tukar jadwal yang sudah lewat
- Hanya berlaku 1x (untuk pertemuan tertentu)

**Syarat Pindah**:
- Slot tujuan kosong
- Tidak bentrok dengan jadwal lain
- Hanya berlaku 1x

**Steps**:
- [ ] Buat validation logic di backend
- [ ] Tampilkan error jika tidak valid
- [ ] Save ke tabel tukar_jadwal

---

### **FASE 7: GENERATE ULANG & RESET**

#### ⏳ Task 7.1: Reset Booking & Tukar saat Generate
**Fitur**: Saat generate ulang, hapus semua booking & tukar jadwal

**Steps**:
- [ ] Update JadwalGeneratorController
- [ ] Sebelum generate: delete all from `booking_laboratorium`
- [ ] Sebelum generate: delete all from `tukar_jadwal`
- [ ] Tampilkan warning sebelum generate
- [ ] Konfirmasi dialog: "Generate akan menghapus semua booking & tukar jadwal"

---

## 📊 PROGRESS SUMMARY

### Fase 1: FIX CRUD & BASIC FIXES
- Task 1.1: ✅ 90% DONE (tinggal Edit.tsx)
- Task 1.2: ⏳ NOT STARTED

### Fase 2: STATUS MANAGEMENT
- Task 2.1: ⏳ NOT STARTED
- Task 2.2: ⏳ NOT STARTED

### Fase 3: KALENDER GRID IMPROVEMENTS
- Task 3.1: ⏳ NOT STARTED
- Task 3.2: ⏳ NOT STARTED
- Task 3.3: ⏳ NOT STARTED

### Fase 4: DASHBOARD IMPROVEMENTS
- Task 4.1: ⏳ NOT STARTED

### Fase 5: BOOKING LAB INTERACTIVE
- Task 5.1: ⏳ NOT STARTED
- Task 5.2: ⏳ NOT STARTED
- Task 5.3: ⏳ NOT STARTED

### Fase 6: TUKAR JADWAL DRAG & DROP
- Task 6.1: ⏳ NOT STARTED
- Task 6.2: ⏳ NOT STARTED
- Task 6.3: ⏳ NOT STARTED
- Task 6.4: ⏳ NOT STARTED

### Fase 7: GENERATE & RESET
- Task 7.1: ⏳ NOT STARTED

---

## 🎯 NEXT STEPS

**Immediate** (Sekarang):
1. ✅ Selesaikan Edit.tsx Dosen
2. Fix Edit Jadwal Master (auto-fill)
3. Update enum status sesi jadwal

**Short Term** (1-2 jam):
4. Mekanisme dosen tidak masuk
5. Kalender grid improvements
6. Dashboard dosen - jadwal hari ini

**Medium Term** (2-3 jam):
7. Booking lab interactive calendar
8. Click cell untuk booking

**Long Term** (3-4 jam):
9. Tukar jadwal drag & drop
10. Generate & reset mechanism

---

## 📌 CATATAN PENTING

### Known Issues:
1. ~~CRUD Dosen tidak lengkap~~ ✅ FIXED
2. Edit Jadwal Master field kosong - **BELUM FIX**
3. Halaman tidak ditemukan untuk TukarJadwal & BookingLab - **PERLU CEK**

### Dependencies:
- Fase 2 (Status) harus selesai sebelum Fase 5 (Booking)
- Fase 3 (Kalender) berguna untuk Fase 5 & 6
- Fase 6 membutuhkan library drag & drop (belum install)

### Estimasi Waktu Total:
- **Fase 1**: 30 menit ✅
- **Fase 2**: 1 jam
- **Fase 3**: 1 jam
- **Fase 4**: 30 menit
- **Fase 5**: 2 jam
- **Fase 6**: 3 jam (paling kompleks)
- **Fase 7**: 30 menit

**TOTAL**: ~8-9 jam pengerjaan

---

**Last Updated**: 11 Nov 2025, 00:30 WIB  
**Progress**: 10% Complete (1/10 fase minor selesai)
