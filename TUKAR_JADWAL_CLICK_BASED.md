# Implementasi Tukar Jadwal - Click-Based Mechanism

## Overview
Fitur tukar jadwal telah direvisi dari mekanisme drag-and-drop menjadi click-based untuk meningkatkan user experience dan konsistensi dengan fitur booking lab.

## Mekanisme Baru

### 1. **Untuk Tukar Jadwal dengan Dosen Lain**
- **Step 1**: Klik jadwal Anda sendiri (ditandai dengan warna hijau dan badge "Jadwal Saya")
- **Step 2**: Klik jadwal dosen lain yang ingin ditukar
- **Step 3**: Muncul dialog konfirmasi untuk mengisi alasan tukar
- **Step 4**: Submit request

### 2. **Untuk Pindah Jadwal ke Slot Kosong**
- **Step 1**: Klik jadwal Anda sendiri 
- **Step 2**: Klik cell/slot kosong yang diinginkan
- **Step 3**: Muncul dialog konfirmasi untuk mengisi alasan pindah
- **Step 4**: Submit request

### 3. **Validasi dan Peringatan**
- ❌ Jika user klik jadwal orang lain atau slot kosong **tanpa** klik jadwal sendiri dulu → Toast warning: "Pilih jadwal Anda dulu"
- ❌ Tidak bisa tukar/pindah ke jadwal yang sudah lewat
- ❌ Tidak bisa tukar/pindah ke tanggal yang sudah lewat
- ✅ Jadwal yang sudah dipilih ditandai dengan ring hijau dan tampil indicator di atas kalender

## UI/UX Improvements

### Tampilan Kalender
- **Sama dengan Booking Lab**: Menggunakan card gradient design dengan color scheme per dosen
- **Visual Indicator**: 
  - Jadwal sendiri: Badge "Jadwal Saya" dengan background hijau
  - Sudah lewat: Badge "Sudah Lewat" dengan opacity 50%
  - Selected: Ring hijau 4px di sekeliling card
- **Empty Cell**: 
  - Jika sudah pilih jadwal: Tampil "Pindah ke sini" dengan icon Plus
  - Jika belum pilih: Tampil "Kosong" dengan border dashed

### Feedback ke User
1. **Selected Schedule Indicator**: Card hijau muncul di atas kalender menunjukkan jadwal yang dipilih
2. **Toast Notifications**: 
   - Success: Hijau dengan icon CheckCircle
   - Error: Merah dengan icon XCircle
   - Warning: Biru untuk validasi
3. **Hover States**: Smooth transition saat hover jadwal atau slot kosong

### Info Box
Instruksi yang jelas di atas kalender:
- Klik jadwal Anda yang ingin ditukar/dipindah
- Lalu klik jadwal dosen lain untuk tukar jadwal
- Atau klik slot kosong untuk pindah jadwal
- Perubahan bersifat sementara (hanya untuk minggu ini)

## Technical Changes

### State Management
```typescript
// Removed: draggedCell (drag-and-drop)
// Added:
const [selectedMySchedule, setSelectedMySchedule] = useState<JadwalCell | null>(null);
```

### Event Handlers
```typescript
// New handlers
handleMyScheduleClick(cell) - untuk klik jadwal sendiri
handleTargetClick(cellsData, tanggal, slot) - untuk klik target (jadwal lain / slot kosong)

// Removed handlers
handleDragStart, handleDragOver, handleDragEnd, handleDrop
```

### Visual Consistency
- Menggunakan color scheme yang sama dengan booking lab
- Badge dan icon positioning sama
- Layout dan spacing konsisten
- Responsive design maintained

## Files Changed
- `resources/js/Pages/TukarJadwal/Calendar.tsx` - Complete refactor

## Testing Checklist
- [ ] Klik jadwal sendiri menampilkan indicator
- [ ] Klik jadwal lain setelah pilih jadwal sendiri membuka dialog tukar
- [ ] Klik slot kosong setelah pilih jadwal sendiri membuka dialog pindah
- [ ] Klik jadwal lain tanpa pilih jadwal sendiri menampilkan toast warning
- [ ] Tidak bisa klik jadwal/tanggal yang sudah lewat
- [ ] Dialog menampilkan informasi yang benar
- [ ] Submit request berhasil dan tampil di tab "Request Keluar"
- [ ] Button "Batal" di indicator menghilangkan selection
- [ ] Toast notifications muncul dengan benar

## Benefits
1. ✅ **Lebih Intuitif**: User tidak perlu drag-and-drop yang kadang tricky di touchscreen
2. ✅ **Konsisten**: UI sama dengan booking lab, familiar bagi user
3. ✅ **Mobile Friendly**: Click lebih mudah di mobile daripada drag
4. ✅ **Clear Feedback**: Visual indicator jelas untuk setiap action
5. ✅ **Validation First**: Validasi di awal mencegah user error

## Future Enhancements
- [ ] Keyboard shortcuts (Enter untuk confirm, Esc untuk cancel)
- [ ] Multi-select untuk batch operations
- [ ] Undo/Redo functionality
- [ ] Save draft request
