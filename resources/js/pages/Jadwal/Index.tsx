import { Badge, type VariantProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    User,
    ArrowLeftRight,
    Search,
} from 'lucide-react';
import { useState, useMemo } from 'react';

// Definisikan tipe data yang diterima dari controller
interface Semester {
    id: number;
    nama: string;
}
interface Kampus {
    id: number;
    kode: string;
    nama: string;
}
interface Minggu {
    nomor: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
}
interface Hari {
    id: number;
    nama: string;
    tanggal?: string;
}
interface Slot {
    id: number;
    waktu_mulai: string;
    waktu_selesai: string;
    is_break?: boolean;
}
interface JadwalCell {
    sesi_jadwal_id: number;
    matkul: string;
    kelas: string;
    dosen: string;
    lab: string;
    sks: number;
    durasi_slot: number;
    waktu_mulai: string;
    waktu_selesai: string;
    status: string;
    is_my_schedule: boolean;
    tanggal: string;
    is_past: boolean;
    is_active?: boolean;
    is_swapped?: boolean;
    slot_waktu_mulai_id?: number;
    laboratorium_id?: number;
    kampus?: string;
}
type JadwalData = Record<
    number,
    Record<number, Record<number, Record<number, JadwalCell[]>>>
>;

interface Props {
    semesters: Semester[];
    selectedSemesterId: number | null;
    kampusList: Kampus[];
    mingguList: Minggu[];
    selectedMinggu: number;
    hari: Hari[];
    slots: Slot[];
    jadwalData: JadwalData;
    tableData: JadwalCell[];
    isEmbed?: boolean;
    breadcrumbs: Array<{ title: string; href: string }>;
}

const StatusBadge = ({ cell }: { cell: JadwalCell }) => {
    const commonClass = "px-1.5 py-0.5 text-xs font-medium";

    if (cell.is_active && !cell.is_past) {
        return <Badge variant="warning" className={commonClass}>Berlangsung</Badge>;
    }
    if (cell.is_past && !cell.is_active) {
        return <Badge variant="secondary" className={commonClass}>Sudah Lewat</Badge>;
    }

    // Logic for not past and not active
    if (!cell.is_past && !cell.is_active) {
        switch (cell.status) {
            case 'booking':
                return <Badge variant="booking" className={commonClass}>Booking</Badge>;
            case 'terjadwal':
                if (cell.is_my_schedule) {
                    return <Badge variant="success" className={commonClass}>Jadwal Saya</Badge>;
                }
                return <Badge variant="info" className={commonClass}>Terjadwal</Badge>;
            case 'tidak_masuk':
                return <Badge variant="outline" className={commonClass}>Tidak Masuk</Badge>;
            case 'dibatalkan':
                return <Badge variant="destructive" className={commonClass}>Dibatalkan</Badge>;
        }
    }
    
    if (cell.status === 'selesai') {
        return <Badge variant="outline" className={commonClass}>Selesai</Badge>;
    }

    return null; // Or some default badge
};


export default function Index({
    semesters,
    selectedSemesterId,
    kampusList,
    mingguList,
    selectedMinggu,
    hari,
    slots,
    jadwalData,
    tableData,
    isEmbed = false,
    breadcrumbs,
}: Props) {
    const [activeKampus, setActiveKampus] = useState(
        kampusList[0]?.kode || 'B',
    );
    const [activeTab, setActiveTab] = useState<'calendar' | 'table'>('calendar');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKampus, setFilterKampus] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Filter table data
    const filteredTableData = useMemo(() => {
        return tableData.filter((item) => {
            const matchSearch =
                searchQuery === '' ||
                item.matkul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.dosen.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.lab.toLowerCase().includes(searchQuery.toLowerCase());

            const matchKampus = filterKampus === 'all' || item.kampus === filterKampus;
            
            const matchStatus = filterStatus === 'all' || item.status === filterStatus;

            return matchSearch && matchKampus && matchStatus;
        });
    }, [tableData, searchQuery, filterKampus, filterStatus]);

    // Cek apakah hari adalah hari ini
    const isToday = (tanggal?: string) => {
        if (!tanggal) return false;
        const now = new Date();
        const offset = 7 * 60;
        const wibTime = new Date(now.getTime() + offset * 60 * 1000);
        const todayString = wibTime.toISOString().split('T')[0];
        return tanggal === todayString;
    };

    const handleSemesterChange = (semesterId: string) => {
        const params: any = { semester_id: semesterId, minggu: 1 };
        if (isEmbed) params.embed = 1;
        
        router.get('/jadwal', params, { preserveState: true });
    };

    const handleMingguChange = (minggu: number) => {
        const params: any = {
            semester_id: selectedSemesterId,
            minggu,
        };
        if (isEmbed) params.embed = 1;
        
        router.get('/jadwal', params, { preserveState: true });
    };

    const currentMinggu = mingguList.find((m) => m.nomor === selectedMinggu);

    // Jika embed mode, render tanpa AppLayout
    const content = (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Jadwal Final</h1>
                    <p className="text-muted-foreground">
                        Tampilan jadwal mingguan per kampus
                    </p>
                    </div>
                    <div className="w-72">
                        <Select
                            value={
                                selectedSemesterId
                                    ? String(selectedSemesterId)
                                    : ''
                            }
                            onValueChange={handleSemesterChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Navigasi Minggu */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMingguChange(selectedMinggu - 1)}
                        disabled={selectedMinggu <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <p className="font-semibold">
                            Minggu ke-{selectedMinggu}
                        </p>
                        {currentMinggu && (
                            <p className="text-xs text-muted-foreground">
                                {new Date(
                                    currentMinggu.tanggal_mulai,
                                ).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}{' '}
                                -{' '}
                                {new Date(
                                    currentMinggu.tanggal_selesai,
                                ).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMingguChange(selectedMinggu + 1)}
                        disabled={selectedMinggu >= mingguList.length}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'calendar' | 'table')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="calendar">Kalender</TabsTrigger>
                        <TabsTrigger value="table">Tabel</TabsTrigger>
                    </TabsList>

                    {/* Calendar Tab */}
                    <TabsContent value="calendar" className="space-y-4">
                        {/* Tab Kampus */}
                        <Tabs value={activeKampus} onValueChange={setActiveKampus}>
                    <TabsList
                        className="grid w-full"
                        style={{
                            gridTemplateColumns: `repeat(${kampusList.length}, 1fr)`,
                        }}
                    >
                        {kampusList.map((kampus) => (
                            <TabsTrigger key={kampus.id} value={kampus.kode}>
                                Kampus {kampus.kode}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {kampusList.map((kampus) => {
                        // Filter jadwal untuk kampus ini saja
                        const jadwalKampus = jadwalData[kampus.id] || {};

                        return (
                            <TabsContent
                                key={kampus.id}
                                value={kampus.kode}
                                className="space-y-4"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Jadwal Kampus {kampus.nama}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full table-fixed border-collapse text-sm">
                                                <thead>
                                                    <tr className="bg-muted/50">
                                                        <th className="sticky left-0 z-10 w-32 border bg-muted/50 p-2 font-semibold">
                                                            Jam
                                                        </th>
                                                        {hari.map((h) => {
                                                            const isTodayCell = isToday(h.tanggal);
                                                            return (
                                                                <th
                                                                    key={h.id}
                                                                    className={`border p-2 font-semibold ${
                                                                        isTodayCell 
                                                                            ? 'bg-primary/10 ring-2 ring-primary ring-inset' 
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className={isTodayCell ? 'text-primary font-bold' : ''}>
                                                                            {h.nama}
                                                                        </span>
                                                                        {h.tanggal && (
                                                                            <span className={`text-xs ${isTodayCell ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                                                                                {new Date(h.tanggal).toLocaleDateString('id-ID', {
                                                                                    day: '2-digit',
                                                                                    month: 'short'
                                                                                })}
                                                                                {isTodayCell && ' (Hari Ini)'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(() => {
                                                        // Track slot yang sudah di-render untuk rowspan (per hari)
                                                        const renderedCells: Record<
                                                            number,
                                                            Set<number>
                                                        > = {};
                                                        hari.forEach((h) => {
                                                            renderedCells[
                                                                h.id
                                                            ] =
                                                                new Set<number>();
                                                        });

                                                        return slots.map(
                                                            (slot, slotIdx) => {
                                                                // Deteksi jam istirahat (11:45-13:15)
                                                                const isBreakTime = slot.waktu_mulai === '11:45:00' && slot.waktu_selesai === '13:15:00';
                                                                
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            slot.id
                                                                        }
                                                                        className={isBreakTime ? 'h-16' : 'h-24'}
                                                                    >
                                                                        <td className={`sticky left-0 border p-2 text-center font-mono text-xs font-semibold ${
                                                                            isBreakTime ? 'bg-muted/50 h-16' : 'bg-background h-24'
                                                                        }`}>
                                                                            {slot.waktu_mulai.slice(
                                                                                0,
                                                                                5,
                                                                            )}{' '}
                                                                            -{' '}
                                                                            {slot.waktu_selesai.slice(
                                                                                0,
                                                                                5,
                                                                            )}
                                                                        </td>
                                                                        {hari.map(
                                                                        (h) => {
                                                                            // Skip jika cell ini sudah di-render sebagai bagian dari rowspan
                                                                            if (
                                                                                renderedCells[
                                                                                    h
                                                                                        .id
                                                                                ].has(
                                                                                    slot.id,
                                                                                )
                                                                            ) {
                                                                                return null;
                                                                            }

                                                                            const cellsData =
                                                                                jadwalKampus[
                                                                                    selectedMinggu
                                                                                ]?.[
                                                                                    h
                                                                                        .id
                                                                                ]?.[
                                                                                    slot
                                                                                        .id
                                                                                ] ||
                                                                                [];

                                                                                                                                                            // Hitung rowspan dinamis berdasarkan waktu mulai dan selesai aktual

                                                                                                                                                            // PENTING: Untuk minggu tertentu, seharusnya hanya ada 1 jadwal per slot

                                                                                                                                                            // Jika ada lebih dari 1, ambil jadwal pertama saja

                                                                                                                                                            let maxRowSpan = 1;

                                                                                                                                                            if (

                                                                                                                                                                cellsData.length >

                                                                                                                                                                0

                                                                                                                                                            ) {

                                                                                                                                                                // Gunakan jadwal pertama untuk menentukan rowspan

                                                                                                                                                                // Karena seharusnya tidak ada overlap di minggu yang sama

                                                                                                                                                                const firstCell = cellsData[0];

                                                                                                                                                                const startIdx =

                                                                                                                                                                    slots.findIndex(

                                                                                                                                                                        (s) =>

                                                                                                                                                                            s.waktu_mulai <=

                                                                                                                                                                                firstCell.waktu_mulai &&

                                                                                                                                                                            s.waktu_selesai >

                                                                                                                                                                                firstCell.waktu_mulai,

                                                                                                                                                                    );

                                                                                                                                                                const endIdx =

                                                                                                                                                                    slots.findIndex(

                                                                                                                                                                        (s) =>

                                                                                                                                                                            s.waktu_mulai <

                                                                                                                                                                                firstCell.waktu_selesai &&

                                                                                                                                                                            s.waktu_selesai >=

                                                                                                                                                                                firstCell.waktu_selesai,

                                                                                                                                                                    );

                                                                                                                                                                if (

                                                                                                                                                                    startIdx !==

                                                                                                                                                                        -1 &&

                                                                                                                                                                    endIdx !==

                                                                                                                                                                        -1

                                                                                                                                                                ) {

                                                                                                                                                                    maxRowSpan =

                                                                                                                                                                        endIdx -

                                                                                                                                                                        startIdx +

                                                                                                                                                                        1;

                                                                                                                                                                } else {

                                                                                                                                                                    maxRowSpan =

                                                                                                                                                                        firstCell.durasi_slot ||

                                                                                                                                                                        1;

                                                                                                                                                                }

                                                                            

                                                                                                                                                                // Mark cells yang akan di-span

                                                                                                                                                                for (

                                                                                                                                                                    let i = 0;

                                                                                                                                                                    i <

                                                                                                                                                                    maxRowSpan;

                                                                                                                                                                    i++

                                                                                                                                                                ) {

                                                                            
                                                                                    const spanSlotIdx =
                                                                                        slotIdx +
                                                                                        i;
                                                                                    if (
                                                                                        spanSlotIdx <
                                                                                        slots.length
                                                                                    ) {
                                                                                        const spanSlotId =
                                                                                            slots[
                                                                                                spanSlotIdx
                                                                                            ]
                                                                                                .id;
                                                                                        renderedCells[
                                                                                            h
                                                                                                .id
                                                                                        ].add(
                                                                                            spanSlotId,
                                                                                        );
                                                                                    }
                                                                                }
                                                                            }

                                                                            return (
                                                                                <td
                                                                                    key={
                                                                                        h.id
                                                                                    }
                                                                                    className="h-full border p-0 align-middle relative"
                                                                                    rowSpan={
                                                                                        maxRowSpan
                                                                                    }
                                                                                    style={{
                                                                                        height: `${maxRowSpan * 6}rem`,
                                                                                    }}
                                                                                >
                                                                                    {/* Overlay istirahat jika slot istirahat */}
                                                                                    {isBreakTime && (
                                                                                        <div className="absolute inset-0 z-10 bg-muted/90 flex items-center justify-center border-t-2 border-b-2 border-dashed border-muted-foreground/30 pointer-events-none">
                                                                                            <div className="flex items-center gap-2 opacity-60">
                                                                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                                                                <span className="text-xs font-semibold text-muted-foreground">
                                                                                                    ISTIRAHAT
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    {cellsData.length >
                                                                                    0 ? (
                                                                                        <div className="flex h-full flex-col divide-y">
                                                                                            {cellsData.map(
                                                                                                (
                                                                                                    cell,
                                                                                                    idx,
                                                                                                ) => {
                                                                                                    // Generate warna berbeda untuk setiap jadwal berdasarkan dosen
                                                                                                    const getColorScheme =
                                                                                                        (
                                                                                                            dosen: string, // <-- DIGANTI DARI MATKUL
                                                                                                            index: number,
                                                                                                        ) => {
                                                                                                            const colors =
                                                                                                                [
                                                                                                                    {
                                                                                                                        from: 'from-blue-50',
                                                                                                                        to: 'to-blue-100',
                                                                                                                        border: 'border-blue-500',
                                                                                                                        icon: 'text-blue-600',
                                                                                                                        text: 'text-blue-900',
                                                                                                                        hover: 'hover:from-blue-100 hover:to-blue-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-green-50',
                                                                                                                        to: 'to-green-100',
                                                                                                                        border: 'border-green-500',
                                                                                                                        icon: 'text-green-600',
                                                                                                                        text: 'text-green-900',
                                                                                                                        hover: 'hover:from-green-100 hover:to-green-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-purple-50',
                                                                                                                        to: 'to-purple-100',
                                                                                                                        border: 'border-purple-500',
                                                                                                                        icon: 'text-purple-600',
                                                                                                                        text: 'text-purple-900',
                                                                                                                        hover: 'hover:from-purple-100 hover:to-purple-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-orange-50',
                                                                                                                        to: 'to-orange-100',
                                                                                                                        border: 'border-orange-500',
                                                                                                                        icon: 'text-orange-600',
                                                                                                                        text: 'text-orange-900',
                                                                                                                        hover: 'hover:from-orange-100 hover:to-orange-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-pink-50',
                                                                                                                        to: 'to-pink-100',
                                                                                                                        border: 'border-pink-500',
                                                                                                                        icon: 'text-pink-600',
                                                                                                                        text: 'text-pink-900',
                                                                                                                        hover: 'hover:from-pink-100 hover:to-pink-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-teal-50',
                                                                                                                        to: 'to-teal-100',
                                                                                                                        border: 'border-teal-500',
                                                                                                                        icon: 'text-teal-600',
                                                                                                                        text: 'text-teal-900',
                                                                                                                        hover: 'hover:from-teal-100 hover:to-teal-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-indigo-50',
                                                                                                                        to: 'to-indigo-100',
                                                                                                                        border: 'border-indigo-500',
                                                                                                                        icon: 'text-indigo-600',
                                                                                                                        text: 'text-indigo-900',
                                                                                                                        hover: 'hover:from-indigo-100 hover:to-indigo-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-amber-50',
                                                                                                                        to: 'to-amber-100',
                                                                                                                        border: 'border-amber-500',
                                                                                                                        icon: 'text-amber-600',
                                                                                                                        text: 'text-amber-900',
                                                                                                                        hover: 'hover:from-amber-100 hover:to-amber-200',
                                                                                                                    },
                                                                                                                ];

                                                                                                            // Hash sederhana berdasarkan nama dosen
                                                                                                            const hash =
                                                                                                                dosen // <-- DIGANTI DARI MATKUL
                                                                                                                    .split(
                                                                                                                        '',
                                                                                                                    )
                                                                                                                    .reduce(
                                                                                                                        (
                                                                                                                            acc,
                                                                                                                            char,
                                                                                                                        ) =>
                                                                                                                            acc +
                                                                                                                            char.charCodeAt(
                                                                                                                                0,
                                                                                                                            ),
                                                                                                                        0,
                                                                                                                    );
                                                                                                            const colorIndex =
                                                                                                                (hash +
                                                                                                                    index) %
                                                                                                                colors.length;
                                                                                                            return colors[
                                                                                                                colorIndex
                                                                                                            ];
                                                                                                        };

                                                                                                    const colorScheme =
                                                                                                        getColorScheme(
                                                                                                            cell.dosen, // <-- DIGANTI DARI MATKUL
                                                                                                            idx,
                                                                                                        );

                                                                                                    return (
                                                                                                        <div
                                                                                                            key={
                                                                                                                idx
                                                                                                            }
                                                                                                            className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} border-l-4 ${colorScheme.border} flex h-full flex-col justify-center p-2 ${colorScheme.hover} mx-0.5 my-0.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
                                                                                                        >
                                                                                                            {/* Header dengan nama mata kuliah */}
                                                                                                            <div className="mb-2 flex items-start gap-1.5">
                                                                                                                <BookOpen
                                                                                                                    className={`h-4 w-4 ${colorScheme.icon} mt-0.5 flex-shrink-0`}
                                                                                                                />
                                                                                                                <div className="min-w-0 flex-1">
                                                                                                                    <p
                                                                                                                        className={`font-bold ${colorScheme.text} truncate text-xs leading-tight`}
                                                                                                                    >
                                                                                                                        {
                                                                                                                            cell.matkul
                                                                                                                        }
                                                                                                                    </p>
                                                                                                                    <div className="mt-0.5 flex items-center gap-1">
                                                                                                                        <Badge
                                                                                                                            variant="muted"
                                                                                                                            // --- PERUBAHAN DI SINI ---
                                                                                                                            // max-w-[130px] dihapus agar bisa fleksibel
                                                                                                                            className="truncate px-1.5 py-0.5 text-xs font-medium"
                                                                                                                        >
                                                                                                                            {
                                                                                                                                cell.kelas
                                                                                                                            }
                                                                                                                        </Badge>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Info detail */}
                                                                                                            <div className="space-y-0.5 text-xs">
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 truncate font-medium">
                                                                                                                        {
                                                                                                                            cell.dosen
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 truncate font-medium">
                                                                                                                        {
                                                                                                                            cell.lab
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 font-medium">
                                                                                                                        {cell.waktu_mulai.slice(
                                                                                                                            0,
                                                                                                                            5,
                                                                                                                        )}{' '}
                                                                                                                        -{' '}
                                                                                                                        {cell.waktu_selesai.slice(
                                                                                                                            0,
                                                                                                                            5,
                                                                                                                        )}
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Footer badges */}
                                                                                                            <div
                                                                                                                className={`mt-1.5 flex items-center justify-between border-t pt-1.5 ${colorScheme.border.replace('border-', 'border-opacity-20 border-')}`}
                                                                                                            >
                                                                                                                <div className="flex items-center gap-1">
                                                                                                                    <Badge
                                                                                                                        variant="outline"
                                                                                                                        className="px-1.5 py-0.5 text-xs font-medium"
                                                                                                                    >
                                                                                                                        {
                                                                                                                            cell.sks
                                                                                                                        }{' '}
                                                                                                                        SKS
                                                                                                                    </Badge>
                                                                                                                    {/* Icon Tukar */}
                                                                                                                    {cell.is_swapped && (
                                                                                                                        <div title="Jadwal Ditukar">
                                                                                                                            <ArrowLeftRight className="h-3 w-3 text-purple-600" />
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                                
                                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                                    <StatusBadge cell={cell} />
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Button Tidak Masuk (hanya untuk dosen pemilik jadwal) */}
                                                                                                            {cell.is_my_schedule && !cell.is_past && cell.status === 'terjadwal' && (
                                                                                                                <div className="mt-2">
                                                                                                                    <Button
                                                                                                                        variant="outline"
                                                                                                                        size="sm"
                                                                                                                        className="w-full text-xs h-7"
                                                                                                                        onClick={() => {
                                                                                                                            if (confirm('Tandai jadwal ini sebagai "Tidak Masuk"?')) {
                                                                                                                                router.post(`/sesi-jadwal/${cell.sesi_jadwal_id}/update-status`, {
                                                                                                                                    status: 'tidak_masuk',
                                                                                                                                    catatan: null,
                                                                                                                                });
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Tidak Masuk
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            )}

                                                                                                            {/* Button Reset Status */}
                                                                                                            {cell.is_my_schedule && !cell.is_past && cell.status === 'tidak_masuk' && (
                                                                                                                <div className="mt-2">
                                                                                                                    <Button
                                                                                                                        variant="default"
                                                                                                                        size="sm"
                                                                                                                        className="w-full text-xs h-7"
                                                                                                                        onClick={() => {
                                                                                                                            if (confirm('Kembalikan status ke "Terjadwal"?')) {
                                                                                                                                router.post(`/sesi-jadwal/${cell.sesi_jadwal_id}/reset-status`);
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Reset Status
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    );
                                                                                                },
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="h-24"></div>
                                                                                    )}
                                                                                </td>
                                                                            );
                                                                        },
                                                                    )}
                                                                </tr>
                                                            );
                                                        }
                                                        );
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        );
                    })}
                        </Tabs>
                    </TabsContent>

                    {/* Table Tab */}
                    <TabsContent value="table" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Jadwal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Filters */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari mata kuliah, dosen, kelas, lab..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select value={filterKampus} onValueChange={setFilterKampus}>
                                        <SelectTrigger className="w-full sm:w-48">
                                            <SelectValue placeholder="Semua Kampus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kampus</SelectItem>
                                            {kampusList.map((k) => (
                                                <SelectItem key={k.id} value={k.nama}>
                                                    Kampus {k.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-full sm:w-48">
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            <SelectItem value="terjadwal">Terjadwal</SelectItem>
                                                                                          <SelectItem value="booking">Booking</SelectItem>                                            <SelectItem value="tidak_masuk">Tidak Masuk</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Table */}
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Waktu</TableHead>
                                                <TableHead>Mata Kuliah</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Dosen</TableHead>
                                                <TableHead>Lab</TableHead>
                                                <TableHead>Kampus</TableHead>
                                                <TableHead>SKS</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTableData.length > 0 ? (
                                                filteredTableData.map((item, idx) => (
                                                    <TableRow 
                                                        key={idx}
                                                        className={item.is_my_schedule ? 'bg-green-50/50 dark:bg-green-950/20' : ''}
                                                    >
                                                        <TableCell>
                                                            {new Date(item.tanggal).toLocaleDateString(
                                                                'id-ID',
                                                                {
                                                                    weekday: 'short',
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                }
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-xs">
                                                            {item.waktu_mulai.slice(0, 5)} -{' '}
                                                            {item.waktu_selesai.slice(0, 5)}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {item.matkul}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="muted">{item.kelas}</Badge>
                                                        </TableCell>
                                                        <TableCell>{item.dosen}</TableCell>
                                                        <TableCell>{item.lab}</TableCell>
                                                        <TableCell>{item.kampus}</TableCell>
                                                        <TableCell>{item.sks} SKS</TableCell>
                                                        <TableCell>
                                                            <StatusBadge cell={item} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={9}
                                                        className="h-24 text-center text-muted-foreground"
                                                    >
                                                        Tidak ada jadwal ditemukan
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {mingguList.length === 0 && (
                    <div className="flex h-64 items-center justify-center rounded-md border">
                        <p className="text-muted-foreground">
                            Belum ada jadwal. Silakan generate jadwal di menu
                            Jadwal Master.
                        </p>
                    </div>
                )}
            </div>
    );

    // Render dengan atau tanpa layout
    if (isEmbed) {
        return (
            <>
                <Head title="Jadwal Final" />
                {content}
            </>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Final" />
            {content}
        </AppLayout>
    );
}