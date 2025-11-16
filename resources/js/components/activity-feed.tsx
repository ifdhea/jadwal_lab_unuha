import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { Activity, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActivityLog {
    id: number;
    actor_name: string;
    actor_role: string;
    action: string;
    title: string;
    description: string;
    data: any;
    icon: string;
    color: string;
    activity_date: string;
    created_at: string;
}

interface ActivityFeedProps {
    days?: number;
    maxHeight?: string;
    showHeader?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

export function ActivityFeed({
    days = 7,
    maxHeight = '500px',
    showHeader = true,
    autoRefresh = true,
    refreshInterval = 60000, // 1 minute
}: ActivityFeedProps) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const fetchActivities = async () => {
        try {
            const response = await axios.get(`/api/activity-logs/recent?days=${days}`);
            setActivities(response.data.activities);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();

        if (autoRefresh) {
            const interval = setInterval(fetchActivities, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [days, autoRefresh, refreshInterval]);

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
            green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
            orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
            red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        };
        return colors[color] || colors.blue;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (hours < 1) return 'Baru saja';
        if (hours < 24) return `${hours} jam yang lalu`;
        if (days < 7) return `${days} hari yang lalu`;

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Memuat aktivitas...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            {showHeader && (
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Aktivitas Terkini
                            </CardTitle>
                            <CardDescription>
                                Riwayat aktivitas {days} hari terakhir
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">{activities.length} aktivitas</Badge>
                    </div>
                </CardHeader>
            )}
            <CardContent className="p-0">
                <ScrollArea style={{ maxHeight }}>
                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <Activity className="mb-2 h-12 w-12 opacity-20" />
                            <p className="text-center text-sm text-muted-foreground">
                                Belum ada aktivitas dalam {days} hari terakhir
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {activities.map((activity, index) => (
                                <div
                                    key={activity.id}
                                    className="flex gap-3 p-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-2xl">
                                            {activity.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium leading-tight">
                                                    {activity.title}
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {activity.description}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={getColorClasses(activity.color)}
                                            >
                                                {activity.actor_role}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(activity.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
