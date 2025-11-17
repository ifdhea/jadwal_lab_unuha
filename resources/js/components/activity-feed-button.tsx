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
import { useEffect, useState, useRef } from 'react';

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
    const [hasUnread, setHasUnread] = useState(false);
    const instanceId = useRef(Math.random().toString(36).substring(7));

    console.log(`[ActivityFeed-${instanceId.current}] Component rendered, hasUnread:`, hasUnread);

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

    const checkUnread = async () => {
        try {
            // Untuk guest, gunakan localStorage
            const lastSeenAt = localStorage.getItem('activity_last_seen_at');
            
            console.log(`[ActivityFeed-${instanceId.current}] Checking unread, lastSeenAt from localStorage:`, lastSeenAt);
            
            const response = await axios.get('/api/activity-logs/check-unread', {
                withCredentials: true,
                params: {
                    client_last_seen: lastSeenAt, // kirim dari client
                }
            });
            console.log(`[ActivityFeed-${instanceId.current}] Check unread response:`, response.data);
            console.log(`[ActivityFeed-${instanceId.current}] has_unread value:`, response.data.has_unread, 'type:', typeof response.data.has_unread);
            setHasUnread(response.data.has_unread);
        } catch (error) {
            console.error(`[ActivityFeed-${instanceId.current}] Failed to check unread activities:`, error);
            // Jika error, anggap tidak ada unread
            setHasUnread(false);
        }
    };

    const markAsSeen = async () => {
        try {
            console.log(`[ActivityFeed-${instanceId.current}] Marking as seen...`);
            const response = await axios.post('/api/activity-logs/mark-seen', {}, {
                withCredentials: true,
            });
            console.log(`[ActivityFeed-${instanceId.current}] Marked as seen:`, response.data);
            
            // Simpan ke localStorage untuk guest
            if (response.data.marked_at) {
                localStorage.setItem('activity_last_seen_at', response.data.marked_at);
                console.log(`[ActivityFeed-${instanceId.current}] Saved to localStorage:`, response.data.marked_at);
            }
            
            // Set badge ke false langsung
            setHasUnread(false);
            console.log(`[ActivityFeed-${instanceId.current}] Badge set to false`);
            
            // Trigger custom event untuk notify instance lain di window yang sama
            window.dispatchEvent(new CustomEvent('activity-marked-seen'));
        } catch (error) {
            console.error(`[ActivityFeed-${instanceId.current}] Failed to mark activities as seen:`, error);
        }
    };

    useEffect(() => {
        // Check for unread activities on mount
        checkUnread();

        // Poll for new activities every 30 seconds - tapi tidak saat dialog terbuka
        const interval = setInterval(() => {
            if (!isOpen) {
                checkUnread();
            }
        }, 30000);

        // Listen untuk perubahan localStorage dari tab/window lain
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'activity_last_seen_at') {
                console.log(`[ActivityFeed-${instanceId.current}] localStorage changed by another tab, re-checking...`);
                checkUnread();
            }
        };
        
        // Listen untuk custom event dari instance lain di window yang sama
        const handleActivityMarkedSeen = () => {
            console.log(`[ActivityFeed-${instanceId.current}] Activity marked seen by another instance, updating...`);
            setHasUnread(false);
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('activity-marked-seen', handleActivityMarkedSeen);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('activity-marked-seen', handleActivityMarkedSeen);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchActivities();
            markAsSeen();
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
                    <Button variant="ghost" size="icon" title="Aktivitas Terkini" className="relative">
                        <Activity className="h-5 w-5" />
                        {hasUnread && (
                            <span className="absolute right-1 top-1 flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            </span>
                        )}
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" className="relative">
                        <Activity className="mr-2 h-4 w-4" />
                        Aktivitas Terkini
                        {hasUnread && (
                            <span className="ml-2 flex h-2 w-2">
                                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            </span>
                        )}
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
