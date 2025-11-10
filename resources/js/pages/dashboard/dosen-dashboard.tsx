import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Clock,
    BookOpen,
    CheckCircle2,
    School,
    Building2,
    User,
} from 'lucide-react';

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
    jadwalMingguIni: JadwalItem[];
    jadwalBulanIni: JadwalItem[];
    semesterAktif: SemesterAktif | null;
    error?: string;
}

export default function DosenDashboard({
    dosen,
    stats,
    jadwalMingguIni,
    jadwalBulanIni,
    semesterAktif,
    error,
}: DosenDashboardProps) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            terjadwal: { variant: 'default', label: 'Terjadwal' },
            berlangsung: { variant: 'secondary', label: 'Berlangsung' },
            selesai: { variant: 'outline', label: 'Selesai' },
            dibatalkan: { variant: 'destructive', label: 'Dibatalkan' },
        };

        const config = variants[status] || variants.terjadwal;
        return (
            <Badge variant={config.variant} className="text-xs">
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
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

            {/* Jadwal Minggu Ini */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Jadwal Minggu Ini
                    </CardTitle>
                    <CardDescription>
                        {jadwalMingguIni.length > 0
                            ? `${jadwalMingguIni.length} pertemuan minggu ini`
                            : 'Tidak ada jadwal minggu ini'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {jadwalMingguIni.length > 0 ? (
                        <div className="space-y-3">
                            {jadwalMingguIni.map((jadwal) => (
                                <div
                                    key={jadwal.id}
                                    className="flex items-start justify-between rounded-lg border p-3 hover:bg-accent/50"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="font-medium">{jadwal.mata_kuliah}</div>
                                        <div className="text-sm text-muted-foreground">{jadwal.kelas}</div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(jadwal.tanggal)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Building2 className="h-3 w-3" />
                                            {jadwal.laboratorium} ({jadwal.kampus})
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-sm font-medium">
                                            {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                                        </span>
                                        {getStatusBadge(jadwal.status)}
                                        <span className="text-xs text-muted-foreground">
                                            Pertemuan {jadwal.pertemuan_ke}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Tidak ada jadwal untuk minggu ini.</p>
                    )}
                </CardContent>
            </Card>

            {/* Jadwal Bulan Ini */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Jadwal Bulan Ini
                    </CardTitle>
                    <CardDescription>
                        {jadwalBulanIni.length > 0
                            ? `${jadwalBulanIni.length} pertemuan bulan ini`
                            : 'Tidak ada jadwal bulan ini'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {jadwalBulanIni.length > 0 ? (
                        <div className="max-h-96 space-y-2 overflow-y-auto">
                            {jadwalBulanIni.map((jadwal) => (
                                <div
                                    key={jadwal.id}
                                    className="flex items-center justify-between rounded-lg border p-2 text-sm hover:bg-accent/50"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium">{jadwal.mata_kuliah}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {jadwal.tanggal} • {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                                        </span>
                                    </div>
                                    {getStatusBadge(jadwal.status)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Tidak ada jadwal untuk bulan ini.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
