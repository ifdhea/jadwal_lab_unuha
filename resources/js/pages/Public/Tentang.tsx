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
    CheckCircle,
} from 'lucide-react';

export default function Tentang() {
    return (
        <PublicLayout>
            <Head title="Tentang - Jadwal Lab" />
            <div className="container mx-auto space-y-20 px-6 py-8 md:py-16 lg:px-8 relative">
            {/* Hero Section */}
            <section className="relative mx-auto max-w-4xl text-center space-y-6 pt-12 md:pt-24">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm shadow-sm" data-aos="fade-down">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="font-medium">Tentang Sistem</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" data-aos="fade-up" data-aos-delay="100">
                            Jadwal Laboratorium
                        </h1>
                        <p className="text-lg text-primary font-semibold sm:text-xl" data-aos="fade-up" data-aos-delay="200">
                            Universitas Nurul Huda
                        </p>
                        <p className="text-base text-foreground/70 sm:text-lg max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="300">
                            Platform terpadu untuk mengelola dan memantau jadwal penggunaan
                            laboratorium secara efisien, transparan, dan real-time.
                        </p>
                    </section>

                    {/* Vision & Mission */}
                    <section className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50" data-aos="fade-right" data-aos-delay="100">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Target className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Visi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/70 leading-relaxed">
                                    Menjadi sistem informasi terdepan dalam pengelolaan jadwal
                                    laboratorium yang mendukung proses pembelajaran dan
                                    penelitian dengan teknologi modern dan user-friendly.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50" data-aos="fade-left" data-aos-delay="200">
                            <CardHeader>
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Misi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-foreground/70">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>Menyediakan akses informasi jadwal real-time</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>Meningkatkan efisiensi penggunaan laboratorium</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>Memudahkan koordinasi semua pihak</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* About the System */}
                    <section className="relative mx-auto max-w-4xl space-y-8 py-12">
                        <div className="text-center space-y-3" data-aos="fade-up">
                            <h2 className="text-3xl font-bold sm:text-4xl">Tentang Sistem</h2>
                            <p className="text-foreground/70">
                                Dirancang khusus untuk memenuhi kebutuhan pengelolaan jadwal
                                laboratorium di lingkungan kampus
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card className="hover:shadow-lg transition-shadow duration-300 " data-aos="fade-up" data-aos-delay="100">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2.5">
                                        <Calendar className="h-6 w-6 text-primary" />
                                        Apa itu Jadwal Lab?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-foreground/70 leading-relaxed">
                                    <p>
                                        Sistem Informasi Jadwal Laboratorium adalah platform
                                        berbasis web yang dikembangkan khusus untuk Universitas
                                        Nurul Huda. Dirancang untuk memudahkan pengelolaan,
                                        penjadwalan, dan pemantauan penggunaan laboratorium di seluruh kampus.
                                    </p>
                                    <p>
                                        Dengan antarmuka yang intuitif dan fitur komprehensif,
                                        sistem ini memungkinkan mahasiswa melihat jadwal praktikum,
                                        dosen mengelola jadwal mengajar, dan administrator mengkoordinasikan
                                        penggunaan laboratorium secara efektif.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow duration-300 " data-aos="fade-up" data-aos-delay="200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2.5">
                                        <Users className="h-6 w-6 text-primary" />
                                        Siapa yang Menggunakan?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <div className="space-y-3 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                                <BookOpen className="h-7 w-7 text-primary" />
                                            </div>
                                            <h4 className="font-semibold text-lg">Mahasiswa</h4>
                                            <p className="text-sm text-foreground/70">
                                                Melihat jadwal praktikum dan penggunaan laboratorium
                                            </p>
                                        </div>
                                        <div className="space-y-3 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                                <Users className="h-7 w-7 text-primary" />
                                            </div>
                                            <h4 className="font-semibold text-lg">Dosen</h4>
                                            <p className="text-sm text-foreground/70">
                                                Mengelola jadwal mengajar dan booking laboratorium
                                            </p>
                                        </div>
                                        <div className="space-y-3 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                                <Shield className="h-7 w-7 text-primary" />
                                            </div>
                                            <h4 className="font-semibold text-lg">Administrator</h4>
                                            <p className="text-sm text-foreground/70">
                                                Mengatur sistem dan mengkoordinasikan jadwal
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Key Features */}
                    <section className="relative mx-auto max-w-5xl space-y-8 py-12">
                        <div className="text-center space-y-3" data-aos="fade-up">
                            <h2 className="text-3xl font-bold sm:text-4xl">Fitur Utama</h2>
                            <p className="text-foreground/70">
                                Berbagai fitur yang dirancang untuk kemudahan penggunaan
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Calendar,
                                    title: 'Jadwal Real-time',
                                    desc: 'Informasi jadwal yang selalu ter-update dengan tampilan kalender yang mudah dipahami.',
                                },
                                {
                                    icon: Clock,
                                    title: 'Booking Lab',
                                    desc: 'Dosen dapat melakukan booking laboratorium untuk kegiatan khusus dengan sistem persetujuan.',
                                },
                                {
                                    icon: Zap,
                                    title: 'Tukar Jadwal',
                                    desc: 'Fitur untuk menukar jadwal mengajar antar dosen dengan persetujuan pihak terkait.',
                                },
                                {
                                    icon: Target,
                                    title: 'Multi Kampus',
                                    desc: 'Mendukung pengelolaan jadwal untuk beberapa kampus dalam satu sistem terpadu.',
                                },
                                {
                                    icon: Shield,
                                    title: 'Role-Based Access',
                                    desc: 'Sistem hak akses berbasis peran untuk keamanan dan privasi data.',
                                },
                                {
                                    icon: BookOpen,
                                    title: 'Akses Publik',
                                    desc: 'Mahasiswa dan umum dapat melihat jadwal tanpa perlu login ke sistem.',
                                },
                            ].map((feature, idx) => (
                                <Card 
                                    key={idx} 
                                    className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 "
                                    data-aos="zoom-in"
                                    data-aos-delay={idx * 100}
                                >
                                    <CardHeader>
                                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-foreground/70">
                                        {feature.desc}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="relative mx-auto max-w-4xl py-12" data-aos="zoom-in">
                        {/* Local mesh enhancement */}
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#9AEF5E] opacity-35 rounded-full blur-[140px]" />
                        </div>

                        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background/50 backdrop-blur-sm p-10 sm:p-14 shadow-2xl shadow-primary/10">
                            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#9AEF5E]/25 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#27563C]/25 blur-3xl" />
                            <div className="relative text-center space-y-6">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-4 ring-primary/5 mb-2">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold sm:text-3xl">
                                    Siap Menggunakan Sistem?
                                </h2>
                                <p className="text-foreground/70 max-w-2xl mx-auto">
                                    Akses jadwal laboratorium sekarang dan nikmati kemudahan
                                    dalam mengelola waktu Anda
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
                                    <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25">
                                        <Link href="/jadwal-lab">
                                            Lihat Jadwal
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg">
                                        <Link href="/login">Login Sistem</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
        </PublicLayout>
    );
}
