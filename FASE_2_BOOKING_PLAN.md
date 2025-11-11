# FASE 2B: BOOKING LABORATORIUM - DETAIL PLAN

## Overview
Halaman booking lab dengan 2 tab sistem:
1. **Tab Jadwal/Kalender** - Grid seperti jadwal final, klik cell kosong untuk booking
2. **Tab Request Saya** - Daftar request booking yang sudah diajukan

## Tab 1: Kalender Booking

### Konsep:
- Tampilan grid seperti di Jadwal/Index.tsx
- Menampilkan jadwal existing + slot kosong
- Cell yang bisa diklik untuk booking:
  - ✅ Slot kosong (tidak ada jadwal)
  - ✅ Slot ada jadwal tapi status = 'tidak_masuk'
  - ❌ Slot terisi jadwal normal (disabled/tidak bisa klik)

### Data yang Ditampilkan di Grid:
```typescript
interface BookingCalendarCell {
  // Untuk slot terisi (existing schedule)
  sesi_jadwal_id?: number;
  matkul?: string;
  dosen?: string;
  lab?: string;
  status?: string; // 'terjadwal', 'tidak_masuk', dst
  
  // Untuk slot kosong atau bisa booking
  is_available: boolean;  // true jika kosong atau dosen tidak masuk
  is_booked: boolean;     // true jika ada booking approved disini
  booking_info?: {
    id: number;
    dosen: string;
    keperluan: string;
  };
}
```

### Interaksi:
1. Klik cell kosong/available → Dialog booking muncul
2. Dialog berisi:
   - Tanggal (readonly, dari cell)
   - Waktu (readonly, dari slot)
   - Lab (readonly, dari kolom)
   - Keperluan (input required)
   - Keterangan (textarea optional)
3. Submit → Create booking dengan status 'menunggu'

### Backend API Needed:
```php
GET /booking-lab/calendar?semester_id=1&minggu=1
Response: {
  jadwalData: {...},  // Format sama seperti JadwalController
  availableSlots: [   // Tambahan info slot yang bisa di-booking
    {
      hari: 'Senin',
      slot_id: 1,
      lab_id: 1,
      is_available: true,
      reason: 'kosong' | 'dosen_tidak_masuk'
    }
  ],
  bookings: [  // Booking yang sudah disetujui (ditampilkan di grid)
    {
      tanggal: '2025-09-22',
      slot_mulai_id: 1,
      slot_selesai_id: 2,
      lab_id: 1,
      dosen_nama: 'Dr. Ahmad',
      keperluan: 'Ujian praktek'
    }
  ]
}
```

## Tab 2: Request Booking Saya

### Konsep:
- Sama dengan halaman Index.tsx yang existing
- Tampilkan daftar booking milik dosen (jika dosen) atau semua (jika admin)
- Action buttons:
  - Dosen: Batalkan (jika status menunggu/disetujui)
  - Admin: Setujui/Tolak (jika status menunggu)

### Data:
- Reuse existing structure dari BookingLaboratoriumController::index()

## Implementation Steps:

### Step 1: Update Controller ✅
File: `BookingLaboratoriumController.php`
- Add method `calendar()` untuk return data grid + available slots
- Keep existing `index()` untuk tab request

### Step 2: Update Routes ✅  
File: `web.php`
```php
Route::get('/booking-lab/calendar', [BookingLaboratoriumController::class, 'calendar'])->name('booking-lab.calendar');
```

### Step 3: Create New Index.tsx Structure
File: `resources/js/pages/BookingLaboratorium/Index.tsx`

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Index({ ... }) {
  return (
    <AppLayout>
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Kalender Booking</TabsTrigger>
          <TabsTrigger value="requests">Request Saya</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          {/* Grid seperti Jadwal/Index.tsx */}
          {/* Tapi dengan onClick handler untuk cell kosong */}
        </TabsContent>
        
        <TabsContent value="requests">
          {/* List booking (existing code) */}
        </TabsContent>
      </Tabs>
      
      {/* Dialog untuk form booking */}
      <BookingDialog ... />
    </AppLayout>
  );
}
```

### Step 4: Reuse Jadwal Grid Component
- Copy paste grid rendering dari Jadwal/Index.tsx
- Modify cell click handler
- Add visual indicator untuk slot available (border hijau/dashed?)

### Step 5: Create BookingDialog Component
Simple dialog dengan form:
- Input keperluan
- Textarea keterangan
- Submit button

## Visual Design:

### Grid Cell States:
1. **Terisi (Normal Jadwal)** - Sama seperti Jadwal/Index.tsx
   - Background gradient
   - Info matkul, dosen, dll
   - Tidak bisa diklik

2. **Kosong & Available** 
   - Background putih/abu-abu muda
   - Border hijau dashed
   - Icon/text "Klik untuk booking"
   - Cursor pointer
   - Hover effect

3. **Jadwal Tidak Masuk (Available for Booking)**
   - Background kuning muda
   - Strikethrough pada info jadwal
   - Badge "Dosen Tidak Masuk - Bisa Booking"
   - Cursor pointer

4. **Sudah Di-booking**
   - Background hijau muda
   - Info booking (dosen, keperluan)
   - Badge "Booked"

## Next Actions:
1. Tambah method `calendar()` di BookingLaboratoriumController
2. Update route
3. Refactor Index.tsx jadi 2 tabs
4. Test booking flow

---

Lanjut implement?
