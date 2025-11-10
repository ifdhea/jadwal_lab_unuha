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

// Definisikan tipe data yang diterima dari controller
interface Kelas {
    id: number;
    nama: string;
}
interface MataKuliah {
    id: number;
    nama: string;
    sks: number;
}
interface Semester {
    id: number;
    nama: string;
}
interface KelasMataKuliah {
    id: number;
    kelas: Kelas;
    mata_kuliah: MataKuliah;
    semester: Semester;
}

interface Props {
    kelasMataKuliah: KelasMataKuliah[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({ kelasMataKuliah, breadcrumbs }: Props) {
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
            router.delete(`/kelas-matkul/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelas & Mata Kuliah" />

            {showToast && flash.success && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
                    <div className="flex items-center gap-3 rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
            {showToast && flash.error && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
                    <div className="flex items-center gap-3 rounded-lg bg-red-500 px-6 py-3 text-white shadow-lg">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Penugasan Kelas & Mata Kuliah</h1>
                            <p className="text-muted-foreground">
                                Kelola mata kuliah yang diambil oleh setiap kelas per semester.
                            </p>
                        </div>
                        <Link href="/kelas-matkul/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Penugasan
                            </Button>
                        </Link>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>Semester Akademik</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kelasMataKuliah.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-muted-foreground"
                                        >
                                            Belum ada data penugasan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    kelasMataKuliah.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.kelas.nama}
                                            </TableCell>
                                            <TableCell>
                                                {item.mata_kuliah.nama} ({item.mata_kuliah.sks} SKS)
                                            </TableCell>
                                            <TableCell>{item.semester.nama}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/kelas-matkul/${item.id}/edit`}>
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
                                    Apakah Anda yakin ingin menghapus penugasan ini? Tindakan ini
                                    tidak dapat dibatalkan.
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
