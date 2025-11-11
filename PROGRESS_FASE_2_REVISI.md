# PROGRESS REVISI FASE 2 - JADWAL LAB UNUHA

## Tanggal: 11 November 2025

### DAFTAR MASALAH & STATUS PERBAIKAN

#### 1. ✅ **PERBAIKAN ERROR BOOKING LAB** 
- **Masalah**: Halaman Booking Lab error (blank putih) dengan error "Cannot read properties of undefined (reading 'status')" dan "Cannot read properties of undefined (reading 'length')"
- **Penyebab**: Controller mengembalikan data dengan `.through()` yang tidak kompatibel dengan struktur yang diharapkan
- **Solusi**: ✅ **SELESAI** - Memperbaiki BookingLaboratoriumController.php untuk mengembalikan struktur data yang benar dengan null-safe checks

#### 2. ⏳ **SIDEBAR DOSEN** 
- **Masalah**: Sidebar untuk role dosen masih menampilkan menu super admin
- **Action Required**: Perlu membuat/memperbaiki sidebar khusus dosen
- **Status**: BELUM DIKERJAKAN

#### 3. ⏳ **HALAMAN DASHBOARD DOSEN**
- **Masalah**: Jadwal minggu ini dan bulan ini perlu diganti dengan kalender seperti halaman jadwal
- **Requirement**:
  - Hapus jadwal minggu ini & bulan ini
  - Embed komponen jadwal/kalender ke dashboard
  - Jadwal hari ini tetap ditampilkan
  - Tambah tombol "Tidak Masuk" pada jadwal hari ini
- **Status**: BELUM DIKERJAKAN

#### 4. ⏳ **MEKANISME STATUS DOSEN TIDAK MASUK**
- **Requirement**:
  - Perlu ada mekanisme untuk dosen menandai tidak masuk
  - Ketika dosen tidak masuk, lab menjadi kosong dan bisa dibooking
  - Status perlu ditambahkan di tabel sesi_jadwal
- **Status**: BELUM DIKERJAKAN

#### 5. ⏳ **MEKANISME BOOKING LAB**
- **Requirement Kompleks**:
  - **Syarat 1**: Lab harus kosong (tidak ada jadwal terjadwal)
  - **Syarat 2**: Atau status dosen lain "tidak masuk"
  - **Syarat 3**: Jam selesai booking tidak boleh menimpa jam mulai jadwal lain
  - Hanya bisa booking slot kosong
  - Klik cell kosong → popup konfirmasi → status "booking" (bukan "terjadwal")
- **Status**: BELUM DIKERJAKAN

#### 6. ⏳ **HALAMAN TUKAR JADWAL - DENGAN DRAG & DROP**
- **Requirement Kompleks**:
  - **3 Tab**:
    1. Tab Kalender (drag & drop jadwal)
    2. Tab Request Tukar (request dari dosen ini)
    3. Tab Request Masuk (request dari dosen lain)
  - **Fitur Drag & Drop**:
    - Drag jadwal sendiri ke jadwal orang lain → popup konfirmasi → submit
    - Bisa drag ke slot kosong (berarti pindah, bukan tukar)
    - Otomatis isi pemohon_id, mitra_id, sesi_jadwal_pemohon_id, sesi_jadwal_mitra_id
  - **Perbedaan dengan Booking**:
    - Tukar: drag jadwal yang ada (ada jadwal asal yang kosong)
    - Booking: klik slot kosong (tidak ada jadwal asal)
- **Status**: BELUM DIKERJAKAN

#### 7. ⏳ **HALAMAN BOOKING LAB - TAB & KALENDER**
- **Requirement**:
  - **2 Tab**:
    1. Tab Jadwal/Kalender (tampilan seperti jadwal final admin)
    2. Tab Request Booking
  - **Syarat Klik Cell**:
    - Hanya bisa klik cell jika:
      a. Jadwal kosong/tidak ada slot, ATAU
      b. Status dosen lain "tidak masuk"
    - Tidak bisa klik jadwal yang dosen masuk normal
  - Klik → popup → konfirmasi → status "booking"
- **Status**: BELUM DIKERJAKAN

#### 8. ⏳ **JADWAL FINAL & JADWAL DOSEN - TANGGAL DI HEADER**
- **Requirement**:
  - Di atas kolom "Hari" perlu ditambahkan tanggal
  - Kalender langsung buka di minggu/tanggal hari ini (bukan minggu 1)
  - Penanda visual untuk jadwal dosen sendiri (highlight)
- **Status**: BELUM DIKERJAKAN

#### 9. ⏳ **JAM ISTIRAHAT (11:45-13:15)**
- **Requirement**:
  - Cell istirahat berwarna abu-abu
  - Merge horizontal penuh dengan tulisan "ISTIRAHAT"
  - Jadwal yang melewati istirahat meloncati cell istirahat
  - **Jika susah**: hapus saja baris jam istirahat
- **Status**: BELUM DIKERJAKAN

#### 10. ⏳ **EDIT JADWAL MASTER - AUTO-FILL**
- **Masalah**: Saat edit jadwal master, field semester dan hari tidak terisi otomatis
- **Requirement**: Auto-fill semua field saat edit
- **Status**: BELUM DIKERJAKAN

#### 11. ⏳ **CRUD DOSEN - SUPERADMIN**
- **Masalah**: Belum bisa tambah & edit dosen dari UI superadmin (sekarang manual via database)
- **Requirement**: Lengkapi CRUD dosen di superadmin
- **Status**: BELUM DIKERJAKAN

#### 12. ⏳ **GENERATE ULANG - RESET DATA**
- **Requirement**:
  - Saat generate ulang jadwal, semua data tukar_jadwal & booking_laboratorium harus di-reset (dihapus)
  - Jadwal kembali ke jadwal master
- **Status**: BELUM DIKERJAKAN

#### 13. ⏳ **STATUS JADWAL - TERLAKSANA**
- **Requirement**:
  - Jadwal yang sudah lewat tanggalnya harus berubah status dari "terjadwal" menjadi "terlaksana"/"selesai"
  - Tampilkan status ini di grid jadwal dengan visual yang jelas
- **Status**: BELUM DIKERJAKAN

---

## RENCANA PENGERJAAN BERTAHAP

### Sesi 1: ✅ Perbaikan Error Dasar (SELESAI)
- ✅ Fix Booking Lab error

### Sesi 2: Perbaikan UI & Navigasi (NEXT)
- [ ] Perbaiki Sidebar Dosen
- [ ] Perbaiki Dashboard Dosen (embed kalender)
- [ ] Auto-scroll ke tanggal hari ini di kalender
- [ ] Tambahkan tanggal di header jadwal

### Sesi 3: Mekanisme Status & Kehadiran
- [ ] Implementasi mekanisme "Tidak Masuk"
- [ ] Update status jadwal otomatis (terlaksana)
- [ ] Tombol "Tidak Masuk" di dashboard dosen

### Sesi 4: CRUD & Edit
- [ ] Perbaiki edit jadwal master (auto-fill)
- [ ] Lengkapi CRUD dosen
- [ ] Handle jam istirahat di kalender

### Sesi 5: Booking Lab (Kompleks)
- [ ] Tab & UI halaman booking
- [ ] Logika cek slot tersedia
- [ ] Validasi jam tidak overlap
- [ ] Popup & submit booking

### Sesi 6: Tukar Jadwal (Paling Kompleks)
- [ ] UI 3 tab
- [ ] Implementasi drag & drop
- [ ] Logika tukar vs pindah
- [ ] Popup konfirmasi & submit
- [ ] Handle request masuk & keluar

### Sesi 7: Finalisasi
- [ ] Reset data saat generate ulang
- [ ] Testing semua fitur
- [ ] Bug fixing
- [ ] Dokumentasi

---

## CATATAN PENTING

### Database Struktur Saat Ini:
- ✅ `tukar_jadwal` - sudah ada
- ✅ `booking_laboratorium` - sudah ada
- ✅ `sesi_jadwal` - jadwal final (bukan jadwal_master)
- ⚠️ `sesi_jadwal.status` - perlu dipastikan ada enum untuk 'tidak_masuk'

### Konsep Penting:
1. **jadwal_master** = Data mentah input admin, bisa konflik
2. **sesi_jadwal** = Jadwal real hasil generate, sudah diselesaikan konfliknya dengan rolling
3. **Tukar Jadwal** = Menukar 2 jadwal (atau pindah ke slot kosong), hanya berlaku untuk sesi tertentu, tidak permanen
4. **Booking Lab** = Booking slot kosong (karena tidak ada jadwal atau dosen tidak masuk)
5. **Generate Ulang** = Reset semua tukar & booking, kembali ke jadwal master

### Pola Minggu (Rolling):
- Jika ada 2 jadwal konflik di slot sama: [1,0,1,0,1,0,...] dan [0,1,0,1,0,1,...]
- Jika 3 konflik: rolling 1-4-7-10, 2-5-8-11, 3-6-9-12

---

## PROGRESS TRACKING

**Tanggal Update Terakhir**: 11 November 2025, 08:21 WIB
**Items Selesai**: 1/13 (7.7%)
**Items In Progress**: 0/13
**Items Pending**: 12/13

---

**NEXT ACTION**: Mulai Sesi 2 - Perbaikan Sidebar Dosen & Dashboard
