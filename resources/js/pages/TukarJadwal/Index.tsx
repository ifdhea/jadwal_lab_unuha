import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { Plus, CheckCircle2, XCircle, Calendar, Clock, ArrowLeftRight } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface SesiJadwal {
    id: number;
    mata_kuliah: string;
    tanggal: string;
    hari: string;
    laboratorium: string;
    waktu_mulai: string;
    waktu_selesai: string;
}

interface Dosen {
    id: number;
    nama: string;
}

interface TukarJadwal {
    id: number;
    pemohon: Dosen;
    sesi_pemohon: SesiJadwal;
    mitra: Dosen | null;
    sesi_mitra: SesiJadwal | null;
    status: string;
    alasan_pemohon: string;
    alasan_penolakan: string | null;
    tanggal_diajukan: string;
    tanggal_diproses: string | null;
    is_pemohon: boolean;
    is_mitra: boolean;
}

interface PageProps {
    tukarJadwals: {
        data: TukarJadwal[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
    };
    dosenId: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tukar Jadwal', href: '/tukar-jadwal' },
];

export default function Index({ tukarJadwals, filters, dosenId }: PageProps) {
    const [selectedItem, setSelectedItem] = useState<TukarJadwal | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string; icon: any }> = {
            menunggu: { variant: 'default', label: 'Menunggu', icon: Clock },
            disetujui: { variant: 'outline', label: 'Disetujui', icon: CheckCircle2 },
            ditolak: { variant: 'destructive', label: 'Ditolak', icon: XCircle },
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

    const handleApprove = (item: TukarJadwal) => {
        setSelectedItem(item);
        setShowApproveDialog(true);
    };

    const confirmApprove = () => {
        if (!selectedItem) return;

        setProcessing(true);
        router.post(
            `/tukar-jadwal/${selectedItem.id}/approve`,
            {},
            {
                onSuccess: () => {
                    setShowApproveDialog(false);
                    setSelectedItem(null);
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleReject = (item: TukarJadwal) => {
        setSelectedItem(item);
        setShowRejectDialog(true);
        setRejectReason('');
    };

    const confirmReject = () => {
        if (!selectedItem || !rejectReason.trim()) return;

        setProcessing(true);
        router.post(
            `/tukar-jadwal/${selectedItem.id}/reject`,
            { alasan_penolakan: rejectReason },
            {
                onSuccess: () => {
                    setShowRejectDialog(false);
                    setSelectedItem(null);
                    setRejectReason('');
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleCancel = (item: TukarJadwal) => {
        if (confirm('Apakah Anda yakin ingin membatalkan permintaan tukar jadwal ini?')) {
            router.post(`/tukar-jadwal/${item.id}/cancel`);
        }
    };

    const handleFilterChange = (value: string) => {
        router.get('/tukar-jadwal', { status: value === 'all' ? '' : value }, { preserveState: true });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tukar Jadwal" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tukar Jadwal</h1>
                        <p className="text-muted-foreground">
                            Kelola permintaan tukar jadwal dengan dosen lain
                        </p>
                    </div>
                    <Link href="/tukar-jadwal/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajukan Tukar Jadwal
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
                                    onValueChange={handleFilterChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="menunggu">Menunggu</SelectItem>
                                        <SelectItem value="disetujui">Disetujui</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Permintaan Tukar Jadwal</CardTitle>
                        <CardDescription>
                            {tukarJadwals.data.length} permintaan ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tukarJadwals.data.length > 0 ? (
                            <div className="space-y-4">
                                {tukarJadwals.data.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border p-4 hover:bg-accent/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-3">
                                                {/* Status dan Tanggal */}
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(item.status)}
                                                    <span className="text-sm text-muted-foreground">
                                                        Diajukan {formatDate(item.tanggal_diajukan)}
                                                    </span>
                                                    {item.tanggal_diproses && (
                                                        <span className="text-sm text-muted-foreground">
                                                            • Diproses{' '}
                                                            {formatDate(item.tanggal_diproses)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Info Pemohon dan Mitra */}
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {/* Jadwal Pemohon */}
                                                    <div className="space-y-2 rounded-lg border p-3">
                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                            <ArrowLeftRight className="h-4 w-4" />
                                                            {item.is_pemohon ? 'Jadwal Saya' : item.pemohon.nama}
                                                        </div>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="font-medium">
                                                                {item.sesi_pemohon.mata_kuliah}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Calendar className="h-3 w-3" />
                                                                {item.sesi_pemohon.hari},{' '}
                                                                {formatDate(item.sesi_pemohon.tanggal)}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                {item.sesi_pemohon.waktu_mulai} -{' '}
                                                                {item.sesi_pemohon.waktu_selesai}
                                                            </div>
                                                            <div className="text-muted-foreground">
                                                                {item.sesi_pemohon.laboratorium}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Jadwal Mitra */}
                                                    {item.sesi_mitra && (
                                                        <div className="space-y-2 rounded-lg border p-3">
                                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                                <ArrowLeftRight className="h-4 w-4" />
                                                                {item.is_mitra
                                                                    ? 'Jadwal Saya'
                                                                    : item.mitra?.nama}
                                                            </div>
                                                            <div className="space-y-1 text-sm">
                                                                <div className="font-medium">
                                                                    {item.sesi_mitra.mata_kuliah}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {item.sesi_mitra.hari},{' '}
                                                                    {formatDate(item.sesi_mitra.tanggal)}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    {item.sesi_mitra.waktu_mulai} -{' '}
                                                                    {item.sesi_mitra.waktu_selesai}
                                                                </div>
                                                                <div className="text-muted-foreground">
                                                                    {item.sesi_mitra.laboratorium}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Alasan */}
                                                <div className="text-sm">
                                                    <span className="font-medium">Alasan: </span>
                                                    <span className="text-muted-foreground">
                                                        {item.alasan_pemohon}
                                                    </span>
                                                </div>

                                                {/* Alasan Penolakan */}
                                                {item.alasan_penolakan && (
                                                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
                                                        <span className="font-medium">
                                                            Alasan Penolakan:{' '}
                                                        </span>
                                                        <span>{item.alasan_penolakan}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            {item.status === 'menunggu' && (
                                                <div className="ml-4 flex gap-2">
                                                    {item.is_mitra && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApprove(item)}
                                                            >
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                Setujui
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleReject(item)}
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Tolak
                                                            </Button>
                                                        </>
                                                    )}
                                                    {item.is_pemohon && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCancel(item)}
                                                        >
                                                            Batalkan
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                Tidak ada permintaan tukar jadwal
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Approve Dialog */}
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setujui Tukar Jadwal</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menyetujui permintaan tukar jadwal ini? Jadwal
                            Anda akan otomatis ditukar dengan jadwal pemohon.
                        </DialogDescription>
                    </DialogHeader>
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
                        <DialogTitle>Tolak Tukar Jadwal</DialogTitle>
                        <DialogDescription>
                            Silakan berikan alasan penolakan permintaan tukar jadwal ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="alasan">Alasan Penolakan</Label>
                            <Textarea
                                id="alasan"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
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
                            disabled={processing || !rejectReason.trim()}
                        >
                            {processing ? 'Memproses...' : 'Tolak Permintaan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
