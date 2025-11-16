import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Check, CheckCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    data: any;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

interface NotificationsIndexProps {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    unreadCount: number;
}

export default function NotificationsIndex({
    notifications,
    unreadCount,
}: NotificationsIndexProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            jadwal_hari_ini: '📅',
            tukar_jadwal_request: '🔄',
            tukar_jadwal_approved: '✅',
            tukar_jadwal_rejected: '❌',
            booking_request: '📝',
            booking_approved: '✅',
            booking_rejected: '❌',
            pindah_jadwal: '📌',
        };
        return icons[type] || '📬';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const markAsRead = (id: number) => {
        router.post(
            `/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['notifications', 'unreadCount'],
            }
        );
    };

    const markAllAsRead = () => {
        router.post(
            '/notifications/read-all',
            {},
            {
                preserveScroll: true,
                only: ['notifications', 'unreadCount'],
            }
        );
    };

    const deleteNotification = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
            router.delete(`/notifications/${id}`, { preserveScroll: true });
        }
    };

    const deleteAll = () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
            router.delete('/notifications');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        if (notification.data?.link) {
            router.visit(notification.data.link);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Notifikasi', href: '/notifications' },
            ]}
        >
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notifikasi</h1>
                        <p className="text-muted-foreground">
                            Kelola notifikasi Anda
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                            >
                                <CheckCheck className="mr-2 h-4 w-4" />
                                Tandai Semua Dibaca
                            </Button>
                        )}
                        {notifications.data.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={deleteAll}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Semua
                            </Button>
                        )}
                    </div>
                </div>

                {unreadCount > 0 && (
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Anda memiliki {unreadCount} notifikasi yang belum
                            dibaca
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="mb-4 text-6xl opacity-50">
                                    📬
                                </div>
                                <p className="text-lg font-medium">
                                    Tidak ada notifikasi
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Anda akan melihat notifikasi di sini ketika
                                    ada aktivitas
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        notifications.data.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`transition-colors hover:bg-muted/50 ${
                                    !notification.is_read
                                        ? 'border-l-4 border-l-blue-500 bg-muted/30'
                                        : ''
                                }`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="text-3xl">
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-base">
                                                        {notification.title}
                                                    </CardTitle>
                                                    {!notification.is_read && (
                                                        <Badge variant="default">
                                                            Baru
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardDescription className="mt-1">
                                                    {notification.message}
                                                </CardDescription>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    {formatDate(
                                                        notification.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                    title="Tandai dibaca"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id
                                                    )
                                                }
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                {notification.data?.link && (
                                    <CardContent className="pt-0">
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0"
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                        >
                                            Lihat Detail →
                                        </Button>
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    )}
                </div>

                {notifications.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from(
                            { length: notifications.last_page },
                            (_, i) => i + 1
                        ).map((page) => (
                            <Button
                                key={page}
                                variant={
                                    page === notifications.current_page
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        `/notifications?page=${page}`,
                                        {},
                                        { preserveState: true }
                                    )
                                }
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
