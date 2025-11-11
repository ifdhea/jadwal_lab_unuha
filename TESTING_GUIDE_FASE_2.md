# TESTING GUIDE - Fase 2 Features

## ✅ FITUR YANG SUDAH BISA DI-TEST

### 1. Status "Tidak Masuk" (Jadwal Final)

**Login sebagai:** Dosen (ahmad.hidayat@unuha.ac.id / password)

**Steps:**
1. Navigate ke `/jadwal`
2. Pilih semester yang aktif
3. Pilih minggu ke-1 atau minggu saat ini
4. Cari jadwal Anda (jadwal dengan background warna berbeda)
5. Pada card jadwal Anda, akan ada button **"Tidak Masuk"**
6. Klik button tersebut
7. Confirm dialog
8. Status berubah menjadi "Tidak Masuk" dengan badge
9. Button berganti menjadi **"Reset Status"**
10. Klik "Reset Status" untuk kembali ke "Terjadwal"

**Expected Result:**
- ✅ Button "Tidak Masuk" hanya muncul di jadwal milik dosen yang login
- ✅ Button tidak muncul jika jadwal sudah lewat
- ✅ Status berubah dengan sukses
- ✅ Badge status update dengan label yang benar
- ✅ Flash message success muncul

**Known Limitations:**
- Button hanya untuk jadwal hari ini atau yang akan datang
- Tidak bisa ubah jadwal yang sudah selesai/lewat

---

### 2. View Jadwal Final (Semua Role)

**Login sebagai:** Super Admin / Dosen

**Steps:**
1. Navigate ke `/jadwal`
2. Pilih semester
3. Pilih minggu
4. Lihat grid jadwal per kampus (tabs)

**Expected Result:**
- ✅ Grid menampilkan jadwal dengan warna berbeda per dosen
- ✅ Info lengkap: Matkul, Kelas, Dosen, Lab, Waktu, SKS
- ✅ Badge status ditampilkan
- ✅ Tabs per kampus berfungsi
- ✅ Filter semester & minggu berfungsi

---

### 3. Booking Laboratorium (Routes Ready)

**Status:** Backend ready, Frontend masih existing version

**Test Route:**
```
GET http://jadwal_lab.test/booking-lab
```

**Expected:**
- ✅ Halaman terbuka (masih versi lama dengan list booking)
- ✅ Tidak ada error 404
- ✅ Data booking ditampilkan (jika ada)

**Note:** 
- UI baru belum di-implement
- Backend `calendar()` sudah ready
- Data structure sudah siap

---

## 🔄 FITUR YANG BELUM BISA DI-TEST (Work in Progress)

### 1. Booking Lab - Kalender Grid
**Status:** Backend ready, Frontend pending
**File:** `resources/js/pages/BookingLaboratorium/Index.tsx` (backup available)

**What's Ready:**
- ✅ Backend `calendar()` method
- ✅ Route `/booking-lab` → calendar
- ✅ Data structure: jadwalData, availableSlots, bookings
- ⏳ Frontend UI with 2 tabs

**Next Steps:**
1. Implement new Index.tsx with tabs
2. Copy grid from Jadwal/Index.tsx
3. Add click handlers for available slots
4. Create BookingDialog

---

### 2. Tukar Jadwal
**Status:** Routes exist, Controller minimal, UI missing

**Routes:**
- GET `/tukar-jadwal` → 404 (halaman belum dibuat)
- POST `/tukar-jadwal/{id}/approve`
- POST `/tukar-jadwal/{id}/reject`
- POST `/tukar-jadwal/{id}/cancel`

**Need:**
- Index.tsx with 3 tabs
- Drag & drop functionality
- Calendar grid
- Request handling

---

## 🐛 KNOWN BUGS TO FIX

### 1. Sidebar Dosen - Menu Super Admin Muncul ⚠️
**Issue:** Saat login sebagai dosen, sidebar masih tampil menu super admin

**How to Reproduce:**
1. Login sebagai dosen (ahmad.hidayat@unuha.ac.id / password)
2. Check sidebar kiri
3. Menu "Master Data" (seharusnya hidden) masih terlihat

**Fix Needed:**
- File: `resources/js/layouts/app-layout.tsx` atau sidebar component
- Conditional menu berdasarkan `auth.user.peran`

**Priority:** Medium (not breaking, but confusing)

---

### 2. Edit Jadwal Master - Dropdown Kosong
**Issue:** Saat edit jadwal master, dropdown semester & hari tidak terisi

**How to Reproduce:**
1. Login sebagai super admin
2. Go to Jadwal Master
3. Klik Edit pada salah satu jadwal
4. Form terbuka, tapi semester & hari kosong

**Fix Needed:**
- File: `app/Http/Controllers/JadwalMasterController.php`  - edit()
- File: `resources/js/pages/JadwalMaster/Edit.tsx`
- Pass & pre-select current values

**Priority:** Low (data masih bisa di-edit, cuma UX tidak baik)

---

## 📊 TEST CHECKLIST

### Before Testing:
- [ ] Build frontend: `npm run build` ✅ (Done)
- [ ] Clear cache: `php artisan config:clear`
- [ ] Check database: Pastikan ada data semester, jadwal, dosen
- [ ] Login credentials ready

### Test Scenarios:

#### Scenario 1: Dosen Set Status Tidak Masuk
- [ ] Login sebagai dosen
- [ ] Navigate ke Jadwal
- [ ] Find jadwal milik dosen
- [ ] Click "Tidak Masuk"
- [ ] Verify status changed
- [ ] Verify badge updated
- [ ] Click "Reset Status"
- [ ] Verify kembali ke "Terjadwal"

#### Scenario 2: Jadwal Lewat - Button Tidak Muncul
- [ ] Set minggu ke minggu lama (sudah lewat)
- [ ] Verify button "Tidak Masuk" tidak muncul
- [ ] Check untuk jadwal yang tanggalnya sudah lewat

#### Scenario 3: Dosen Lain - Button Tidak Muncul
- [ ] Login sebagai dosen
- [ ] Lihat jadwal dosen lain di grid
- [ ] Verify button tidak muncul di jadwal dosen lain
- [ ] Only muncul di jadwal sendiri

#### Scenario 4: Admin View Jadwal
- [ ] Login sebagai super admin
- [ ] Navigate ke Jadwal
- [ ] Verify grid tampil normal
- [ ] Check status badges
- [ ] No "Tidak Masuk" button (admin tidak punya jadwal sendiri)

---

## 🚀 QUICK TEST COMMANDS

```bash
# Login Credentials
Super Admin: admin@unuha.ac.id / password
Dosen 1:     ahmad.hidayat@unuha.ac.id / password
Dosen 2:     siti.fatimah@unuha.ac.id / password

# Clear everything
php artisan config:clear && php artisan cache:clear && php artisan view:clear

# Check routes
php artisan route:list | grep sesi-jadwal
php artisan route:list | grep booking

# Rebuild frontend
npm run build

# Dev mode (auto rebuild)
npm run dev
```

---

## 📸 EXPECTED SCREENSHOTS

### 1. Jadwal dengan Button "Tidak Masuk"
- Card jadwal dengan gradient color
- Badge status "Terjadwal"
- Button "Tidak Masuk" di bottom
- Button full width, small size

### 2. Jadwal setelah Set "Tidak Masuk"
- Badge status berubah jadi "Tidak Masuk" (outline variant)
- Button berganti jadi "Reset Status"
- No visual change lainnya di grid

### 3. Jadwal Dosen Lain (No Button)
- Card normal dengan info
- No action buttons
- Readonly view

---

## 🎯 ACCEPTANCE CRITERIA

### Fase 2A - Status Tidak Masuk: ✅ PASS
- [x] Dosen bisa set status tidak masuk
- [x] Dosen bisa reset status ke terjadwal
- [x] Button hanya muncul untuk jadwal sendiri
- [x] Button tidak muncul untuk jadwal lewat
- [x] Status tersimpan di database
- [x] Badge updated
- [x] Flash message muncul

### Fase 2B - Booking Lab: 🔄 IN PROGRESS (60%)
- [x] Routes exist & accessible
- [x] Backend calendar() method ready
- [x] Data structure defined
- [ ] Frontend dengan 2 tabs (pending)
- [ ] Grid kalender booking (pending)
- [ ] Click handler untuk booking (pending)
- [ ] Form dialog booking (pending)

---

**Test Report Template:**

```
Test Date: _______
Tester: _______
Browser: _______

Feature: Status Tidak Masuk
- [ ] PASS / [ ] FAIL
Notes: _______

Feature: Jadwal Grid Display
- [ ] PASS / [ ] FAIL
Notes: _______

Bugs Found:
1. _______
2. _______
```

---

**Last Updated:** 11 Nov 2025 09:00 WIB  
**Next:** Implement BookingLaboratorium frontend UI
