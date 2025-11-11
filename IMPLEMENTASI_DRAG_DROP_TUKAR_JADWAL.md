# Implementasi Drag & Drop Tukar Jadwal

## Status: ✅ SELESAI

Tanggal: 11 November 2025

---

## Fitur yang Diimplementasi

### 1. Kalender Drag & Drop untuk Tukar Jadwal

**File:** `resources/js/Pages/TukarJadwal/Calendar.tsx` (857 lines)

**Fitur Utama:**
- Tampilan kalender grid seperti Jadwal Final
- Drag & drop jadwal sendiri ke jadwal lain atau slot kosong
- 3 Tab: **Kalender** | **Request Keluar** | **Request Masuk**
- Visual feedback saat drag & drop

---

## Detail Implementasi

### A. Tab Kalender (Drag & Drop)

#### Visual Indicator:
- 🟢 **Jadwal Sendiri (Hijau)**: Border hijau, draggable, cursor move
- 🔵 **Jadwal Dosen Lain (Biru)**: Border biru, droppable target
- ⚪ **Slot Kosong (Abu-abu)**: Border dashed, droppable target
- 🟢 **Drop Zone Active**: Background hijau muda dengan ring hijau saat drag over

#### Cara Kerja:
```tsx
// 1. Drag Start - Hanya jadwal sendiri yang belum lewat
draggable={cell.is_my_schedule && !cell.is_past}
onDragStart={(e) => handleDragStart(cell, e)}

// 2. Drag Over - Visual feedback
const canDropHere = draggedCell && 
    !cellsData.some(c => c.sesi_jadwal_id === draggedCell.sesi_jadwal_id) &&
    !cellsData.some(c => c.is_past);

// 3. Drop - Trigger dialog konfirmasi
onDrop={(e) => h.tanggal && handleDrop(cellsData, h.tanggal, slot, e)}
```

#### Validasi:
- ❌ Tidak bisa drag jadwal yang sudah lewat (is_past)
- ❌ Tidak bisa drop ke jadwal sendiri
- ❌ Tidak bisa drop ke jadwal yang sudah lewat
- ✅ Bisa drag ke jadwal dosen lain (tukar)
- ✅ Bisa drag ke slot kosong (pindah)

---

### B. Dialog Konfirmasi

Saat drop jadwal, muncul dialog dengan 2 mode:

#### Mode 1: Tukar Jadwal (dengan dosen lain)
```tsx
{!targetCell.isEmptySlot && targetCell.cell && (
    <div>
        <Label>Ditukar dengan:</Label>
        - Mata Kuliah: {targetCell.cell.matkul}
        - Dosen: {targetCell.cell.dosen}
        - Tanggal & Waktu
        - Lab
    </div>
)}
```

#### Mode 2: Pindah Jadwal (ke slot kosong)
```tsx
{targetCell.isEmptySlot && (
    <div>
        <Label>Pindah ke:</Label>
        - Slot Kosong
        - Tanggal & Waktu
    </div>
)}
```

**Form Input:**
- **Alasan** (required): Textarea untuk alasan tukar/pindah
- Button: **Batal** | **Ajukan Tukar/Pindah**

---

### C. Tab Request Keluar

Menampilkan request tukar jadwal yang diajukan oleh user.

**Data Ditampilkan:**
- Status badge: Menunggu | Disetujui | Ditolak | Dibatalkan
- Jadwal Saya (jadwal asal)
- Ditukar dengan / Pindah ke (jadwal tujuan atau slot kosong)
- Alasan pemohon
- Alasan penolakan (jika ditolak)
- Tanggal diajukan

**Actions:**
- **Batalkan** (jika status = menunggu)

---

### D. Tab Request Masuk

Menampilkan request tukar jadwal dari dosen lain yang meminta tukar dengan jadwal user.

**Data Ditampilkan:**
- Status badge
- Jadwal Saya (yang diminta untuk ditukar)
- Ditukar dengan (jadwal pemohon)
- Alasan pemohon
- Tanggal diajukan

**Actions:**
- **Setujui** (jika status = menunggu)
- **Tolak** (jika status = menunggu, dengan alasan)

---

## Backend Implementation

### Controller: TukarJadwalController.php

#### Method Baru: `calendar()`

**Responsibilities:**
1. Get jadwal data untuk kalender
2. Mark jadwal user dengan `is_my_schedule: true`
3. Check apakah jadwal sudah lewat dengan `is_past`
4. Get request keluar (myRequests)
5. Get request masuk (incomingRequests)

**Key Logic:**
```php
$isMySchedule = $master->dosen_id === $dosen->id;
$isPast = $sesi->tanggal->isPast();

$jadwalData[$kampusId][$minggu][$hariId][$slotId][] = [
    'sesi_jadwal_id' => $sesi->id,
    'matkul' => $master->kelasMatKul->mataKuliah->nama,
    'dosen' => $master->dosen->user->name,
    'dosen_id' => $master->dosen->id,
    'is_my_schedule' => $isMySchedule,
    'is_past' => $isPast,
    // ...
];
```

#### Method Existing: `store()`

Handle submit tukar jadwal:
```php
$data = [
    'sesi_jadwal_pemohon_id' => $request->sesi_jadwal_pemohon_id,
    'alasan_pemohon' => $request->alasan_pemohon,
];

// Jika tukar dengan dosen lain
if ($request->sesi_jadwal_mitra_id) {
    $data['sesi_jadwal_mitra_id'] = $request->sesi_jadwal_mitra_id;
    $data['mitra_id'] = $request->mitra_id;
} else {
    // Pindah ke slot kosong
    $data['sesi_jadwal_mitra_id'] = null;
    $data['mitra_id'] = null;
}
```

---

## Routes

```php
Route::middleware(['peran:dosen'])->group(function () {
    Route::get('/tukar-jadwal', [TukarJadwalController::class, 'calendar'])
        ->name('tukar-jadwal.index');
    Route::get('/tukar-jadwal/calendar', [TukarJadwalController::class, 'calendar'])
        ->name('tukar-jadwal.calendar');
    Route::get('/tukar-jadwal/requests', [TukarJadwalController::class, 'index'])
        ->name('tukar-jadwal.requests');
    
    Route::post('/tukar-jadwal', [TukarJadwalController::class, 'store'])
        ->name('tukar-jadwal.store');
    Route::post('/tukar-jadwal/{tukarJadwal}/approve', [TukarJadwalController::class, 'approve'])
        ->name('tukar-jadwal.approve');
    Route::post('/tukar-jadwal/{tukarJadwal}/reject', [TukarJadwalController::class, 'reject'])
        ->name('tukar-jadwal.reject');
    Route::post('/tukar-jadwal/{tukarJadwal}/cancel', [TukarJadwalController::class, 'cancel'])
        ->name('tukar-jadwal.cancel');
});
```

---

## UI/UX Features

### Visual Feedback

1. **Drag Start**
   - Opacity 0.5 pada element yang di-drag
   - Cursor berubah jadi `grabbing`

2. **Drag Over**
   - Background hijau muda pada drop zone
   - Ring hijau 2px pada cell target
   - Transition smooth

3. **Drag End**
   - Opacity kembali ke 1
   - Visual effect hilang

4. **Hover States**
   - Jadwal sendiri: hover green-100
   - Cell kosong: hover accent/30

### Info Box

Card biru dengan instruksi penggunaan:
```
Cara Tukar Jadwal:
• Drag jadwal Anda (yang berwarna hijau) ke jadwal dosen lain untuk tukar jadwal
• Drag jadwal Anda ke slot kosong untuk pindah jadwal
• Perubahan bersifat sementara (hanya untuk minggu ini)
• Jika ingin permanen, hubungi admin untuk ubah jadwal master
```

---

## Testing Checklist

### Drag & Drop
- [ ] Jadwal sendiri bisa di-drag (border hijau, cursor move)
- [ ] Jadwal dosen lain tidak bisa di-drag
- [ ] Jadwal yang sudah lewat tidak bisa di-drag
- [ ] Visual feedback saat drag (opacity 0.5)
- [ ] Drop zone highlight (background hijau + ring) saat drag over
- [ ] Dialog muncul saat drop ke target valid

### Tukar Jadwal (dengan dosen lain)
- [ ] Dialog menampilkan info lengkap kedua jadwal
- [ ] Form alasan required sebelum submit
- [ ] Submit berhasil dan muncul di tab Request Keluar
- [ ] Request muncul di tab Request Masuk dosen mitra

### Pindah Jadwal (ke slot kosong)
- [ ] Dialog menampilkan "Slot Kosong" sebagai target
- [ ] Form alasan required
- [ ] Submit berhasil
- [ ] Mitra_id = null di database

### Tab Request Keluar
- [ ] Menampilkan semua request yang diajukan user
- [ ] Status badge akurat (Menunggu, Disetujui, Ditolak, Dibatalkan)
- [ ] Bisa batalkan request dengan status menunggu
- [ ] Alasan penolakan muncul jika ditolak

### Tab Request Masuk
- [ ] Menampilkan request dari dosen lain
- [ ] Button Setujui & Tolak hanya muncul jika status menunggu
- [ ] Approve berhasil
- [ ] Reject dengan alasan berhasil

### Validasi
- [ ] Tidak bisa drop ke jadwal sendiri
- [ ] Tidak bisa drop ke jadwal yang sudah lewat
- [ ] Tidak bisa drag jadwal yang sudah lewat
- [ ] Counter badge di tab akurat (Request Keluar & Masuk)

---

## Files Created/Modified

### Created:
1. `resources/js/Pages/TukarJadwal/Calendar.tsx` (NEW - 857 lines)

### Modified:
1. `app/Http/Controllers/TukarJadwalController.php`
   - Added method `calendar()` (234 lines)
   
2. `routes/web.php`
   - Added calendar routes for tukar jadwal

---

## Database Schema

Menggunakan tabel `tukar_jadwal` yang sudah ada:

```php
Schema::create('tukar_jadwal', function (Blueprint $table) {
    $table->id();
    $table->foreignId('pemohon_id')->constrained('dosen');
    $table->foreignId('sesi_jadwal_pemohon_id')->constrained('sesi_jadwal');
    $table->foreignId('mitra_id')->nullable()->constrained('dosen');
    $table->foreignId('sesi_jadwal_mitra_id')->nullable()->constrained('sesi_jadwal');
    $table->enum('status', ['menunggu', 'disetujui', 'ditolak', 'dibatalkan']);
    $table->text('alasan_pemohon')->nullable();
    $table->text('alasan_penolakan')->nullable();
    $table->timestamp('tanggal_diajukan')->useCurrent();
    $table->timestamp('tanggal_diproses')->nullable();
    $table->timestamps();
});
```

**Note:**
- Jika `mitra_id` = null → Pindah ke slot kosong
- Jika `mitra_id` != null → Tukar dengan dosen lain

---

## Known Limitations

1. **Sementara (Per Minggu)**
   - Perubahan hanya berlaku untuk minggu yang dipilih
   - Tidak mengubah jadwal master
   - Jika ingin permanen, harus lewat admin

2. **Approve Flow**
   - Pindah ke slot kosong: Auto approve (tidak perlu persetujuan)
   - Tukar dengan dosen lain: Perlu approve dari mitra

3. **Past Schedule**
   - Jadwal yang sudah lewat tidak bisa di-drag atau dijadikan target drop

---

## Next Steps

Berdasarkan requirement awal yang belum dikerjakan:

1. [ ] **Dashboard Dosen** - Tampilkan jadwal hari ini
2. [ ] **Super Admin** - Auto-fill semester & hari saat edit, CRUD Dosen
3. [ ] **Generate Ulang** - Reset tukar_jadwal & booking_laboratorium
4. [ ] **Status Terlaksana** - Update status jadwal yang sudah lewat
5. [ ] **Alasan Tidak Masuk** - Tambah field alasan (sakit, izin, dll)

---

## Screenshots Expected

**Tab Kalender:**
- Jadwal hijau (draggable)
- Jadwal biru (droppable)
- Slot kosong dengan border dashed
- Drop zone highlight saat drag over

**Dialog Tukar:**
- Info jadwal asal & tujuan
- Form alasan
- Button Ajukan

**Tab Request:**
- List dengan status badge
- Info lengkap jadwal
- Button action sesuai status

---

## Troubleshooting

### Drag tidak berfungsi:
1. Pastikan jadwal adalah milik user (`is_my_schedule: true`)
2. Pastikan jadwal belum lewat (`is_past: false`)
3. Check `draggable={cell.is_my_schedule && !cell.is_past}`
4. Check browser console untuk error

### Drop tidak trigger dialog:
1. Pastikan `onDrop` handler terpasang di `<td>`
2. Pastikan `handleDragOver` ada `e.preventDefault()`
3. Check tanggal cell tersedia

### Visual feedback tidak muncul:
1. Check CSS classes di inspect element
2. Pastikan `draggedCell` state ter-set
3. Check conditional className

---

## Contact

Untuk pertanyaan atau issue, silakan hubungi developer.
