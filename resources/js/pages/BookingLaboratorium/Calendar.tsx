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
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    User,
    AlertCircle,
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

interface Booking {
    id: number;
    dosen: { id: number; nama: string };
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
    breadcrumbs,
}: Props) {
    const [activeKampus, setActiveKampus] = useState(
        kampusList[0]?.kode || 'B',
    );
    const [activeTab, setActiveTab] = useState('calendar');
    const [showBookingDialog, setShowBookingDialog] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{
        kampus_id: number;
        lab_id: number;
        lab_name: string;
        tanggal: string;
        slot_mulai_id: number;
        slot_selesai_id: number;
        waktu_mulai: string;
        waktu_selesai: string;
    } | null>(null);
    const [bookingForm, setBookingForm] = useState({
        keperluan: '',
        keterangan: '',
    });

    const isToday = (tanggal?: string) => {
        if (!tanggal) return false;
        const today = new Date().toISOString().split('T')[0];
        return tanggal === today;
    };

    const handleSemesterChange = (semesterId: string) => {
        router.get(
            '/booking-lab/calendar',
            { semester_id: semesterId, minggu: 1 },
            { preserveState: true },
        );
    };

    const handleMingguChange = (minggu: number) => {
        router.get(
            '/booking-lab/calendar',
            {
                semester_id: selectedSemesterId,
                minggu,
            },
            { preserveState: true },
        );
    };

    const handleCellClick = (
        kampus_id: number,
        lab_id: number,
        lab_name: string,
        tanggal: string,
        slot: Slot,
        cellsData: JadwalCell[],
    ) => {
        // Hanya bisa klik jika slot kosong atau status tidak_masuk
        const canBook =
            cellsData.length === 0 ||
            cellsData.every((c) => c.status === 'tidak_masuk');

        if (!canBook) return;

        setSelectedSlot({
            kampus_id,
            lab_id,
            lab_name,
            tanggal,
            slot_mulai_id: slot.id,
            slot_selesai_id: slot.id,
            waktu_mulai: slot.waktu_mulai,
            waktu_selesai: slot.waktu_selesai,
        });
        setBookingForm({ keperluan: '', keterangan: '' });
        setShowBookingDialog(true);
    };

    const handleSubmitBooking = () => {
        if (!selectedSlot || !bookingForm.keperluan.trim()) return;

        router.post('/booking-lab', {
            laboratorium_id: selectedSlot.lab_id,
            tanggal: selectedSlot.tanggal,
            slot_waktu_mulai_id: selectedSlot.slot_mulai_id,
            slot_waktu_selesai_id: selectedSlot.slot_selesai_id,
            keperluan: bookingForm.keperluan,
            keterangan: bookingForm.keterangan,
        }, {
            onSuccess: () => {
                setShowBookingDialog(false);
                setSelectedSlot(null);
                setBookingForm({ keperluan: '', keterangan: '' });
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            menunggu: { variant: 'default', label: 'Menunggu' },
            disetujui: { variant: 'outline', label: 'Disetujui' },
            ditolak: { variant: 'destructive', label: 'Ditolak' },
            selesai: { variant: 'secondary', label: 'Selesai' },
            dibatalkan: { variant: 'secondary', label: 'Dibatalkan' },
        };
        const config = variants[status] || variants.menunggu;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const currentMinggu = mingguList.find((m) => m.nomor === selectedMinggu);
    const currentKampus = kampusList.find((k) => k.kode === activeKampus);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Lab - Kalender" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Booking Laboratorium</h1>
                        <p className="text-muted-foreground">
                            Klik slot kosong untuk booking laboratorium
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
                                ).toLocaleDateString('id-ID')}{' '}
                                -{' '}
                                {new Date(
                                    currentMinggu.tanggal_selesai,
                                ).toLocaleDateString('id-ID')}
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

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="calendar">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Kalender
                        </TabsTrigger>
                        <TabsTrigger value="requests">
                            Request Booking
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="calendar" className="space-y-4">
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
                                                    Kalender Booking - Kampus{' '}
                                                    {kampus.nama}
                                                </CardTitle>
                                                <div className="flex gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 border-2 border-green-500 bg-green-50"></div>
                                                        <span>Kosong (Bisa booking)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 border-2 border-orange-500 bg-orange-50"></div>
                                                        <span>Tidak Masuk (Bisa booking)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 border-2 border-blue-500 bg-blue-50"></div>
                                                        <span>Terjadwal (Tidak bisa)</span>
                                                    </div>
                                                </div>
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
                                                            {slots.map((slot, slotIdx) => {
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
                                                                                const cellsData =
                                                                                    jadwalKampus[selectedMinggu]?.[h.id]?.[slot.id] || [];
                                                                                
                                                                                const isEmpty = cellsData.length === 0;
                                                                                const isTidakMasuk = cellsData.some(c => c.status === 'tidak_masuk');
                                                                                const canBook = isEmpty || isTidakMasuk;

                                                                                return (
                                                                                    <td
                                                                                        key={h.id}
                                                                                        className={`h-24 border p-1 align-middle ${
                                                                                            canBook
                                                                                                ? 'cursor-pointer hover:bg-accent/50'
                                                                                                : ''
                                                                                        }`}
                                                                                        onClick={() => {
                                                                                            if (canBook && h.tanggal) {
                                                                                                // Ambil lab_id dari cellsData jika ada, atau default ke lab pertama kampus
                                                                                                const labId = cellsData[0]?.laboratorium_id || 1;
                                                                                                const labName = cellsData[0]?.lab || 'Lab';
                                                                                                handleCellClick(
                                                                                                    kampus.id,
                                                                                                    labId,
                                                                                                    labName,
                                                                                                    h.tanggal,
                                                                                                    slot,
                                                                                                    cellsData,
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {isEmpty ? (
                                                                                            <div className="flex h-24 items-center justify-center rounded border-2 border-dashed border-green-500 bg-green-50/30">
                                                                                                <span className="text-xs text-green-700 font-medium">
                                                                                                    Kosong
                                                                                                </span>
                                                                                            </div>
                                                                                        ) : isTidakMasuk ? (
                                                                                            <div className="flex h-24 flex-col justify-center gap-1 rounded border-2 border-orange-500 bg-orange-50/30 p-2">
                                                                                                <AlertCircle className="h-4 w-4 text-orange-600 mx-auto" />
                                                                                                <span className="text-xs text-orange-700 font-medium text-center">
                                                                                                    Tidak Masuk
                                                                                                </span>
                                                                                                <span className="text-xs text-orange-600 text-center">
                                                                                                    {cellsData[0]?.dosen}
                                                                                                </span>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="flex h-24 flex-col justify-center gap-1 rounded border-2 border-blue-500 bg-blue-50/30 p-2">
                                                                                                <BookOpen className="h-4 w-4 text-blue-600 mx-auto" />
                                                                                                <span className="text-xs text-blue-900 font-semibold text-center truncate">
                                                                                                    {cellsData[0]?.matkul}
                                                                                                </span>
                                                                                                <span className="text-xs text-blue-700 text-center truncate">
                                                                                                    {cellsData[0]?.dosen}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                    </td>
                                                                                );
                                                                            })
                                                                        )}
                                                                    </tr>
                                                                );
                                                            })}
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

                    <TabsContent value="requests" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Booking Saya</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {myBookings.length > 0 ? (
                                    <div className="space-y-3">
                                        {myBookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(booking.status)}
                                                            <span className="text-sm text-muted-foreground">
                                                                {new Date(booking.tanggal).toLocaleDateString('id-ID')}
                                                            </span>
                                                        </div>
                                                        <div className="grid gap-2 md:grid-cols-2">
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
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Belum ada request booking
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
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
                                    <span className="font-medium">Lab: </span>
                                    {selectedSlot.lab_name}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Tanggal: </span>
                                    {new Date(selectedSlot.tanggal).toLocaleDateString('id-ID')}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Waktu: </span>
                                    {selectedSlot.waktu_mulai.slice(0, 5)} - {selectedSlot.waktu_selesai.slice(0, 5)}
                                </div>
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
                            disabled={!bookingForm.keperluan.trim()}
                        >
                            Ajukan Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
