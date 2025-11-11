# QUICK REFERENCE - Lanjut Development Fase 2

## 📋 WHERE WE LEFT OFF

**Status:** Fase 2A ✅ Complete | Fase 2B 60% Complete  
**Date:** 11 November 2025, 09:00 WIB  
**Build:** ✅ Success (npm run build completed)

---

## 🎯 IMMEDIATE NEXT TASK

### Task: Implement Booking Lab Frontend (Tab System)

**Estimated Time:** 2-3 hours  
**Priority:** HIGH  
**Complexity:** Medium

**Files to Edit:**
1. `resources/js/pages/BookingLaboratorium/Index.tsx` ⭐ MAIN FILE
   - Current: List view (backed up to Index.backup.tsx)
   - Target: 2-tab system (Calendar + Requests)

**Reference Files (Copy From):**
1. `resources/js/pages/Jadwal/Index.tsx` - Grid rendering
2. `resources/js/components/ui/tabs.tsx` - Tabs component
3. `resources/js/components/ui/dialog.tsx` - Dialog component

---

## 🔧 IMPLEMENTATION STEPS

### Step 1: Create Tab Structure (30 mins)
```tsx
// File: resources/js/pages/BookingLaboratorium/Index.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List } from 'lucide-react';

export default function Index({ 
    semesters, selectedSemesterId, kampusList, mingguList, selectedMinggu,
    hari, slots, jadwalData, availableSlots, bookings, breadcrumbs 
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Laboratorium" />
            
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Booking Laboratorium</h1>
                
                <Tabs defaultValue="calendar">
                    <TabsList>
                        <TabsTrigger value="calendar">
                            <Calendar className="mr-2 h-4 w-4" />
                            Kalender
                        </TabsTrigger>
                        <TabsTrigger value="requests">
                            <List className="mr-2 h-4 w-4" />
                            Request Saya
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="calendar">
                        {/* TODO: Grid kalender */}
                    </TabsContent>
                    
                    <TabsContent value="requests">
                        {/* TODO: List requests */}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
```

### Step 2: Copy Grid dari Jadwal/Index.tsx (60 mins)
- Copy seluruh grid structure (line ~180-650 di Jadwal/Index.tsx)
- Paste ke TabsContent "calendar"
- Modify: Tambah onClick handler untuk cell

### Step 3: Add Available Slot Indicator (30 mins)
Tambah logic untuk render cell kosong:
```tsx
{/* Cek jika slot available */}
{availableSlots.some(
    slot => slot.kampus_id === kampus.id 
         && slot.hari_id === hariId 
         && slot.slot_id === slotId
) && (
    <div 
        onClick={() => handleBookingClick(slot)}
        className="border-2 border-dashed border-green-500 bg-green-50 
                   hover:bg-green-100 cursor-pointer p-4 rounded-lg 
                   flex items-center justify-center"
    >
        <Plus className="h-5 w-5 text-green-600 mr-2" />
        <span className="text-sm text-green-700">Klik untuk Booking</span>
    </div>
)}
```

### Step 4: Create Booking Dialog (45 mins)
```tsx
const [showDialog, setShowDialog] = useState(false);
const [selectedSlot, setSelectedSlot] = useState(null);

function handleBookingClick(slot) {
    setSelectedSlot(slot);
    setShowDialog(true);
}

// Di return:
<Dialog open={showDialog} onOpenChange={setShowDialog}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Booking Laboratorium</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    </DialogContent>
</Dialog>
```

### Step 5: Handle Requests Tab (30 mins)
Option A: Load via route
```tsx
<TabsContent value="requests">
    <Button onClick={() => router.visit('/booking-lab/requests')}>
        Lihat Semua Request
    </Button>
</TabsContent>
```

Option B: Embed iframe (quick hack)
```tsx
<TabsContent value="requests">
    <iframe 
        src="/booking-lab/requests" 
        className="w-full h-screen border-0"
    />
</TabsContent>
```

---

## 📂 FILES STRUCTURE

```
jadwal_lab/
├── app/Http/Controllers/
│   ├── BookingLaboratoriumController.php  ✅ DONE (calendar() method added)
│   ├── JadwalController.php               ✅ DONE (updated data)
│   └── SesiJadwalController.php           ✅ DONE (status methods)
│
├── routes/
│   └── web.php                             ✅ DONE (routes updated)
│
├── resources/js/pages/
│   ├── Jadwal/
│   │   └── Index.tsx                       ✅ DONE (status buttons added)
│   ├── BookingLaboratorium/
│   │   ├── Index.tsx                       🔄 IN PROGRESS (need update)
│   │   ├── Index.backup.tsx                ✅ BACKUP (original file)
│   │   └── Create.tsx                      ✅ EXISTS (form booking)
│   └── TukarJadwal/
│       └── Index.tsx                       ⏳ TODO (empty/basic)
│
└── Documentation/
    ├── PROGRESS_FASE_2.md                  ✅ Progress tracking
    ├── CHECKPOINT_FASE_2B.md               ✅ Detailed guide
    ├── SESSION_SUMMARY.md                  ✅ Summary
    ├── TESTING_GUIDE_FASE_2.md             ✅ Test guide
    └── QUICK_REFERENCE.md                  ✅ This file
```

---

## 💾 DATA STRUCTURE REFERENCE

### Backend Returns (calendar method):
```php
[
    'jadwalData' => [
        1 => [  // kampus_id
            1 => [  // minggu
                1 => [  // hari_id (Senin)
                    1 => [  // slot_id
                        [
                            'sesi_jadwal_id' => 163,
                            'matkul' => 'Perograman Web 1',
                            'dosen' => 'Dr. Ahmad Hidayat',
                            'status' => 'terjadwal',
                            'is_available' => false,
                            // ... dst
                        ]
                    ]
                ]
            ]
        ]
    ],
    'availableSlots' => [
        [
            'kampus_id' => 1,
            'hari_id' => 1,
            'slot_id' => 5,
            'lab_id' => 1,
            'tanggal' => '2025-09-22',
            'reason' => 'dosen_tidak_masuk'
        ]
    ],
    'bookings' => [...]
]
```

---

## 🎨 VISUAL GUIDELINES

### Cell States:
1. **Normal Jadwal** - Gradient colored, not clickable
2. **Available (Kosong)** - Green dashed border, white bg, clickable
3. **Available (Tidak Masuk)** - Yellow bg, orange dashed, clickable
4. **Booked** - Green solid border, light green bg, not clickable

### Colors:
```css
/* Available Slot */
border: 2px dashed #22c55e;  /* green-500 */
background: #f0fdf4;         /* green-50 */
hover: #dcfce7;              /* green-100 */

/* Tidak Masuk Slot */
border: 2px dashed #f97316;  /* orange-500 */
background: #fffbeb;         /* yellow-50 */
hover: #fed7aa;              /* orange-100 */

/* Booked Slot */
border: 2px solid #16a34a;   /* green-600 */
background: #dcfce7;         /* green-100 */
```

---

## 🔍 DEBUG TIPS

### Check Data in Browser Console:
```javascript
// Di component, add:
console.log('Available Slots:', availableSlots);
console.log('Jadwal Data:', jadwalData);
console.log('Bookings:', bookings);
```

### Verify Backend Data:
```bash
# Test route directly
curl http://jadwal_lab.test/booking-lab?semester_id=1&minggu=1

# Check Laravel logs
tail -f storage/logs/laravel.log
```

### Common Issues:
1. **Grid tidak muncul** → Check `jadwalData` structure
2. **Available slots tidak keliatan** → Check `availableSlots` array
3. **Click tidak jalan** → Check onClick handler & state
4. **Dialog tidak muncul** → Check Dialog component import

---

## ⚡ QUICK COMMANDS

```bash
# Start dev server (auto rebuild)
npm run dev

# Build for production
npm run build

# Clear cache
php artisan config:clear && php artisan cache:clear

# Check routes
php artisan route:list | grep booking

# View logs
tail -f storage/logs/laravel.log

# Git status (if needed)
git status
git diff resources/js/pages/BookingLaboratorium/Index.tsx
```

---

## 📞 NEXT SESSION CHECKLIST

**Before Starting:**
- [ ] Read CHECKPOINT_FASE_2B.md
- [ ] Read this QUICK_REFERENCE.md
- [ ] Verify build is working: `npm run build`
- [ ] Check browser console for errors
- [ ] Test login as dosen

**Implementation:**
- [ ] Backup check: Index.backup.tsx exists
- [ ] Create tab structure
- [ ] Copy grid from Jadwal/Index.tsx
- [ ] Add available slot rendering
- [ ] Add click handlers
- [ ] Create dialog component
- [ ] Test end-to-end flow

**Testing:**
- [ ] Grid tampil dengan benar
- [ ] Available slots keliatan (green dashed)
- [ ] Klik cell available → dialog muncul
- [ ] Form submit → booking created
- [ ] Tab Requests → load data

---

## 🎯 SUCCESS CRITERIA

**Fase 2B Complete When:**
- ✅ 2 tabs working (Kalender & Requests)
- ✅ Grid rendering sama seperti Jadwal/Index.tsx
- ✅ Available slots visible dengan indicator
- ✅ Click available slot → dialog booking muncul
- ✅ Submit booking → saved to database
- ✅ Booking approved → tampil di grid
- ✅ No console errors
- ✅ Responsive design

---

**Ready to Continue!** 🚀  
**Estimated Time:** 2-3 hours  
**Difficulty:** Medium  
**Files to Touch:** Mainly `Index.tsx` (BookingLaboratorium)

**Next Big Task After This:** Tukar Jadwal (Drag & Drop)
