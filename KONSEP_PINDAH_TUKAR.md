# KONSEP PINDAH vs TUKAR JADWAL - FINAL

## Skenario & Solusi

### 1. PINDAH JADWAL (Slot Kosong)
User memilih jadwal sendiri → Klik slot kosong

**Contoh**:
- Jadwal asli: Senin 08:00-11:00 (Minggu 9)
- User klik: Rabu 13:15 (Minggu 9) - KOSONG

**Yang harus terjadi**:
- Tanggal berubah: Senin → Rabu ✅
- JAM/SLOT berubah: 08:00 → 13:15 ✅ (PENTING!)
- Minggu tetap: 9
- SKS/Matkul/Dosen: TETAP (dari master)

**Implementasi**: Use OVERRIDE
```php
DB::table('sesi_jadwal')->where('id', $sesi->id)->update([
    'tanggal' => $tanggalTujuan,
    'pertemuan_ke' => $mingguTujuan,
    'override_slot_waktu_mulai_id' => $slotTujuanMulai,
    'override_slot_waktu_selesai_id' => $slotTujuanSelesai,
    'override_laboratorium_id' => $labTujuan,
]);
```

### 2. TUKAR JADWAL - BEDA HARI
Dosen A ↔ Dosen B (hari berbeda)

**Contoh**:
- Dosen A: Senin 08:00 (Minggu 9)
- Dosen B: Selasa 13:15 (Minggu 9)

**Yang harus terjadi**:
- Dosen A: Pindah ke Selasa (tanggal berubah) tapi JAM TETAP 08:00 ✅
- Dosen B: Pindah ke Senin (tanggal berubah) tapi JAM TETAP 13:15 ✅
- SKS masing-masing TETAP

**Implementasi**: Tukar TANGGAL saja
```php
// Swap tanggal & minggu only
$sesiA->tanggal = $sesiB->tanggal;
$sesiB->tanggal = $sesiA_old->tanggal;
```

### 3. TUKAR JADWAL - SAMA HARI
Dosen A ↔ Dosen B (hari sama, jam beda)

**Contoh**:
- Dosen A: Selasa 08:00 (Minggu 9)
- Dosen B: Selasa 13:15 (Minggu 9)

**Yang harus terjadi**:
- Dosen A: Tetap Selasa tapi JAM jadi 13:15 ✅
- Dosen B: Tetap Selasa tapi JAM jadi 08:00 ✅
- SKS masing-masing TETAP

**Implementasi**: Use OVERRIDE
```php
$sesiA->override_slot_mulai = $sesiB->master->slot_mulai;
$sesiB->override_slot_mulai = $sesiA->master->slot_mulai;
```

## Kesimpulan

**OVERRIDE digunakan untuk**:
1. Pindah jadwal (slot kosong) ← JAM HARUS BERUBAH
2. Tukar sama hari ← JAM HARUS BERTUKAR

**SWAP TANGGAL digunakan untuk**:
1. Tukar beda hari ← HARI BERTUKAR, JAM TETAP
