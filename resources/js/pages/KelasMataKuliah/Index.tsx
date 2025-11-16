import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle2, Search, Filter, X } from 'lucide-react';
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

interface Filters {
    search?: string;
    kelas_id?: string;
    mata_kuliah_id?: string;
    semester_id?: string;
}

interface Props {
    kelasMataKuliah: KelasMataKuliah[];
    kelas: Kelas[];
    mataKuliah: MataKuliah[];
    semester: Semester[];
    filters: Filters;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({ kelasMataKuliah, kelas, mataKuliah, semester, filters, breadcrumbs }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [showToast, setShowToast] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filters>(filters || {});

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [flash]);

    useEffect(() => {
        const hasActiveFilters = Object.values(filters || {}).some(v => v !== undefined && v !== '');
        setShowFilters(hasActiveFilters);
    }, [filters]);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/kelas-matkul/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/kelas-matkul', localFilters, { preserveState: true });
    };

    const resetFilters = () => {
        setLocalFilters({});
        router.get('/kelas-matkul', {}, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
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

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari kelas atau mata kuliah..."
                                        value={localFilters.search || ''}
                                        onChange={(e) => {
                                            handleFilterChange('search', e.target.value);
                                            if (e.target.value === '') applyFilters();
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="pl-9 h-10"
                                    />
                                </div>
                            </form>
                            <div className="flex gap-2">
                                <Button
                                    variant={showFilters ? "default" : "outline"}
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2 h-10 whitespace-nowrap"
                                    size="sm"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span className="hidden sm:inline">Filter</span>
                                    {Object.values(localFilters).filter(v => v).length > 0 && (
                                        <Badge variant="secondary" className="ml-1 px-1.5 min-w-5 h-5">
                                            {Object.values(localFilters).filter(v => v).length}
                                        </Badge>
                                    )}
                                </Button>
                                {Object.values(localFilters).some(v => v) && (
                                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-10 gap-1">
                                        <X className="h-4 w-4" />
                                        <span className="hidden sm:inline">Reset</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 border rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm">
                                <Select
                                    value={localFilters.kelas_id || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('kelas_id', value === 'all' ? '' : value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        {kelas.map(k => (
                                            <SelectItem key={k.id} value={String(k.id)}>
                                                {k.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.mata_kuliah_id || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('mata_kuliah_id', value === 'all' ? '' : value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Mata Kuliah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Mata Kuliah</SelectItem>
                                        {mataKuliah.map(mk => (
                                            <SelectItem key={mk.id} value={String(mk.id)}>
                                                {mk.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.semester_id || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('semester_id', value === 'all' ? '' : value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Semester</SelectItem>
                                        {semester.map(s => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
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
