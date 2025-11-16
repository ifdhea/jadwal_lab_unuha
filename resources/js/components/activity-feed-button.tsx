import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { Activity, Clock } from 'lucide-react';
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

interface ActivityFeedButtonProps {
    variant?: 'button' | 'icon';
    days?: number;
}

export function ActivityFeedButton({ variant = 'button', days = 7 }: ActivityFeedButtonProps) {
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
        if (isOpen) {
            fetchActivities();
        }
    }, [isOpen, days]);

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
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {variant === 'icon' ? (
                    <Button variant="ghost" size="icon" title="Aktivitas Terkini">
                        <Activity className="h-5 w-5" />
                    </Button>
                ) : (
                    <Button variant="outline" size="sm">
                        <Activity className="mr-2 h-4 w-4" />
                        Aktivitas Terkini
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Aktivitas Terkini
                    </DialogTitle>
                    <DialogDescription>
                        Riwayat aktivitas dosen dan admin dalam {days} hari terakhir
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[500px] pr-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-muted-foreground">Memuat aktivitas...</div>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Activity className="mb-4 h-16 w-16 opacity-20" />
                            <p className="text-center text-muted-foreground">
                                Belum ada aktivitas dalam {days} hari terakhir
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
                                                {activity.icon}
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-semibold leading-tight">
                                                    {activity.title}
                                                </h4>
                                                <Badge
                                                    variant="secondary"
                                                    className={getColorClasses(activity.color)}
                                                >
                                                    {activity.actor_role}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(activity.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
