# Tukar Jadwal - Final Fixes

## Issues Fixed

### 1. ✅ Fix Minggu Decimal (8.428571428571429)
**Problem**: URL menampilkan `minggu=8.428571428571429`

**Solution**:
```php
// Cast ke integer di controller
$diffInWeeks = $tanggalMulai->diffInWeeks($today);
$currentWeek = (int) min(max(1, $diffInWeeks + 1), $totalMinggu);
$selectedMinggu = (int) $request->get('minggu', $currentWeek);
```

### 2. ✅ Fix Rentang Tanggal Tidak Muncul
**Problem**: Minggu 2 dst tidak ada rentang tanggal

**Root Cause**: Variable `$tanggalMulai` di-redeclare, duplikat dihapus

**Solution**:
```php
// Hapus duplikat declaration
// $tanggalMulai = Carbon::parse($selectedSemester->tanggal_mulai); // ❌ DIHAPUS

// Gunakan yang sudah ada di atas
$mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek();
```

### 3. ✅ Fix Error "Cannot read properties of null (reading 'slice')"
**Problem**: Jadwal booking tidak punya `waktu_selesai` yang valid

**Solution**:
```php
// Hitung waktu selesai dari slot waktu berdasarkan durasi_slot
$slotWaktuSelesai = \App\Models\SlotWaktu::where('urutan', '>=', $booking->slotWaktuMulai->urutan)
    ->orderBy('urutan')
    ->skip($booking->durasi_slot - 1)
    ->first();

'waktu_selesai' => $slotWaktuSelesai ? $slotWaktuSelesai->waktu_selesai : $booking->slotWaktuMulai->waktu_selesai,
```

### 4. ✅ Jadwal Booking Yang Disetujui Tampil
**Problem**: Jadwal booking tidak muncul di kalender tukar jadwal

**Solution**:
```php
// Tambahkan query booking yang disetujui
$bookings = \App\Models\BookingLaboratorium::where('status', 'disetujui')
    ->whereBetween('tanggal', [$mingguStart->format('Y-m-d'), $mingguStart->copy()->addDays(5)->format('Y-m-d')])
    ->with([...])
    ->get();

// Merge ke jadwalData dengan format yang sama
foreach ($bookings as $booking) {
    // ... populate jadwalData
}
```

### 5. ✅ Fix Tukar Jadwal: SKS Tidak Ikut Tertukar
**Problem**: Saat tukar, SKS dan dosen ikut tertukar (permanen di jadwal master)

**Solution - Tukar Hanya Tanggal**:
```php
// SEBELUM (❌ SALAH):
$tempDosenId = $jadwalMasterPemohon->dosen_id;
$jadwalMasterPemohon->update(['dosen_id' => $jadwalMasterMitra->dosen_id]);
$jadwalMasterMitra->update(['dosen_id' => $tempDosenId]);

// SESUDAH (✅ BENAR):
// Tukar hanya tanggal dan minggu di SESI, bukan di MASTER
$tempTanggalPemohon = $sesiPemohon->tanggal;
$tempPertemuanPemohon = $sesiPemohon->pertemuan_ke;

$sesiPemohon->update([
    'tanggal' => $sesiMitra->tanggal,
    'pertemuan_ke' => $sesiMitra->pertemuan_ke,
]);

$sesiMitra->update([
    'tanggal' => $tempTanggalPemohon,
    'pertemuan_ke' => $tempPertemuanPemohon,
]);
```

**Penjelasan**:
- Tukar di `sesi_jadwal` (per minggu/pertemuan) bukan di `jadwal_master` (permanen)
- SKS, dosen, lab tetap sesuai mata kuliah masing-masing
- Hanya waktu/tanggal yang bertukar

### 6. ✅ Fix Pindah Jadwal: Jadwal Benar-Benar Pindah
**Problem**: Jadwal tidak pindah ke tempat yang diinginkan

**Solution**:
```php
// Update sesi jadwal dengan tanggal dan minggu tujuan
$sesiPemohon->update([
    'tanggal' => $tanggalTujuan,        // dari request
    'pertemuan_ke' => $mingguTujuan,    // dari request
]);
```

**Frontend mengirim**:
```typescript
data.tanggal_tujuan = targetCell.tanggal;
data.minggu_tujuan = selectedMinggu;
```

### 7. ✅ Default Minggu Saat Ini
**Problem**: Selalu buka minggu 1 saat pertama kali

**Solution**:
```php
// Hitung minggu saat ini
$tanggalMulai = Carbon::parse($selectedSemester->tanggal_mulai);
$today = Carbon::today();
$diffInWeeks = $tanggalMulai->diffInWeeks($today);
$currentWeek = (int) min(max(1, $diffInWeeks + 1), $totalMinggu);

// Default ke minggu saat ini
$selectedMinggu = (int) $request->get('minggu', $currentWeek);
```

## Data Structure

### Sesi Jadwal (Per Minggu)
```
sesi_jadwal:
- id
- jadwal_master_id
- tanggal (Y-m-d)  ← BISA DIUBAH saat tukar/pindah
- pertemuan_ke     ← BISA DIUBAH saat tukar/pindah
- status
```

### Jadwal Master (Permanen)
```
jadwal_master:
- id
- dosen_id         ← TIDAK BERUBAH saat tukar
- kelas_mata_kuliah_id
- laboratorium_id
- slot_waktu_mulai_id
- slot_waktu_selesai_id
- hari
- durasi_slot
- sks             ← TIDAK BERUBAH saat tukar
```

## Flow Tukar Jadwal

### Tukar dengan Dosen Lain:
1. Dosen A klik jadwal sendiri (Senin 08:00)
2. Dosen A klik jadwal Dosen B (Selasa 10:00)
3. Popup konfirmasi → Submit
4. Status: **Menunggu** approval Dosen B
5. Dosen B approve
6. **Hasil**:
   - Jadwal Dosen A pindah ke Selasa 10:00 (minggu ini saja)
   - Jadwal Dosen B pindah ke Senin 08:00 (minggu ini saja)
   - SKS, dosen, lab tetap sesuai aslinya

### Pindah ke Slot Kosong:
1. Dosen A klik jadwal sendiri (Senin 08:00)
2. Dosen A klik slot kosong (Rabu 13:00)
3. Popup konfirmasi → Submit
4. Status: **Auto Disetujui** (no approval needed)
5. **Hasil**:
   - Jadwal Dosen A pindah ke Rabu 13:00 (minggu ini saja)
   - Slot Senin 08:00 jadi kosong (minggu ini saja)

## Testing Checklist

- [x] Minggu tidak decimal lagi
- [x] Rentang tanggal muncul di semua minggu
- [x] Jadwal booking tampil di kalender
- [x] Tidak ada error "Cannot read properties of null"
- [x] Default buka minggu saat ini
- [x] Tukar jadwal: SKS tidak ikut tertukar
- [x] Tukar jadwal: hanya berlaku 1 minggu
- [x] Pindah jadwal: jadwal benar-benar pindah
- [x] Pindah jadwal: auto disetujui

## Important Notes

⚠️ **Tukar jadwal bersifat TEMPORARY (per minggu)**
- Hanya untuk minggu yang dipilih
- Minggu berikutnya kembali normal sesuai jadwal master
- Jika ingin permanen, hubungi admin untuk ubah jadwal master

✅ **SKS dan Dosen tetap sesuai mata kuliah**
- Dosen A tetap mengajar mata kuliah A dengan SKS A
- Hanya waktu/tanggal yang berubah
- Tidak ada perubahan di jadwal master

🔒 **Validasi**
- Tidak bisa pindah ke slot yang bentrok
- Tidak bisa tukar/pindah jadwal yang sudah lewat
- Tidak bisa tukar/pindah ke tanggal yang sudah lewat
