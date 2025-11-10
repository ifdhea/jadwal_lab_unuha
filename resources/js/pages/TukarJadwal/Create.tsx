import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

interface JadwalItem {
    id: number;
    tanggal: string;
    hari: string;
    mata_kuliah: string;
    kelas: string;
    laboratorium: string;
    waktu_mulai: string;
    waktu_selesai: string;
    pertemuan_ke: number;
}

interface DosenItem {
    id: number;
    nama: string;
    nidn: string;
}

interface PageProps {
    jadwalDosen: JadwalItem[];
    dosenLain: DosenItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tukar Jadwal', href: '/tukar-jadwal' },
    { title: 'Ajukan Tukar Jadwal', href: '/tukar-jadwal/create' },
];

export default function Create({ jadwalDosen, dosenLain }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        sesi_jadwal_pemohon_id: '',
        mitra_id: '',
        sesi_jadwal_mitra_id: '',
        alasan_pemohon: '',
    });

    const [jadwalMitra, setJadwalMitra] = useState<JadwalItem[]>([]);
    const [loadingJadwalMitra, setLoadingJadwalMitra] = useState(false);
    const [selectedJadwalPemohon, setSelectedJadwalPemohon] = useState<JadwalItem | null>(null);

    const handleJadwalPemohonChange = (value: string) => {
        setData('sesi_jadwal_pemohon_id', value);
        const jadwal = jadwalDosen.find((j) => j.id.toString() === value);
        setSelectedJadwalPemohon(jadwal || null);

        // Reset jadwal mitra
        setData('sesi_jadwal_mitra_id', '');
        setJadwalMitra([]);
    };

    const handleMitraChange = async (value: string) => {
        setData('mitra_id', value);
        setData('sesi_jadwal_mitra_id', '');

        if (!selectedJadwalPemohon) return;

        setLoadingJadwalMitra(true);
        try {
            const response = await axios.get('/tukar-jadwal/jadwal-mitra', {
                params: {
                    mitra_id: value,
                    tanggal: selectedJadwalPemohon.tanggal,
                },
            });
            setJadwalMitra(response.data.jadwal || []);
        } catch (error) {
            console.error('Error fetching jadwal mitra:', error);
            setJadwalMitra([]);
        } finally {
            setLoadingJadwalMitra(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tukar-jadwal');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajukan Tukar Jadwal" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/tukar-jadwal">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ajukan Tukar Jadwal</h1>
                        <p className="text-muted-foreground">
                            Ajukan permintaan tukar jadwal dengan dosen lain
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pilih Jadwal yang Ingin Ditukar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Pilih Jadwal Anda yang Ingin Ditukar</CardTitle>
                            <CardDescription>
                                Pilih jadwal mengajar Anda yang ingin ditukar dengan dosen lain
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sesi_jadwal_pemohon_id">
                                    Jadwal Mengajar Anda <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.sesi_jadwal_pemohon_id}
                                    onValueChange={handleJadwalPemohonChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jadwal yang ingin ditukar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jadwalDosen.map((jadwal) => (
                                            <SelectItem key={jadwal.id} value={jadwal.id.toString()}>
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-medium">
                                                        {jadwal.mata_kuliah} - {jadwal.kelas}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {jadwal.hari}, {formatDate(jadwal.tanggal)} •{' '}
                                                        {jadwal.waktu_mulai} - {jadwal.waktu_selesai} •{' '}
                                                        {jadwal.laboratorium}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sesi_jadwal_pemohon_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.sesi_jadwal_pemohon_id}
                                    </p>
                                )}
                            </div>

                            {selectedJadwalPemohon && (
                                <Alert>
                                    <Calendar className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="space-y-1">
                                            <div className="font-medium">
                                                {selectedJadwalPemohon.mata_kuliah}
                                            </div>
                                            <div className="text-sm">
                                                {selectedJadwalPemohon.hari},{' '}
                                                {formatDate(selectedJadwalPemohon.tanggal)} •{' '}
                                                {selectedJadwalPemohon.waktu_mulai} -{' '}
                                                {selectedJadwalPemohon.waktu_selesai}
                                            </div>
                                            <div className="text-sm">
                                                {selectedJadwalPemohon.laboratorium} •{' '}
                                                Pertemuan ke-{selectedJadwalPemohon.pertemuan_ke}
                                            </div>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pilih Dosen Mitra */}
                    {selectedJadwalPemohon && (
                        <Card>
                            <CardHeader>
                                <CardTitle>2. Pilih Dosen Mitra (Opsional)</CardTitle>
                                <CardDescription>
                                    Anda bisa memilih dosen tertentu untuk tukar jadwal, atau biarkan
                                    kosong untuk permintaan umum
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mitra_id">Dosen Mitra</Label>
                                    <Select value={data.mitra_id} onValueChange={handleMitraChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih dosen mitra (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dosenLain.map((dosen) => (
                                                <SelectItem key={dosen.id} value={dosen.id.toString()}>
                                                    {dosen.nama} ({dosen.nidn})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mitra_id && (
                                        <p className="text-sm text-destructive">{errors.mitra_id}</p>
                                    )}
                                </div>

                                {data.mitra_id && (
                                    <div className="space-y-2">
                                        <Label htmlFor="sesi_jadwal_mitra_id">
                                            Jadwal Mitra di Tanggal yang Sama
                                        </Label>
                                        {loadingJadwalMitra ? (
                                            <div className="py-4 text-center text-sm text-muted-foreground">
                                                Memuat jadwal mitra...
                                            </div>
                                        ) : jadwalMitra.length > 0 ? (
                                            <>
                                                <Select
                                                    value={data.sesi_jadwal_mitra_id}
                                                    onValueChange={(value) =>
                                                        setData('sesi_jadwal_mitra_id', value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jadwal mitra (opsional)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {jadwalMitra.map((jadwal) => (
                                                            <SelectItem
                                                                key={jadwal.id}
                                                                value={jadwal.id.toString()}
                                                            >
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="font-medium">
                                                                        {jadwal.mata_kuliah} -{' '}
                                                                        {jadwal.kelas}
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {jadwal.waktu_mulai} -{' '}
                                                                        {jadwal.waktu_selesai} •{' '}
                                                                        {jadwal.laboratorium}
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.sesi_jadwal_mitra_id && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.sesi_jadwal_mitra_id}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    Dosen mitra tidak memiliki jadwal di tanggal yang
                                                    sama ({formatDate(selectedJadwalPemohon.tanggal)})
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Alasan */}
                    {selectedJadwalPemohon && (
                        <Card>
                            <CardHeader>
                                <CardTitle>3. Alasan Tukar Jadwal</CardTitle>
                                <CardDescription>
                                    Jelaskan alasan Anda mengajukan tukar jadwal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="alasan_pemohon">
                                        Alasan <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="alasan_pemohon"
                                        value={data.alasan_pemohon}
                                        onChange={(e) => setData('alasan_pemohon', e.target.value)}
                                        placeholder="Contoh: Ada keperluan mendadak yang tidak bisa ditunda..."
                                        rows={4}
                                    />
                                    {errors.alasan_pemohon && (
                                        <p className="text-sm text-destructive">
                                            {errors.alasan_pemohon}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href="/tukar-jadwal">
                            <Button type="button" variant="outline" disabled={processing}>
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing || !selectedJadwalPemohon}>
                            {processing ? 'Menyimpan...' : 'Ajukan Tukar Jadwal'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
