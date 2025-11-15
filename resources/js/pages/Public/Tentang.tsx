import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Users,
    Target,
    Zap,
    BookOpen,
    Clock,
    Shield,
    ArrowRight,
} from 'lucide-react';

export default function Tentang() {
    return (
        <PublicLayout>
            <Head title="Tentang - Jadwal Lab" />

            <div className="container mx-auto space-y-16 px-4 py-12">
                {/* Hero Section */}
                <section className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center rounded-full border bg-primary/5 px-4 py-2 text-sm">
                        <BookOpen className="mr-2 h-4 w-4 text-primary" />
                        <span className="font-medium">Tentang Sistem</span>
                    </div>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                        Sistem Informasi Jadwal Laboratorium
                    </h1>
                    <p className="text-lg text-muted-foreground sm:text-xl">
                        Platform terpadu untuk mengelola dan memantau jadwal penggunaan
                        laboratorium di Universitas Nurul Huda secara efisien dan
                        transparan.
                    </p>
                </section>

                {/* Vision & Mission */}
                <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Target className="mb-2 h-10 w-10 text-primary" />
                            <CardTitle>Visi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Menjadi sistem informasi terdepan dalam pengelolaan jadwal
                                laboratorium yang mendukung proses pembelajaran dan
                                penelitian di Universitas Nurul Huda dengan teknologi modern
                                dan user-friendly.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Zap className="mb-2 h-10 w-10 text-primary" />
                            <CardTitle>Misi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Menyediakan akses informasi jadwal secara real-time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>
                                        Meningkatkan efisiensi penggunaan laboratorium
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>
                                        Memudahkan koordinasi antara dosen, mahasiswa, dan
                                        admin
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* About the System */}
                <section className="mx-auto max-w-4xl">
                    <div className="mb-8 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Tentang Sistem</h2>
                        <p className="text-muted-foreground">
                            Dirancang khusus untuk memenuhi kebutuhan pengelolaan jadwal
                            laboratorium di lingkungan kampus
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Apa itu Sistem Jadwal Lab?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    Sistem Informasi Jadwal Laboratorium adalah platform
                                    berbasis web yang dikembangkan khusus untuk Universitas
                                    Nurul Huda. Sistem ini dirancang untuk memudahkan
                                    pengelolaan, penjadwalan, dan pemantauan penggunaan
                                    laboratorium di seluruh kampus.
                                </p>
                                <p>
                                    Dengan antarmuka yang intuitif dan fitur-fitur yang
                                    komprehensif, sistem ini memungkinkan mahasiswa untuk
                                    melihat jadwal praktikum mereka, dosen untuk mengelola
                                    jadwal mengajar, dan administrator untuk mengkoordinasikan
                                    penggunaan laboratorium secara efektif.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Siapa yang Menggunakan?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <BookOpen className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold">Mahasiswa</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Melihat jadwal praktikum dan penggunaan
                                            laboratorium
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Users className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold">Dosen</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Mengelola jadwal mengajar dan booking
                                            laboratorium
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Shield className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold">Administrator</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Mengatur sistem dan mengkoordinasikan jadwal
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Key Features */}
                <section className="mx-auto max-w-5xl">
                    <div className="mb-8 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Fitur Utama</h2>
                        <p className="text-muted-foreground">
                            Berbagai fitur yang dirancang untuk kemudahan penggunaan
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Calendar className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">Jadwal Real-time</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Informasi jadwal yang selalu ter-update dengan tampilan
                                kalender mingguan yang mudah dipahami.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">Booking Lab</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Dosen dapat melakukan booking laboratorium untuk kegiatan
                                khusus dengan sistem persetujuan.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Zap className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">Tukar Jadwal</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Fitur untuk menukar jadwal mengajar antar dosen dengan
                                persetujuan pihak terkait.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Target className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">Multi Kampus</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Mendukung pengelolaan jadwal untuk beberapa kampus dalam
                                satu sistem terpadu.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">Role-Based Access</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Sistem hak akses berbasis peran untuk keamanan dan
                                privasi data.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BookOpen className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">Akses Publik</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Mahasiswa dan umum dapat melihat jadwal tanpa perlu login
                                ke sistem.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="mx-auto max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Teknologi yang Digunakan</CardTitle>
                            <CardDescription className="text-center">
                                Dibangun dengan teknologi modern dan terpercaya
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg border p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-primary">
                                        Laravel
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        PHP Framework
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-primary">
                                        React
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        JavaScript Library
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-primary">
                                        Inertia.js
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Modern Monolith
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-primary">
                                        Tailwind CSS
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        CSS Framework
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* CTA Section */}
                <section className="mx-auto max-w-4xl">
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                        <CardContent className="p-8 text-center">
                            <h2 className="mb-4 text-2xl font-bold">
                                Siap Menggunakan Sistem?
                            </h2>
                            <p className="mb-6 text-muted-foreground">
                                Akses jadwal laboratorium sekarang dan nikmati kemudahan
                                dalam mengelola waktu Anda
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Button asChild size="lg" className="gap-2">
                                    <Link href="/jadwal-lab">
                                        Lihat Jadwal
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/login">Login Sistem</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Contact Info */}
                <section className="mx-auto max-w-4xl border-t pt-12">
                    <div className="text-center">
                        <h3 className="mb-4 text-xl font-semibold">
                            Universitas Nurul Huda
                        </h3>
                        <div className="space-y-2 text-muted-foreground">
                            <p>OKU Timur, Sumatera Selatan</p>
                            <p>Email: info@unuha.ac.id</p>
                            <p className="text-sm">
                                © {new Date().getFullYear()} Universitas Nurul Huda. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
