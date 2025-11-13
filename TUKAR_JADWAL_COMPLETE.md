# Tukar Jadwal - Complete Implementation

## ✅ All Issues Fixed

### 1. Field `jenis` Required Error
**Fix**: Kirim field `jenis` dari frontend
```typescript
if (!targetCell.isEmptySlot && targetCell.cell) {
    data.jenis = 'tukar';  // ✅
} else {
    data.jenis = 'pindah';  // ✅
    data.tanggal_tujuan = targetCell.tanggal;
    data.minggu_tujuan = selectedMinggu;
}
```

### 2. Jadwal Tidak Tertukar/Pindah
**Fix**: Gunakan `.save()` langsung + Debug logging
```php
// Tukar
$sesiPemohon->tanggal = $sesiMitra->tanggal;
$sesiPemohon->pertemuan_ke = $sesiMitra->pertemuan_ke;
$sesiPemohon->save();  // ✅ save() langsung

// Pindah
$sesiPemohon->tanggal = $tanggalTujuan;
$sesiPemohon->pertemuan_ke = $mingguTujuan;
$sesiPemohon->save();  // ✅ save() langsung
```

### 3. Jadwal Booking Bisa Ditukar
**Fix**: Disable booking untuk tukar + Tampilkan badge
```typescript
const isBooking = cell.status === 'booking';
const canClick = cell.is_my_schedule && !cell.is_past && !isBooking 
    ? true 
    : (selectedMySchedule && !cell.is_past && !isBooking);

<div 
    className={`... ${isBooking ? 'cursor-not-allowed opacity-50' : ''}`}
    onClick={() => {
        if (cell.is_past || isBooking) return;  // ✅ Block booking
        // ...
    }}
>
```

### 4. Badge Status Tidak Ditampilkan
**Fix**: Tampilkan badge untuk semua status
```tsx
{/* Badge Status */}
{cell.status === 'booking' && (
    <Badge className="bg-orange-500">Booking</Badge>
)}
{cell.status === 'terjadwal' && !cell.is_past && (
    <Badge className="bg-blue-500">Terjadwal</Badge>
)}
{cell.status === 'selesai' && (
    <Badge variant="secondary">Selesai</Badge>
)}

{/* Badge Jadwal Saya */}
{cell.is_my_schedule && !cell.is_past && cell.status !== 'booking' && (
    <Badge className="bg-green-600">Jadwal Saya</Badge>
)}
```

### 5. SKS Tidak Ikut Tertukar
**Solution**: Tukar di `sesi_jadwal` bukan `jadwal_master`
- ✅ Dosen tetap sama
- ✅ SKS tetap sama
- ✅ Lab tetap sama
- ✅ Hanya tanggal dan minggu yang bertukar

### 6. Minggu Decimal & Rentang Tanggal
**Fix**: Cast to `(int)` dan hapus duplikat variable
```php
$currentWeek = (int) min(max(1, $diffInWeeks + 1), $totalMinggu);
$selectedMinggu = (int) $request->get('minggu', $currentWeek);
```

### 7. Default Minggu Saat Ini
**Fix**: Calculate current week dari semester start
```php
$diffInWeeks = $tanggalMulai->diffInWeeks($today);
$currentWeek = (int) min(max(1, $diffInWeeks + 1), $totalMinggu);
```

### 8. Jadwal Booking Tampil
**Fix**: Query booking yang disetujui dan merge ke jadwalData
```php
$bookings = \App\Models\BookingLaboratorium::where('status', 'disetujui')
    ->whereBetween('tanggal', [$mingguStart, $mingguEnd])
    ->get();

foreach ($bookings as $booking) {
    $jadwalData[...][] = [
        'booking_id' => $booking->id,
        'status' => 'booking',  // ✅ Ditandai sebagai booking
        // ...
    ];
}
```

## 🎯 Key Features

### Click-Based Mechanism
1. **Klik jadwal sendiri** (warna hijau + badge "Jadwal Saya")
2. **Klik target**:
   - Jadwal dosen lain → Tukar (perlu approval)
   - Slot kosong → Pindah (auto approved)
3. **Popup konfirmasi** → Submit

### Status & Validasi
- ✅ **Terjadwal**: Jadwal normal, bisa ditukar
- ⚠️ **Booking**: Tidak bisa ditukar (disabled + opacity 50%)
- ✅ **Selesai**: Sudah lewat, tidak bisa ditukar
- 🚫 **Sudah Lewat**: Tidak bisa ditukar/pindah

### Visual Indicators
- **Terpilih**: Ring hijau 4px
- **Jadwal Saya**: Badge hijau "Jadwal Saya"
- **Booking**: Badge orange "Booking" + opacity 50% + cursor not-allowed
- **Terjadwal**: Badge biru "Terjadwal"
- **Selesai**: Badge abu-abu "Selesai"
- **Sudah Lewat**: Badge abu-abu + opacity 50%

## 📊 Data Flow

### Tukar Jadwal
```
Frontend:
- Click jadwal A (Senin 08:00)
- Click jadwal B (Selasa 10:00)
- Submit dengan jenis: 'tukar'

Backend:
- Create request status 'menunggu'
- Dosen B approve
- Tukar tanggal & minggu di sesi_jadwal:
  * Sesi A: tanggal → Selasa, pertemuan → B's week
  * Sesi B: tanggal → Senin, pertemuan → A's week
- Dosen & SKS TETAP sama

Result:
- Jadwal A pindah ke Selasa 10:00 (minggu ini)
- Jadwal B pindah ke Senin 08:00 (minggu ini)
- Minggu depan kembali normal
```

### Pindah Jadwal
```
Frontend:
- Click jadwal A (Senin 08:00)
- Click slot kosong (Rabu 13:00)
- Submit dengan jenis: 'pindah'

Backend:
- Langsung approved (no approval needed)
- Update sesi_jadwal:
  * tanggal → Rabu
  * pertemuan_ke → current week

Result:
- Jadwal A pindah ke Rabu 13:00 (minggu ini)
- Senin 08:00 jadi kosong (minggu ini)
- Minggu depan kembali normal
```

## 🔍 Debug Logging

Log untuk troubleshooting:
```php
\Log::info('Pindah Jadwal', [
    'sesi_id' => $sesiPemohon->id,
    'tanggal_lama' => $sesiPemohon->tanggal,
    'tanggal_baru' => $tanggalTujuan,
]);

\Log::info('Tukar Jadwal - Before', [
    'pemohon_tanggal' => $sesiPemohon->tanggal,
    'mitra_tanggal' => $sesiMitra->tanggal,
]);
```

Check logs di: `storage/logs/laravel.log`

## 📝 Testing Checklist

### Tukar Jadwal
- [ ] Klik jadwal sendiri → terselect (ring hijau)
- [ ] Klik jadwal dosen lain → popup muncul
- [ ] Submit → status "Menunggu"
- [ ] Dosen lain approve → jadwal tertukar
- [ ] SKS tetap sesuai mata kuliah masing-masing
- [ ] Minggu depan kembali normal
- [ ] Tidak bisa klik booking (cursor not-allowed)

### Pindah Jadwal
- [ ] Klik jadwal sendiri → terselect
- [ ] Klik slot kosong → popup muncul
- [ ] Submit → auto approved
- [ ] Jadwal benar-benar pindah ke slot yang dipilih
- [ ] Minggu depan kembali normal

### UI/UX
- [ ] Badge status tampil (Terjadwal/Booking/Selesai)
- [ ] Jadwal booking ada badge orange "Booking"
- [ ] Jadwal booking disabled (opacity 50%)
- [ ] Toast error readable (light red bg)
- [ ] Default buka minggu saat ini
- [ ] Rentang tanggal tampil di semua minggu
- [ ] Minggu tidak decimal

### Validasi
- [ ] Tidak bisa tukar jadwal yang sudah lewat
- [ ] Tidak bisa pindah ke tanggal yang sudah lewat
- [ ] Tidak bisa pindah ke slot yang bentrok
- [ ] Warning jika belum pilih jadwal sendiri

## 🎨 Files Changed

### Backend
- `app/Http/Controllers/TukarJadwalController.php`
  - ✅ Fix store() - tambah jenis, tanggal_tujuan
  - ✅ Fix approve() - tukar di sesi bukan master
  - ✅ Fix calendar() - cast minggu to int, default current week
  - ✅ Tambah jadwal booking yang disetujui
  - ✅ Debug logging

### Frontend
- `resources/js/Pages/TukarJadwal/Calendar.tsx`
  - ✅ Kirim field jenis, tanggal_tujuan, minggu_tujuan
  - ✅ Disable booking untuk tukar
  - ✅ Tampilkan badge status lengkap
  - ✅ Fix toast styling
  - ✅ Implement rowspan

## ⚠️ Important Notes

**Temporary Changes**:
- Tukar/pindah jadwal hanya berlaku untuk **minggu yang dipilih**
- Minggu berikutnya **kembali normal** sesuai jadwal master
- Untuk perubahan permanen, hubungi admin

**Data Integrity**:
- Dosen, SKS, Lab **TIDAK BERUBAH** saat tukar
- Hanya tanggal dan minggu yang berubah
- Perubahan di `sesi_jadwal` bukan `jadwal_master`

**Booking Restrictions**:
- Jadwal booking **TIDAK BISA** ditukar
- Hanya bisa dilihat (informasi)
- Ditandai dengan badge orange "Booking"
