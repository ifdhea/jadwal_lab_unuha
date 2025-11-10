import { useState, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, CheckCircle2, Building2, Calendar, Clock } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

interface Lab {
    id: number;
    nama: string;
    kode: string;
    kampus: string;
    kapasitas: number;
}

interface SlotWaktu {
    id: number;
    label: string;
    waktu_mulai: string;
    waktu_selesai: string;
}

interface PageProps {
    laboratoriums: Lab[];
    slotWaktu: SlotWaktu[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Booking Lab', href: '/booking-lab' },
    { title: 'Booking Baru', href: '/booking-lab/create' },
];

export default function Create({ laboratoriums, slotWaktu }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        laboratorium_id: '',
        tanggal: '',
        slot_waktu_mulai_id: '',
        slot_waktu_selesai_id: '',
        durasi_slot: 1,
        keperluan: '',
        keterangan: '',
    });

    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<{
        available: boolean;
        message: string;
    } | null>(null);

    const calculateDurasiSlot = () => {
        if (!data.slot_waktu_mulai_id || !data.slot_waktu_selesai_id) return;

        const slotMulai = slotWaktu.find((s) => s.id.toString() === data.slot_waktu_mulai_id);
        const slotSelesai = slotWaktu.find((s) => s.id.toString() === data.slot_waktu_selesai_id);

        if (slotMulai && slotSelesai) {
            const indexMulai = slotWaktu.indexOf(slotMulai);
            const indexSelesai = slotWaktu.indexOf(slotSelesai);
            const durasi = indexSelesai - indexMulai + 1;
            setData('durasi_slot', durasi);
        }
    };

    useEffect(() => {
        calculateDurasiSlot();
    }, [data.slot_waktu_mulai_id, data.slot_waktu_selesai_id]);

    const checkAvailability = async () => {
        if (
            !data.laboratorium_id ||
            !data.tanggal ||
            !data.slot_waktu_mulai_id ||
            data.durasi_slot < 1
        ) {
            setAvailabilityStatus({
                available: false,
                message: 'Mohon lengkapi data laboratorium, tanggal, dan waktu terlebih dahulu',
            });
            return;
        }

        setCheckingAvailability(true);
        setAvailabilityStatus(null);

        try {
            const response = await axios.post('/booking-lab/check-availability', {
                laboratorium_id: data.laboratorium_id,
                tanggal: data.tanggal,
                slot_waktu_mulai_id: data.slot_waktu_mulai_id,
                durasi_slot: data.durasi_slot,
            });

            setAvailabilityStatus({
                available: response.data.available,
                message: response.data.message,
            });

            if (response.data.available && response.data.slot_waktu_selesai_id) {
                setData('slot_waktu_selesai_id', response.data.slot_waktu_selesai_id.toString());
            }
        } catch (error: any) {
            setAvailabilityStatus({
                available: false,
                message:
                    error.response?.data?.message || 'Terjadi kesalahan saat mengecek ketersediaan',
            });
        } finally {
            setCheckingAvailability(false);
        }
    };

    useEffect(() => {
        if (
            data.laboratorium_id &&
            data.tanggal &&
            data.slot_waktu_mulai_id &&
            data.durasi_slot > 0
        ) {
            checkAvailability();
        }
    }, [data.laboratorium_id, data.tanggal, data.slot_waktu_mulai_id, data.durasi_slot]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/booking-lab');
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const selectedLab = laboratoriums.find((l) => l.id.toString() === data.laboratorium_id);
    const slotMulai = slotWaktu.find((s) => s.id.toString() === data.slot_waktu_mulai_id);
    const slotSelesai = slotWaktu.find((s) => s.id.toString() === data.slot_waktu_selesai_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Lab Baru" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/booking-lab">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Booking Laboratorium</h1>
                        <p className="text-muted-foreground">
                            Ajukan booking laboratorium untuk kegiatan di luar jadwal kuliah
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pilih Lab dan Waktu */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Pilih Laboratorium dan Waktu</CardTitle>
                            <CardDescription>
                                Pilih laboratorium yang ingin dibooking beserta tanggal dan waktunya
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Laboratorium */}
                            <div className="space-y-2">
                                <Label htmlFor="laboratorium_id">
                                    Laboratorium <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.laboratorium_id}
                                    onValueChange={(value) => setData('laboratorium_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih laboratorium" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {laboratoriums.map((lab) => (
                                            <SelectItem key={lab.id} value={lab.id.toString()}>
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-medium">
                                                        {lab.nama} ({lab.kode})
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {lab.kampus} • Kapasitas: {lab.kapasitas}{' '}
                                                        orang
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.laboratorium_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.laboratorium_id}
                                    </p>
                                )}
                            </div>

                            {/* Tanggal */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal">
                                    Tanggal <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                />
                                {errors.tanggal && (
                                    <p className="text-sm text-destructive">{errors.tanggal}</p>
                                )}
                                {data.tanggal && (
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(data.tanggal)}
                                    </p>
                                )}
                            </div>

                            {/* Waktu Mulai */}
                            <div className="space-y-2">
                                <Label htmlFor="slot_waktu_mulai_id">
                                    Waktu Mulai <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.slot_waktu_mulai_id}
                                    onValueChange={(value) => setData('slot_waktu_mulai_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih waktu mulai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {slotWaktu.map((slot) => (
                                            <SelectItem key={slot.id} value={slot.id.toString()}>
                                                {slot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.slot_waktu_mulai_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.slot_waktu_mulai_id}
                                    </p>
                                )}
                            </div>

                            {/* Durasi */}
                            <div className="space-y-2">
                                <Label htmlFor="durasi_slot">
                                    Durasi (Slot) <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.durasi_slot.toString()}
                                    onValueChange={(value) => setData('durasi_slot', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                                {num} slot ({num * 45} menit)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.durasi_slot && (
                                    <p className="text-sm text-destructive">{errors.durasi_slot}</p>
                                )}
                            </div>

                            {/* Status Ketersediaan */}
                            {checkingAvailability && (
                                <Alert>
                                    <Clock className="h-4 w-4 animate-spin" />
                                    <AlertDescription>Mengecek ketersediaan...</AlertDescription>
                                </Alert>
                            )}

                            {availabilityStatus && !checkingAvailability && (
                                <Alert
                                    variant={availabilityStatus.available ? 'default' : 'destructive'}
                                >
                                    {availabilityStatus.available ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                    <AlertDescription>{availabilityStatus.message}</AlertDescription>
                                </Alert>
                            )}

                            {/* Summary */}
                            {selectedLab && slotMulai && slotSelesai && data.tanggal && (
                                <Alert>
                                    <Building2 className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="space-y-1">
                                            <div className="font-medium">{selectedLab.nama}</div>
                                            <div className="text-sm">
                                                {formatDate(data.tanggal)} •{' '}
                                                {slotMulai.waktu_mulai} - {slotSelesai.waktu_selesai}
                                            </div>
                                            <div className="text-sm">
                                                Durasi: {data.durasi_slot} slot (
                                                {data.durasi_slot * 45} menit)
                                            </div>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Keperluan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Detail Keperluan</CardTitle>
                            <CardDescription>
                                Jelaskan keperluan Anda menggunakan laboratorium
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="keperluan">
                                    Keperluan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="keperluan"
                                    value={data.keperluan}
                                    onChange={(e) => setData('keperluan', e.target.value)}
                                    placeholder="Contoh: Rapat Tim Penelitian, Workshop, dll"
                                    maxLength={200}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {data.keperluan.length}/200 karakter
                                </p>
                                {errors.keperluan && (
                                    <p className="text-sm text-destructive">{errors.keperluan}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan Tambahan (Opsional)</Label>
                                <Textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    placeholder="Tambahkan keterangan tambahan jika diperlukan..."
                                    rows={4}
                                />
                                {errors.keterangan && (
                                    <p className="text-sm text-destructive">{errors.keterangan}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href="/booking-lab">
                            <Button type="button" variant="outline" disabled={processing}>
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                !availabilityStatus?.available ||
                                checkingAvailability
                            }
                        >
                            {processing ? 'Menyimpan...' : 'Ajukan Booking'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
