import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    User,
    Plus,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
    sesi_jadwal_id?: number;
    booking_id?: number;
    matkul: string;
    kelas: string;
    dosen: string;
    lab: string;
    sks: number;
    durasi_slot: number;
    waktu_mulai: string;
    waktu_selesai: string;
    status: string;
    is_my_schedule?: boolean;
    tanggal: string;
    is_past?: boolean;
    is_active?: boolean;
}
type JadwalData = Record<
    number,
    Record<number, Record<number, Record<number, JadwalCell[]>>>
>;

interface MatKul {
    id: number;
    nama: string;
    kelas: string;
    sks: number;
}

interface Booking {
    id: number;
    mata_kuliah?: { nama: string; sks: number } | null;
    kelas?: string | null;
    laboratorium: { id: number; nama: string; kampus: string };
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    durasi_slot: number;
    keperluan: string;
    keterangan: string | null;
    status: string;
}

interface Props {
    semesters: Semester[];
    selectedSemesterId: number | null;
    kampusList: Kampus[];
    mingguList: Minggu[];
    selectedMinggu: number;
    hari: Hari[];
    slots: Slot[];
    jadwalData: JadwalData;
    myBookings: Booking[];
    myMatKuls: MatKul[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Calendar({
    semesters,
    selectedSemesterId,
    kampusList,
    mingguList,
    selectedMinggu,
    hari,
    slots,
    jadwalData,
    myBookings,
    myMatKuls,
    breadcrumbs,
}: Props) {
    const { flash } = usePage<any>().props;
    const [activeKampus, setActiveKampus] = useState(
        kampusList[0]?.kode || 'B',
    );
    const [showBookingDialog, setShowBookingDialog] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{
        kampus_id: number;
        tanggal: string;
        slot_mulai_id: number;
        waktu_mulai: string;
    } | null>(null);
    const [bookingForm, setBookingForm] = useState({
        kelas_mata_kuliah_id: '',
        keperluan: '',
        keterangan: '',
    });

    // Toast notification untuk flash messages
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Berhasil",
                description: flash.success,
                variant: "default",
                className: "bg-green-50 border-green-200 text-green-900",
                action: (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                ),
            });
        }
        if (flash?.error) {
            toast({
                title: "Gagal",
                description: flash.error,
                variant: "destructive",
                className: "bg-red-50 border-red-200 text-red-900",
                action: (
                    <XCircle className="h-5 w-5 text-red-600" />
                ),
            });
        }
    }, [flash]);

    // Cek apakah hari adalah hari ini (GMT+7 Jakarta)
    const isToday = (tanggal?: string) => {
        if (!tanggal) return false;
        const now = new Date();
        const offset = 7 * 60;
        const wibTime = new Date(now.getTime() + offset * 60 * 1000);
        const todayString = wibTime.toISOString().split('T')[0];
        return tanggal === todayString;
    };

    const handleSemesterChange = (semesterId: string) => {
        router.get(
            '/booking-lab/calendar',
            { semester_id: semesterId, minggu: 1 },
            { preserveState: true },
        );
    };

    const handleMingguChange = (minggu: number | string) => {
        const mingguNum = Number(minggu);
        if (isNaN(mingguNum) || mingguNum < 1) return;

        router.get(
            '/booking-lab/calendar',
            {
                semester_id: selectedSemesterId,
                minggu: mingguNum,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleCellClick = (
        kampusId: number,
        tanggal: string,
        slotId: number,
        waktuMulai: string,
    ) => {
        const now = new Date();
        const offset = 7 * 60;
        const wibTime = new Date(now.getTime() + offset * 60 * 1000);
        wibTime.setHours(0, 0, 0, 0);
        
        const selectedDate = new Date(tanggal + 'T00:00:00');
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < wibTime) {
            alert('Tidak dapat booking untuk tanggal yang sudah lewat');
            return;
        }

        setSelectedSlot({
            kampus_id: kampusId,
            tanggal,
            slot_mulai_id: slotId,
            waktu_mulai: waktuMulai,
        });
        setBookingForm({ kelas_mata_kuliah_id: '', keperluan: '', keterangan: '' });
        setShowBookingDialog(true);
    };

    const handleSubmitBooking = () => {
        if (!selectedSlot || !bookingForm.kelas_mata_kuliah_id || !bookingForm.keperluan.trim()) return;

        router.post('/booking-lab', {
            kelas_mata_kuliah_id: bookingForm.kelas_mata_kuliah_id,
            laboratorium_id: 1,
            tanggal: selectedSlot.tanggal,
            slot_waktu_mulai_id: selectedSlot.slot_mulai_id,
            keperluan: bookingForm.keperluan,
            keterangan: bookingForm.keterangan,
        }, {
            onSuccess: () => {
                setShowBookingDialog(false);
                setSelectedSlot(null);
                setBookingForm({ kelas_mata_kuliah_id: '', keperluan: '', keterangan: '' });
                
                // Scroll ke list booking
                setTimeout(() => {
                    const bookingList = document.getElementById('booking-list');
                    if (bookingList) {
                        bookingList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 500);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            menunggu: { variant: 'default', label: 'Menunggu' },
            disetujui: { variant: 'outline', label: 'Disetujui' },
            ditolak: { variant: 'destructive', label: 'Ditolak' },
        };
        const config = variants[status] || variants.menunggu;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const currentMinggu = mingguList.find((m) => m.nomor === Number(selectedMinggu));
    const pendingBookingsCount = myBookings.filter(b => b.status === 'menunggu').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Lab - Kalender" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Booking Laboratorium</h1>
                        <p className="text-muted-foreground">
                            Klik slot kosong untuk booking laboratorium
                            {pendingBookingsCount > 0 && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="ml-2 p-0 h-auto"
                                    onClick={() => {
                                        const bookingList = document.getElementById('booking-list');
                                        if (bookingList) {
                                            bookingList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                >
                                    <Badge variant="default">
                                        ({pendingBookingsCount}) Request Pending
                                    </Badge>
                                </Button>
                            )}
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
                        onClick={() => handleMingguChange(Number(selectedMinggu) - 1)}
                        disabled={Number(selectedMinggu) <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center min-w-[200px]">
                        <p className="font-semibold">
                            Minggu ke-{selectedMinggu}
                        </p>
                        {currentMinggu && (
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {(() => {
                                    const start = new Date(currentMinggu.tanggal_mulai);
                                    const end = new Date(currentMinggu.tanggal_selesai);
                                    return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
                                })()}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMingguChange(Number(selectedMinggu) + 1)}
                        disabled={Number(selectedMinggu) >= mingguList.length}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

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
                                                                        {isBreakTime ? (
                                                                            <td 
                                                                                colSpan={hari.length} 
                                                                                className="border bg-muted/50 p-4 text-center h-16"
                                                                            >
                                                                                <div className="flex items-center justify-center gap-2">
                                                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                                                    <span className="font-semibold text-muted-foreground">
                                                                                        ISTIRAHAT
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        ) : (
                                                                            hari.map(
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
                                                                            let maxRowSpan = 1;
                                                                            if (
                                                                                cellsData.length >
                                                                                0
                                                                            ) {
                                                                                maxRowSpan =
                                                                                    Math.max(
                                                                                        ...cellsData.map(
                                                                                            (
                                                                                                cell,
                                                                                            ) => {
                                                                                                const startIdx =
                                                                                                    slots.findIndex(
                                                                                                        (
                                                                                                            s,
                                                                                                        ) =>
                                                                                                            s.waktu_mulai <=
                                                                                                                cell.waktu_mulai &&
                                                                                                            s.waktu_selesai >
                                                                                                                cell.waktu_mulai,
                                                                                                    );
                                                                                                const endIdx =
                                                                                                    slots.findIndex(
                                                                                                        (
                                                                                                            s,
                                                                                                        ) =>
                                                                                                            s.waktu_mulai <
                                                                                                                cell.waktu_selesai &&
                                                                                                            s.waktu_selesai >=
                                                                                                                cell.waktu_selesai,
                                                                                                    );
                                                                                                if (
                                                                                                    startIdx !==
                                                                                                        -1 &&
                                                                                                    endIdx !==
                                                                                                        -1
                                                                                                ) {
                                                                                                    return (
                                                                                                        endIdx -
                                                                                                        startIdx +
                                                                                                        1
                                                                                                    );
                                                                                                }
                                                                                                return (
                                                                                                    cell.durasi_slot ||
                                                                                                    1
                                                                                                );
                                                                                            },
                                                                                        ),
                                                                                    );

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
                                                                                    className="h-full border p-0 align-middle"
                                                                                    rowSpan={
                                                                                        maxRowSpan
                                                                                    }
                                                                                    style={{
                                                                                        height: `${maxRowSpan * 6}rem`,
                                                                                    }}
                                                                                >
                                                                                    {cellsData.length >
                                                                                    0 ? (
                                                                                        <div className="flex h-full flex-col divide-y">
                                                                                            {cellsData.map(
                                                                                                (
                                                                                                    cell,
                                                                                                    idx,
                                                                                                ) => {
                                                                                                    // Mapping status ke variant badge
                                                                                                    const getStatusVariant =
                                                                                                        (
                                                                                                            status: string,
                                                                                                        ) => {
                                                                                                            switch (
                                                                                                                status
                                                                                                            ) {
                                                                                                                case 'terjadwal':
                                                                                                                    return 'default';
                                                                                                                case 'selesai':
                                                                                                                    return 'secondary';
                                                                                                                case 'tidak_masuk':
                                                                                                                    return 'outline';
                                                                                                                case 'dibatalkan':
                                                                                                                    return 'destructive';
                                                                                                                default:
                                                                                                                    return 'outline';
                                                                                                            }
                                                                                                        };

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
                                                                                                            className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} border-l-4 ${colorScheme.border} flex h-full flex-col justify-center p-2 ${colorScheme.hover} mx-0.5 my-0.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md relative ${cell.status === 'tidak_masuk' && !cell.is_my_schedule ? 'cursor-pointer ring-2 ring-orange-400 ring-opacity-50' : ''}`}
                                                                                                            onClick={() => {
                                                                                                                // Jika tidak_masuk dan bukan jadwal saya, bisa diklik untuk booking
                                                                                                                if (cell.status === 'tidak_masuk' && !cell.is_my_schedule && h.tanggal) {
                                                                                                                    handleCellClick(
                                                                                                                        kampus.id,
                                                                                                                        h.tanggal,
                                                                                                                        slot.id,
                                                                                                                        slot.waktu_mulai,
                                                                                                                    );
                                                                                                                }
                                                                                                            }}
                                                                                                        >
                                                                                                            {/* Indicator booking available untuk slot tidak_masuk */}
                                                                                                            {cell.status === 'tidak_masuk' && !cell.is_my_schedule && (
                                                                                                                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-bl-lg rounded-tr-lg font-semibold shadow-md z-10">
                                                                                                                    📅 Bisa Dibook
                                                                                                                </div>
                                                                                                            )}
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
                                                                                                                            variant="secondary"
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
                                                                                                                <div className="flex gap-0.5">
                                                                                                                    <Badge
                                                                                                                        variant="outline"
                                                                                                                        className="px-1.5 py-0.5 text-xs font-medium"
                                                                                                                    >
                                                                                                                        {
                                                                                                                            cell.sks
                                                                                                                        }{' '}
                                                                                                                        SKS
                                                                                                                    </Badge>
                                                                                                                </div>
                                                                                                                
                                                                                                                {/* Status Badges - Same as TukarJadwal & Jadwal Utama */}
                                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                                    {/* Badge Berlangsung - Highest Priority */}
                                                                                                                    {cell.is_active && !cell.is_past && (
                                                                                                                        <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-yellow-500 text-white">
                                                                                                                            Berlangsung
                                                                                                                        </Badge>
                                                                                                                    )}
                                                                                                                    
                                                                                                                    {/* Badge Sudah Lewat */}
                                                                                                                    {cell.is_past && (
                                                                                                                        <Badge variant="secondary" className="px-1.5 py-0.5 text-xs font-medium">
                                                                                                                            Sudah Lewat
                                                                                                                        </Badge>
                                                                                                                    )}
                                                                                                                    
                                                                                                                    {/* Badge Booking */}
                                                                                                                    {cell.status === 'booking' && !cell.is_past && !cell.is_active && (
                                                                                                                        <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-orange-500">
                                                                                                                            Booking
                                                                                                                        </Badge>
                                                                                                                    )}
                                                                                                                    
                                                                                                                    {/* Badge Jadwal Saya */}
                                                                                                                    {cell.is_my_schedule && !cell.is_past && !cell.is_active && cell.status !== 'booking' && cell.status === 'terjadwal' && (
                                                                                                                        <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-green-600">
                                                                                                                            Jadwal Saya
                                                                                                                        </Badge>
                                                                                                                    )}
                                                                                                                    
                                                                                                                    {/* Badge Terjadwal */}
                                                                                                                    {cell.status === 'terjadwal' && !cell.is_past && !cell.is_active && !cell.is_my_schedule && (
                                                                                                                        <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-blue-500">
                                                                                                                            Terjadwal
                                                                                                                        </Badge>
                                                                                                                    )}
                                                                                                                    
                                                                                                                    {/* Badge Other Status */}
                                                                                                                    {cell.status === 'selesai' && (
                                                                                                                        <Badge variant="secondary" className="px-1.5 py-0.5 text-xs font-medium">
                                                                                                                            Selesai
                                                                                                                        </Badge>
                                                                                                                    )}
                                                                                                                    {cell.status === 'tidak_masuk' && (
                                                                                                                        <Badge variant="outline" className="px-1.5 py-0.5 text-xs font-medium">
                                                                                                                            Tidak Masuk
                                                                                                                        </Badge>
                                                                                                                    )}
                                                                                                                    {cell.status === 'dibatalkan' && (
                                                                                                                        <Badge variant="destructive" className="px-1.5 py-0.5 text-xs font-medium">
                                                                                                                            Dibatalkan
                                                                                                                        </Badge>
                                                                                                                    )}
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
                                                                                        (() => {
                                                                                            const today = new Date();
                                                                                            const jakartaOffset = 7 * 60;
                                                                                            const localOffset = today.getTimezoneOffset();
                                                                                            const jakartaTime = new Date(today.getTime() + (jakartaOffset + localOffset) * 60 * 1000);
                                                                                            jakartaTime.setHours(0, 0, 0, 0);
                                                                                            
                                                                                            const cellDate = h.tanggal ? new Date(h.tanggal + 'T00:00:00') : null;
                                                                                            if (cellDate) cellDate.setHours(0, 0, 0, 0);
                                                                                            
                                                                                            const isPast = cellDate && cellDate < jakartaTime;
                                                                                            const isCurrentDay = cellDate && cellDate.getTime() === jakartaTime.getTime();

                                                                                            return (
                                                                                                <div 
                                                                                                    className={`h-24 flex items-center justify-center transition-colors ${
                                                                                                        isPast 
                                                                                                            ? 'bg-muted/30 cursor-not-allowed' 
                                                                                                            : 'cursor-pointer hover:bg-green-50/50 hover:border-green-400 border-2 border-dashed border-transparent group'
                                                                                                    }`}
                                                                                                    onClick={() => {
                                                                                                        if (!isPast && h.tanggal) {
                                                                                                            handleCellClick(
                                                                                                                kampus.id,
                                                                                                                h.tanggal,
                                                                                                                slot.id,
                                                                                                                slot.waktu_mulai,
                                                                                                            );
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    {isPast ? (
                                                                                                        <div className="text-center text-muted-foreground">
                                                                                                            <Clock className="h-5 w-5 mx-auto mb-1 opacity-50" />
                                                                                                            <div className="text-xs font-medium">Sudah Lewat</div>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <div className="text-center">
                                                                                                            <Plus className={`h-6 w-6 mx-auto mb-1 ${isCurrentDay ? 'text-primary' : 'text-green-600 group-hover:text-green-700'}`} />
                                                                                                            <div className={`text-sm font-medium ${isCurrentDay ? 'text-primary' : 'text-green-700 group-hover:text-green-800'}`}>
                                                                                                                {isCurrentDay ? 'Booking Hari Ini' : 'Booking'}
                                                                                                            </div>
                                                                                                            <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-green-600">
                                                                                                                Klik untuk ajukan
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            );
                                                                                        })()
                                                                                    )}
                                                                                </td>
                                                                            );
                                                                        },
                                                                    )
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

                                {/* Request Booking List */}
                                {myBookings.length > 0 && (
                                    <Card id="booking-list">
                                        <CardHeader>
                                            <CardTitle>Request Booking Saya</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {myBookings.map((booking) => (
                                                    <div key={booking.id} className="rounded-lg border p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-2 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    {getStatusBadge(booking.status)}
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {new Date(booking.tanggal).toLocaleDateString('id-ID')}
                                                                    </span>
                                                                </div>
                                                                <div className="grid gap-2 md:grid-cols-2">
                                                                    {booking.mata_kuliah && (
                                                                        <div className="text-sm">
                                                                            <span className="font-medium">Mata Kuliah: </span>
                                                                            {booking.mata_kuliah.nama} ({booking.mata_kuliah.sks} SKS)
                                                                        </div>
                                                                    )}
                                                                    {booking.kelas && (
                                                                        <div className="text-sm">
                                                                            <span className="font-medium">Kelas: </span>
                                                                            {booking.kelas}
                                                                        </div>
                                                                    )}
                                                                    <div className="text-sm">
                                                                        <span className="font-medium">Lab: </span>
                                                                        {booking.laboratorium.nama}
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        <span className="font-medium">Waktu: </span>
                                                                        {booking.waktu_mulai} - {booking.waktu_selesai}
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        <span className="font-medium">Keperluan: </span>
                                                                        {booking.keperluan}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {booking.status === 'menunggu' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        if (confirm('Batalkan booking ini?')) {
                                                                            router.post(`/booking-lab/${booking.id}/cancel`);
                                                                        }
                                                                    }}
                                                                >
                                                                    Batalkan
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>

                {mingguList.length === 0 && (
                    <div className="flex h-64 items-center justify-center rounded-md border">
                        <p className="text-muted-foreground">
                            Belum ada jadwal. Silakan pilih semester.
                        </p>
                    </div>
                )}
            </div>

            {/* Dialog Booking */}
            <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Booking Laboratorium</DialogTitle>
                        <DialogDescription>
                            Isi form berikut untuk mengajukan booking laboratorium
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSlot && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                                <div className="text-sm">
                                    <span className="font-medium">Tanggal: </span>
                                    {new Date(selectedSlot.tanggal).toLocaleDateString('id-ID')}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Waktu Mulai: </span>
                                    {selectedSlot.waktu_mulai.slice(0, 5)}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mata_kuliah">
                                    Mata Kuliah <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={bookingForm.kelas_mata_kuliah_id}
                                    onValueChange={(value) =>
                                        setBookingForm({
                                            ...bookingForm,
                                            kelas_mata_kuliah_id: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Mata Kuliah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {myMatKuls.map((mk) => (
                                            <SelectItem key={mk.id} value={String(mk.id)}>
                                                {mk.nama} - {mk.kelas} ({mk.sks} SKS)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Durasi booking akan disesuaikan dengan SKS mata kuliah
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keperluan">
                                    Keperluan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="keperluan"
                                    placeholder="Misal: Praktikum, Remedial, dll"
                                    value={bookingForm.keperluan}
                                    onChange={(e) =>
                                        setBookingForm({
                                            ...bookingForm,
                                            keperluan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                                <Textarea
                                    id="keterangan"
                                    placeholder="Tambahkan keterangan jika diperlukan..."
                                    rows={3}
                                    value={bookingForm.keterangan}
                                    onChange={(e) =>
                                        setBookingForm({
                                            ...bookingForm,
                                            keterangan: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowBookingDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmitBooking}
                            disabled={!bookingForm.kelas_mata_kuliah_id || !bookingForm.keperluan.trim()}
                        >
                            Ajukan Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
