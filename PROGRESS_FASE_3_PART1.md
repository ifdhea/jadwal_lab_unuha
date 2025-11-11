# Progress Development - Fase 3 Part 1
## Tanggal: 11 November 2025

---

## ✅ DONE - Error Fixes

### 1. Fix BookingLaboratorium Index Error
- **Status**: SELESAI ✅
- **Problem**: Halaman booking lab blank putih dengan error `Cannot read properties of undefined (reading 'status')` dan `(reading 'length')`
- **Root Cause**: 
  - Route `/booking-lab` mengarah ke method `calendar()` yang return data berbeda dengan yang diharapkan component
  - Component Index.tsx mengharapkan structure dari method `index()` (table view)
  - Method `calendar()` return structure untuk kalender view
- **Solution**:
  - Update PageProps interface untuk handle both data structures (array dan object with data property)
  - Add conditional rendering dengan safe navigation (`?.`) 
  - Handle both `Array.isArray(bookings)` dan `bookings?.data`
- **Files Changed**:
  - `resources/js/Pages/BookingLaboratorium/Index.tsx` (lines 57-105, 237-261)

---

## 🔄 IN PROGRESS - Current Tasks

### 2. Sidebar Navigation per Role
- **Status**: BELUM DIMULAI ⏳
- **Problem**: Sidebar navigation masih sama untuk semua role (super_admin, dosen)
- **Required**: Buat komponen sidebar dinamis berdasarkan role user
- **Files to Check/Modify**:
  - `resources/js/layouts/app-layout.tsx` atau `sidebar.tsx`
  - `resources/js/components/Navigation.tsx`

### 3. Dashboard Dosen - Tampilkan Jadwal Kalender
- **Status**: BELUM DIMULAI ⏳
- **Requirements**:
  - Ganti tampilan "Jadwal Minggu Ini" dan "Jadwal Bulan Ini" dengan kalender grid seperti halaman Jadwal
  - Embed jadwal kalender dari halaman jadwal ke dashboard
  - Tambah tombol "Tidak Masuk" pada Jadwal Hari Ini di dashboard
- **Files Involved**:
  - `resources/js/Pages/Dashboard/Index.tsx` (Dosen dashboard)
  - Possibly reuse `resources/js/Pages/Jadwal/Index.tsx` components

### 4. Jadwal - Auto Scroll to Current Week
- **Status**: BELUM DIMULAI ⏳
- **Requirements**:
  - Saat buka halaman jadwal pertama kali, langsung scroll ke minggu di tanggal hari ini
  - Bukan default ke minggu pertama
- **Implementation Notes**:
  - Detect current date
  - Calculate which week dalam semester
  - Auto select dan scroll to that week
- **Files to Modify**:
  - `resources/js/Pages/Jadwal/Index.tsx`

### 5. Jadwal Master Edit - Auto Fill Semester & Hari
- **Status**: BELUM DIMULAI ⏳
- **Problem**: Ketika edit jadwal master, field semester dan hari tidak terisi otomatis
- **Solution**: Pre-fill form dengan data existing
- **Files to Modify**:
  - `resources/js/Pages/JadwalMaster/Edit.tsx`
  - `app/Http/Controllers/JadwalMasterController.php` (edit method)

### 6. CRUD Dosen - Super Admin
- **Status**: BELUM DIMULAI ⏳
- **Problem**: Belum bisa edit dan tambah dosen di superadmin panel
- **Current**: Data dosen hanya ada di database (manual insert)
- **Files to Create/Modify**:
  - `resources/js/Pages/Dosen/Index.tsx`
  - `resources/js/Pages/Dosen/Create.tsx`
  - `resources/js/Pages/Dosen/Edit.tsx`
  - `app/Http/Controllers/DosenController.php`

---

## 📋 TODO - Next Phase Features

### 7. Tukar Jadwal - Drag & Drop Interface
- **Status**: NOT STARTED 🔴
- **Requirements**:
  - 3 tabs: Kalender (drag & drop), Request Terkirim, Request Masuk
  - Drag jadwal sendiri ke jadwal orang lain → popup konfirmasi dengan form alasan
  - Drag jadwal ke slot kosong → pindah jadwal (bukan tukar)
  - Auto submit dengan data lengkap (pemohon_id, mitra_id, sesi_jadwal_ids, dll)
- **Implementation Strategy**:
  - Use React DnD library atau HTML5 Drag & Drop API
  - Reuse calendar grid dari Jadwal/Index
  - Create modal confirmation component

### 8. Booking Lab - Calendar Click Interface
- **Status**: NOT STARTED 🔴
- **Requirements**:
  - 2 tabs: Kalender (untuk booking), Request Booking
  - Hanya bisa klik cell yang kosong ATAU status = tidak_masuk
  - Klik cell → popup konfirmasi booking
  - Jika approve, status = 'booking', bukan 'terjadwal'
- **Special Rules**:
  - Slot kosong = bisa booking
  - Jadwal dengan status dosen tidak masuk = bisa booking
  - Jadwal normal (dosen masuk) = tidak bisa diklik

### 9. Mekanisme Dosen Tidak Masuk
- **Status**: PARTIALLY DONE (model exists) ⚠️
- **Existing**:
  - Field `status` di tabel `sesi_jadwal`
  - Enum values include: 'dosen_tidak_hadir'
- **Need to Implement**:
  - UI untuk dosen tandai tidak masuk
  - Auto update slot jadi available untuk booking
  - Notifikasi atau log
- **Files Involved**:
  - `app/Http/Controllers/SesiJadwalController.php` (updateStatus method exists)
  - UI buttons di Jadwal dan Dashboard

### 10. Status Management untuk Jadwal
- **Status**: NOT STARTED 🔴
- **Requirements**:
  - Status jadwal yang sudah terlewat → 'selesai' atau 'terlaksana'
  - Status 'terjadwal' hanya untuk jadwal yang belum terjadi
  - Status 'tidak_masuk' untuk dosen yang absent
  - Status 'booking' untuk slot yang dibooking dosen lain
- **Implementation**:
  - Scheduled job untuk auto update status past schedules
  - Or update on page load/check

### 11. Generate Jadwal - Reset Tukar & Booking
- **Status**: NOT STARTED 🔴
- **Requirements**:
  - Ketika generate ulang jadwal (button di Jadwal Master admin)
  - Semua data tukar_jadwal harus dihapus
  - Semua data booking_laboratorium harus dihapus
  - Fresh start untuk semester baru
- **Files to Modify**:
  - `app/Http/Controllers/JadwalGeneratorController.php`
  - Add confirmation dialog: "Generate ulang akan menghapus semua data tukar jadwal dan booking"

### 12. Jadwal Grid - Tambah Tanggal di Header
- **Status**: NOT STARTED 🔴
- **Requirements**:
  - Di atas kolom "Hari" (Senin, Selasa, dll), kasih tanggal
  - Format: "Senin, 20 Nov 2025"
- **Files to Modify**:
  - `resources/js/Pages/Jadwal/Index.tsx`
  - `resources/js/Pages/TukarJadwal/Index.tsx` (kalau sudah dibuat)
  - `resources/js/Pages/BookingLaboratorium/Index.tsx`

### 13. Jam Istirahat - Special Styling
- **Status**: NOT STARTED 🔴
- **Requirements**:
  - Jam 11:45-13:15 → gray background
  - Merge horizontal (colspan full width)
  - Text center: "ISTIRAHAT"
  - Jika ada matkul yang lewat istirahat (mulai sebelum, selesai sesudah), skip cell istirahat
- **Alternative** (jika susah):
  - Hide row istirahat completely dari grid
- **Files to Modify**:
  - Grid rendering logic di `resources/js/Pages/Jadwal/Index.tsx`

---

## 🚀 NEXT SESSION ACTION PLAN

### Priority 1 (Critical - Harus selesai dulu):
1. ✅ Fix Sidebar Navigation per Role
2. ✅ CRUD Dosen (SuperAdmin)
3. ✅ Jadwal Master - Auto fill form edit

### Priority 2 (Important):
4. ✅ Dashboard Dosen - Embed Kalender Jadwal
5. ✅ Jadwal - Auto scroll to current week
6. ✅ Jadwal Grid - Tambah Tanggal di Header

### Priority 3 (Complex Features):
7. ⏳ Mekanisme Dosen Tidak Masuk (UI + Logic)
8. ⏳ Status Management untuk Jadwal
9. ⏳ Tukar Jadwal - Drag & Drop Interface
10. ⏳ Booking Lab - Calendar Click Interface

### Priority 4 (Polish):
11. ⏳ Jam Istirahat - Special Styling
12. ⏳ Generate Jadwal - Reset Tukar & Booking

---

## 📝 NOTES & CONSIDERATIONS

### Database Structure (Current):
- ✅ Tabel `tukar_jadwal` exists
- ✅ Tabel `booking_laboratorium` exists
- ✅ Tabel `sesi_jadwal` has status enum
- ✅ Foreign keys properly set

### Pending Decisions:
1. **Tukar Jadwal Duration**: Apakah hanya berlaku 1 minggu atau permanent sampai generate ulang?
   - **Current Understanding**: Hanya berlaku untuk minggu tersebut, minggu depan balik normal
   - **Alternative**: Bisa pilih juga permanent (update di jadwal_master)

2. **Booking Lab Approval**: Apakah auto approve atau perlu approval admin?
   - **Current**: Need admin approval (status: menunggu → disetujui)
   - **Could be**: Auto approve untuk slot kosong, need approval untuk slot dengan dosen tidak masuk

3. **Notification System**: Perlu implement atau tidak?
   - **Current**: Belum ada
   - **Nice to have**: Notifikasi untuk request tukar jadwal, booking approved/rejected

### Technical Debt:
- [ ] Breadcrumbs not consistently used across all pages
- [ ] Need to standardize date format display
- [ ] Need to add loading states to forms
- [ ] Need to add error handling for API calls

---

## 🐛 KNOWN ISSUES

1. ~~Booking Lab page blank white~~ - **FIXED** ✅
2. Sidebar sama untuk semua role - **PENDING**
3. Jadwal Master edit form tidak auto fill - **PENDING**
4. Dosen CRUD belum ada UI - **PENDING**

---

## 📊 COMPLETION STATUS

**Fase 2 (CRUD Super Admin)**: 95% ✅
- Semua CRUD master data done
- Jadwal Master & Generate done
- Sedikit polish needed (edit form auto-fill)

**Fase 3 Part 1 (Fixes & Polish)**: 10% ⏳
- Fix booking lab error ✅
- Sidebar navigation ⏳
- Dashboard improvements ⏳
- Jadwal improvements ⏳

**Fase 3 Part 2 (Advanced Features)**: 0% 🔴
- Tukar Jadwal UI
- Booking Lab UI
- Status Management
- Dosen Tidak Masuk mechanism

---

**Last Updated**: 11 November 2025, 08:24 WIB
**Next Session**: Continue with Priority 1 tasks (Sidebar, CRUD Dosen, Jadwal Master edit)
