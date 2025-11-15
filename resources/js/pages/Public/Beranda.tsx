import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

interface Props {
    activeSemester: {
        id: number;
        nama: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
    } | null;
    totalKampus: number;
}

export default function Beranda({ activeSemester, totalKampus }: Props) {
    return (
        <PublicLayout>
            <Head title="Beranda - Jadwal Lab" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto px-4 py-20 sm:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center rounded-full border bg-background px-4 py-2 text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-primary" />
                            <span className="font-medium">
                                {activeSemester
                                    ? `Semester Aktif: ${activeSemester.nama}`
                                    : 'Belum ada semester aktif'}
                            </span>
                        </div>

                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                            Sistem Jadwal Laboratorium
                        </h1>

                        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                            Universitas Nurul Huda
                        </p>

                        <p className="mb-10 text-base text-muted-foreground">
                            Platform terpadu untuk mengelola dan melihat jadwal penggunaan
                            laboratorium secara real-time. Akses mudah, informasi lengkap,
                            dan selalu ter-update.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button asChild size="lg" className="gap-2">
                                <Link href="/jadwal-lab">
                                    Lihat Jadwal
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/tentang">Pelajari Lebih Lanjut</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-b py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Fitur Unggulan
                        </h2>
                        <p className="text-muted-foreground">
                            Kemudahan akses dan transparansi informasi jadwal laboratorium
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Calendar className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Jadwal Real-time</CardTitle>
                                <CardDescription>
                                    Informasi jadwal yang selalu ter-update dan akurat
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Tampilan kalender mingguan</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Navigasi antar minggu</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Filter per kampus</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <MapPin className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Multi Kampus</CardTitle>
                                <CardDescription>
                                    Dukungan untuk {totalKampus} kampus
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Pemisahan jadwal per kampus</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Informasi laboratorium lengkap</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Pencarian cepat</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BookOpen className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Informasi Lengkap</CardTitle>
                                <CardDescription>
                                    Detail jadwal yang komprehensif
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Mata kuliah dan kelas</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Nama dosen pengampu</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Waktu dan lokasi</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Akses 24/7</CardTitle>
                                <CardDescription>
                                    Tersedia kapan saja, dimana saja
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Tidak perlu login untuk melihat</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Responsive di semua perangkat</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Interface yang user-friendly</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Users className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Untuk Semua</CardTitle>
                                <CardDescription>
                                    Mahasiswa, dosen, dan staf admin
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Mahasiswa cek jadwal</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Dosen kelola jadwal</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Admin monitor sistem</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CheckCircle className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Mudah Digunakan</CardTitle>
                                <CardDescription>
                                    Interface intuitif dan modern
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Tampilan kalender atau tabel</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Filter dan pencarian</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Mode gelap/terang</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                        <CardContent className="p-8 sm:p-12">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                    Mulai Lihat Jadwal Sekarang
                                </h2>
                                <p className="mb-8 text-muted-foreground">
                                    Akses jadwal laboratorium tanpa perlu login. Lihat jadwal
                                    terkini dari semua kampus dalam satu platform.
                                </p>
                                <Button asChild size="lg" className="gap-2">
                                    <Link href="/jadwal-lab">
                                        Buka Jadwal Lab
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
