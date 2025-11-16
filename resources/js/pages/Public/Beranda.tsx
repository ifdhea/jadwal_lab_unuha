import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, CheckCircle, BookOpen, ArrowRight, Zap, Shield } from 'lucide-react';
import { useRef, useEffect } from 'react';

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
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, []);

    return (
        <PublicLayout>
            <Head title="Beranda - Jadwal Lab" />

            {/* Hero Section with SVG Background */}
            <section className="relative min-h-[90vh] overflow-hidden">
                {/* SVG MESH GRADIENT BACKGROUND */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero_bg_light.svg"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover dark:hidden"
                    />
                    <img
                        src="/hero_bg_dark.svg"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover hidden dark:block"
                    />
                </div>

                <div className="container relative z-10 mx-auto px-6 pt-24 pb-16 sm:pt-32 sm:pb-20 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-2 text-sm shadow-sm">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="font-medium">
                                        {activeSemester
                                            ? `${activeSemester.nama}`
                                            : 'Belum ada semester aktif'}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                                        Jadwal Laboratorium
                                    </h1>
                                    <p className="text-xl font-semibold text-primary sm:text-2xl">
                                        Universitas Nurul Huda
                                    </p>
                                    <p className="text-base text-foreground max-w-lg sm:text-lg">
                                        Platform modern untuk mengelola dan melihat jadwal laboratorium.
                                        Akses mudah, real-time, dan tersedia untuk semua.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25">
                                        <Link href="/jadwal-lab">
                                            Lihat Jadwal
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="backdrop-blur-sm bg-background/50">
                                        <Link href="/tentang">Pelajari Lebih Lanjut</Link>
                                    </Button>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{totalKampus}</p>
                                            <p className="text-xs text-foreground/70">Kampus</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">24/7</p>
                                            <p className="text-xs text-foreground/70">Akses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content - Image */}
                            <div className="relative">
                                <div className="relative overflow-hidden">
                                    <img
                                        src="/hero_image.svg"
                                        alt="Hero Image"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Clean White Background */}
            <section className="relative py-20 sm:py-28 bg-background">
                <div className="container relative mx-auto px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Fitur Unggulan
                        </h2>
                        <p className="text-foreground/70">
                            Kemudahan akses dan transparansi informasi untuk semua pengguna
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Jadwal Real-time</CardTitle>
                                <p className="text-sm text-foreground/60">
                                    Informasi jadwal yang selalu ter-update dan akurat
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5 text-sm text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Tampilan kalender mingguan</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Navigasi mudah antar minggu</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Filter cepat per kampus</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Multi Kampus</CardTitle>
                                <p className="text-sm text-foreground/60">
                                    Mendukung {totalKampus} kampus dalam satu platform
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5 text-sm text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Pemisahan jadwal per kampus</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Informasi lab lengkap</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Pencarian cepat</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Informasi Lengkap</CardTitle>
                                <p className="text-sm text-foreground/60">
                                    Detail jadwal yang komprehensif
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5 text-sm text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Mata kuliah dan kelas</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Nama dosen pengampu</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Waktu dan lokasi detail</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Akses 24/7</CardTitle>
                                <p className="text-sm text-foreground/60">
                                    Tersedia kapan saja, dimana saja
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5 text-sm text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Tanpa perlu login</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Responsive di semua device</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Interface user-friendly</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Users className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Untuk Semua</CardTitle>
                                <p className="text-sm text-foreground/60">
                                    Mahasiswa, dosen, dan staff
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5 text-sm text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Mahasiswa cek jadwal</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Dosen kelola jadwal</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Admin monitor sistem</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Modern & Cepat</CardTitle>
                                <p className="text-sm text-foreground/60">
                                    Teknologi terkini untuk performa optimal
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5 text-sm text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Loading super cepat</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Dark mode support</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span>Optimized performance</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 sm:py-28">
                <div className="container relative mx-auto px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-12 lg:p-16 shadow-2xl shadow-primary/10">
                        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#9AEF5E]/25 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#27563C]/25 blur-3xl" />

                        <div className="relative mx-auto max-w-3xl text-center">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/5">
                                <Calendar className="h-7 w-7 text-primary" />
                            </div>
                            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                Akses Jadwal Sekarang
                            </h2>
                            <p className="mb-8 text-base text-foreground/70 sm:text-lg max-w-2xl mx-auto">
                                Lihat jadwal laboratorium dari semua kampus dalam satu platform.
                                Gratis, mudah, dan tanpa perlu registrasi.
                            </p>
                            <Button asChild size="lg" className="gap-2 text-base h-12 px-8 shadow-lg shadow-primary/25">
                                <Link href="/jadwal-lab">
                                    Lihat Jadwal Lab
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}