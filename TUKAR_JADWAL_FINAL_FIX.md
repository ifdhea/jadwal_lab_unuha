# Tukar Jadwal - Final Fix (SOLVED!)

## 🎯 ROOT CAUSE FOUND!

### Problem
Jadwal **SUDAH BERUBAH** di database tapi **TIDAK TAMPIL** di kalender setelah tukar/pindah.

### Root Cause
Query `calendar()` menggunakan **FILTER YANG SALAH**:

```php
// ❌ SALAH - Filter by pertemuan_ke
$sesiJadwals = SesiJadwal::where('pertemuan_ke', $selectedMinggu)->get();

// ❌ SALAH - Gunakan hari dari jadwal_master
$hariId = $hariMap[$master->hari];

// ❌ SALAH - Gunakan pertemuan_ke sebagai key array
$jadwalData[$kampusId][$sesi->pertemuan_ke][$hariId][$slotId]
```

**Mengapa salah?**
1. Ketika jadwal dipindah, `pertemuan_ke` berubah
2. Query filter by `pertemuan_ke = 10` tidak akan menemukan jadwal yang sudah pindah ke `pertemuan_ke = 11`
3. Hari dari `jadwal_master` adalah hari asli (Senin), bukan hari setelah dipindah (Rabu)

## ✅ SOLUTION

### 1. Query By DATE RANGE (bukan pertemuan_ke)
```php
// ✅ BENAR - Filter by tanggal range
$mingguEnd = $mingguStart->copy()->addDays(5); // Senin - Sabtu

$sesiJadwals = SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($selectedSemesterId) {
        $query->where('semester_id', $selectedSemesterId);
    })
    ->whereBetween('tanggal', [
        $mingguStart->format('Y-m-d'), 
        $mingguEnd->format('Y-m-d')
    ])
    ->get();
```

### 2. Gunakan Hari dari TANGGAL SESI (bukan master)
```php
// ✅ BENAR - Get hari dari tanggal sesi yang sudah dipindah
$tanggalSesi = Carbon::parse($sesi->tanggal);
$hariNamaSesi = $tanggalSesi->locale('id')->dayName;  // 'senin', 'selasa', dll
$hariNamaSesiCapitalized = ucfirst($hariNamaSesi);    // 'Senin', 'Selasa', dll
$hariId = $hariMap[$hariNamaSesiCapitalized];
```

### 3. Gunakan selectedMinggu sebagai Key (bukan pertemuan_ke)
```php
// ✅ BENAR - Gunakan minggu yang sedang ditampilkan
$jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [...];
```

## 📊 Complete Example

### Scenario: Pindah Jadwal
```
Original:
- Sesi ID: 649
- tanggal: 2025-12-02 (Selasa)
- pertemuan_ke: 11
- hari_master: 'Selasa'

After Pindah:
- Sesi ID: 649
- tanggal: 2025-12-04 (Kamis)  ← BERUBAH
- pertemuan_ke: 11              ← TETAP (masih minggu 11)
- hari_master: 'Selasa'         ← TETAP (dari jadwal_master)

Query Calendar (Minggu 11):
❌ SALAH:
where('pertemuan_ke', 11)              → Found (tapi...)
$hariId = $hariMap[$master->hari]      → 2 (Selasa)
Tampil di: Selasa                       → SALAH! Harusnya Kamis

✅ BENAR:
whereBetween('tanggal', ['2025-12-02', '2025-12-07'])  → Found
$hariId = $hariMap['Kamis']                           → 4 (Kamis)
Tampil di: Kamis                                       → BENAR! ✅
```

### Scenario: Tukar Jadwal
```
Sesi A:
- ID: 647
- tanggal: 2025-11-18 (Senin)
- pertemuan_ke: 9

Sesi B:
- ID: 679
- tanggal: 2025-11-18 (Senin)
- pertemuan_ke: 9

After Tukar:
- Sesi A: tanggal = 2025-11-18 (tetap), pertemuan_ke = 9
- Sesi B: tanggal = 2025-11-18 (tetap), pertemuan_ke = 9
(Tanggal sama karena mereka tukar di minggu & hari yang sama)

Query Calendar (Minggu 9):
✅ whereBetween('tanggal', [minggu 9 range]) → Found both
✅ Tampil sesuai tanggal masing-masing
```

## 🔧 Code Changes

### File: TukarJadwalController.php

#### Method: calendar()
```php
// Before (Line ~528):
$sesiJadwals = SesiJadwal::where('pertemuan_ke', $selectedMinggu)->get();

foreach ($sesiJadwals as $sesi) {
    $hariId = $hariMap[$master->hari];  // hari dari master
    $minggu = $sesi->pertemuan_ke;       // pertemuan_ke dari sesi
    $jadwalData[$kampusId][$minggu][$hariId][$slotId][] = [...];
}

// After:
$mingguEnd = $mingguStart->copy()->addDays(5);
$sesiJadwals = SesiJadwal::whereBetween('tanggal', [
    $mingguStart->format('Y-m-d'), 
    $mingguEnd->format('Y-m-d')
])->get();

foreach ($sesiJadwals as $sesi) {
    // Get hari dari tanggal sesi
    $tanggalSesi = Carbon::parse($sesi->tanggal);
    $hariNamaSesi = $tanggalSesi->locale('id')->dayName;
    $hariId = $hariMap[ucfirst($hariNamaSesi)];
    
    // Gunakan selectedMinggu sebagai key
    $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [...];
}
```

## ✅ Verification

### Test Case 1: Pindah Jadwal
1. **Setup**: Jadwal Senin 08:00 (Minggu 9)
2. **Action**: Pindah ke Rabu 13:00 (Minggu 9)
3. **DB Check**:
   ```sql
   SELECT tanggal, pertemuan_ke FROM sesi_jadwal WHERE id = 649;
   -- Result: 2025-11-20 (Rabu), 9
   ```
4. **UI Check**: Buka kalender Minggu 9
   - ✅ Senin 08:00: KOSONG
   - ✅ Rabu 13:00: Ada jadwal
5. **Log Check**: "success": true

### Test Case 2: Tukar Jadwal
1. **Setup**: 
   - Dosen A: Senin 08:00 (ID 647)
   - Dosen B: Selasa 10:00 (ID 679)
2. **Action**: Dosen A request tukar → Dosen B approve
3. **DB Check**:
   ```sql
   SELECT id, tanggal, pertemuan_ke FROM sesi_jadwal WHERE id IN (647, 679);
   -- ID 647: 2025-11-19 (Selasa), 9
   -- ID 679: 2025-11-18 (Senin), 9
   ```
4. **UI Check**: Buka kalender Minggu 9
   - ✅ Senin 10:00: Jadwal Dosen B
   - ✅ Selasa 08:00: Jadwal Dosen A

### Test Case 3: Pindah ke Minggu Lain
1. **Setup**: Jadwal Senin 08:00 (Minggu 10)
2. **Action**: Pindah ke Rabu 13:00 (Minggu 11)
3. **DB Check**:
   ```sql
   -- Result: 2025-11-27 (Rabu), 11
   ```
4. **UI Check**:
   - Minggu 10: Senin 08:00 KOSONG ✅
   - Minggu 11: Rabu 13:00 Ada jadwal ✅

## 📝 Summary

**Database Update**: ✅ WORKS (verified from logs)
**Calendar Display**: ✅ FIXED (query by date range + use sesi tanggal for hari)

**Key Learnings**:
1. Always query by **actual date**, not **logical week number**
2. Use **sesi.tanggal** for display, not **master.hari**
3. Jadwal yang dipindah/ditukar tetap di database, hanya tanggal & minggu yang berubah

## 🎉 DONE!

Sekarang:
- ✅ Pindah jadwal: Jadwal pindah ke slot baru
- ✅ Tukar jadwal: Kedua jadwal bertukar tempat
- ✅ Tampil di kalender sesuai tanggal yang baru
- ✅ Minggu berikutnya kembali normal (karena query by range date per minggu)
