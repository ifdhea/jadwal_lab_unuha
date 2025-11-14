# Tukar Jadwal - Remaining Issues & Fixes

## Issues to Fix:

### 1. ✅ Jadwal pindah/tukar belum tampil di Jadwal Utama & Booking Lab
**Problem**: JadwalController & BookingLaboratoriumController masih query by `pertemuan_ke`

**Solution**: Sama seperti TukarJadwalController - query by date range

**Files to Update**:
- `app/Http/Controllers/JadwalController.php`
- `app/Http/Controllers/BookingLaboratoriumController.php` (jika ada)

### 2. ✅ Tidak bisa tukar jadwal sehari (Selasa dengan Selasa)
**Problem**: Validasi atau logic yang prevent same-day swap

**Analysis**: 
```
Sesi A: Selasa 08:00 (ID 743)
Sesi B: Selasa 10:00 (ID 727)
After Tukar: Both still Selasa ✓
```

Log shows: "pemohon_tanggal":"2025-11-18", "mitra_tanggal":"2025-11-18"
Artinya BERHASIL! Tapi UI mungkin tidak update atau ada issue lain.

**Solution**: Check if there's validation preventing same-day swap

### 3. ✅ Jam mulai tidak ter-tukar
**Problem**: Setelah tukar, jam tidak mengikuti jadwal target

**Root Cause**: Kita hanya tukar `tanggal` dan `pertemuan_ke`, TIDAK tukar slot waktu!

**Current Logic**:
```php
// Hanya tukar ini:
$sesiPemohon->tanggal = $sesiMitra->tanggal;
$sesiPemohon->pertemuan_ke = $sesiMitra->pertemuan_ke;

// TIDAK tukar ini (harusnya ditukar!):
// $sesiPemohon->waktu_mulai ← masih pakai waktu asli
// $sesiPemohon->waktu_selesai ← masih pakai waktu asli
```

**Problem**: `sesi_jadwal` tidak punya field `waktu_mulai` dan `waktu_selesai`!
Waktu diambil dari `jadwal_master` via `slot_waktu_mulai_id` dan `slot_waktu_selesai_id`.

**Wait... That's the issue!**
Ketika kita tukar jadwal A (Senin 08:00) dengan B (Selasa 10:00):
- A pindah ke Selasa ✓
- Tapi waktu A masih 08:00 (dari jadwal_master) ✗

**Solution**: 
We can't change `jadwal_master` because it's the template!
**This is by design** - jadwal master defines the slot, sesi only changes date/week.

**Alternative**: Accept this behavior OR create new approach

### 4. ✅ Badge uniform di semua halaman

## Decisions Needed:

### Question 1: Apakah jam HARUS ikut tertukar?
**Scenario**:
- Dosen A: Perograman Web (Senin 08:00-11:00, 4 SKS)
- Dosen B: Algoritma (Selasa 13:00-14:45, 2 SKS)

**Option A - Current (Tukar tanggal saja)**:
After swap:
- Dosen A: Perograman Web (Selasa 08:00-11:00, 4 SKS) ← Tanggal berubah, waktu & SKS tetap
- Dosen B: Algoritma (Senin 13:00-14:45, 2 SKS) ← Tanggal berubah, waktu & SKS tetap

**Option B - Tukar semua (complicated)**:
After swap:
- Dosen A: Perograman Web (Selasa 13:00-14:45, 4 SKS) ← MASALAH: 4 SKS tapi slot cuma 2 SKS!
- Dosen B: Algoritma (Senin 08:00-11:00, 2 SKS) ← MASALAH: 2 SKS tapi slot 4 SKS!

**Recommendation**: **Option A** - Keep current behavior
- Lebih masuk akal
- Tidak ada conflict durasi vs slot
- Dosen tetap ngajar mata kuliahnya dengan durasi yang sama
- Hanya waktu (hari) yang berubah

### Question 2: Apakah boleh tukar jadwal yang overlapping tapi beda lab?
**Answer from user**: YES - Biarkan tampilannya seperti itu, yang penting bisa ditukar

## Implementation Plan:

### Fix 1: JadwalController - Query by Date Range
```php
// app/Http/Controllers/JadwalController.php

// Calculate minggu start/end
$mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek();
$mingguEnd = $mingguStart->copy()->addDays(5);

// Query by date range
$sesiJadwals = SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($selectedSemesterId) {
        $query->where('semester_id', $selectedSemesterId);
    })
    ->whereBetween('tanggal', [$mingguStart->format('Y-m-d'), $mingguEnd->format('Y-m-d')])
    ->whereNotIn('status', ['dibatalkan'])
    ->with([...])
    ->get();

// Use tanggal from sesi for hari
foreach ($sesiJadwals as $sesi) {
    $tanggalSesi = Carbon::parse($sesi->tanggal);
    $hariId = $hariMap[ucfirst($tanggalSesi->locale('id')->dayName)];
    
    // Use selectedMinggu as key
    $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [...];
}
```

### Fix 2: Booking Lab - Query by Date Range
Same approach

### Fix 3: Badge Uniform
Apply same badge structure to:
- Jadwal Utama (JadwalController)
- Booking Lab (BookingLaboratoriumController)
- Tukar Jadwal (Already done)

Badge structure:
```tsx
{/* Badge Status */}
{cell.status === 'booking' && <Badge className="bg-orange-500">Booking</Badge>}
{cell.status === 'terjadwal' && !cell.is_past && <Badge className="bg-blue-500">Terjadwal</Badge>}
{cell.status === 'selesai' && <Badge variant="secondary">Selesai</Badge>}

{/* Badge Jadwal Saya (only if not booking) */}
{cell.is_my_schedule && !cell.is_past && cell.status !== 'booking' && 
    <Badge className="bg-green-600">Jadwal Saya</Badge>
}

{/* Badge Sudah Lewat */}
{cell.is_past && <Badge variant="secondary">Sudah Lewat</Badge>}
```

### Fix 4: Same-day Swap Issue
Check if there's any validation preventing same-day swap.
From logs, update is successful, so likely UI issue or validation issue.

## Testing Plan:

1. **Test Jadwal Utama**: Pindah jadwal → Check di Jadwal Utama harus update
2. **Test Booking Lab**: Pindah jadwal → Check di Booking Lab harus update
3. **Test Same-day Swap**: Tukar Selasa 08:00 dengan Selasa 10:00 → Harus berhasil
4. **Test Badge**: Check semua halaman punya badge yang sama
5. **Test Overlapping**: Tukar jadwal yang overlap waktu tapi beda lab → Harus berhasil

## Next Steps:

1. Update JadwalController dengan date range query
2. Update BookingLaboratoriumController (if needed)
3. Apply uniform badge ke semua halaman
4. Test & verify
