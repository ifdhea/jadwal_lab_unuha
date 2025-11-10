import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Kampus {
    id: number;
    kode: string;
    nama: string;
}

interface Laboratorium {
    id: number;
    kode: string;
    nama: string;
    kapasitas: number;
    deskripsi: string | null;
    is_aktif: boolean;
    kampus: Kampus;
}

interface Props {
    laboratorium: Laboratorium[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({ laboratorium, breadcrumbs }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [flash]);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/laboratorium/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laboratorium" />

            {/* Toast Notification */}
            {showToast && flash.success && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
                    <div className="flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Laboratorium</h1>
                            <p className="text-muted-foreground">
                                Kelola data laboratorium komputer
                            </p>
                        </div>
                        <Link href="/laboratorium/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Laboratorium
                            </Button>
                        </Link>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kampus</TableHead>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kapasitas</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {laboratorium.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground"
                                        >
                                            Belum ada data laboratorium
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    laboratorium.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {item.kampus.kode}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.kode}
                                            </TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.kapasitas} orang</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {item.deskripsi || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {item.is_aktif ? (
                                                    <Badge variant="default">Aktif</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Tidak Aktif</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/laboratorium/${item.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setDeleteId(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus laboratorium ini? Tindakan ini tidak dapat
                                    dibatalkan.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AppLayout>
    );
}
