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
    semesterAktif: SemesterAktif | null;
    error?: string;
}

export default function DosenDashboard({
    dosen,
    stats,
    jadwalHariIni,
    semesterAktif,
    error,
}: DosenDashboardProps) {
    const getStatusBadge = (jadwal: JadwalItem) => {
        const commonClass = "px-1.5 py-0.5 text-xs font-medium";

        if (jadwal.is_active && !jadwal.is_past) {
            return <Badge variant="warning" className={commonClass}>Berlangsung</Badge>;
        }
        if (jadwal.is_past && !jadwal.is_active) {
            return <Badge variant="secondary" className={commonClass}>Sudah Lewat</Badge>;
        }

        if (!jadwal.is_past && !jadwal.is_active) {
            switch (jadwal.status) {
                case 'booking':
                    return <Badge variant="booking" className={commonClass}>Booking</Badge>;
                case 'terjadwal':
                    if (jadwal.is_my_schedule) {
                        return <Badge variant="success" className={commonClass}>Jadwal Saya</Badge>;
                    }
                    return <Badge variant="info" className={commonClass}>Terjadwal</Badge>;
                case 'tidak_masuk':
                    return <Badge variant="outline" className={commonClass}>Tidak Masuk</Badge>;
                case 'dibatalkan':
                    return <Badge variant="destructive" className={commonClass}>Dibatalkan</Badge>;
            }
        }

        if (jadwal.status === 'selesai') {
            return <Badge variant="outline" className={commonClass}>Selesai</Badge>;
        }

        // Fallback for any other cases
        return <Badge variant="info" className={commonClass}>Terjadwal</Badge>;
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
        <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-background to-muted/20">
            {/* Header Info */}
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Dashboard Dosen
                </h1>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full w-fit">
                        <User className="h-4 w-4 text-primary" />
                        <span>
                            <strong className="text-foreground">{dosen.nama}</strong> ({dosen.nidn})
                        </span>
                    </div>
                    {dosen.program_studi && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full w-fit">
                            <School className="h-4 w-4" />
                            <span>Program Studi: <strong className="text-foreground">{dosen.program_studi}</strong></span>
                        </div>
                    )}
                    {semesterAktif && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full w-fit">
                            <Calendar className="h-4 w-4" />
                            <span>Semester: <strong className="text-foreground">{semesterAktif.nama}</strong></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Statistik */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mata Kuliah</CardTitle>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_mata_kuliah}</div>
                        <p className="text-xs text-muted-foreground mt-1">mata kuliah diampu</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kelas</CardTitle>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <School className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_kelas}</div>
                        <p className="text-xs text-muted-foreground mt-1">kelas diajar</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pertemuan</CardTitle>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_pertemuan}</div>
                        <p className="text-xs text-muted-foreground mt-1">termasuk booking lab</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pertemuan Selesai</CardTitle>
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.pertemuan_selesai}</div>
                        <p className="text-xs text-muted-foreground mt-1">
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
                                        {/* Tampilkan pertemuan_ke hanya jika bukan booking */}
                                        {jadwal.pertemuan_ke && (
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Pertemuan ke-{jadwal.pertemuan_ke}
                                            </span>
                                        )}
                                        {/* Tombol Tidak Hadir - hanya untuk jadwal saya yang terjadwal dan belum lewat dan bukan booking */}
                                        {jadwal.is_my_schedule && !jadwal.is_past && jadwal.status === 'terjadwal' && !jadwal.id.toString().startsWith('booking_') && (
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
                                        {/* Tombol Reset Status - untuk yang sudah tidak masuk dan bukan booking */}
                                        {jadwal.is_my_schedule && !jadwal.is_past && jadwal.status === 'tidak_masuk' && !jadwal.id.toString().startsWith('booking_') && (
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

            {/* Tabel Jadwal Utama - Embed Iframe */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Jadwal Lengkap Saya
                    </CardTitle>
                    <CardDescription>
                        Jadwal lengkap dengan fitur interaktif - scroll untuk melihat lebih banyak
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <iframe 
                        src="/jadwal?embed=1"
                        className="w-full border-0"
                        style={{ height: '800px', minHeight: '600px' }}
                        title="Jadwal Lengkap"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
