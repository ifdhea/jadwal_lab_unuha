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
import { Plus, Pencil, Trash2, CheckCircle2, Check, X, Search, Filter, XCircle } from 'lucide-react';
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

interface ProgramStudi {
    id: number;
    nama: string;
}

interface MataKuliah {
    id: number;
    kode: string;
    nama: string;
    sks: number;
    tingkat_semester: number;
    tipe_semester: 'ganjil' | 'genap' | 'both';
    butuh_lab: boolean;
    is_aktif: boolean;
    program_studi: ProgramStudi;
}

interface Filters {
    [key: string]: string | undefined;
    search?: string;
    program_studi_id?: string;
    tingkat_semester?: string;
    tipe_semester?: string;
    butuh_lab?: string;
    is_aktif?: string;
}

interface Props {
    mataKuliah: MataKuliah[];
    programStudi: ProgramStudi[];
    filters: Filters;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({ mataKuliah, programStudi, filters, breadcrumbs }: Props) {
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
            router.delete(`/mata-kuliah/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleFilterChange = (key: keyof Filters, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Apply filter immediately with new value
        const cleanFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([_, v]) => v !== '' && v !== undefined)
        );
        router.get('/mata-kuliah', cleanFilters, { preserveState: true, preserveScroll: true, replace: true });
    };

    const applyFilters = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(localFilters).filter(([_, value]) => value !== '' && value !== undefined)
        );
        router.get('/mata-kuliah', cleanFilters, { preserveState: true, preserveScroll: true });
    };

    const resetFilters = () => {
        setLocalFilters({});
        router.get('/mata-kuliah', {}, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mata Kuliah" />

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
                            <h1 className="text-3xl font-bold">Mata Kuliah</h1>
                            <p className="text-muted-foreground">Kelola data mata kuliah UNUHA</p>
                        </div>
                        <Link href="/mata-kuliah/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Mata Kuliah
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari kode atau nama mata kuliah..."
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-3 border rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm">
                                <Select
                                    value={localFilters.program_studi_id || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('program_studi_id', value === 'all' ? '' : value);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Prodi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Prodi</SelectItem>
                                        {programStudi.map(prodi => (
                                            <SelectItem key={prodi.id} value={String(prodi.id)}>
                                                {prodi.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.tingkat_semester || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('tingkat_semester', value === 'all' ? '' : value);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Semester</SelectItem>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                            <SelectItem key={sem} value={String(sem)}>
                                                Semester {sem}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.tipe_semester || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('tipe_semester', value === 'all' ? '' : value);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tipe</SelectItem>
                                        <SelectItem value="ganjil">Ganjil</SelectItem>
                                        <SelectItem value="genap">Genap</SelectItem>
                                        <SelectItem value="both">Keduanya</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.butuh_lab || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('butuh_lab', value === 'all' ? '' : value);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Lab" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Lab</SelectItem>
                                        <SelectItem value="true">Butuh Lab</SelectItem>
                                        <SelectItem value="false">Tidak Butuh Lab</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.is_aktif || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('is_aktif', value === 'all' ? '' : value);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="true">Aktif</SelectItem>
                                        <SelectItem value="false">Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Nama Mata Kuliah</TableHead>
                                    <TableHead>Prodi</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Butuh Lab</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mataKuliah.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="text-center text-muted-foreground"
                                        >
                                            Belum ada data mata kuliah
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mataKuliah.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.kode}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.program_studi.nama}</TableCell>
                                            <TableCell>{item.sks}</TableCell>
                                            <TableCell>{item.tingkat_semester}</TableCell>
                                            <TableCell>
                                                {item.butuh_lab ? (
                                                    <Check className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <X className="h-5 w-5 text-red-500" />
                                                )}
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
                                                    <Link href={`/mata-kuliah/${item.id}/edit`}>
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
                                    Apakah Anda yakin ingin menghapus mata kuliah ini? Tindakan ini
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
