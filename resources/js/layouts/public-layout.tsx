import { Link, usePage } from '@inertiajs/react';
import { Menu, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
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
    const { auth, url } = usePage().props as any;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Beranda', href: '/beranda' },
        { name: 'Jadwal Lab', href: '/jadwal-lab' },
        { name: 'Tentang', href: '/tentang' },
    ];

    const isActive = (href: string) => {
        if (!url) return false;
        return url === href || url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link href="/beranda" className="flex items-center space-x-3">
                        <img
                            src="/logo_unuha.png"
                            alt="Logo UNUHA"
                            className="h-12 w-12 object-contain"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold leading-tight">Jadwal Lab</h1>
                            <p className="text-xs text-muted-foreground leading-tight">
                                Universitas Nurul Huda
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                                    isActive(item.href)
                                        ? 'text-primary bg-primary/10'
                                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                                }`}
                            >
                                {item.name}
                                {isActive(item.href) && (
                                    <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center space-x-2">
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
                                    <UserMenuContent user={auth.user} />
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
                        <nav className="container mx-auto space-y-1 px-4 py-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-primary'
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
            <footer className="border-t bg-muted/50">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* About */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Jadwal Lab</h3>
                            <p className="text-sm text-muted-foreground">
                                Sistem Informasi Jadwal Laboratorium Universitas Nurul
                                Huda. Memudahkan mahasiswa dan dosen dalam melihat
                                jadwal penggunaan laboratorium.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Tautan Cepat</h3>
                            <ul className="space-y-2 text-sm">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Kontak</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>Universitas Nurul Huda</li>
                                <li>OKU Timur, Sumatera Selatan</li>
                                <li>Email: info@unuha.ac.id</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                        <p>
                            &copy; {new Date().getFullYear()} Universitas Nurul Huda.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
