import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, CheckCircle2, XCircle, Calendar, Clock, Building2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Dosen {
    id: number;
    nama: string;
    nidn: string;
}

interface Laboratorium {
    id: number;
    nama: string;
    kampus: string;
}

interface Booking {
    id: number;
    dosen: Dosen;
    laboratorium: Laboratorium;
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    durasi_slot: number;
    keperluan: string;
    keterangan: string | null;
    status: string;
    catatan_admin: string | null;
    diproses_oleh: string | null;
    tanggal_diajukan: string;
    tanggal_diproses: string | null;
}

interface PageProps {
    bookings: {
        data: Booking[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
        tanggal?: string;
    };
    canApprove: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Booking Lab', href: '/booking-lab' },
];

export default function Index({ bookings, filters, canApprove }: PageProps) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string; icon: any }> = {
            menunggu: { variant: 'default', label: 'Menunggu', icon: Clock },
            disetujui: { variant: 'outline', label: 'Disetujui', icon: CheckCircle2 },
            ditolak: { variant: 'destructive', label: 'Ditolak', icon: XCircle },
            selesai: { variant: 'secondary', label: 'Selesai', icon: CheckCircle2 },
            dibatalkan: { variant: 'secondary', label: 'Dibatalkan', icon: XCircle },
        };

        const config = variants[status] || variants.menunggu;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const handleApprove = (booking: Booking) => {
        setSelectedBooking(booking);
        setAdminNote('');
        setShowApproveDialog(true);
    };

    const confirmApprove = () => {
        if (!selectedBooking) return;

        setProcessing(true);
        router.post(
            `/booking-lab/${selectedBooking.id}/approve`,
            { catatan_admin: adminNote },
            {
                onSuccess: () => {
                    setShowApproveDialog(false);
                    setSelectedBooking(null);
                    setAdminNote('');
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleReject = (booking: Booking) => {
        setSelectedBooking(booking);
        setAdminNote('');
        setShowRejectDialog(true);
    };

    const confirmReject = () => {
        if (!selectedBooking || !adminNote.trim()) return;

        setProcessing(true);
        router.post(
            `/booking-lab/${selectedBooking.id}/reject`,
            { catatan_admin: adminNote },
            {
                onSuccess: () => {
                    setShowRejectDialog(false);
                    setSelectedBooking(null);
                    setAdminNote('');
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleCancel = (booking: Booking) => {
        if (confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
            router.post(`/booking-lab/${booking.id}/cancel`);
        }
    };

    const handleFilterChange = (field: string, value: string) => {
        router.get(
            '/booking-lab',
            {
                ...filters,
                [field]: value === 'all' ? '' : value,
            },
            { preserveState: true }
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Laboratorium" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Booking Laboratorium</h1>
                        <p className="text-muted-foreground">
                            Kelola booking laboratorium untuk kegiatan di luar jadwal kuliah
                        </p>
                    </div>
                    <Link href="/booking-lab/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Booking Lab
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="w-64">
                                <Label>Status</Label>
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) => handleFilterChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="menunggu">Menunggu</SelectItem>
                                        <SelectItem value="disetujui">Disetujui</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-64">
                                <Label>Tanggal</Label>
                                <Input
                                    type="date"
                                    value={filters.tanggal || ''}
                                    onChange={(e) => handleFilterChange('tanggal', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Booking</CardTitle>
                        <CardDescription>
                            {bookings.data.length} booking ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {bookings.data.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.data.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="rounded-lg border p-4 hover:bg-accent/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-3">
                                                {/* Status dan Tanggal */}
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(booking.status)}
                                                    <span className="text-sm text-muted-foreground">
                                                        Diajukan {formatDate(booking.tanggal_diajukan)}
                                                    </span>
                                                    {booking.tanggal_diproses && (
                                                        <span className="text-sm text-muted-foreground">
                                                            • Diproses{' '}
                                                            {formatDate(booking.tanggal_diproses)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Info Booking */}
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {booking.laboratorium.nama}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                ({booking.laboratorium.kampus})
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            <span>{formatDate(booking.tanggal)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            <span>
                                                                {booking.waktu_mulai} -{' '}
                                                                {booking.waktu_selesai}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                ({booking.durasi_slot} slot)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-sm">
                                                            <span className="font-medium">
                                                                Dosen:{' '}
                                                            </span>
                                                            <span>{booking.dosen.nama}</span>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="font-medium">
                                                                Keperluan:{' '}
                                                            </span>
                                                            <span>{booking.keperluan}</span>
                                                        </div>
                                                        {booking.keterangan && (
                                                            <div className="text-sm">
                                                                <span className="font-medium">
                                                                    Keterangan:{' '}
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    {booking.keterangan}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Catatan Admin */}
                                                {booking.catatan_admin && (
                                                    <div
                                                        className={`rounded-lg border p-3 text-sm ${
                                                            booking.status === 'ditolak'
                                                                ? 'border-destructive/50 bg-destructive/10'
                                                                : 'border-border bg-muted/50'
                                                        }`}
                                                    >
                                                        <span className="font-medium">
                                                            Catatan Admin:{' '}
                                                        </span>
                                                        <span>{booking.catatan_admin}</span>
                                                        {booking.diproses_oleh && (
                                                            <span className="text-muted-foreground">
                                                                {' '}
                                                                - {booking.diproses_oleh}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="ml-4 flex gap-2">
                                                {booking.status === 'menunggu' && canApprove && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove(booking)}
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                            Setujui
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleReject(booking)}
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Tolak
                                                        </Button>
                                                    </>
                                                )}
                                                {(booking.status === 'menunggu' ||
                                                    booking.status === 'disetujui') &&
                                                    !canApprove && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCancel(booking)}
                                                        >
                                                            Batalkan
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                Tidak ada booking laboratorium
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Approve Dialog */}
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setujui Booking Lab</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menyetujui booking laboratorium ini?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="catatan">Catatan (Opsional)</Label>
                            <Textarea
                                id="catatan"
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Tambahkan catatan jika diperlukan..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowApproveDialog(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button onClick={confirmApprove} disabled={processing}>
                            {processing ? 'Memproses...' : 'Ya, Setujui'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Booking Lab</DialogTitle>
                        <DialogDescription>
                            Silakan berikan alasan penolakan booking laboratorium ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="alasan">
                                Alasan Penolakan <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="alasan"
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Masukkan alasan penolakan..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowRejectDialog(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmReject}
                            disabled={processing || !adminNote.trim()}
                        >
                            {processing ? 'Memproses...' : 'Tolak Booking'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
