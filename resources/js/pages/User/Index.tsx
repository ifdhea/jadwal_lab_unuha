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

interface User {
    id: number;
    name: string;
    email: string;
    peran: string;
    created_at: string;
}

interface Props {
    users: User[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({ users, breadcrumbs }: Props) {
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
            router.delete(`/users/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const getPeranBadge = (peran: string) => {
        const variants: Record<string, { label: string; className: string }> = {
            super_admin: { label: 'Super Admin', className: 'bg-purple-500' },
            admin: { label: 'Admin', className: 'bg-blue-500' },
            dosen: { label: 'Dosen', className: 'bg-green-500' },
        };
        const config = variants[peran] || { label: peran, className: 'bg-gray-500' };
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />

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
                            <h1 className="text-3xl font-bold">User</h1>
                            <p className="text-muted-foreground">Kelola data user sistem.</p>
                        </div>
                        <Button asChild>
                            <Link href="/users/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah User
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Peran</TableHead>
                                    <TableHead>Dibuat</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            Belum ada data user
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{getPeranBadge(user.peran)}</TableCell>
                                            <TableCell>
                                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/users/${user.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => setDeleteId(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Aksi ini tidak dapat dibatalkan. User ini akan dihapus secara permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
