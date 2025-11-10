import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Building2,
    Calendar,
    Clock,
    GraduationCap,
    School,
    Users,
    BookOpen,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

interface Stats {
    total_kampus: number;
    total_laboratorium: number;
    total_program_studi: number;
    total_dosen: number;
    total_kelas: number;
    total_mata_kuliah: number;
}

interface JadwalStats {
    total_jadwal_master: number;
    jadwal_konflik: number;
    total_sesi_terjadwal: number;
}

interface LabUsage {
    kampus: string;
    total_lab: number;
    lab_terpakai: number;
}

interface JadwalHariIni {
    id: number;
    mata_kuliah: string;
    kelas: string;
    dosen: string;
    laboratorium: string;
    kampus: string;
    waktu_mulai: string;
    waktu_selesai: string;
    status: string;
    pertemuan_ke: number;
}

interface SemesterAktif {
    id: number;
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
}

interface TahunAjaranAktif {
    id: number;
    nama: string;
}

interface SuperAdminDashboardProps {
    stats: Stats;
    jadwalStats: JadwalStats;
    labUsage: LabUsage[];
    jadwalHariIni: JadwalHariIni[];
    semesterAktif: SemesterAktif | null;
    tahunAjaranAktif: TahunAjaranAktif | null;
}

export default function SuperAdminDashboard({
    stats,
    jadwalStats,
    labUsage,
    jadwalHariIni,
    semesterAktif,
    tahunAjaranAktif,
}: SuperAdminDashboardProps) {
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

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            {/* Header Info */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                {semesterAktif && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Semester: <strong>{semesterAktif.nama}</strong>
                        </span>
                        {tahunAjaranAktif && (
                            <>
                                <span>•</span>
                                <span>Tahun Ajaran: {tahunAjaranAktif.nama}</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Statistik Umum */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Kampus</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_kampus}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Laboratorium</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_laboratorium}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Program Studi</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_program_studi}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_dosen}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_kelas}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Mata Kuliah</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_mata_kuliah}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Statistik Jadwal */}
            {semesterAktif && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Jadwal Master</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{jadwalStats.total_jadwal_master}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jadwal Konflik</CardTitle>
                            <AlertCircle className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">
                                {jadwalStats.jadwal_konflik}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sesi Terjadwal</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{jadwalStats.total_sesi_terjadwal}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Penggunaan Lab */}
            {labUsage.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Penggunaan Laboratorium per Kampus</CardTitle>
                        <CardDescription>Ringkasan penggunaan lab di setiap kampus</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {labUsage.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{item.kampus}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">
                                            {item.lab_terpakai} / {item.total_lab} lab terpakai
                                        </span>
                                        <div className="h-2 w-32 rounded-full bg-secondary">
                                            <div
                                                className="h-2 rounded-full bg-primary"
                                                style={{
                                                    width: `${item.total_lab > 0 ? (item.lab_terpakai / item.total_lab) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Jadwal Hari Ini */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Jadwal Hari Ini
                    </CardTitle>
                    <CardDescription>
                        {jadwalHariIni.length > 0
                            ? `${jadwalHariIni.length} jadwal perkuliahan hari ini`
                            : 'Tidak ada jadwal hari ini'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {jadwalHariIni.length > 0 ? (
                        <div className="space-y-3">
                            {jadwalHariIni.map((jadwal) => (
                                <div
                                    key={jadwal.id}
                                    className="flex items-start justify-between rounded-lg border p-3 hover:bg-accent/50"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="font-medium">{jadwal.mata_kuliah}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {jadwal.kelas} • {jadwal.dosen}
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Tidak ada jadwal perkuliahan untuk hari ini.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
