# Mobile Responsive Calendar - Implementation Guide

## 📋 Referensi: Public/Jadwal.tsx (SUDAH BENAR)

File `resources/js/pages/Public/Jadwal.tsx` sudah menggunakan implementasi yang benar dengan:
- Memisahkan view Mobile dan Desktop
- Fixed time column di mobile
- Horizontal scroll yang smooth

## 🎯 File yang Perlu Diupdate

1. ✅ **Public/Jadwal.tsx** - Sudah benar (referensi)
2. ⏳ **Jadwal/Index.tsx** - Perlu diupdate
3. ⏳ **BookingLaboratorium/Calendar.tsx** - Perlu diupdate  
4. ⏳ **TukarJadwal/Calendar.tsx** - Perlu diupdate

## 🔧 Pattern yang Benar

### Struktur HTML:
```tsx
<CardContent>
    {/* Mobile View - dengan fixed time column */}
    <div className="block md:hidden">
        <div className="relative">
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    <table className="border-collapse text-sm">
                        {/* Table content untuk mobile */}
                    </table>
                </div>
            </div>
        </div>
    </div>

    {/* Desktop View - normal table */}
    <div className="hidden md:block">
        <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-sm">
                {/* Table content untuk desktop */}
            </table>
        </div>
    </div>
</CardContent>
```

### Key Classes untuk Mobile View:

#### 1. **Container Wrapper**
```tsx
<div className="block md:hidden">          // Show only on mobile
    <div className="relative">              // Relative positioning
        <div className="overflow-x-auto">   // Enable horizontal scroll
            <div className="min-w-max">     // Prevent table from shrinking
```

#### 2. **Time Column (Fixed/Sticky)**
```tsx
// Header
<th className="sticky left-0 z-20 w-24 border-r-2 border-r-gray-300 bg-muted p-1 font-semibold shadow-md">

// Body Cell
<td className="sticky left-0 z-10 border-r-2 border-r-gray-300 p-1 text-center font-mono text-xs font-semibold shadow-md whitespace-nowrap bg-background">
```

**Penjelasan:**
- `sticky left-0` - Fixed di kiri
- `z-20` (header) / `z-10` (body) - Layering
- `border-r-2 border-r-gray-300` - Border kanan tebal untuk pemisah
- `shadow-md` - Shadow agar terlihat melayang
- `whitespace-nowrap` - Teks tidak wrap
- `w-24` - Width 96px (lebih kecil dari desktop)

#### 3. **Day Columns (Scrollable)**
```tsx
<th className="border p-2 font-semibold min-w-[140px]">
```

**Penjelasan:**
- `min-w-[140px]` - Minimum width untuk setiap kolom hari
- Tidak ada `sticky` - Ikut scroll horizontal

### Key Classes untuk Desktop View:

```tsx
<div className="hidden md:block">          // Show only on desktop
    <div className="overflow-x-auto">      // Optional scroll jika perlu
        <table className="w-full table-fixed border-collapse text-sm">
```

Time column untuk desktop:
```tsx
<th className="sticky left-0 z-10 w-32 border bg-muted/50 p-2 font-semibold">
```

## 📝 Langkah-langkah Update

### Untuk Setiap File (Jadwal/Index.tsx, BookingLaboratorium/Calendar.tsx, TukarJadwal/Calendar.tsx):

#### Step 1: Backup File
```bash
# Backup sudah dilakukan ke:
- Jadwal/Index.backup.tsx
- BookingLaboratorium/Calendar.backup2.tsx
- TukarJadwal/Calendar.backup.tsx
```

#### Step 2: Locate CardContent Block
Cari bagian:
```tsx
<CardContent>
    <div className="overflow-x-auto">
        <table className="w-full table-fixed ...">
```

#### Step 3: Replace dengan Pattern Baru
Ganti dengan struktur Mobile + Desktop terpisah seperti di Public/Jadwal.tsx

#### Step 4: Copy Logic dari Existing
- Salin semua logic rendering cells yang sudah ada
- Paste di kedua view (mobile dan desktop)
- Pastikan tidak ada logic yang hilang

#### Step 5: Test
- Test di mobile (responsive mode browser)
- Test di desktop
- Pastikan scroll horizontal bekerja
- Pastikan kolom jam fixed di mobile

## ⚠️ PENTING - Jangan Ubah Logic!

### Yang BOLEH Diubah:
✅ Struktur HTML/JSX wrapper
✅ CSS classes
✅ Layout container

### Yang TIDAK BOLEH Diubah:
❌ Logic rendering cells
❌ Logic rowspan calculation
❌ Event handlers
❌ State management
❌ Data processing
❌ Conditional rendering logic

## 🧪 Testing Checklist

### Mobile (< 768px):
- [ ] Kolom jam tetap fixed saat scroll horizontal
- [ ] Kolom hari bisa di-scroll ke kanan/kiri
- [ ] Shadow/border pemisah kolom jam terlihat jelas
- [ ] Konten jadwal tidak terpotong
- [ ] Touch scroll responsive dan smooth
- [ ] Minimum width kolom hari cukup (140px)

### Desktop (≥ 768px):
- [ ] Tabel full width normal
- [ ] Tidak ada scroll horizontal (kecuali banyak hari)
- [ ] Kolom terdistribusi merata
- [ ] Tampilan sama seperti sebelumnya

## 🎨 Visual Comparison

### ❌ SALAH (Single table dengan responsive classes):
```tsx
<div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
    <table className="min-w-full md:w-full md:table-fixed">
        {/* Single table untuk mobile DAN desktop */}
    </table>
</div>
```
**Masalah:** Fixed column tidak bekerja optimal, ada gap/spacing issues

### ✅ BENAR (Separate mobile & desktop tables):
```tsx
{/* Mobile */}
<div className="block md:hidden">
    <div className="relative">
        <div className="overflow-x-auto">
            <div className="min-w-max">
                <table className="border-collapse text-sm">
                    {/* Optimized untuk mobile */}
                </table>
            </div>
        </div>
    </div>
</div>

{/* Desktop */}
<div className="hidden md:block">
    <table className="w-full table-fixed border-collapse text-sm">
        {/* Optimized untuk desktop */}
    </table>
</div>
```
**Keuntungan:** Full control per device, fixed column perfect, no conflicts

## 📦 Quick Reference - Class Mapping

| Element | Mobile Classes | Desktop Classes |
|---------|---------------|-----------------|
| Container | `block md:hidden` `relative` `overflow-x-auto` | `hidden md:block` `overflow-x-auto` |
| Table | `border-collapse text-sm` | `w-full table-fixed border-collapse text-sm` |
| Time Header | `sticky left-0 z-20 w-24 border-r-2 border-r-gray-300 bg-muted p-1 font-semibold shadow-md` | `sticky left-0 z-10 w-32 border bg-muted/50 p-2 font-semibold` |
| Time Cell | `sticky left-0 z-10 border-r-2 border-r-gray-300 p-1 text-center font-mono text-xs font-semibold shadow-md whitespace-nowrap bg-background/bg-muted` | `sticky left-0 border p-2 text-center font-mono text-xs font-semibold bg-background/bg-muted` |
| Day Column | `border p-2 font-semibold min-w-[140px]` | `border p-2 font-semibold` |

## 🚀 Implementation Status

- ✅ Public/Jadwal.tsx - **DONE** (Reference)
- ⏳ Jadwal/Index.tsx - **PENDING**
- ⏳ BookingLaboratorium/Calendar.tsx - **PENDING**
- ⏳ TukarJadwal/Calendar.tsx - **PENDING**

---

**Note:** Karena kompleksitas file dan banyaknya nested logic, implementasi harus dilakukan dengan sangat hati-hati untuk memastikan tidak ada logic yang hilang atau berubah.
