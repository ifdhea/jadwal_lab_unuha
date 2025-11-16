import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Building2,
    Calendar,
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
    semesterAktif: SemesterAktif | null;
    tahunAjaranAktif: TahunAjaranAktif | null;
}

export default function SuperAdminDashboard({
    stats,
    jadwalStats,
    labUsage,
    semesterAktif,
    tahunAjaranAktif,
}: SuperAdminDashboardProps) {

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-background to-muted/20">
            {/* Header Info */}
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Dashboard Admin
                </h1>
                {semesterAktif && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                                Semester: <strong className="text-foreground">{semesterAktif.nama}</strong>
                            </span>
                        </div>
                        {tahunAjaranAktif && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full">
                                <span>Tahun Ajaran: <strong className="text-foreground">{tahunAjaranAktif.nama}</strong></span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Statistik Umum */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Kampus</CardTitle>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_kampus}</div>
                        <p className="text-xs text-muted-foreground mt-1">kampus aktif</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Laboratorium</CardTitle>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <School className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_laboratorium}</div>
                        <p className="text-xs text-muted-foreground mt-1">lab tersedia</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Program Studi</CardTitle>
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_program_studi}</div>
                        <p className="text-xs text-muted-foreground mt-1">program studi</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_dosen}</div>
                        <p className="text-xs text-muted-foreground mt-1">dosen aktif</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                            <School className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_kelas}</div>
                        <p className="text-xs text-muted-foreground mt-1">kelas tersedia</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Mata Kuliah</CardTitle>
                        <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                            <BookOpen className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_mata_kuliah}</div>
                        <p className="text-xs text-muted-foreground mt-1">mata kuliah</p>
                    </CardContent>
                </Card>
            </div>

            {/* Statistik Jadwal */}
            {semesterAktif && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Jadwal Master</CardTitle>
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{jadwalStats.total_jadwal_master}</div>
                            <p className="text-xs text-muted-foreground mt-1">jadwal master terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jadwal Konflik</CardTitle>
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-destructive">
                                {jadwalStats.jadwal_konflik}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">perlu diselesaikan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sesi Terjadwal</CardTitle>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{jadwalStats.total_sesi_terjadwal}</div>
                            <p className="text-xs text-muted-foreground mt-1">termasuk booking lab</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Penggunaan Lab */}
            {labUsage.length > 0 && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Penggunaan Laboratorium per Kampus
                        </CardTitle>
                        <CardDescription>Ringkasan penggunaan lab di setiap kampus</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {labUsage.map((item, index) => {
                                const percentage = item.total_lab > 0 ? (item.lab_terpakai / item.total_lab) * 100 : 0;
                                const colorClass = percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-blue-500';
                                
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Building2 className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-semibold text-base">{item.kampus}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-foreground">
                                                    {item.lab_terpakai} / {item.total_lab}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                    ({percentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full ${colorClass} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
