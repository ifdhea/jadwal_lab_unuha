import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Book,
    BookCheck,
    BookOpen,
    BookUser,
    Building,
    Building2,
    Calendar,
    CalendarCheck,
    CalendarCog,
    CalendarDays,
    ClipboardList,
    Clock,
    Database,
    FlaskConical,
    Home,
    LayoutGrid,
    User,
    Users,
    UserSquare,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { peran: string } } }>().props;
    const userRole = auth.user.peran;

    // Menu untuk Super Admin & Admin
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Penjadwalan',
            icon: CalendarCog,
            items: [
                {
                    title: 'Jadwal Master',
                    href: '/jadwal-master',
                    icon: ClipboardList,
                },
                {
                    title: 'Jadwal Final',
                    href: '/jadwal',
                    icon: CalendarCheck,
                },
            ],
        },
        {
            title: 'Booking Lab',
            href: '/admin/booking-lab',
            icon: Building2,
        },
        {
            title: 'Master Data',
            icon: Database,
            items: [
                {
                    title: 'Tahun Ajaran',
                    href: '/tahun-ajaran',
                    icon: Calendar,
                },
                {
                    title: 'Semester',
                    href: '/semester',
                    icon: CalendarDays,
                },
                {
                    title: 'Kampus',
                    href: '/kampus',
                    icon: Building,
                },
                {
                    title: 'Laboratorium',
                    href: '/laboratorium',
                    icon: FlaskConical,
                },
                {
                    title: 'Program Studi',
                    href: '/program-studi',
                    icon: BookUser,
                },
                {
                    title: 'Kelas',
                    href: '/kelas',
                    icon: Users,
                },
                {
                    title: 'Mata Kuliah',
                    href: '/mata-kuliah',
                    icon: Book,
                },
                {
                    title: 'Kelas & MK',
                    href: '/kelas-matkul',
                    icon: BookCheck,
                },
                {
                    title: 'Slot Waktu',
                    href: '/slot-waktu',
                    icon: Clock,
                },
                {
                    title: 'Dosen',
                    href: '/dosen',
                    icon: UserSquare,
                },
                {
                    title: 'User',
                    href: '/users',
                    icon: User,
                },
            ],
        },
    ];

    // Menu untuk Dosen
    const dosenNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Jadwal',
            href: '/jadwal',
            icon: CalendarCheck,
        },
        {
            title: 'Tukar Jadwal',
            href: '/tukar-jadwal',
            icon: ArrowLeftRight,
        },
        {
            title: 'Booking Lab',
            href: '/booking-lab',
            icon: Building2,
        },
    ];

    // Pilih menu berdasarkan role
    const mainNavItems = userRole === 'dosen' ? dosenNavItems : adminNavItems;

    const footerNavItems: NavItem[] = [
        {
            title: 'Beranda',
            href: '/',
            icon: Home,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
