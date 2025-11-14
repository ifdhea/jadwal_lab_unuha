# Dashboard Fixes - Complete ✅

## Tanggal: 14 November 2025

### Perbaikan yang Telah Diterapkan

#### 1. ✅ **Fix Error TypeScript - Icon Lucide**
**Masalah:** Icon `ArrowLeftRight` menggunakan attribute `title` yang tidak didukung TypeScript
```typescript
// SEBELUM (ERROR)
<ArrowLeftRight className="h-3 w-3 text-purple-600" title="Jadwal Ditukar" />

// SESUDAH (FIXED)
<div title="Jadwal Ditukar">
    <ArrowLeftRight className="h-3 w-3 text-purple-600" />
</div>
```
**File:** `resources/js/Pages/Jadwal/Index.tsx` (line 705)

---

#### 2. ✅ **Dashboard Dosen - Jadwal Hari Ini Menampilkan Semua Jadwal**
**Masalah:** Booking hari ini tidak tampil di dashboard dosen

**Solusi:** 
- Ambil jadwal dari 2 sumber:
  1. `SesiJadwal` (jadwal dari generate, tukar, pindah)
  2. `BookingLaboratorium` (status = 'disetujui', tanggal hari ini)
- Gabungkan kedua collection
- Urutkan berdasarkan waktu_mulai

**File:** `app/Http/Controllers/DashboardController.php` (method `dosenDashboard`)

**Contoh Data yang Ditampilkan:**
```php
[
    // Dari Jadwal Master/Generate
    [
        'id' => 1143,
        'mata_kuliah' => 'Perograman Web 1',
        'kelas' => 'INF B01 - Semester 1',
        'status' => 'terjadwal',
        'source' => 'jadwal',
        ...
    ],
    // Dari Booking
    [
        'id' => 'booking_17',
        'mata_kuliah' => 'Perograman Web 1',
        'kelas' => 'INF B01 - Semester 1',
        'status' => 'booking',
        'source' => 'booking',
        ...
    ]
]
```

---

#### 3. ✅ **Pertemuan Selesai - Hitung Berdasarkan Jadwal Sudah Lewat**
**Masalah:** Pertemuan Selesai = 0, padahal banyak jadwal yang sudah lewat

**Solusi:** 
```php
// SEBELUM
$stats['pertemuan_selesai'] = SesiJadwal::whereIn('jadwal_master_id', $jadwalMasterIds)
    ->where('status', 'selesai')
    ->count();

// SESUDAH
$now = Carbon::now();
$stats['pertemuan_selesai'] = SesiJadwal::whereIn('jadwal_master_id', $jadwalMasterIds)
    ->where(function($query) use ($now) {
        // Status selesai ATAU jadwal sudah lewat
        $query->where('status', 'selesai')
              ->orWhere(function($q) use ($now) {
                  $q->whereDate('tanggal', '<', $now->toDateString());
              });
    })
    ->count();
```

**File:** `app/Http/Controllers/DashboardController.php`

---

#### 4. ✅ **Badge Dinamis di Jadwal Hari Ini**
**Update:** Badge sekarang mengikuti priority order yang sama dengan jadwal utama:
1. **Berlangsung** (highest priority) - Yellow
2. **Sudah Lewat** - Secondary
3. **Booking** - Orange
4. **Jadwal Saya** - Green
5. **Terjadwal** - Blue
6. **Selesai** - Secondary
7. **Tidak Masuk** - Outline
8. **Dibatalkan** - Destructive

**File:** `resources/js/pages/dashboard/dosen-dashboard.tsx`

---

#### 5. ✅ **Tombol "Tidak Hadir" di Jadwal Hari Ini**
**Fitur Baru:** 
- Tombol "Tidak Hadir" muncul di jadwal hari ini
- Hanya untuk jadwal milik dosen (is_my_schedule = true)
- Hanya untuk status = 'terjadwal'
- Hanya untuk jadwal yang belum lewat
- **TIDAK** tampil untuk booking

**File:** `resources/js/pages/dashboard/dosen-dashboard.tsx`

---

#### 6. ✅ **Embed Jadwal Utama di Dashboard**
**Masalah:** Dashboard hanya menampilkan link "Buka Jadwal Utama"

**Solusi:** 
```tsx
// SEBELUM
<Button onClick={() => router.visit('/jadwal')}>
    Buka Jadwal Utama
</Button>

// SESUDAH
<iframe 
    src="/jadwal"
    className="w-full border-0"
    style={{ height: '800px', minHeight: '600px' }}
    title="Jadwal Lengkap"
/>
```

**File:** `resources/js/pages/dashboard/dosen-dashboard.tsx`

**Benefit:**
- Dosen bisa langsung lihat dan interaksi dengan jadwal lengkap
- Tidak perlu pindah halaman
- Fitur tukar jadwal, tidak hadir, dll bisa diakses langsung

---

#### 7. ✅ **Badge "Sudah Lewat" pada Booking Lab**
**Status:** ✅ Sudah diterapkan sebelumnya

Badge `is_past` dan `is_active` sudah ditambahkan di:
- **File:** `app/Http/Controllers/JadwalController.php` (line 268-270)
- **File:** `app/Http/Controllers/BookingLaboratoriumController.php`

**Logic:**
```php
$now = now();
$jadwalStart = Carbon::parse($tanggal)->setTimezone('Asia/Jakarta')
    ->setTimeFromTimeString($booking->slotWaktuMulai->waktu_mulai);
$jadwalEnd = Carbon::parse($tanggal)->setTimezone('Asia/Jakarta')
    ->setTimeFromTimeString($booking->slotWaktuSelesai->waktu_selesai);
$isActive = $now->between($jadwalStart, $jadwalEnd);
$isPast = $now->greaterThan($jadwalEnd);
```

---

### Testing Checklist

- [x] TypeScript error fixed (no more compilation errors)
- [x] Build frontend berhasil
- [x] Dashboard dosen menampilkan booking hari ini
- [x] Pertemuan selesai dihitung dengan benar
- [x] Badge dinamis sesuai priority
- [x] Tombol "Tidak Hadir" berfungsi
- [x] Embed jadwal utama di dashboard
- [x] Badge "sudah lewat" pada booking

---

### File yang Dimodifikasi

1. `resources/js/Pages/Jadwal/Index.tsx`
2. `app/Http/Controllers/DashboardController.php`
3. `resources/js/pages/dashboard/dosen-dashboard.tsx`

---

### Catatan Penting

1. **Booking Hari Ini:** Sekarang ditampilkan dengan `id = 'booking_{id}'` untuk membedakan dari jadwal reguler
2. **Tombol Action:** Tombol "Tidak Hadir" dan "Reset Status" tidak akan muncul untuk booking
3. **Badge Priority:** Mengikuti urutan yang sama dengan halaman jadwal utama
4. **Iframe:** Menggunakan iframe untuk embed jadwal, sehingga semua fitur interaktif tetap berfungsi

---

### Screenshot yang Diperbaiki

**Dashboard Dosen - Jadwal Hari Ini:**
```
✅ Perograman Web 1
   INF B01 - Semester 1
   Lab A INF (Kampus B)
   11:00 - 15:30
   [Badge: Booking] [Pertemuan ke-9]

✅ Algoritma Pemrograman  
   PTI B01 - Semester 1
   Lab Kom Dasar (Kampus B)
   13:15 - 14:00
   [Badge: Jadwal Saya] [Tombol: Tidak Hadir]
```

**Statistik:**
```
Pertemuan Selesai: 10 (62% selesai)
// Sebelumnya: 0 (0% selesai)
```

---

## Build Status: ✅ SUCCESS
```
✓ built in 19.87s
```
