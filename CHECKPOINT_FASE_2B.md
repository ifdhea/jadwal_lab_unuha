# CHECKPOINT FASE 2B - Ready for Frontend Implementation

## ✅ SUDAH SELESAI (Backend Ready)

### 1. Controller Updates
**File:** `app/Http/Controllers/BookingLaboratoriumController.php`
- ✅ Method `calendar()` added (line ~285)
  - Reuse logic dari JadwalController
  - Return: jadwalData, availableSlots, bookings
  - Ready untuk grid rendering

### 2. Routes Updates
**File:** `routes/web.php`
- ✅ `GET /booking-lab` → `calendar()` (main page)
- ✅ `GET /booking-lab/requests` → `index()` (requests tab)
- ✅ Existing routes tetap ada (create, store, dll)

### 3. Data Structure dari Backend

```php
// Di calendar() return:
[
    'semesters' => [...],
    'selectedSemesterId' => 1,
    'kampusList' => [...],
    'mingguList' => [1,2,3,...,17],
    'selectedMinggu' => 1,
    'hari' => ['Senin', 'Selasa', ...],
    'slots' => [...],
    'jadwalData' => [
        kampus_id => [
            minggu => [
                hari_id => [
                    slot_id => [
                        {
                            'sesi_jadwal_id' => 123,
                            'matkul' => '...',
                            'dosen' => '...',
                            'status' => 'terjadwal|tidak_masuk',
                            'is_available' => true/false,
                            // ... dst
                        }
                    ]
                ]
            ]
        ]
    ],
    'availableSlots' => [
        {
            'kampus_id' => 1,
            'hari_id' => 1,
            'slot_id' => 3,
            'lab_id' => 1,
            'tanggal' => '2025-09-22',
            'reason' => 'dosen_tidak_masuk'
        }
    ],
    'bookings' => [  // Approved bookings
        {
            'id' => 1,
            'kampus_id' => 1,
            'hari_id' => 1,
            'slot_mulai_id' => 5,
            'lab_id' => 1,
            'dosen_nama' => 'Dr. X',
            'keperluan' => 'Ujian',
            // ... dst
        }
    ]
]
```

---

## 🎯 NEXT TASK (Frontend Implementation)

### Task 1: Backup Existing Index.tsx
```bash
cd resources/js/pages/BookingLaboratorium
cp Index.tsx Index.old.tsx
```

### Task 2: Create New Index.tsx Structure
Struktur baru dengan 2 tabs:

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Index({ 
    semesters, selectedSemesterId, kampusList, mingguList, selectedMinggu,
    hari, slots, jadwalData, availableSlots, bookings,
    breadcrumbs 
}) {
    const [showBookingDialog, setShowBookingDialog] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Laboratorium" />

            <Tabs defaultValue="calendar">
                <TabsList>
                    <TabsTrigger value="calendar">
                        <Calendar className="mr-2 h-4 w-4" />
                        Kalender Booking
                    </TabsTrigger>
                    <TabsTrigger value="requests">
                        <List className="mr-2 h-4 w-4" />
                        Request Saya
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Kalender */}
                <TabsContent value="calendar">
                    {/* Copy grid dari Jadwal/Index.tsx */}
                    {/* Tambah handler onClick untuk cell kosong */}
                    <BookingCalendarGrid 
                        jadwalData={jadwalData}
                        availableSlots={availableSlots}
                        bookings={bookings}
                        onCellClick={handleBookingClick}
                    />
                </TabsContent>

                {/* Tab 2: Requests */}
                <TabsContent value="requests">
                    {/* Load via Inertia.visit ke /booking-lab/requests */}
                    {/* ATAU gunakan iframe/fetch */}
                    <RequestList />
                </TabsContent>
            </Tabs>

            {/* Dialog untuk form booking */}
            <BookingDialog 
                open={showBookingDialog}
                onClose={() => setShowBookingDialog(false)}
                slot={selectedSlot}
            />
        </AppLayout>
    );
}
```

### Task 3: Create BookingCalendarGrid Component
- Copy grid rendering dari `Jadwal/Index.tsx`
- Modify untuk handle available slots
- Add visual indicators:
  - Green dashed border untuk slot kosong
  - Yellow bg untuk dosen tidak masuk
  - Click handler

### Task 4: Create BookingDialog Component
Simple dialog dengan form:
```tsx
<Dialog>
    <DialogHeader>
        <DialogTitle>Booking Laboratorium</DialogTitle>
    </DialogHeader>
    <DialogContent>
        <div>
            <Label>Tanggal</Label>
            <Input value={slot.tanggal} disabled />
        </div>
        <div>
            <Label>Waktu</Label>
            <Input value={`${slot.waktu_mulai} - ${slot.waktu_selesai}`} disabled />
        </div>
        <div>
            <Label>Laboratorium</Label>
            <Input value={slot.lab_nama} disabled />
        </div>
        <div>
            <Label>Keperluan *</Label>
            <Input ... />
        </div>
        <div>
            <Label>Keterangan</Label>
            <Textarea ... />
        </div>
    </DialogContent>
    <DialogFooter>
        <Button onClick={handleSubmit}>Ajukan Booking</Button>
    </DialogFooter>
</Dialog>
```

### Task 5: Handle Requests Tab
Option 1: Separate route (recommended)
- Tab click → `router.visit('/booking-lab/requests')`
- Create separate component for requests list

Option 2: Embedded (complex)
- Load data via fetch
- Render dalam same component

---

## 📝 VISUAL DESIGN - Cell States

### 1. Normal Jadwal (Tidak Bisa Booking)
- Background: Gradient colored
- Display: Matkul, Dosen, Lab
- Cursor: default
- Opacity: 100%

### 2. Slot Kosong (Bisa Booking)
- Background: white/gray-50
- Border: 2px dashed green-500
- Content: Icon + "Klik untuk booking"
- Cursor: pointer
- Hover: bg-green-50

### 3. Dosen Tidak Masuk (Bisa Booking)
- Background: yellow-50
- Border: 2px dashed orange-500
- Display: Strikethrough jadwal + Badge "Dosen Tidak Masuk"
- Content bawah: "Klik untuk booking"
- Cursor: pointer
- Hover: bg-orange-100

### 4. Sudah Di-booking (Info Only)
- Background: green-100
- Border: 2px solid green-600
- Display: Dosen yang booking + keperluan
- Badge: "Booked"
- Cursor: default

---

## 🚀 QUICK START untuk Next Session

```bash
# 1. Backup existing file
cd D:\laragon\www\proyek_ignitepad\jadwal_lab
cp resources\js\pages\BookingLaboratorium\Index.tsx resources\js\pages\BookingLaboratorium\Index.backup.tsx

# 2. Create new Index.tsx (dari template)
# ... implement new structure

# 3. Test
npm run dev

# 4. Visit
http://jadwal_lab.test/booking-lab
```

---

## ⚠️ IMPORTANT NOTES

1. **Jangan hapus** file Index.old/backup
2. **Backend sudah ready**, fokus ke frontend saja
3. **Reuse** sebanyak mungkin dari Jadwal/Index.tsx
4. **Test** di browser dosen (bukan super admin)
5. Cell click harus:
   - Check `is_available` dari data
   - Populate form dengan data slot
   - Submit ke `/booking-lab/create` atau langsung `/booking-lab/store`

---

**Status:** Ready untuk Frontend Implementation  
**Estimasi:** 2-3 jam untuk complete UI + testing  
**Next:** Backup file → Build new structure → Test

