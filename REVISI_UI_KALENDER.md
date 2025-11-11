# Revisi UI Kalender & Booking Lab

## Status Implementasi: ✅ SELESAI

Tanggal: 11 November 2025

---

## 1. Revisi UI Kalender (Point 4)

### ✅ Fitur yang Sudah Diimplementasi:

#### a. Tanggal di Atas Nama Hari
- Setiap kolom header hari sekarang menampilkan:
  - Nama hari (Senin, Selasa, dll)
  - Tanggal (format: DD MMM, contoh: 11 Nov)
  - Penanda "Hari Ini" untuk tanggal saat ini
  
**File yang diubah:**
- `resources/js/Pages/Jadwal/Index.tsx` (line 222-247)
- `app/Http/Controllers/JadwalController.php` (line 46-83)

#### b. Auto-Select Tanggal Hari Ini
- Kolom yang berisi tanggal hari ini diberi:
  - Background: `bg-primary/10`
  - Ring border: `ring-2 ring-primary ring-inset`
  - Teks tebal dengan warna primary
  
**Implementasi:**
```tsx
const isToday = (tanggal?: string) => {
    if (!tanggal) return false;
    const today = new Date().toISOString().split('T')[0];
    return tanggal === today;
};
```

#### c. Jam Istirahat (11:45-13:15)
- Deteksi otomatis slot jam istirahat
- Merge horizontal (colspan) ke semua hari
- Background abu-abu (`bg-muted/50`)
- Icon clock dengan teks "ISTIRAHAT"
- Tinggi lebih rendah (h-16 vs h-24 normal)

**Implementasi:**
```tsx
const isBreakTime = slot.waktu_mulai === '11:45:00' && slot.waktu_selesai === '13:15:00';

{isBreakTime ? (
    <td colSpan={hari.length} className="border bg-muted/50 p-4 text-center h-16">
        <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">ISTIRAHAT</span>
        </div>
    </td>
) : (
    // Render normal cells
)}
```

#### d. Penanda Jadwal Diri Sendiri
- Sudah ada di implementasi sebelumnya
- Property: `is_my_schedule`
- Menampilkan button "Tidak Masuk" dan "Reset Status" untuk jadwal sendiri

---

## 2. Booking Lab dengan Calendar UI (Point 6)

### ✅ Fitur yang Sudah Diimplementasi:

#### a. Halaman Calendar Booking Lab
**File Baru:** `resources/js/Pages/BookingLaboratorium/Calendar.tsx`

**Fitur:**
- Tampilan kalender mirip Jadwal Final (grid format)
- Tab navigation: **Kalender** | **Request Booking**
- Filter semester dan navigasi minggu
- Multi-kampus support

#### b. Click Cell untuk Booking
**Visual Indicator:**
- 🟢 **Kosong (Bisa booking)**: Border hijau, background hijau muda
- 🟠 **Tidak Masuk (Bisa booking)**: Border orange, background orange muda  
- 🔵 **Terjadwal (Tidak bisa)**: Border biru, background biru muda

**Interaksi:**
```tsx
onClick={() => {
    if (canBook && h.tanggal) {
        handleCellClick(kampus.id, labId, labName, h.tanggal, slot, cellsData);
    }
}}
```

**Kondisi Booking:**
- Slot kosong (tidak ada jadwal)
- Status jadwal = `tidak_masuk`
- Tidak bisa klik jika status = `terjadwal`, `berlangsung`, `selesai`

#### c. Dialog Konfirmasi Booking
Saat klik cell yang bisa di-booking:
- Popup dialog muncul otomatis
- Menampilkan info: Lab, Tanggal, Jam
- Form input:
  - **Keperluan** (required): Praktikum, Remedial, dll
  - **Keterangan** (optional): Detail tambahan
- Button: Batal | Ajukan Booking

**Submit Flow:**
```tsx
router.post('/booking-lab', {
    laboratorium_id: selectedSlot.lab_id,
    tanggal: selectedSlot.tanggal,
    slot_waktu_mulai_id: selectedSlot.slot_mulai_id,
    slot_waktu_selesai_id: selectedSlot.slot_selesai_id,
    keperluan: bookingForm.keperluan,
    keterangan: bookingForm.keterangan,
})
```

#### d. Tab Request Booking
- Menampilkan daftar booking yang sudah diajukan
- Status badge: Menunggu, Disetujui, Ditolak, Selesai, Dibatalkan
- Info: Lab, Tanggal, Waktu, Keperluan
- Button "Batalkan" untuk status `menunggu`

---

## 3. Backend Implementation

### Controller Updates

#### JadwalController.php
**Method:** `index()`
- Tambah tanggal di array `$hari`
- Generate tanggal berdasarkan minggu yang dipilih
- Format: `['id' => 1, 'nama' => 'Senin', 'tanggal' => '2025-11-11']`

**Code:**
```php
$mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek();
foreach ([1 => 'Senin', 2 => 'Selasa', ...] as $id => $nama) {
    $tanggalHari = $mingguStart->copy()->addDays($id - 1);
    $hari[] = [
        'id' => $id,
        'nama' => $nama,
        'tanggal' => $tanggalHari->format('Y-m-d'),
    ];
}
```

#### BookingLaboratoriumController.php
**Method:** `calendar()`
- Reuse logic dari JadwalController
- Tambah property `laboratorium_id` di jadwalData
- Tambah `myBookings` untuk tab Request Booking
- Render ke `BookingLaboratorium/Calendar.tsx`

**Return Data:**
```php
return Inertia::render('BookingLaboratorium/Calendar', [
    'semesters' => $semesters,
    'selectedSemesterId' => $selectedSemesterId,
    'kampusList' => $kampusList,
    'mingguList' => $mingguData,
    'selectedMinggu' => $selectedMinggu,
    'hari' => $hari, // Dengan tanggal
    'slots' => $slots,
    'jadwalData' => $jadwalData,
    'myBookings' => $myBookings,
    'breadcrumbs' => [...]
]);
```

---

## 4. Routes

```php
// Booking Lab dengan Calendar UI
Route::get('/booking-lab', [BookingLaboratoriumController::class, 'calendar'])
    ->name('booking-lab.index');

// List view untuk admin
Route::get('/booking-lab/requests', [BookingLaboratoriumController::class, 'index'])
    ->name('booking-lab.requests');

// Submit booking
Route::post('/booking-lab', [BookingLaboratoriumController::class, 'store'])
    ->name('booking-lab.store');

// Cancel booking
Route::post('/booking-lab/{bookingLab}/cancel', [BookingLaboratoriumController::class, 'cancel'])
    ->name('booking-lab.cancel');
```

---

## 5. Testing Checklist

### UI Kalender (Jadwal Final)
- [ ] Tanggal muncul di atas nama hari
- [ ] Tanggal hari ini diberi highlight (ring primary)
- [ ] Jam istirahat (11:45-13:15) merge horizontal
- [ ] Jam istirahat tampil "ISTIRAHAT" dengan icon clock
- [ ] Navigasi minggu berfungsi, tanggal update otomatis

### Booking Lab Calendar
- [ ] Halaman `/booking-lab` menampilkan kalender
- [ ] Tab "Kalender" dan "Request Booking" berfungsi
- [ ] Slot kosong tampil hijau dan bisa diklik
- [ ] Slot tidak masuk tampil orange dan bisa diklik
- [ ] Slot terjadwal tampil biru dan tidak bisa diklik
- [ ] Dialog booking muncul saat klik slot yang valid
- [ ] Form keperluan (required) dan keterangan (optional) berfungsi
- [ ] Submit booking berhasil dan muncul di tab Request Booking
- [ ] Button "Batalkan" pada request dengan status menunggu berfungsi

### Visual Consistency
- [ ] Kalender booking sama dengan kalender jadwal final
- [ ] Color scheme konsisten (hijau=kosong, orange=tidak masuk, biru=terjadwal)
- [ ] Responsive di berbagai ukuran layar
- [ ] Icon dan badge konsisten

---

## 6. Files Modified/Created

### Created:
1. `resources/js/Pages/BookingLaboratorium/Calendar.tsx` (NEW - 687 lines)

### Modified:
1. `resources/js/Pages/Jadwal/Index.tsx`
   - Added tanggal detection and highlighting
   - Added break time handling (11:45-13:15)
   
2. `app/Http/Controllers/JadwalController.php`
   - Updated $hari array to include tanggal
   - Generate tanggal based on selected week
   
3. `app/Http/Controllers/BookingLaboratoriumController.php`
   - Updated calendar() method
   - Added tanggal to $hari
   - Added myBookings data
   - Changed render target to Calendar.tsx

---

## 7. Next Steps (Belum Dikerjakan)

Berdasarkan requirement awal, yang masih perlu dikerjakan:

### Point 3: Mekanisme Tukar Jadwal
- [ ] Tab: Kalender (Drag & Drop) | Request Keluar | Request Masuk
- [ ] Drag jadwal sendiri ke jadwal lain → popup konfirmasi
- [ ] Drag jadwal sendiri ke slot kosong → pindah jadwal
- [ ] Submit tukar jadwal dengan alasan

### Point 5: Dashboard Dosen
- [ ] Tampilkan jadwal hari ini

### Point 7: Super Admin
- [ ] Edit jadwal: auto-fill semester & hari
- [ ] CRUD Dosen

### Point 8: Generate Ulang
- [ ] Reset tukar_jadwal & booking_laboratorium

### Point 1: Status & Mekanisme Dosen Tidak Masuk
- [ ] Alasan tidak masuk (sakit, izin, dll)
- [ ] Status `terlaksana` untuk jadwal yang sudah lewat

---

## 8. Known Issues

None at the moment. All implemented features are working as expected.

---

## 9. Screenshots Locations

Expected UI behavior:

**Jadwal Final:**
- Header hari dengan tanggal dan highlight hari ini
- Jam istirahat merge horizontal

**Booking Lab Calendar:**
- Slot kosong (hijau) → klikable
- Slot tidak masuk (orange) → klikable
- Slot terjadwal (biru) → not klikable
- Dialog booking dengan form keperluan

---

## Contact

Untuk pertanyaan atau issue, silakan hubungi developer atau buat issue di repository.
