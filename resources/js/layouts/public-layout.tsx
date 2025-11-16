import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, Home, Calendar, Info, LogIn, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import AppearanceToggleSimple from '@/components/appearance-toggle-simple';
import { Spin as Hamburger } from 'hamburger-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
        
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
        });
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: 'Beranda', href: '/beranda', icon: Home },
        { name: 'Jadwal Lab', href: '/jadwal-lab', icon: Calendar },
        { name: 'Tentang', href: '/tentang', icon: Info },
    ];

    const isActive = (href: string) => {
        if (!url) return false;
        if (url === href) return true;
        if (url.startsWith(href + '/')) return true;
        return false;
    };

    return (
        <div className="min-h-screen relative bg-background">
            {/* Header */}
            <header 
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    scrolled 
                        ? 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm' 
                        : 'md:bg-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:backdrop-blur-none border-b md:border-b-0'
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
                                            ? 'text-primary'
                                            : 'text-foreground/70 hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-foreground dark:hover:text-primary'
                                    }`}
                                >
                                    {item.name}
                                    {isActive(item.href) && (
                                        <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-primary rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Dark Mode Toggle - Keep visible on all screens */}
                        <AppearanceToggleSimple />

                        {/* User Menu or Login - Desktop Only */}
                        <div className="hidden md:block">
                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-9 gap-2 px-2 hover:bg-gray-100 dark:hover:bg-primary/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-primary/10"
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
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Hamburger
                                toggled={mobileMenuOpen}
                                toggle={setMobileMenuOpen}
                                size={24}
                                direction="left"
                                duration={0.4}
                                distance="md"
                                rounded
                                label="Menu"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="border-t md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <nav className="container mx-auto space-y-1 px-6 py-4 lg:px-8">
                            {/* Navigation Links */}
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                            isActive(item.href)
                                                ? 'text-primary font-semibold'
                                                : 'text-foreground/70 hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-foreground dark:hover:text-primary'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            
                            {/* User Menu or Login Button */}
                            {auth?.user ? (
                                <>
                                    <div className="border-t my-3" />
                                    <div className="px-3 py-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <UserInfo user={auth.user} showEmail={true} />
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-foreground dark:hover:text-primary transition-all duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/profile/edit"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-foreground dark:hover:text-primary transition-all duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                    <div className="border-t my-3" />
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="border-t my-3" />
                                    <Button asChild size="sm" className="w-full gap-2">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <LogIn className="h-4 w-4" />
                                            Masuk
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="relative border-t bg-background">
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