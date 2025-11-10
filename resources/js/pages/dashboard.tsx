import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import SuperAdminDashboard from './dashboard/super-admin-dashboard';
import DosenDashboard from './dashboard/dosen-dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    userRole?: string;
    [key: string]: any;
}

export default function Dashboard(props: DashboardProps) {
    const { userRole } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {userRole === 'super_admin' || userRole === 'admin' ? (
                <SuperAdminDashboard {...props} />
            ) : userRole === 'dosen' ? (
                <DosenDashboard {...props} />
            ) : (
                <div className="p-6">
                    <p>Dashboard tidak tersedia untuk role Anda.</p>
                </div>
            )}
        </AppLayout>
    );
}
