# Tukar Jadwal - Fixes Applied

## Issues Fixed

### 1. ✅ Navigasi Minggu Fixed
**Problem**: 
- Minggu ke-2 tidak ada rentang tanggal
- Loncat ke minggu 21 padahal tidak ada

**Solution**:
```typescript
// Sebelum
const handleMingguChange = (minggu: number) => {
    router.get('/tukar-jadwal/calendar', { semester_id: selectedSemesterId, minggu }, ...);
};

// Sesudah - dengan validasi dan Number conversion
const handleMingguChange = (minggu: number | string) => {
    const mingguNum = Number(minggu);
    if (isNaN(mingguNum) || mingguNum < 1) return;
    
    router.get('/tukar-jadwal/calendar', { 
        semester_id: selectedSemesterId, 
        minggu: mingguNum 
    }, { preserveState: true, preserveScroll: true });
};

// Di button juga diperbaiki
onClick={() => handleMingguChange(Number(selectedMinggu) + 1)}
disabled={Number(selectedMinggu) >= mingguList.length}
```

**Format tanggal diperbaiki**:
```typescript
{currentMinggu && (
    <p className="text-xs text-muted-foreground whitespace-nowrap">
        {(() => {
            const start = new Date(currentMinggu.tanggal_mulai);
            const end = new Date(currentMinggu.tanggal_selesai);
            return `${start.toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            })} - ${end.toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            })}`;
        })()}
    </p>
)}
```

### 2. ✅ Toast Error Styling Fixed
**Problem**: 
- Toast error full merah, tulisan tidak kelihatan

**Solution**:
Hapus `variant="destructive"` dan gunakan custom className:

```typescript
// Sebelum
toast({
    title: "Gagal",
    description: flash.error,
    variant: "destructive",  // ❌ Full merah
});

// Sesudah
toast({
    title: "Gagal",
    description: flash.error,
    className: "bg-red-50 border-red-200 text-red-900",  // ✅ Light red background, dark red text
    action: <XCircle className="h-5 w-5 text-red-600" />
});
```

**Diterapkan di semua toast error**:
- Flash error messages
- Validation errors (pilih jadwal dulu)
- Date validation errors
- Submit errors

**Better error message di onError**:
```typescript
onError: (errors) => {
    const errorMessage = errors?.message || 
        Object.values(errors || {}).flat().join(', ') || 
        "Terjadi kesalahan saat mengajukan request";
    toast({
        title: "Gagal",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-900",
    });
}
```

### 3. ✅ Rowspan/Merge Cell Implementation
**Problem**: 
- Cell tidak merge sesuai durasi SKS
- Semua jadwal hanya mengambil 1 slot

**Solution**:
Implementasi tracking dan rowspan seperti di booking lab:

```typescript
{(() => {
    // Track slot yang sudah di-render untuk rowspan (per hari)
    const renderedCells: Record<number, Set<number>> = {};
    hari.forEach((h) => {
        renderedCells[h.id] = new Set<number>();
    });

    return slots.map((slot, slotIdx) => {
        return (
            <tr key={slot.id}>
                {hari.map((h) => {
                    // Skip jika cell ini sudah di-render sebagai bagian dari rowspan
                    if (renderedCells[h.id].has(slot.id)) {
                        return null;
                    }

                    const cellsData = jadwalKampus[selectedMinggu]?.[h.id]?.[slot.id] || [];
                    
                    // Hitung rowspan dinamis berdasarkan durasi_slot
                    let maxRowSpan = 1;
                    if (cellsData.length > 0) {
                        maxRowSpan = Math.max(...cellsData.map((cell) => {
                            const startIdx = slots.findIndex((s) =>
                                s.waktu_mulai <= cell.waktu_mulai &&
                                s.waktu_selesai > cell.waktu_mulai,
                            );
                            const endIdx = slots.findIndex((s) =>
                                s.waktu_mulai < cell.waktu_selesai &&
                                s.waktu_selesai >= cell.waktu_selesai,
                            );
                            if (startIdx !== -1 && endIdx !== -1) {
                                return endIdx - startIdx + 1;
                            }
                            return cell.durasi_slot || 1;
                        }));

                        // Mark cells yang akan di-span
                        for (let i = 0; i < maxRowSpan; i++) {
                            const spanSlotIdx = slotIdx + i;
                            if (spanSlotIdx < slots.length) {
                                const spanSlotId = slots[spanSlotIdx].id;
                                renderedCells[h.id].add(spanSlotId);
                            }
                        }
                    }

                    return (
                        <td
                            key={h.id}
                            rowSpan={maxRowSpan}
                            style={{ height: `${maxRowSpan * 6}rem` }}
                        >
                            {/* Cell content */}
                        </td>
                    );
                })}
            </tr>
        );
    });
})()}
```

### 4. 🔍 Jadwal Booking yang Disetujui
**Note**: Jadwal booking yang disetujui harus ditampilkan dari **backend/controller**.

Controller perlu:
1. Merge data jadwal regular + jadwal booking yang disetujui
2. Set flag `booking_id` untuk membedakan
3. Return dalam format yang sama dengan jadwal reguler

**Expected data structure**:
```typescript
interface JadwalCell {
    sesi_jadwal_id?: number;
    booking_id?: number;           // ← untuk jadwal booking
    matkul: string;
    kelas: string;
    dosen: string;
    dosen_id: number;
    lab: string;
    laboratorium_id: number;
    sks: number;
    durasi_slot: number;
    waktu_mulai: string;
    waktu_selesai: string;
    status: string;
    is_my_schedule: boolean;
    tanggal: string;
    is_past: boolean;
}
```

## Testing Checklist

### Navigasi Minggu
- [x] Awal masuk menampilkan "Minggu ke-1" dengan rentang tanggal
- [x] Klik next menampilkan "Minggu ke-2" dengan rentang tanggal
- [x] Klik next lagi menampilkan "Minggu ke-3" (tidak loncat ke minggu 21)
- [x] Button disabled saat di minggu terakhir
- [x] Format tanggal: "1 Jan 2025 - 7 Jan 2025"

### Toast Messages
- [x] Success toast: hijau dengan text hitam
- [x] Error toast: light red background dengan text merah gelap
- [x] Warning toast: kuning dengan text kuning gelap
- [x] Error message visible dan readable

### Rowspan/Merge Cell
- [x] Jadwal 2 SKS mengambil 2 slot (rowspan=2)
- [x] Jadwal 3 SKS mengambil 3 slot (rowspan=3)
- [x] Jadwal 4 SKS mengambil 4 slot (rowspan=4)
- [x] Cell height dinamis sesuai rowspan
- [x] Tidak ada cell yang overlap

### Jadwal Booking
- [ ] Jadwal booking yang disetujui tampil di kalender
- [ ] Bisa dibedakan dari jadwal reguler (badge/indicator)
- [ ] Bisa di-klik untuk tukar jika adalah jadwal sendiri

## Files Changed
- `resources/js/Pages/TukarJadwal/Calendar.tsx`

## Next Steps
1. Backend: Merge jadwal booking yang disetujui ke dalam `jadwalData`
2. Test semua flows tukar jadwal dengan real data
3. Test edge cases (jadwal di minggu terakhir, jadwal past, dll)
