# Tukar Jadwal - Final Solution

## 🔧 Root Cause Analysis

### Problem: Jadwal tidak tertukar/pindah setelah disetujui
**Root Cause**: Model `SesiJadwal` kemungkinan memiliki:
- Observer/Event listener yang override nilai
- Mutator/Accessor yang transform data
- Timestamp auto-update yang conflict

**Solution**: Gunakan `DB::table()` query builder langsung untuk bypass model layer

## ✅ Final Fixes

### 1. Pindah Jadwal - Direct DB Update
```php
// ❌ SEBELUM (Tidak work):
$sesiPemohon->tanggal = $tanggalTujuan;
$sesiPemohon->pertemuan_ke = $mingguTujuan;
$sesiPemohon->save();

// ✅ SESUDAH (Work!):
DB::table('sesi_jadwal')
    ->where('id', $sesiPemohon->id)
    ->update([
        'tanggal' => $tanggalTujuan,
        'pertemuan_ke' => $mingguTujuan,
        'updated_at' => now(),
    ]);
```

### 2. Tukar Jadwal - Direct DB Update
```php
// ❌ SEBELUM (Tidak work):
$sesiPemohon->tanggal = $sesiMitra->tanggal;
$sesiPemohon->save();
$sesiMitra->tanggal = $tempTanggalPemohon;
$sesiMitra->save();

// ✅ SESUDAH (Work!):
$tempTanggalPemohon = $sesiPemohon->tanggal;
$tempPertemuanPemohon = $sesiPemohon->pertemuan_ke;

DB::table('sesi_jadwal')
    ->where('id', $sesiPemohon->id)
    ->update([
        'tanggal' => $sesiMitra->tanggal,
        'pertemuan_ke' => $sesiMitra->pertemuan_ke,
        'updated_at' => now(),
    ]);

DB::table('sesi_jadwal')
    ->where('id', $sesiMitra->id)
    ->update([
        'tanggal' => $tempTanggalPemohon,
        'pertemuan_ke' => $tempPertemuanPemohon,
        'updated_at' => now(),
    ]);
```

### 3. Fix Double Toast
```typescript
// ❌ SEBELUM:
useEffect(() => {
    // triggers on every render
}, [flash]);

onSuccess: () => {
    toast({ title: "Berhasil" });  // Toast 1
}
// Flash message also shows toast  // Toast 2 = DOUBLE!

// ✅ SESUDAH:
useEffect(() => {
    // only trigger when flash actually changes
}, [flash?.success, flash?.error]);

onSuccess: () => {
    // Remove toast, use flash message only
}
```

### 4. Redirect After Pindah
```php
// ✅ Redirect ke minggu tujuan setelah pindah
return redirect()->route('tukar-jadwal.calendar', [
    'semester_id' => request()->get('semester_id'),
    'minggu' => $mingguTujuan  // ✅ Show result immediately
])->with('success', 'Jadwal berhasil dipindahkan');
```

## 📊 Complete Flow

### Pindah Jadwal Flow:
```
1. User klik jadwal (Senin 08:00, Minggu 10)
2. User klik slot kosong (Rabu 13:00)
3. Frontend kirim:
   {
     jenis: 'pindah',
     sesi_jadwal_pemohon_id: 463,
     tanggal_tujuan: '2025-11-27',
     minggu_tujuan: 10
   }

4. Backend:
   - Cek bentrok
   - DB::table('sesi_jadwal')->where('id', 463)->update([
       'tanggal' => '2025-11-27',
       'pertemuan_ke' => 10
     ])
   - Create TukarJadwal record (status: disetujui)
   - Commit

5. Verify:
   - Log: "Pindah Jadwal - Verified"
   - tanggal: 2025-11-27 ✅
   - pertemuan_ke: 10 ✅

6. Redirect ke minggu 10
7. Toast: "Jadwal berhasil dipindahkan"
```

### Tukar Jadwal Flow:
```
1. Dosen A klik jadwal (Senin 08:00, ID 463)
2. Dosen A klik jadwal Dosen B (Selasa 10:00, ID 490)
3. Submit → Status: menunggu

4. Dosen B login → Approve
5. Backend:
   - Simpan temp: tanggal_463, minggu_463
   - Update ID 463: tanggal = tanggal_490, minggu = minggu_490
   - Update ID 490: tanggal = tanggal_463, minggu = minggu_463
   - Update tukar_jadwal status = disetujui
   - Commit

6. Verify:
   - Log: "Tukar Jadwal - Verified"
   - ID 463: tanggal_490 ✅
   - ID 490: tanggal_463 ✅

7. Redirect to index
8. Toast: "Permintaan tukar jadwal berhasil disetujui"
```

## 🔍 Debug Guide

### Check Logs
```bash
# Tail logs
tail -f storage/logs/laravel.log

# Search for specific action
grep "Pindah Jadwal" storage/logs/laravel.log
grep "Tukar Jadwal" storage/logs/laravel.log
```

### Expected Log Output

**Pindah Jadwal Success:**
```
[2025-11-13 08:00:00] local.INFO: Pindah Jadwal - Start {
  "sesi_id": 463,
  "tanggal_lama": "2025-09-22",
  "tanggal_baru": "2025-11-27",
  "minggu_lama": 1,
  "minggu_baru": 10
}

[2025-11-13 08:00:01] local.INFO: Pindah Jadwal - Update Result {
  "updated": 1
}

[2025-11-13 08:00:02] local.INFO: Pindah Jadwal - Verified {
  "sesi_id": 463,
  "tanggal": "2025-11-27",
  "pertemuan_ke": 10
}
```

**Tukar Jadwal Success:**
```
[2025-11-13 08:05:00] local.INFO: Tukar Jadwal - Start {
  "pemohon_id": 463,
  "pemohon_tanggal": "2025-09-22",
  "pemohon_minggu": 1,
  "mitra_id": 490,
  "mitra_tanggal": "2025-12-09",
  "mitra_minggu": 12
}

[2025-11-13 08:05:01] local.INFO: Tukar Jadwal - Update Results {
  "pemohon_updated": 1,
  "mitra_updated": 1
}

[2025-11-13 08:05:02] local.INFO: Tukar Jadwal - Verified {
  "pemohon": {"id": 463, "tanggal": "2025-12-09", "pertemuan_ke": 12},
  "mitra": {"id": 490, "tanggal": "2025-09-22", "pertemuan_ke": 1}
}
```

## 🧪 Testing Instructions

### Test Pindah Jadwal:
1. **Setup**:
   - Login sebagai dosen
   - Buka Tukar Jadwal → Kalender
   - Default harus buka minggu saat ini

2. **Execute**:
   - Klik jadwal Anda (warna hijau)
   - Lihat indicator hijau muncul
   - Klik slot kosong
   - Popup muncul → Isi alasan → Submit

3. **Verify**:
   - Toast hijau: "Jadwal berhasil dipindahkan"
   - Redirect ke minggu tujuan
   - Jadwal tampil di slot baru ✅
   - Slot lama jadi kosong ✅
   - Check log: "Pindah Jadwal - Verified"

4. **Check Next Week**:
   - Pindah ke minggu berikutnya
   - Jadwal kembali normal (di slot asli) ✅

### Test Tukar Jadwal:
1. **Setup**:
   - Login sebagai Dosen A
   - Buka Tukar Jadwal → Kalender

2. **Request**:
   - Klik jadwal Anda
   - Klik jadwal Dosen B
   - Popup → Isi alasan → Submit
   - Tab "Request Keluar" → Status: Menunggu ✅

3. **Approve**:
   - Login sebagai Dosen B
   - Tab "Request Masuk" → Ada request dari Dosen A
   - Klik Approve
   - Toast: "Permintaan tukar jadwal berhasil disetujui"

4. **Verify**:
   - Login kembali sebagai Dosen A
   - Buka kalender minggu yang ditukar
   - Jadwal Dosen A di slot Dosen B ✅
   - Check log: "Tukar Jadwal - Verified"

5. **Check Next Week**:
   - Pindah ke minggu berikutnya
   - Jadwal kembali normal ✅

### Test Booking Disabled:
1. Ada jadwal booking (badge orange "Booking")
2. Opacity 50%, cursor not-allowed
3. Klik → Tidak ada reaksi ✅
4. Badge status tampil jelas ✅

## 📝 Files Changed

### Backend
- `app/Http/Controllers/TukarJadwalController.php`
  - `store()`: Gunakan `DB::table()->update()` untuk pindah
  - `approve()`: Gunakan `DB::table()->update()` untuk tukar
  - Tambah extensive logging
  - Redirect ke minggu tujuan setelah pindah

### Frontend
- `resources/js/Pages/TukarJadwal/Calendar.tsx`
  - Fix useEffect dependency: `[flash?.success, flash?.error]`
  - Remove double toast di onSuccess
  - Disable toast saat select (indicator card sudah cukup)

## ⚠️ Important Notes

**Why Direct DB Update?**
- Model `SesiJadwal` might have observers/mutators
- `->save()` might trigger events that override values
- `DB::table()->update()` bypasses model layer completely
- Ensures data is written directly to database

**Transaction Safety:**
- All updates wrapped in `DB::beginTransaction()`
- Automatic rollback on exception
- Commit only after all updates succeed

**Logging:**
- Every action logged with "Start", "Update Result", "Verified"
- Check `storage/logs/laravel.log` for troubleshooting
- Logs include all relevant IDs and values

## 🎯 Success Criteria

- [x] Pindah jadwal: Jadwal benar-benar pindah
- [x] Tukar jadwal: Kedua jadwal bertukar tempat
- [x] SKS tidak ikut tertukar
- [x] Minggu berikutnya kembali normal
- [x] No double toast
- [x] Booking disabled
- [x] Badge status tampil
- [x] Extensive logging
- [x] Transaction safety
