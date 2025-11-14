import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Clock,
    BookOpen,
    CheckCircle2,
    School,
    Building2,
    User,
    ArrowLeftRight,
} from 'lucide-react';
import { router } from '@inertiajs/react';

interface Stats {
    total_mata_kuliah: number;
    total_kelas: number;
    total_pertemuan: number;
    pertemuan_selesai: number;
}

interface JadwalItem {
    id: number;
    tanggal: string;
    hari: string;
    mata_kuliah: string;
    kelas: string;
    laboratorium: string;
    kampus: string;
    waktu_mulai: string;
    waktu_selesai: string;
    status: string;
    pertemuan_ke: number;
    is_my_schedule?: boolean;
    is_past?: boolean;
    is_active?: boolean;
    is_swapped?: boolean;
}

interface Dosen {
    id: number;
    nama: string;
    nidn: string;
    email: string;
    program_studi: string | null;
}

interface SemesterAktif {
    id: number;
    nama: string;
}

interface DosenDashboardProps {
    dosen: Dosen;
    stats: Stats;
    jadwalHariIni: JadwalItem[];
    jadwalMingguIni: JadwalItem[];
    jadwalBulanIni: JadwalItem[];
    semesterAktif: SemesterAktif | null;
    error?: string;
}

export default function DosenDashboard({
    dosen,
    stats,
    jadwalHariIni,
    jadwalMingguIni,
    jadwalBulanIni,
    semesterAktif,
    error,
}: DosenDashboardProps) {
    const getStatusBadge = (jadwal: JadwalItem) => {
        // Priority order untuk badge (sama seperti di jadwal utama)
        // 1. Berlangsung (highest priority)
        if (jadwal.is_active && !jadwal.is_past) {
            return <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-500">Berlangsung</Badge>;
        }
        
        // 2. Sudah Lewat
        if (jadwal.is_past && !jadwal.is_active) {
            return <Badge variant="secondary" className="px-1.5 py-0.5 text-xs font-medium">Sudah Lewat</Badge>;
        }
        
        // 3. Booking
        if (jadwal.status === 'booking' && !jadwal.is_past && !jadwal.is_active) {
            return <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-orange-500 hover:bg-orange-500">Booking</Badge>;
        }
        
        // 4. Jadwal Saya
        if (jadwal.is_my_schedule && !jadwal.is_past && !jadwal.is_active && jadwal.status !== 'booking' && jadwal.status === 'terjadwal') {
            return <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-green-600 hover:bg-green-600">Jadwal Saya</Badge>;
        }
        
        // 5. Terjadwal
        if (jadwal.status === 'terjadwal' && !jadwal.is_past && !jadwal.is_active && !jadwal.is_my_schedule) {
            return <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium bg-blue-500 hover:bg-blue-500">Terjadwal</Badge>;
        }
        
        // 6. Other statuses
        if (jadwal.status === 'selesai') {
            return <Badge variant="secondary" className="px-1.5 py-0.5 text-xs font-medium">Selesai</Badge>;
        }
        if (jadwal.status === 'tidak_masuk' && !jadwal.is_past && !jadwal.is_active) {
            return <Badge variant="outline" className="px-1.5 py-0.5 text-xs font-medium">Tidak Masuk</Badge>;
        }
        if (jadwal.status === 'dibatalkan') {
            return <Badge variant="destructive" className="px-1.5 py-0.5 text-xs font-medium">Dibatalkan</Badge>;
        }
        
        // Default
        return <Badge variant="default" className="px-1.5 py-0.5 text-xs font-medium">Terjadwal</Badge>;
    };

    if (error) {
        return (
            <div className="flex h-full flex-1 items-center justify-center p-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            {/* Header Info */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Dosen</h1>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                            <strong>{dosen.nama}</strong> ({dosen.nidn})
                        </span>
                    </div>
                    {dosen.program_studi && (
                        <div className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            <span>Program Studi: {dosen.program_studi}</span>
                        </div>
                    )}
                    {semesterAktif && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Semester: {semesterAktif.nama}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Statistik */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mata Kuliah</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_mata_kuliah}</div>
                        <p className="text-xs text-muted-foreground">mata kuliah diampu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kelas</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_kelas}</div>
                        <p className="text-xs text-muted-foreground">kelas diajar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pertemuan</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_pertemuan}</div>
                        <p className="text-xs text-muted-foreground">pertemuan semester ini</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pertemuan Selesai</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pertemuan_selesai}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total_pertemuan > 0
                                ? `${Math.round((stats.pertemuan_selesai / stats.total_pertemuan) * 100)}% selesai`
                                : '0% selesai'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Jadwal Hari Ini - PRIORITAS */}
            <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Jadwal Hari Ini
                    </CardTitle>
                    <CardDescription>
                        {jadwalHariIni.length > 0
                            ? `${jadwalHariIni.length} pertemuan hari ini`
                            : 'Tidak ada jadwal hari ini'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {jadwalHariIni.length > 0 ? (
                        <div className="space-y-3">
                            {jadwalHariIni.map((jadwal) => (
                                <div
                                    key={jadwal.id}
                                    className="flex items-start justify-between rounded-lg border-2 border-primary/20 bg-background p-4 hover:border-primary/40 hover:bg-accent/50"
                                >
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="text-lg font-semibold text-primary">
                                            {jadwal.mata_kuliah}
                                        </div>
                                        <div className="text-sm font-medium text-foreground">
                                            {jadwal.kelas}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Building2 className="h-4 w-4" />
                                            {jadwal.laboratorium} ({jadwal.kampus})
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            {jadwal.waktu_mulai.slice(0, 5)} - {jadwal.waktu_selesai.slice(0, 5)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex flex-wrap items-center gap-1 justify-end">
                                            {/* Icon Tukar */}
                                            {jadwal.is_swapped && (
                                                <div title="Jadwal Ditukar">
                                                    <ArrowLeftRight className="h-3 w-3 text-purple-600" />
                                                </div>
                                            )}
                                            {/* Badge dinamis */}
                                            {getStatusBadge(jadwal)}
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Pertemuan ke-{jadwal.pertemuan_ke}
                                        </span>
                                        {/* Tombol Tidak Hadir - hanya untuk jadwal saya yang terjadwal dan belum lewat */}
                                        {jadwal.is_my_schedule && !jadwal.is_past && jadwal.status === 'terjadwal' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-7 mt-1"
                                                onClick={() => {
                                                    if (confirm('Tandai jadwal ini sebagai "Tidak Masuk"?')) {
                                                        router.post(`/sesi-jadwal/${jadwal.id}/update-status`, {
                                                            status: 'tidak_masuk',
                                                            catatan: null,
                                                        });
                                                    }
                                                }}
                                            >
                                                Tidak Hadir
                                            </Button>
                                        )}
                                        {/* Tombol Reset Status - untuk yang sudah tidak masuk */}
                                        {jadwal.is_my_schedule && !jadwal.is_past && jadwal.status === 'tidak_masuk' && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="text-xs h-7 mt-1"
                                                onClick={() => {
                                                    if (confirm('Kembalikan status ke "Terjadwal"?')) {
                                                        router.post(`/sesi-jadwal/${jadwal.id}/reset-status`);
                                                    }
                                                }}
                                            >
                                                Reset Status
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-2 text-sm font-medium text-muted-foreground">
                                Tidak ada jadwal untuk hari ini.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Nikmati waktu luang Anda!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tabel Jadwal Utama - Menggantikan Jadwal Minggu & Bulan Ini */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Jadwal Lengkap Saya
                    </CardTitle>
                    <CardDescription>
                        Lihat semua jadwal Anda di halaman jadwal utama untuk fitur lengkap
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <Calendar className="h-16 w-16 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground text-center max-w-md">
                            Untuk melihat jadwal lengkap, melakukan tukar jadwal, atau menandai kehadiran, 
                            silakan kunjungi halaman Jadwal Utama.
                        </p>
                        <Button
                            onClick={() => router.visit('/jadwal')}
                            className="mt-2"
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Buka Jadwal Utama
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
