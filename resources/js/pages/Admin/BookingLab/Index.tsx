import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Calendar, Clock, Building2, User } from 'lucide-react';

interface Dosen {
    id: number;
    nama: string;
    nidn: string;
}

interface MatKul {
    nama: string;
    sks: number;
}

interface Laboratorium {
    id: number;
    nama: string;
    kampus: string;
}

interface Booking {
    id: number;
    dosen: Dosen;
    mata_kuliah: MatKul | null;
    kelas: string | null;
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
    is_past?: boolean;
}

interface PageProps {
    bookings: {
        data: Booking[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters?: {
        status?: string;
        tanggal?: string;
    };
}

export default function Index({ bookings, filters = {} }: PageProps) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string; icon: any }> = {
            menunggu: { variant: 'default', label: 'Menunggu', icon: Clock },
            disetujui: { variant: 'success', label: 'Disetujui', icon: CheckCircle2 },
            ditolak: { variant: 'destructive', label: 'Ditolak', icon: XCircle },
            dibatalkan: { variant: 'secondary', label: 'Dibatalkan', icon: XCircle },
            selesai: { variant: 'outline', label: 'Selesai', icon: CheckCircle2 },
        };
        const config = variants[status] || variants.menunggu;
        const Icon = config.icon;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
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

    const handleReject = (booking: Booking) => {
        setSelectedBooking(booking);
        setAdminNote('');
        setShowRejectDialog(true);
    };

    const submitApprove = () => {
        if (!selectedBooking) return;
        setProcessing(true);
        router.post(`/booking-lab/${selectedBooking.id}/approve`, {
            catatan_admin: adminNote,
        }, {
            onFinish: () => {
                setProcessing(false);
                setShowApproveDialog(false);
                setSelectedBooking(null);
                setAdminNote('');
            }
        });
    };

    const submitReject = () => {
        if (!selectedBooking || !adminNote.trim()) return;
        setProcessing(true);
        router.post(`/booking-lab/${selectedBooking.id}/reject`, {
            catatan_admin: adminNote,
        }, {
            onFinish: () => {
                setProcessing(false);
                setShowRejectDialog(false);
                setSelectedBooking(null);
                setAdminNote('');
            }
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Booking Lab - Admin', href: '/admin/booking-lab' },
            ]}
        >
            <Head title="Booking Lab - Admin" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Booking Laboratorium</h1>
                        <p className="text-muted-foreground">
                            Kelola dan approve request booking laboratorium dari dosen
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Request Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bookings.data.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.data.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    {getStatusBadge(booking.status)}
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(booking.tanggal).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    <div className="flex items-start gap-2">
                                                        <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                                        <div className="text-sm">
                                                            <p className="font-medium">{booking.dosen.nama}</p>
                                                            <p className="text-muted-foreground">{booking.dosen.nidn}</p>
                                                        </div>
                                                    </div>

                                                    {booking.mata_kuliah && (
                                                        <div className="text-sm">
                                                            <p className="font-medium text-muted-foreground">Mata Kuliah</p>
                                                            <p>{booking.mata_kuliah.nama} ({booking.mata_kuliah.sks} SKS)</p>
                                                            {booking.kelas && <p className="text-muted-foreground">Kelas: {booking.kelas}</p>}
                                                        </div>
                                                    )}

                                                    <div className="flex items-start gap-2">
                                                        <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                                        <div className="text-sm">
                                                            <p className="font-medium">{booking.laboratorium.nama}</p>
                                                            <p className="text-muted-foreground">{booking.laboratorium.kampus}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                                        <div className="text-sm">
                                                            <p className="font-medium">
                                                                {booking.waktu_mulai.slice(0, 5)} - {booking.waktu_selesai.slice(0, 5)}
                                                            </p>
                                                            <p className="text-muted-foreground">{booking.durasi_slot} slot</p>
                                                        </div>
                                                    </div>

                                                    <div className="text-sm">
                                                        <p className="font-medium text-muted-foreground">Keperluan</p>
                                                        <p>{booking.keperluan}</p>
                                                    </div>

                                                    {booking.keterangan && (
                                                        <div className="text-sm">
                                                            <p className="font-medium text-muted-foreground">Keterangan</p>
                                                            <p>{booking.keterangan}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {booking.catatan_admin && (
                                                    <div className="rounded bg-muted p-3 text-sm">
                                                        <p className="font-medium text-muted-foreground mb-1">Catatan Admin</p>
                                                        <p>{booking.catatan_admin}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {booking.status === 'menunggu' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleApprove(booking)}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Setujui
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleReject(booking)}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Tolak
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                Belum ada request booking
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setujui Booking</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menyetujui booking ini?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label htmlFor="approve-note">Catatan (Opsional)</Label>
                        <Textarea
                            id="approve-note"
                            placeholder="Tambahkan catatan jika diperlukan..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowApproveDialog(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={submitApprove}
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Setujui'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Booking</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan booking ini
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label htmlFor="reject-note">
                            Alasan Penolakan <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="reject-note"
                            placeholder="Masukkan alasan penolakan..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows={3}
                        />
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
                            onClick={submitReject}
                            disabled={processing || !adminNote.trim()}
                        >
                            {processing ? 'Memproses...' : 'Tolak'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
