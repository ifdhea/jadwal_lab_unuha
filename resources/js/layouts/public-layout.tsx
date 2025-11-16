import { Link, usePage } from '@inertiajs/react';
import { Menu, ChevronsUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

interface Props {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: Props) {
    const page = usePage();
    const auth = page.props.auth as any;
    const url = page.url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: 'Beranda', href: '/beranda' },
        { name: 'Jadwal Lab', href: '/jadwal-lab' },
        { name: 'Tentang', href: '/tentang' },
    ];

    const isActive = (href: string) => {
        if (!url) return false;
        if (url === href) return true;
        if (url.startsWith(href + '/')) return true;
        return false;
    };

    return (
        <div className="min-h-screen relative bg-background">
            {/* Global mesh gradient background - Sparse blobs only */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Top left blob */}
                <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px]" style={{ background: 'rgba(39, 86, 60, 0.15)', filter: 'blur(150px)', borderRadius: '50%' }} />
                {/* Top right blob */}
                <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px]" style={{ background: 'rgba(154, 239, 94, 0.12)', filter: 'blur(120px)', borderRadius: '50%' }} />
                {/* Bottom left blob */}
                <div className="absolute -bottom-[250px] -left-[250px] w-[550px] h-[550px]" style={{ background: 'rgba(154, 239, 94, 0.1)', filter: 'blur(130px)', borderRadius: '50%' }} />
                {/* Bottom right blob */}
                <div className="absolute -bottom-[200px] -right-[300px] w-[600px] h-[600px]" style={{ background: 'rgba(39, 86, 60, 0.12)', filter: 'blur(140px)', borderRadius: '50%' }} />
            </div>
            {/* Header */}
            <header 
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    scrolled 
                        ? 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm' 
                        : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/beranda" className="flex items-center gap-2.5">
                        <img
                            src="/logo_unuha.png"
                            alt="Logo UNUHA"
                            className="h-9 w-9 object-contain"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-base font-bold leading-tight">Jadwal Lab</h1>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                                Universitas Nurul Huda
                            </p>
                        </div>
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                        isActive(item.href)
                                            ? '!text-primary'
                                            : 'text-foreground/70 hover:!text-primary hover:!bg-primary/5'
                                    }`}
                                >
                                    {item.name}
                                    {isActive(item.href) && (
                                        <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 !bg-primary rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Dark Mode Toggle */}
                        <AppearanceToggleDropdown />

                        {/* User Menu or Login */}
                        {auth?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-9 gap-2 px-2 data-[state=open]:bg-accent"
                                    >
                                        <UserInfo user={auth.user} />
                                        <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <UserMenuContent user={auth.user} showDashboardLink={true} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/login">Masuk</Link>
                            </Button>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="border-t md:hidden">
                        <nav className="container mx-auto space-y-1 px-6 py-4 lg:px-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        isActive(item.href)
                                            ? '!bg-primary/10 !text-primary shadow-sm'
                                            : 'text-foreground/70 hover:!bg-primary/5 hover:!text-primary'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="relative border-t bg-gradient-to-b from-background to-muted/30">
                <div className="container mx-auto px-6 py-12 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* About */}
                        <div className="lg:col-span-2">
                            <div className="mb-4 flex items-center gap-2">
                                <img
                                    src="/logo_unuha.png"
                                    alt="Logo UNUHA"
                                    className="h-8 w-8 object-contain"
                                />
                                <div>
                                    <h3 className="font-bold">Jadwal Lab</h3>
                                    <p className="text-xs text-muted-foreground">Universitas Nurul Huda</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-md">
                                Sistem Informasi Jadwal Laboratorium yang memudahkan mahasiswa, dosen, 
                                dan staf dalam mengelola dan melihat jadwal penggunaan laboratorium secara real-time.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold">Tautan Cepat</h3>
                            <ul className="space-y-2.5">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold">Kontak</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>Universitas Nurul Huda</li>
                                <li>OKU Timur, Sumatera Selatan</li>
                                <li>info@unuha.ac.id</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 border-t pt-6">
                        <p className="text-center text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} UNUHA IT CENTER. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}