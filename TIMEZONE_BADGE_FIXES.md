# Timezone & Badge Fixes - Tukar Jadwal System

## ✅ Perubahan yang Sudah Dilakukan

### 1. **Timezone Asia/Jakarta** 
- ✅ Config sudah `Asia/Jakarta` di `config/app.php`
- ✅ Backend menggunakan `now()` yang otomatis pakai timezone dari config
- ✅ Logika `is_past` dan `is_active` menggunakan timezone-aware comparison
- ✅ Format: `Carbon::parse($date)->setTimezone('Asia/Jakarta')`

### 2. **Icon Tukar Jadwal (🔄)**
- ✅ Tambah field `is_swapped` di backend (TukarJadwalController & JadwalController)
- ✅ Query: Check apakah sesi ada di table `tukar_jadwal` dengan `status='disetujui'` dan `jenis='tukar'`
- ✅ Frontend: Tampilkan icon `ArrowLeftRight` di samping badge SKS jika `is_swapped=true`
- ✅ Warna icon: Purple (`text-purple-600`)

### 3. **Badge Seragam di Semua Halaman**

**Urutan Priority Badge:**
1. 🟡 **Berlangsung** (Yellow) - `is_active && !is_past` 
2. ⚫ **Sudah Lewat** (Secondary/Gray) - `is_past && !is_active`
3. 🟧 **Booking** (Orange) - `status='booking' && !is_past && !is_active`
4. 🟩 **Jadwal Saya** (Green) - `is_my_schedule && !is_past && !is_active && status='terjadwal'`
5. 🟦 **Terjadwal** (Blue) - `status='terjadwal' && !is_past && !is_active && !is_my_schedule`
6. ⚪ **Selesai** (Gray) - `status='selesai'`

**Diterapkan di:**
- ✅ Tukar Jadwal Calendar (`TukarJadwal/Calendar.tsx`)
- ✅ Jadwal Utama (`Jadwal/Index.tsx`)
- ⚠️ Booking Lab (Belum, tapi struktur sudah sama)

### 4. **Logic is_past & is_active** 

**Backend (Controller):**
```php
$now = now(); // Uses Asia/Jakarta from config
$jadwalStart = Carbon::parse($tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($waktuMulai);
$jadwalEnd = Carbon::parse($tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($waktuSelesai);

$isActive = $now->between($jadwalStart, $jadwalEnd);
$isPast = $now->greaterThan($jadwalEnd);
```

**Sudah Diterapkan:**
- ✅ TukarJadwalController (calendar method)
- ✅ TukarJadwalController (booking section)
- ✅ JadwalController (sesi jadwal section)
- ✅ JadwalController (booking section)

### 5. **Frontend Interface Update**
- ✅ Tambah `is_swapped?: boolean` ke interface `JadwalCell`
- ✅ Import `ArrowLeftRight` icon dari lucide-react
- ✅ Badge styling: Tambah `hover:bg-xxx` untuk konsistensi

## 📝 Cara Kerja

### Badge "Berlangsung"
```
Jam sekarang (Asia/Jakarta) di antara waktu_mulai dan waktu_selesai jadwal
```

### Badge "Sudah Lewat"
```
Jam sekarang (Asia/Jakarta) > waktu_selesai jadwal
```

### Icon Tukar (🔄)
```
Muncul jika sesi_jadwal_id ada di table tukar_jadwal dengan:
- status = 'disetujui'
- jenis = 'tukar'
- (sesi_jadwal_pemohon_id = id OR sesi_jadwal_mitra_id = id)
```

## 🧪 Testing

1. **Test Timezone:**
   - Buka halaman saat jadwal sedang berlangsung
   - Badge harus "Berlangsung" (yellow)
   - Setelah jam selesai, badge harus "Sudah Lewat" (gray)

2. **Test Icon Tukar:**
   - Tukar jadwal antara 2 dosen
   - Kedua jadwal harus muncul icon 🔄 (purple)
   - Jadwal yang tidak ditukar tidak ada icon

3. **Test Badge Consistency:**
   - Cek Jadwal Utama
   - Cek Tukar Jadwal  
   - Cek Booking Lab
   - Semua harus punya badge yang sama

## ⚠️ Catatan Penting

1. **Timezone:**
   - Semua comparison menggunakan `Asia/Jakarta`
   - No longer use `->isPast()` atau `->isToday()` tanpa timezone
   - Always use `Carbon::parse()->setTimezone('Asia/Jakarta')`

2. **Badge Logic:**
   - `is_active` dan `is_past` TIDAK bisa true bersamaan
   - `is_active` = sedang berlangsung SEKARANG
   - `is_past` = sudah lewat (selesai)

3. **Icon Tukar:**
   - Hanya muncul untuk jadwal yang BENAR-BENAR ditukar (disetujui)
   - Tidak muncul untuk jadwal pindah (jenis='pindah')

## 🔧 Files Changed

**Backend:**
1. `app/Http/Controllers/TukarJadwalController.php`
   - Update logic `is_past` dan `is_active` 
   - Tambah query `is_swapped`
   - Fix timezone comparison

2. `app/Http/Controllers/JadwalController.php`
   - Update logic `is_past` dan `is_active`
   - Tambah query `is_swapped`
   - Fix timezone comparison
   - Tambah `is_my_schedule` di booking

**Frontend:**
1. `resources/js/Pages/TukarJadwal/Calendar.tsx`
   - Tambah `is_swapped` interface
   - Update badge logic
   - Tambah icon tukar
   - Import `ArrowLeftRight`

2. `resources/js/Pages/Jadwal/Index.tsx`
   - Tambah `is_swapped` interface
   - Update badge logic
   - Tambah icon tukar
   - Import `ArrowLeftRight`

## 📊 Database Schema (Reference)

```sql
-- tukar_jadwal table
- id
- pemohon_id
- sesi_jadwal_pemohon_id
- mitra_id
- sesi_jadwal_mitra_id
- status (menunggu/disetujui/ditolak/dibatalkan)
- jenis (tukar/pindah)
- ...
```

## 🎯 Result

Sekarang sistem sudah:
1. ✅ Menggunakan timezone Asia/Jakarta secara konsisten
2. ✅ Menampilkan "Berlangsung" dan "Sudah Lewat" dengan akurat
3. ✅ Menampilkan icon tukar untuk jadwal yang ditukar
4. ✅ Badge seragam di semua halaman (Tukar Jadwal & Jadwal Utama)
5. ✅ Logic timezone-aware untuk perbandingan waktu

---
**Updated:** 2025-11-14
**Status:** ✅ Complete
