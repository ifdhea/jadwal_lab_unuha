import PublicLayout from '@/layouts/public-layout';
import { Head, router } from '@inertiajs/react';
import { ActivityFeedButton } from '@/components/activity-feed-button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    User,
    ArrowLeftRight,
    Search,
    Filter,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
    tanggal: string;
    is_past: boolean;
    is_active?: boolean;
    is_swapped?: boolean;
    kampus: string;
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
}

export default function Jadwal({
    semesters,
    selectedSemesterId,
    kampusList,
    mingguList,
    selectedMinggu,
    hari,
    slots,
    jadwalData,
    tableData,
}: Props) {
    const [activeKampus, setActiveKampus] = useState(kampusList[0]?.kode || 'B');
    const [activeTab, setActiveTab] = useState<'calendar' | 'table'>('calendar');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKampus, setFilterKampus] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const isToday = (tanggal?: string) => {
        if (!tanggal) return false;
        const now = new Date();
        const offset = 7 * 60;
        const wibTime = new Date(now.getTime() + offset * 60 * 1000);
        const todayString = wibTime.toISOString().split('T')[0];
        return tanggal === todayString;
    };

    const handleSemesterChange = (semesterId: string) => {
        router.get('/jadwal-lab', { semester_id: semesterId, minggu: 1 }, { preserveState: true });
    };

    const handleMingguChange = (minggu: number) => {
        router.get(
            '/jadwal-lab',
            { semester_id: selectedSemesterId, minggu },
            { preserveState: true }
        );
    };

    const currentMinggu = mingguList.find((m) => m.nomor === selectedMinggu);

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

    const getColorScheme = (dosen: string, index: number) => {
        const colors = [
            {
                from: 'from-blue-50 dark:from-blue-900/30',
                to: 'to-blue-100 dark:to-blue-800/30',
                border: 'border-blue-500 dark:border-blue-400',
                icon: 'text-blue-600 dark:text-blue-400',
                text: 'text-blue-900 dark:text-blue-100',
                hover: 'hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
            {
                from: 'from-green-50 dark:from-green-900/30',
                to: 'to-green-100 dark:to-green-800/30',
                border: 'border-green-500 dark:border-green-400',
                icon: 'text-green-600 dark:text-green-400',
                text: 'text-green-900 dark:text-green-100',
                hover: 'hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
            {
                from: 'from-purple-50 dark:from-purple-900/30',
                to: 'to-purple-100 dark:to-purple-800/30',
                border: 'border-purple-500 dark:border-purple-400',
                icon: 'text-purple-600 dark:text-purple-400',
                text: 'text-purple-900 dark:text-purple-100',
                hover: 'hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
            {
                from: 'from-orange-50 dark:from-orange-900/30',
                to: 'to-orange-100 dark:to-orange-800/30',
                border: 'border-orange-500 dark:border-orange-400',
                icon: 'text-orange-600 dark:text-orange-400',
                text: 'text-orange-900 dark:text-orange-100',
                hover: 'hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
            {
                from: 'from-pink-50 dark:from-pink-900/30',
                to: 'to-pink-100 dark:to-pink-800/30',
                border: 'border-pink-500 dark:border-pink-400',
                icon: 'text-pink-600 dark:text-pink-400',
                text: 'text-pink-900 dark:text-pink-100',
                hover: 'hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-800/40 dark:hover:to-pink-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
            {
                from: 'from-teal-50 dark:from-teal-900/30',
                to: 'to-teal-100 dark:to-teal-800/30',
                border: 'border-teal-500 dark:border-teal-400',
                icon: 'text-teal-600 dark:text-teal-400',
                text: 'text-teal-900 dark:text-teal-100',
                hover: 'hover:from-teal-100 hover:to-teal-200 dark:hover:from-teal-800/40 dark:hover:to-teal-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
            {
                from: 'from-indigo-50 dark:from-indigo-900/30',
                to: 'to-indigo-100 dark:to-indigo-800/30',
                border: 'border-indigo-500 dark:border-indigo-400',
                icon: 'text-indigo-600 dark:text-indigo-400',
                text: 'text-indigo-900 dark:text-indigo-100',
                hover: 'hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-800/40 dark:hover:to-indigo-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
            {
                from: 'from-amber-50 dark:from-amber-900/30',
                to: 'to-amber-100 dark:to-amber-800/30',
                border: 'border-amber-500 dark:border-amber-400',
                icon: 'text-amber-600 dark:text-amber-400',
                text: 'text-amber-900 dark:text-amber-100',
                hover: 'hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-800/40 dark:hover:to-amber-700/40',
                detailText: 'text-gray-700 dark:text-gray-300',
            },
        ];

        const hash = dosen.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colorIndex = (hash + index) % colors.length;
        return colors[colorIndex];
    };

    return (
        <PublicLayout>
            <Head title="Jadwal Lab" />

            <div className="container mx-auto space-y-6 px-6 py-8 pt-20 md:pt-24 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold">Jadwal Laboratorium</h1>
                        <p className="text-muted-foreground">
                            Lihat jadwal penggunaan laboratorium
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ActivityFeedButton variant="button" days={7} />
                        <div className="w-full sm:w-72">
                            <Select
                                value={selectedSemesterId ? String(selectedSemesterId) : ''}
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
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="100">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMingguChange(selectedMinggu - 1)}
                        disabled={selectedMinggu <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <p className="font-semibold">Minggu ke-{selectedMinggu}</p>
                        {currentMinggu && (
                            <p className="text-xs text-muted-foreground">
                                {new Date(currentMinggu.tanggal_mulai).toLocaleDateString(
                                    'id-ID',
                                    { day: 'numeric', month: 'short', year: 'numeric' }
                                )}{' '}
                                -{' '}
                                {new Date(currentMinggu.tanggal_selesai).toLocaleDateString(
                                    'id-ID',
                                    { day: 'numeric', month: 'short', year: 'numeric' }
                                )}
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
                    <TabsList className="grid w-full grid-cols-2" data-aos="fade-up" data-aos-delay="200">
                        <TabsTrigger value="calendar">Kalender</TabsTrigger>
                        <TabsTrigger value="table">Tabel</TabsTrigger>
                    </TabsList>

                    {/* Calendar Tab */}
                    <TabsContent value="calendar" className="space-y-4">
                        <Tabs value={activeKampus} onValueChange={setActiveKampus}>
                            <TabsList
                                className="grid w-full"
                                style={{
                                    gridTemplateColumns: `repeat(${kampusList.length}, 1fr)`,
                                }}
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                {kampusList.map((kampus) => (
                                    <TabsTrigger key={kampus.id} value={kampus.kode}>
                                        Kampus {kampus.kode}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {kampusList.map((kampus) => {
                                const jadwalKampus = jadwalData[kampus.id] || {};

                                return (
                                    <TabsContent key={kampus.id} value={kampus.kode} className="space-y-4">
                                        <Card data-aos="fade-up" data-aos-delay="400">
                                            <CardHeader>
                                                <CardTitle>Jadwal Kampus {kampus.nama}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {/* Mobile and Desktop Table Container */}
                                                <div className="block md:hidden">
                                                    {/* Mobile View - Fixed time column, scrollable days */}
                                                    <div className="relative">
                                                        <div className="overflow-x-auto">
                                                            <div className="min-w-max">
                                                                <table className="border-collapse text-sm">
                                                                    <thead>
                                                                        <tr className="bg-muted/50">
                                                                            <th className="sticky left-0 z-20 w-24 border-r-2 border-r-gray-300 bg-muted p-1 font-semibold shadow-md">
                                                                                Jam
                                                                            </th>
                                                                            {hari.map((h) => {
                                                                                const isTodayCell = isToday(h.tanggal);
                                                                                return (
                                                                                    <th
                                                                                        key={h.id}
                                                                                        className={`border p-2 font-semibold min-w-[140px] ${isTodayCell
                                                                                            ? 'bg-primary/10 ring-2 ring-primary ring-inset'
                                                                                            : ''
                                                                                            }`}
                                                                                    >
                                                                                        <div className="flex flex-col gap-1">
                                                                                            <span
                                                                                                className={
                                                                                                    isTodayCell
                                                                                                        ? 'text-primary font-bold'
                                                                                                        : ''
                                                                                                }
                                                                                            >
                                                                                                {h.nama}
                                                                                            </span>
                                                                                            {h.tanggal && (
                                                                                                <span
                                                                                                    className={`text-xs ${isTodayCell
                                                                                                        ? 'text-primary font-semibold'
                                                                                                        : 'text-muted-foreground'
                                                                                                        }`}
                                                                                                >
                                                                                                    {new Date(
                                                                                                        h.tanggal
                                                                                                    ).toLocaleDateString('id-ID', {
                                                                                                        day: '2-digit',
                                                                                                        month: 'short',
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
                                                                            const renderedCells: Record<number, Set<number>> = {};
                                                                            hari.forEach((h) => {
                                                                                renderedCells[h.id] = new Set<number>();
                                                                            });

                                                                            return slots.map((slot, slotIdx) => {
                                                                                const isBreakTime =
                                                                                    slot.waktu_mulai === '11:45:00' &&
                                                                                    slot.waktu_selesai === '13:15:00';

                                                                                return (
                                                                                    <tr
                                                                                        key={slot.id}
                                                                                        className={isBreakTime ? 'h-16' : 'h-24'}
                                                                                    >
                                                                                        <td
                                                                                            className={`sticky left-0 z-10 border-r-2 border-r-gray-300 p-1 text-center font-mono text-xs font-semibold shadow-md whitespace-nowrap ${isBreakTime
                                                                                                ? 'bg-muted h-16'
                                                                                                : 'bg-background h-24'
                                                                                                }`}
                                                                                        >
                                                                                            {slot.waktu_mulai.slice(0, 5)} -{' '}
                                                                                            {slot.waktu_selesai.slice(0, 5)}
                                                                                        </td>
                                                                                        {hari.map((h) => {
                                                                                            if (renderedCells[h.id].has(slot.id)) {
                                                                                                return null;
                                                                                            }

                                                                                            const cellsData =
                                                                                                jadwalKampus[selectedMinggu]?.[h.id]?.[
                                                                                                slot.id
                                                                                                ] || [];

                                                                                            let maxRowSpan = 1;
                                                                                            if (cellsData.length > 0) {
                                                                                                const firstCell = cellsData[0];
                                                                                                const startIdx = slots.findIndex(
                                                                                                    (s) =>
                                                                                                        s.waktu_mulai <=
                                                                                                        firstCell.waktu_mulai &&
                                                                                                        s.waktu_selesai >
                                                                                                        firstCell.waktu_mulai
                                                                                                );
                                                                                                const endIdx = slots.findIndex(
                                                                                                    (s) =>
                                                                                                        s.waktu_mulai <
                                                                                                        firstCell.waktu_selesai &&
                                                                                                        s.waktu_selesai >=
                                                                                                        firstCell.waktu_selesai
                                                                                                );
                                                                                                if (startIdx !== -1 && endIdx !== -1) {
                                                                                                    maxRowSpan = endIdx - startIdx + 1;
                                                                                                } else {
                                                                                                    maxRowSpan = firstCell.durasi_slot || 1;
                                                                                                }

                                                                                                for (let i = 0; i < maxRowSpan; i++) {
                                                                                                    const spanSlotIdx = slotIdx + i;
                                                                                                    if (spanSlotIdx < slots.length) {
                                                                                                        const spanSlotId =
                                                                                                            slots[spanSlotIdx].id;
                                                                                                        renderedCells[h.id].add(spanSlotId);
                                                                                                    }
                                                                                                }
                                                                                            }

                                                                                            return (
                                                                                                <td
                                                                                                    key={h.id}
                                                                                                    className="h-full border p-0 align-middle relative"
                                                                                                    rowSpan={maxRowSpan}
                                                                                                    style={{
                                                                                                        height: `${maxRowSpan * 6}rem`,
                                                                                                    }}
                                                                                                >
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
                                                                                                    {cellsData.length > 0 ? (
                                                                                                        <div className="flex h-full flex-col divide-y">
                                                                                                            {cellsData.map((cell, idx) => {
                                                                                                                const colorScheme = getColorScheme(
                                                                                                                    cell.dosen,
                                                                                                                    idx
                                                                                                                );

                                                                                                                return (
                                                                                                                    <div
                                                                                                                        key={idx}
                                                                                                                        className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} border-l-4 ${colorScheme.border} flex h-full flex-col justify-center p-2 ${colorScheme.hover} mx-0.5 my-0.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
                                                                                                                    >
                                                                                                                        <div className="mb-2 flex items-start gap-1.5">
                                                                                                                            <BookOpen
                                                                                                                                className={`h-4 w-4 ${colorScheme.icon} mt-0.5 flex-shrink-0`}
                                                                                                                            />
                                                                                                                            <div className="min-w-0 flex-1">
                                                                                                                                <p
                                                                                                                                    className={`font-bold ${colorScheme.text} truncate text-xs leading-tight`}
                                                                                                                                >
                                                                                                                                    {cell.matkul}
                                                                                                                                </p>
                                                                                                                                <div className="mt-0.5 flex items-center gap-1">
                                                                                                                                    <Badge
                                                                                                                                        variant="muted"
                                                                                                                                        className="truncate px-1.5 py-0.5 text-xs font-medium"
                                                                                                                                    >
                                                                                                                                        {cell.kelas}
                                                                                                                                    </Badge>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-0.5 text-xs">
                                                                                                                            <div className={`flex items-center gap-1 ${colorScheme.detailText}`}>
                                                                                                                                <User className="h-3 w-3 flex-shrink-0" />
                                                                                                                                <span className="flex-1 truncate font-medium">
                                                                                                                                    {cell.dosen}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                            <div className={`flex items-center gap-1 ${colorScheme.detailText}`}>
                                                                                                                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                                                                                <span className="flex-1 truncate font-medium">
                                                                                                                                    {cell.lab}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                            <div className={`flex items-center gap-1 ${colorScheme.detailText}`}>
                                                                                                                                <Clock className="h-3 w-3 flex-shrink-0" />
                                                                                                                                <span className="flex-1 font-medium">
                                                                                                                                    {cell.waktu_mulai.slice(0, 5)} -{' '}
                                                                                                                                    {cell.waktu_selesai.slice(0, 5)}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div
                                                                                                                            className={`mt-1.5 flex items-center justify-between border-t pt-1.5 ${colorScheme.border.replace('border-', 'border-opacity-20 border-')}`}
                                                                                                                        >
                                                                                                                            <div className="flex items-center gap-1">
                                                                                                                                <Badge
                                                                                                                                    variant="outline"
                                                                                                                                    className="px-1.5 py-0.5 text-xs font-medium border-[rgb(39,86,60)] dark:border-white"
                                                                                                                                >
                                                                                                                                    {cell.sks} SKS
                                                                                                                                </Badge>
                                                                                                                                {cell.is_swapped && (
                                                                                                                                    <div title="Jadwal Ditukar">
                                                                                                                                        <ArrowLeftRight className="h-3 w-3 text-purple-600" />
                                                                                                                                    </div>
                                                                                                                                )}
                                                                                                                            </div>

                                                                                                                            <div className="flex flex-wrap gap-1">
                                                                                                                                {cell.is_active &&
                                                                                                                                    !cell.is_past && (
                                                                                                                                        <Badge
                                                                                                                                            variant="default"
                                                                                                                                            className="px-1.5 py-0.5 text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-600"
                                                                                                                                        >
                                                                                                                                            Berlangsung
                                                                                                                                        </Badge>
                                                                                                                                    )}

                                                                                                                                {cell.is_past &&
                                                                                                                                    !cell.is_active && (
                                                                                                                                        <Badge
                                                                                                                                            variant="secondary"
                                                                                                                                            className="px-1.5 py-0.5 text-xs font-medium text-white"
                                                                                                                                        >
                                                                                                                                            Sudah Lewat
                                                                                                                                        </Badge>
                                                                                                                                    )}

                                                                                                                                {cell.status === 'booking' &&
                                                                                                                                    !cell.is_past &&
                                                                                                                                    !cell.is_active && (
                                                                                                                                        <Badge
                                                                                                                                            variant="default"
                                                                                                                                            className="px-1.5 py-0.5 text-xs font-medium bg-orange-500 text-white hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-600"
                                                                                                                                        >
                                                                                                                                            Booking
                                                                                                                                        </Badge>
                                                                                                                                    )}

                                                                                                                                {cell.status === 'terjadwal' &&
                                                                                                                                    !cell.is_past &&
                                                                                                                                    !cell.is_active && (
                                                                                                                                        <Badge
                                                                                                                                            variant="default"
                                                                                                                                            className="px-1.5 py-0.5 text-xs font-medium bg-blue-500 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-600"
                                                                                                                                        >
                                                                                                                                            Terjadwal
                                                                                                                                        </Badge>
                                                                                                                                    )}

                                                                                                                                {cell.status === 'tidak_masuk' &&
                                                                                                                                    !cell.is_past &&
                                                                                                                                    !cell.is_active && (
                                                                                                                                        <Badge
                                                                                                                                            variant="outline"
                                                                                                                                            className="px-1.5 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100">
                                                                                                                                            Tidak Masuk
                                                                                                                                        </Badge>
                                                                                                                                    )}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                );
                                                                                                            })}
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <div className="flex h-full items-center justify-center p-2">
                                                                                                            <span className="text-xs text-muted-foreground">
                                                                                                                -
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </td>
                                                                                            );
                                                                                        })}
                                                                                    </tr>
                                                                                );
                                                                            });
                                                                        })()}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Desktop View */}
                                                <div className="hidden md:block">
                                                    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                                        <table className="border-collapse text-sm min-w-full md:w-full md:table-fixed">
                                                            <thead>
                                                                <tr className="bg-muted/50">
                                                                    <th className="sticky left-0 z-20 w-24 md:w-32 border bg-muted p-2 font-semibold">
                                                                        Jam
                                                                    </th>
                                                                    {hari.map((h) => {
                                                                        const isTodayCell = isToday(h.tanggal);
                                                                        return (
                                                                            <th
                                                                                key={h.id}
                                                                                className={`border p-2 font-semibold min-w-[160px] md:min-w-0 ${isTodayCell
                                                                                    ? 'bg-primary/10 ring-2 ring-primary ring-inset'
                                                                                    : ''
                                                                                    }`}
                                                                            >
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span
                                                                                        className={
                                                                                            isTodayCell
                                                                                                ? 'text-primary font-bold'
                                                                                                : ''
                                                                                        }
                                                                                    >
                                                                                        {h.nama}
                                                                                    </span>
                                                                                    {h.tanggal && (
                                                                                        <span
                                                                                            className={`text-xs ${isTodayCell
                                                                                                ? 'text-primary font-semibold'
                                                                                                : 'text-muted-foreground'
                                                                                                }`}
                                                                                        >
                                                                                            {new Date(
                                                                                                h.tanggal
                                                                                            ).toLocaleDateString('id-ID', {
                                                                                                day: '2-digit',
                                                                                                month: 'short',
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
                                                                    const renderedCells: Record<number, Set<number>> = {};
                                                                    hari.forEach((h) => {
                                                                        renderedCells[h.id] = new Set<number>();
                                                                    });

                                                                    return slots.map((slot, slotIdx) => {
                                                                        const isBreakTime =
                                                                            slot.waktu_mulai === '11:45:00' &&
                                                                            slot.waktu_selesai === '13:15:00';

                                                                        return (
                                                                            <tr
                                                                                key={slot.id}
                                                                                className={isBreakTime ? 'h-16' : 'h-24'}
                                                                            >
                                                                                <td
                                                                                    className={`sticky left-0 z-10 border p-2 text-center font-mono text-xs font-semibold ${isBreakTime
                                                                                        ? 'bg-muted h-16'
                                                                                        : 'bg-background h-24'
                                                                                        }`}
                                                                                >
                                                                                    {slot.waktu_mulai.slice(0, 5)} -{' '}
                                                                                    {slot.waktu_selesai.slice(0, 5)}
                                                                                </td>
                                                                                {hari.map((h) => {
                                                                                    if (renderedCells[h.id].has(slot.id)) {
                                                                                        return null;
                                                                                    }

                                                                                    const cellsData =
                                                                                        jadwalKampus[selectedMinggu]?.[h.id]?.[
                                                                                        slot.id
                                                                                        ] || [];

                                                                                    let maxRowSpan = 1;
                                                                                    if (cellsData.length > 0) {
                                                                                        const firstCell = cellsData[0];
                                                                                        const startIdx = slots.findIndex(
                                                                                            (s) =>
                                                                                                s.waktu_mulai <=
                                                                                                firstCell.waktu_mulai &&
                                                                                                s.waktu_selesai >
                                                                                                firstCell.waktu_mulai
                                                                                        );
                                                                                        const endIdx = slots.findIndex(
                                                                                            (s) =>
                                                                                                s.waktu_mulai <
                                                                                                firstCell.waktu_selesai &&
                                                                                                s.waktu_selesai >=
                                                                                                firstCell.waktu_selesai
                                                                                        );
                                                                                        if (startIdx !== -1 && endIdx !== -1) {
                                                                                            maxRowSpan = endIdx - startIdx + 1;
                                                                                        } else {
                                                                                            maxRowSpan = firstCell.durasi_slot || 1;
                                                                                        }

                                                                                        for (let i = 0; i < maxRowSpan; i++) {
                                                                                            const spanSlotIdx = slotIdx + i;
                                                                                            if (spanSlotIdx < slots.length) {
                                                                                                const spanSlotId =
                                                                                                    slots[spanSlotIdx].id;
                                                                                                renderedCells[h.id].add(spanSlotId);
                                                                                            }
                                                                                        }
                                                                                    }

                                                                                    return (
                                                                                        <td
                                                                                            key={h.id}
                                                                                            className="h-full border p-0 align-middle relative"
                                                                                            rowSpan={maxRowSpan}
                                                                                            style={{
                                                                                                height: `${maxRowSpan * 6}rem`,
                                                                                            }}
                                                                                        >
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
                                                                                            {cellsData.length > 0 ? (
                                                                                                <div className="flex h-full flex-col divide-y">
                                                                                                    {cellsData.map((cell, idx) => {
                                                                                                        const colorScheme = getColorScheme(
                                                                                                            cell.dosen,
                                                                                                            idx
                                                                                                        );

                                                                                                        return (
                                                                                                            <div
                                                                                                                key={idx}
                                                                                                                className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} border-l-4 ${colorScheme.border} flex h-full flex-col justify-center p-2 ${colorScheme.hover} mx-0.5 my-0.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
                                                                                                            >
                                                                                                                <div className="mb-2 flex items-start gap-1.5">
                                                                                                                    <BookOpen
                                                                                                                        className={`h-4 w-4 ${colorScheme.icon} mt-0.5 flex-shrink-0`}
                                                                                                                    />
                                                                                                                    <div className="min-w-0 flex-1">
                                                                                                                        <p
                                                                                                                            className={`font-bold ${colorScheme.text} truncate text-xs leading-tight`}
                                                                                                                        >
                                                                                                                            {cell.matkul}
                                                                                                                        </p>
                                                                                                                        <div className="mt-0.5 flex items-center gap-1">
                                                                                                                            <Badge
                                                                                                                                variant="muted"
                                                                                                                                className="truncate px-1.5 py-0.5 text-xs font-medium"
                                                                                                                            >
                                                                                                                                {cell.kelas}
                                                                                                                            </Badge>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="space-y-0.5 text-xs">
                                                                                                                    <div className={`flex items-center gap-1 ${colorScheme.detailText}`}>
                                                                                                                        <User className="h-3 w-3 flex-shrink-0" />
                                                                                                                        <span className="flex-1 truncate font-medium">
                                                                                                                            {cell.dosen}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                    <div className={`flex items-center gap-1 ${colorScheme.detailText}`}>
                                                                                                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                                                                        <span className="flex-1 truncate font-medium">
                                                                                                                            {cell.lab}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                    <div className={`flex items-center gap-1 ${colorScheme.detailText}`}>
                                                                                                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                                                                                                        <span className="flex-1 font-medium">
                                                                                                                            {cell.waktu_mulai.slice(0, 5)} -{' '}
                                                                                                                            {cell.waktu_selesai.slice(0, 5)}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div
                                                                                                                    className={`mt-1.5 flex items-center justify-between border-t pt-1.5 ${colorScheme.border.replace('border-', 'border-opacity-20 border-')}`}
                                                                                                                >
                                                                                                                    <div className="flex items-center gap-1">
                                                                                                                        <Badge
                                                                                                                            variant="outline"
                                                                                                                            className="px-1.5 py-0.5 text-xs font-medium border-[rgb(39,86,60)] dark:border-white"
                                                                                                                        >
                                                                                                                            {cell.sks} SKS
                                                                                                                        </Badge>
                                                                                                                        {cell.is_swapped && (
                                                                                                                            <div title="Jadwal Ditukar">
                                                                                                                                <ArrowLeftRight className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                                                                                                            </div>
                                                                                                                        )}
                                                                                                                    </div>

                                                                                                                    <div className="flex flex-wrap gap-1">
                                                                                                                        {cell.is_active &&
                                                                                                                            !cell.is_past && (
                                                                                                                                <Badge
                                                                                                                                    variant="default"
                                                                                                                                    className="px-1.5 py-0.5 text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-600"
                                                                                                                                >
                                                                                                                                    Berlangsung
                                                                                                                                </Badge>
                                                                                                                            )}

                                                                                                                        {cell.is_past &&
                                                                                                                            !cell.is_active && (
                                                                                                                                <Badge
                                                                                                                                    variant="secondary"
                                                                                                                                    className="px-1.5 py-0.5 text-xs font-medium text-white"
                                                                                                                                >
                                                                                                                                    Sudah Lewat
                                                                                                                                </Badge>
                                                                                                                            )}

                                                                                                                        {cell.status === 'booking' &&
                                                                                                                            !cell.is_past &&
                                                                                                                            !cell.is_active && (
                                                                                                                                <Badge
                                                                                                                                    variant="default"
                                                                                                                                    className="px-1.5 py-0.5 text-xs font-medium bg-orange-500 text-white hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-600"
                                                                                                                                >
                                                                                                                                    Booking
                                                                                                                                </Badge>
                                                                                                                            )}

                                                                                                                        {cell.status === 'terjadwal' &&
                                                                                                                            !cell.is_past &&
                                                                                                                            !cell.is_active && (
                                                                                                                                <Badge
                                                                                                                                    variant="default"
                                                                                                                                    className="px-1.5 py-0.5 text-xs font-medium bg-blue-500 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-600"
                                                                                                                                >
                                                                                                                                    Terjadwal
                                                                                                                                </Badge>
                                                                                                                            )}

                                                                                                                        {cell.status === 'tidak_masuk' &&
                                                                                                                            !cell.is_past &&
                                                                                                                            !cell.is_active && (
                                                                                                                                <Badge
                                                                                                                                    variant="outline"
                                                                                                                                    className="px-1.5 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100"
                                                                                                                                >
                                                                                                                                    Tidak Masuk
                                                                                                                                </Badge>
                                                                                                                            )}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        );
                                                                                                    })}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="flex h-full items-center justify-center p-2">
                                                                                                    <span className="text-xs text-muted-foreground">
                                                                                                        -
                                                                                                    </span>
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                    );
                                                                                })}
                                                                            </tr>
                                                                        );
                                                                    });
                                                                })()}
                                                            </tbody>
                                                        </table>
                                                    </div>
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
                                            <SelectItem value="booking">Booking</SelectItem>
                                            <SelectItem value="tidak_masuk">Tidak Masuk</SelectItem>
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
                                                    <TableRow key={idx}>
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
                                                            {item.is_active && !item.is_past && (
                                                                <Badge className="bg-yellow-500 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-600 text-white">
                                                                    Berlangsung
                                                                </Badge>
                                                            )}
                                                            {item.is_past && !item.is_active && (
                                                                <Badge variant="secondary" className="text-white">Sudah Lewat</Badge>
                                                            )}
                                                            {!item.is_past && !item.is_active && (
                                                                <>
                                                                    {item.status === 'booking' && (
                                                                        <Badge className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-600 text-white">
                                                                            Booking
                                                                        </Badge>
                                                                    )}
                                                                    {item.status === 'terjadwal' && (
                                                                        <Badge className="bg-blue-500 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-600 text-white">
                                                                            Terjadwal
                                                                        </Badge>
                                                                    )}
                                                                    {item.status === 'tidak_masuk' && (
                                                                        <Badge variant="outline" className="text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100">
                                                                            Tidak Masuk
                                                                        </Badge>
                                                                    )}
                                                                </>
                                                            )}
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

                                {/* Summary */}
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <p>
                                        Menampilkan {filteredTableData.length} dari {tableData.length}{' '}
                                        jadwal
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </PublicLayout>
    );
}