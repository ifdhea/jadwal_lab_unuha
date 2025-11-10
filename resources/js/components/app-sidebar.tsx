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
    Book,
    BookCheck,
    BookOpen,
    BookUser,
    Building,
    Calendar,
    CalendarCheck,
    CalendarCog,
    CalendarDays,
    ClipboardList,
    Clock,
    Database,
    FlaskConical,
    Folder,
    LayoutGrid,
    Users,
    UserSquare,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const mainNavItems: NavItem[] = [
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
            ],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
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
