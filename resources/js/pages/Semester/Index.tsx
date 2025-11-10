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

interface TahunAjaran {
    id: number;
    nama: string;
}

interface Semester {
    id: number;
    nama: string;
    tipe: 'ganjil' | 'genap';
    tanggal_mulai: string;
    tanggal_selesai: string;
    total_minggu: number;
    is_aktif: boolean;
    tahun_ajaran: TahunAjaran;
}

interface Props {
    semester: Semester[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({ semester, breadcrumbs }: Props) {
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
            router.delete(`/semester/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semester" />

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
                        <h1 className="text-3xl font-bold">Semester</h1>
                        <p className="text-muted-foreground">
                            Kelola data semester akademik
                        </p>
                    </div>
                    <Link href="/semester/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Semester
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Tahun Ajaran</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Tanggal Mulai</TableHead>
                                <TableHead>Tanggal Selesai</TableHead>
                                <TableHead>Total Minggu</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {semester.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data semester
                                    </TableCell>
                                </TableRow>
                            ) : (
                                semester.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.nama}
                                        </TableCell>
                                        <TableCell>{item.tahun_ajaran.nama}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.tipe === 'ganjil' ? 'default' : 'secondary'}>
                                                {item.tipe === 'ganjil' ? 'Ganjil' : 'Genap'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.tanggal_selesai).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>{item.total_minggu} minggu</TableCell>
                                        <TableCell>
                                            {item.is_aktif ? (
                                                <Badge variant="default">Aktif</Badge>
                                            ) : (
                                                <Badge variant="secondary">Tidak Aktif</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/semester/${item.id}/edit`}>
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
                                Apakah Anda yakin ingin menghapus semester ini? Tindakan ini tidak dapat
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
