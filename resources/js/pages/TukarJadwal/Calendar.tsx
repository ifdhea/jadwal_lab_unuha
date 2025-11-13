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
import { useEffect } from 'react';
import {
    BookOpen,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    ArrowLeftRight,
    CheckCircle2,
    XCircle,
    Send,
    Inbox,
    MapPin,
    User,
    Plus,
} from 'lucide-react';
import { useState } from 'react';

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
}
interface JadwalCell {
    sesi_jadwal_id: number;
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
type JadwalData = Record<
    number,
    Record<number, Record<number, Record<number, JadwalCell[]>>>
>;

interface TukarJadwal {
    id: number;
    pemohon: { id: number; nama: string };
    sesi_pemohon: {
        id: number;
        mata_kuliah: string;
        tanggal: string;
        hari: string;
        laboratorium: string;
        waktu_mulai: string;
        waktu_selesai: string;
    };
    mitra: { id: number; nama: string } | null;
    sesi_mitra: {
        id: number;
        mata_kuliah: string;
        tanggal: string;
        hari: string;
        laboratorium: string;
        waktu_mulai: string;
        waktu_selesai: string;
    } | null;
    status: string;
    alasan_pemohon: string;
    alasan_penolakan: string | null;
    tanggal_diajukan: string;
    tanggal_diproses: string | null;
    is_pemohon: boolean;
    is_mitra: boolean;
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
    myRequests: TukarJadwal[];
    incomingRequests: TukarJadwal[];
    dosenId: number;
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
    myRequests,
    incomingRequests,
    dosenId,
    breadcrumbs,
}: Props) {
    const { flash } = usePage<any>().props;
    const [activeKampus, setActiveKampus] = useState(
        kampusList[0]?.kode || 'B',
    );
    const [activeTab, setActiveTab] = useState('calendar');
    const [showSwapDialog, setShowSwapDialog] = useState(false);
    const [selectedMySchedule, setSelectedMySchedule] = useState<JadwalCell | null>(null);
    const [targetCell, setTargetCell] = useState<{
        cell: JadwalCell | null;
        isEmptySlot: boolean;
        tanggal: string;
        slot: Slot;
    } | null>(null);
    const [swapForm, setSwapForm] = useState({
        alasan: '',
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
                className: "bg-red-50 border-red-200 text-red-900",
                action: (
                    <XCircle className="h-5 w-5 text-red-600" />
                ),
            });
        }
    }, [flash]);

    const isToday = (tanggal?: string) => {
        if (!tanggal) return false;
        const today = new Date().toISOString().split('T')[0];
        return tanggal === today;
    };

    const handleSemesterChange = (semesterId: string) => {
        router.get(
            '/tukar-jadwal/calendar',
            { semester_id: semesterId, minggu: 1 },
            { preserveState: true },
        );
    };

    const handleMingguChange = (minggu: number | string) => {
        const mingguNum = Number(minggu);
        if (isNaN(mingguNum) || mingguNum < 1) return;

        router.get(
            '/tukar-jadwal/calendar',
            {
                semester_id: selectedSemesterId,
                minggu: mingguNum,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Handler untuk klik jadwal sendiri (step 1)
    const handleMyScheduleClick = (cell: JadwalCell) => {
        if (!cell.is_my_schedule || cell.is_past) return;
        
        setSelectedMySchedule(cell);
        toast({
            title: "Jadwal dipilih",
            description: "Sekarang klik jadwal lain untuk tukar, atau klik slot kosong untuk pindah",
            className: "bg-blue-50 border-blue-200 text-blue-900",
        });
    };

    // Handler untuk klik jadwal dosen lain atau slot kosong (step 2)
    const handleTargetClick = (
        cellsData: JadwalCell[],
        tanggal: string,
        slot: Slot,
    ) => {
        const isEmpty = cellsData.length === 0;
        const targetJadwal = cellsData.find(c => !c.is_my_schedule);
        
        // Validasi: harus klik jadwal sendiri dulu
        if (!selectedMySchedule) {
            toast({
                title: "Pilih jadwal Anda dulu",
                description: "Klik jadwal yang ingin Anda tukar/pindahkan terlebih dahulu",
                className: "bg-yellow-50 border-yellow-200 text-yellow-900",
            });
            return;
        }

        // Tidak bisa klik jadwal sendiri yang sama
        if (cellsData.some(c => c.sesi_jadwal_id === selectedMySchedule.sesi_jadwal_id)) {
            return;
        }

        // Tidak bisa klik jadwal yang sudah lewat
        if (cellsData.some(c => c.is_past)) {
            toast({
                title: "Tidak dapat tukar",
                description: "Tidak dapat tukar dengan jadwal yang sudah lewat",
                className: "bg-red-50 border-red-200 text-red-900",
            });
            return;
        }

        // Validasi tanggal target tidak boleh sudah lewat
        const today = new Date();
        const jakartaOffset = 7 * 60;
        const localOffset = today.getTimezoneOffset();
        const jakartaTime = new Date(today.getTime() + (jakartaOffset + localOffset) * 60 * 1000);
        jakartaTime.setHours(0, 0, 0, 0);
        
        const targetDate = new Date(tanggal + 'T00:00:00');
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate < jakartaTime) {
            toast({
                title: "Tidak dapat tukar",
                description: "Tidak dapat tukar/pindah ke tanggal yang sudah lewat",
                className: "bg-red-50 border-red-200 text-red-900",
            });
            return;
        }

        // Set target dan buka dialog
        setTargetCell({
            cell: targetJadwal || null,
            isEmptySlot: isEmpty,
            tanggal,
            slot,
        });
        setSwapForm({ alasan: '' });
        setShowSwapDialog(true);
    };

    const handleSubmitSwap = () => {
        if (!selectedMySchedule || !targetCell || !swapForm.alasan.trim()) return;

        const data: any = {
            sesi_jadwal_pemohon_id: selectedMySchedule.sesi_jadwal_id,
            alasan_pemohon: swapForm.alasan,
        };

        if (!targetCell.isEmptySlot && targetCell.cell) {
            // Tukar dengan jadwal dosen lain
            data.sesi_jadwal_mitra_id = targetCell.cell.sesi_jadwal_id;
            data.mitra_id = targetCell.cell.dosen_id;
        } else {
            // Pindah ke slot kosong
            data.sesi_jadwal_mitra_id = null;
            data.mitra_id = null;
        }

        router.post('/tukar-jadwal', data, {
            onSuccess: () => {
                setShowSwapDialog(false);
                setSelectedMySchedule(null);
                setTargetCell(null);
                setSwapForm({ alasan: '' });
                
                toast({
                    title: "Berhasil",
                    description: "Request tukar jadwal berhasil diajukan",
                    className: "bg-green-50 border-green-200 text-green-900",
                });
            },
            onError: (errors) => {
                const errorMessage = errors?.message || Object.values(errors || {}).flat().join(', ') || "Terjadi kesalahan saat mengajukan request";
                toast({
                    title: "Gagal",
                    description: errorMessage,
                    className: "bg-red-50 border-red-200 text-red-900",
                    action: (
                        <XCircle className="h-5 w-5 text-red-600" />
                    ),
                });
            }
        });
    };

    const handleApprove = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menyetujui pertukaran jadwal ini?')) {
            router.post(`/tukar-jadwal/${id}/approve`);
        }
    };

    const handleReject = (id: number, reason: string) => {
        if (!reason.trim()) {
            alert('Harap masukkan alasan penolakan');
            return;
        }
        router.post(`/tukar-jadwal/${id}/reject`, { alasan_penolakan: reason });
    };

    const handleCancel = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan request ini?')) {
            router.post(`/tukar-jadwal/${id}/cancel`);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string; icon: any }> = {
            menunggu: { variant: 'default', label: 'Menunggu', icon: Clock },
            disetujui: { variant: 'outline', label: 'Disetujui', icon: CheckCircle2 },
            ditolak: { variant: 'destructive', label: 'Ditolak', icon: XCircle },
            dibatalkan: { variant: 'secondary', label: 'Dibatalkan', icon: XCircle },
        };
        const config = variants[status] || variants.menunggu;
        const Icon = config.icon;
        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const currentMinggu = mingguList.find((m) => m.nomor === selectedMinggu);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tukar Jadwal - Kalender" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Tukar Jadwal</h1>
                        <p className="text-muted-foreground">
                            Klik jadwal Anda, lalu klik jadwal lain atau slot kosong untuk tukar/pindah
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

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="calendar">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Kalender
                        </TabsTrigger>
                        <TabsTrigger value="outgoing">
                            <Send className="mr-2 h-4 w-4" />
                            Request Keluar ({myRequests.length})
                        </TabsTrigger>
                        <TabsTrigger value="incoming">
                            <Inbox className="mr-2 h-4 w-4" />
                            Request Masuk ({incomingRequests.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="calendar" className="space-y-4">
                        {/* Info Box */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <ArrowLeftRight className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div className="space-y-1 text-sm">
                                        <p className="font-medium text-blue-900">Cara Tukar Jadwal:</p>
                                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                                            <li><strong>Klik jadwal Anda</strong> yang ingin ditukar/dipindah (ditandai warna hijau)</li>
                                            <li>Lalu <strong>klik jadwal dosen lain</strong> untuk tukar jadwal</li>
                                            <li>Atau <strong>klik slot kosong</strong> untuk pindah jadwal</li>
                                            <li>Perubahan bersifat sementara (hanya untuk minggu ini)</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Selected Schedule Indicator */}
                        {selectedMySchedule && (
                            <Card className="bg-green-50 border-green-300">
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-green-900">Jadwal terpilih: {selectedMySchedule.matkul}</p>
                                                <p className="text-sm text-green-700">
                                                    {new Date(selectedMySchedule.tanggal).toLocaleDateString('id-ID')} • {selectedMySchedule.waktu_mulai.slice(0, 5)} - {selectedMySchedule.waktu_selesai.slice(0, 5)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedMySchedule(null)}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tab Kampus */}
                        <Tabs
                            value={activeKampus}
                            onValueChange={setActiveKampus}
                        >
                            <TabsList
                                className="grid w-full"
                                style={{
                                    gridTemplateColumns: `repeat(${kampusList.length}, 1fr)`,
                                }}
                            >
                                {kampusList.map((kampus) => (
                                    <TabsTrigger
                                        key={kampus.id}
                                        value={kampus.kode}
                                    >
                                        Kampus {kampus.kode}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {kampusList.map((kampus) => {
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
                                                    Kalender Tukar Jadwal - Kampus{' '}
                                                    {kampus.nama}
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
                                                                const renderedCells: Record<number, Set<number>> = {};
                                                                hari.forEach((h) => {
                                                                    renderedCells[h.id] = new Set<number>();
                                                                });

                                                                return slots.map((slot, slotIdx) => {
                                                                    const isBreakTime = slot.waktu_mulai === '11:45:00' && slot.waktu_selesai === '13:15:00';
                                                                    
                                                                    return (
                                                                        <tr
                                                                            key={slot.id}
                                                                            className={isBreakTime ? 'h-16' : 'h-24'}
                                                                        >
                                                                            <td className={`sticky left-0 border p-2 text-center font-mono text-xs font-semibold ${
                                                                                isBreakTime ? 'bg-muted/50 h-16' : 'bg-background h-24'
                                                                            }`}>
                                                                                {slot.waktu_mulai.slice(0, 5)} - {slot.waktu_selesai.slice(0, 5)}
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
                                                                                hari.map((h) => {
                                                                                    // Skip jika cell ini sudah di-render sebagai bagian dari rowspan
                                                                                    if (renderedCells[h.id].has(slot.id)) {
                                                                                        return null;
                                                                                    }

                                                                                    const cellsData =
                                                                                        jadwalKampus[selectedMinggu]?.[h.id]?.[slot.id] || [];
                                                                                    
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

                                                                                    const isEmpty = cellsData.length === 0;

                                                                                    return (
                                                                                        <td
                                                                                            key={h.id}
                                                                                            className="h-full border p-0 align-middle"
                                                                                            rowSpan={maxRowSpan}
                                                                                            style={{ height: `${maxRowSpan * 6}rem` }}
                                                                                        >
                                                                                        {!isEmpty ? (
                                                                                            <div className="flex h-full flex-col divide-y">
                                                                                                {cellsData.map((cell, idx) => {
                                                                                                    // Color scheme generator
                                                                                                    const getColorScheme = (dosen: string, index: number) => {
                                                                                                        const colors = [
                                                                                                            { from: 'from-blue-50', to: 'to-blue-100', border: 'border-blue-500', icon: 'text-blue-600', text: 'text-blue-900', hover: 'hover:from-blue-100 hover:to-blue-200' },
                                                                                                            { from: 'from-green-50', to: 'to-green-100', border: 'border-green-500', icon: 'text-green-600', text: 'text-green-900', hover: 'hover:from-green-100 hover:to-green-200' },
                                                                                                            { from: 'from-purple-50', to: 'to-purple-100', border: 'border-purple-500', icon: 'text-purple-600', text: 'text-purple-900', hover: 'hover:from-purple-100 hover:to-purple-200' },
                                                                                                            { from: 'from-orange-50', to: 'to-orange-100', border: 'border-orange-500', icon: 'text-orange-600', text: 'text-orange-900', hover: 'hover:from-orange-100 hover:to-orange-200' },
                                                                                                            { from: 'from-pink-50', to: 'to-pink-100', border: 'border-pink-500', icon: 'text-pink-600', text: 'text-pink-900', hover: 'hover:from-pink-100 hover:to-pink-200' },
                                                                                                            { from: 'from-teal-50', to: 'to-teal-100', border: 'border-teal-500', icon: 'text-teal-600', text: 'text-teal-900', hover: 'hover:from-teal-100 hover:to-teal-200' },
                                                                                                        ];
                                                                                                        const hash = dosen.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                                                                                        return colors[(hash + index) % colors.length];
                                                                                                    };

                                                                                                    const colorScheme = getColorScheme(cell.dosen, idx);
                                                                                                    const isSelected = selectedMySchedule?.sesi_jadwal_id === cell.sesi_jadwal_id;
                                                                                                    const canClick = cell.is_my_schedule ? !cell.is_past : selectedMySchedule && !cell.is_past;

                                                                                                    return (
                                                                                                        <div
                                                                                                            key={idx}
                                                                                                            className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} border-l-4 ${colorScheme.border} flex h-full flex-col justify-center p-2 ${canClick ? 'cursor-pointer ' + colorScheme.hover : ''} mx-0.5 my-0.5 rounded-lg shadow-sm transition-all duration-200 ${canClick ? 'hover:shadow-md' : ''} relative ${isSelected ? 'ring-4 ring-green-400' : ''} ${cell.is_past ? 'opacity-50' : ''}`}
                                                                                                            onClick={() => {
                                                                                                                if (cell.is_past) return;
                                                                                                                if (cell.is_my_schedule) {
                                                                                                                    handleMyScheduleClick(cell);
                                                                                                                } else if (selectedMySchedule && h.tanggal) {
                                                                                                                    handleTargetClick(cellsData, h.tanggal, slot);
                                                                                                                }
                                                                                                            }}
                                                                                                        >
                                                                                                            {/* Header */}
                                                                                                            <div className="mb-2 flex items-start gap-1.5">
                                                                                                                <BookOpen className={`h-4 w-4 ${colorScheme.icon} mt-0.5 flex-shrink-0`} />
                                                                                                                <div className="min-w-0 flex-1">
                                                                                                                    <p className={`font-bold ${colorScheme.text} truncate text-xs leading-tight`}>
                                                                                                                        {cell.matkul}
                                                                                                                    </p>
                                                                                                                    <div className="mt-0.5 flex items-center gap-1">
                                                                                                                        <Badge variant="secondary" className="truncate px-1.5 py-0.5 text-xs font-medium">
                                                                                                                            {cell.kelas}
                                                                                                                        </Badge>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Info detail */}
                                                                                                            <div className="space-y-0.5 text-xs">
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 truncate font-medium">{cell.dosen}</span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 truncate font-medium">{cell.lab}</span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 font-medium">
                                                                                                                        {cell.waktu_mulai.slice(0, 5)} - {cell.waktu_selesai.slice(0, 5)}
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Footer */}
                                                                                                            <div className={`mt-1.5 flex items-center justify-between border-t pt-1.5 ${colorScheme.border.replace('border-', 'border-opacity-20 border-')}`}>
                                                                                                                <Badge variant="outline" className="px-1.5 py-0.5 text-xs font-medium">
                                                                                                                    {cell.sks} SKS
                                                                                                                </Badge>
                                                                                                                {cell.is_my_schedule && !cell.is_past && (
                                                                                                                    <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-green-600">
                                                                                                                        Jadwal Saya
                                                                                                                    </Badge>
                                                                                                                )}
                                                                                                                {cell.is_past && (
                                                                                                                    <Badge variant="secondary" className="px-1.5 py-0.5 text-xs font-medium">
                                                                                                                        Sudah Lewat
                                                                                                                    </Badge>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
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
                                                                                                
                                                                                                const isPastDate = cellDate && cellDate < jakartaTime;
                                                                                                const canClickEmpty = selectedMySchedule && !isPastDate;

                                                                                                return (
                                                                                                    <div 
                                                                                                        className={`h-24 flex items-center justify-center transition-colors ${
                                                                                                            isPastDate 
                                                                                                                ? 'bg-muted/30 cursor-not-allowed' 
                                                                                                                : canClickEmpty
                                                                                                                ? 'cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 border-2 border-dashed border-blue-300 group'
                                                                                                                : 'border-2 border-dashed border-gray-300'
                                                                                                        }`}
                                                                                                        onClick={() => {
                                                                                                            if (canClickEmpty && h.tanggal) {
                                                                                                                handleTargetClick([], h.tanggal, slot);
                                                                                                            }
                                                                                                        }}
                                                                                                    >
                                                                                                        {isPastDate ? (
                                                                                                            <div className="text-center text-muted-foreground">
                                                                                                                <Clock className="h-5 w-5 mx-auto mb-1 opacity-50" />
                                                                                                                <div className="text-xs font-medium">Sudah Lewat</div>
                                                                                                            </div>
                                                                                                        ) : canClickEmpty ? (
                                                                                                            <div className="text-center">
                                                                                                                <Plus className="h-6 w-6 mx-auto mb-1 text-blue-600 group-hover:text-blue-700" />
                                                                                                                <div className="text-sm font-medium text-blue-700 group-hover:text-blue-800">
                                                                                                                    Pindah ke sini
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <div className="text-center text-muted-foreground">
                                                                                                                <div className="text-xs font-medium">Kosong</div>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                );
                                                                                            })()
                                                                                        )}
                                                                                        </td>
                                                                                    );
                                                                                })
                                                                            )}
                                                                        </tr>
                                                                    );
                                                                });
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

                    {/* Tab Request Keluar */}
                    <TabsContent value="outgoing" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Tukar Jadwal yang Saya Ajukan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {myRequests.length > 0 ? (
                                    <div className="space-y-3">
                                        {myRequests.map((req) => (
                                            <div
                                                key={req.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        {getStatusBadge(req.status)}
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(req.tanggal_diajukan).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-semibold">Jadwal Saya:</p>
                                                            <div className="text-sm space-y-1 bg-muted/50 p-3 rounded">
                                                                <p className="font-medium">{req.sesi_pemohon.mata_kuliah}</p>
                                                                <p>{req.sesi_pemohon.hari}, {new Date(req.sesi_pemohon.tanggal).toLocaleDateString('id-ID')}</p>
                                                                <p>{req.sesi_pemohon.waktu_mulai} - {req.sesi_pemohon.waktu_selesai}</p>
                                                                <p>{req.sesi_pemohon.laboratorium}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {req.sesi_mitra ? (
                                                            <div className="space-y-2">
                                                                <p className="text-sm font-semibold">Ditukar dengan:</p>
                                                                <div className="text-sm space-y-1 bg-muted/50 p-3 rounded">
                                                                    <p className="font-medium">{req.sesi_mitra.mata_kuliah}</p>
                                                                    <p>Dosen: {req.mitra?.nama}</p>
                                                                    <p>{req.sesi_mitra.hari}, {new Date(req.sesi_mitra.tanggal).toLocaleDateString('id-ID')}</p>
                                                                    <p>{req.sesi_mitra.waktu_mulai} - {req.sesi_mitra.waktu_selesai}</p>
                                                                    <p>{req.sesi_mitra.laboratorium}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <p className="text-sm font-semibold">Pindah ke:</p>
                                                                <div className="text-sm space-y-1 bg-muted/50 p-3 rounded">
                                                                    <p className="font-medium">Slot Kosong</p>
                                                                    <p className="text-muted-foreground">Request pindah jadwal ke waktu lain</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="text-sm">
                                                        <span className="font-medium">Alasan: </span>
                                                        <span>{req.alasan_pemohon}</span>
                                                    </div>

                                                    {req.alasan_penolakan && (
                                                        <div className="text-sm bg-destructive/10 p-3 rounded border border-destructive/20">
                                                            <span className="font-medium text-destructive">Alasan Penolakan: </span>
                                                            <span>{req.alasan_penolakan}</span>
                                                        </div>
                                                    )}

                                                    {req.status === 'menunggu' && (
                                                        <div className="flex justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleCancel(req.id)}
                                                            >
                                                                Batalkan
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Belum ada request tukar jadwal yang diajukan
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab Request Masuk */}
                    <TabsContent value="incoming" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Tukar Jadwal dari Dosen Lain</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {incomingRequests.length > 0 ? (
                                    <div className="space-y-3">
                                        {incomingRequests.map((req) => {
                                            const [rejectReason, setRejectReason] = useState('');
                                            
                                            return (
                                                <div
                                                    key={req.id}
                                                    className="rounded-lg border p-4"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            {getStatusBadge(req.status)}
                                                            <span className="text-sm text-muted-foreground">
                                                                {new Date(req.tanggal_diajukan).toLocaleDateString('id-ID')}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <p className="text-sm font-semibold">Jadwal Saya:</p>
                                                                <div className="text-sm space-y-1 bg-muted/50 p-3 rounded">
                                                                    <p className="font-medium">{req.sesi_mitra?.mata_kuliah}</p>
                                                                    <p>{req.sesi_mitra?.hari}, {req.sesi_mitra && new Date(req.sesi_mitra.tanggal).toLocaleDateString('id-ID')}</p>
                                                                    <p>{req.sesi_mitra?.waktu_mulai} - {req.sesi_mitra?.waktu_selesai}</p>
                                                                    <p>{req.sesi_mitra?.laboratorium}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-2">
                                                                <p className="text-sm font-semibold">Ditukar dengan:</p>
                                                                <div className="text-sm space-y-1 bg-muted/50 p-3 rounded">
                                                                    <p className="font-medium">{req.sesi_pemohon.mata_kuliah}</p>
                                                                    <p>Dosen: {req.pemohon.nama}</p>
                                                                    <p>{req.sesi_pemohon.hari}, {new Date(req.sesi_pemohon.tanggal).toLocaleDateString('id-ID')}</p>
                                                                    <p>{req.sesi_pemohon.waktu_mulai} - {req.sesi_pemohon.waktu_selesai}</p>
                                                                    <p>{req.sesi_pemohon.laboratorium}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-sm">
                                                            <span className="font-medium">Alasan: </span>
                                                            <span>{req.alasan_pemohon}</span>
                                                        </div>

                                                        {req.status === 'menunggu' && (
                                                            <div className="space-y-2">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleApprove(req.id)}
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                        Setujui
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => {
                                                                            const reason = prompt('Alasan penolakan:');
                                                                            if (reason) handleReject(req.id, reason);
                                                                        }}
                                                                    >
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Tolak
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Belum ada request tukar jadwal masuk
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialog Konfirmasi Tukar/Pindah Jadwal */}
            <Dialog open={showSwapDialog} onOpenChange={setShowSwapDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {targetCell?.isEmptySlot ? 'Pindah Jadwal' : 'Tukar Jadwal'}
                        </DialogTitle>
                        <DialogDescription>
                            {targetCell?.isEmptySlot 
                                ? 'Ajukan permintaan pindah jadwal ke slot kosong'
                                : 'Ajukan permintaan tukar jadwal dengan dosen lain'}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMySchedule && targetCell && (
                        <div className="space-y-4 py-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label className="font-semibold">Jadwal Anda:</Label>
                                    <div className="rounded-lg border bg-muted/50 p-3 space-y-1 text-sm">
                                        <p className="font-medium">{selectedMySchedule.matkul}</p>
                                        <p>{new Date(selectedMySchedule.tanggal).toLocaleDateString('id-ID')}</p>
                                        <p>{selectedMySchedule.waktu_mulai.slice(0, 5)} - {selectedMySchedule.waktu_selesai.slice(0, 5)}</p>
                                        <p>{selectedMySchedule.lab}</p>
                                    </div>
                                </div>

                                {!targetCell.isEmptySlot && targetCell.cell ? (
                                    <div className="space-y-2">
                                        <Label className="font-semibold">Ditukar dengan:</Label>
                                        <div className="rounded-lg border bg-muted/50 p-3 space-y-1 text-sm">
                                            <p className="font-medium">{targetCell.cell.matkul}</p>
                                            <p>Dosen: {targetCell.cell.dosen}</p>
                                            <p>{new Date(targetCell.tanggal).toLocaleDateString('id-ID')}</p>
                                            <p>{targetCell.slot.waktu_mulai.slice(0, 5)} - {targetCell.slot.waktu_selesai.slice(0, 5)}</p>
                                            <p>{targetCell.cell.lab}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className="font-semibold">Pindah ke:</Label>
                                        <div className="rounded-lg border bg-muted/50 p-3 space-y-1 text-sm">
                                            <p className="font-medium">Slot Kosong</p>
                                            <p>{new Date(targetCell.tanggal).toLocaleDateString('id-ID')}</p>
                                            <p>{targetCell.slot.waktu_mulai.slice(0, 5)} - {targetCell.slot.waktu_selesai.slice(0, 5)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alasan">
                                    Alasan {targetCell.isEmptySlot ? 'Pindah' : 'Tukar'} <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="alasan"
                                    placeholder="Masukkan alasan..."
                                    rows={3}
                                    value={swapForm.alasan}
                                    onChange={(e) =>
                                        setSwapForm({
                                            ...swapForm,
                                            alasan: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowSwapDialog(false);
                                setSelectedMySchedule(null);
                                setTargetCell(null);
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmitSwap}
                            disabled={!swapForm.alasan.trim()}
                        >
                            Ajukan {targetCell?.isEmptySlot ? 'Pindah' : 'Tukar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
