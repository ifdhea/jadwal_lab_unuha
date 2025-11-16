import { useState, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, CheckCircle2, CalendarCog, AlertTriangle, X, Search, Filter } from 'lucide-react';
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

interface Semester {
    id: number;
    nama: string;
}
interface Dosen {
    id: number;
    user: { name: string };
}
interface Laboratorium {
    id: number;
    nama: string;
}
interface JadwalMaster {
    id: number;
    semester: Semester;
    kelas_matkul: {
        kelas: { nama: string; tingkat_semester: number };
        mata_kuliah: { nama: string; sks: number };
    };
    dosen: { user: { name: string } };
    laboratorium: { nama: string };
    hari: string;
    slot_waktu_mulai: { waktu_mulai: string };
    slot_waktu_selesai: { waktu_selesai: string };
    durasi_slot: number;
    status_konflik?: boolean;
    catatan: string | null;
}
interface Konflik {
    master_id: number;
    deskripsi: string;
    penyebab: string;
}

interface Filters {
    search?: string;
    semester_id?: string;
    dosen_id?: string;
    laboratorium_id?: string;
    hari?: string;
    status_konflik?: string;
}

interface Props {
    jadwalMaster: JadwalMaster[];
    semester: Semester[];
    dosen: Dosen[];
    laboratorium: Laboratorium[];
    filters: Filters;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({ jadwalMaster, semester, dosen, laboratorium, filters, breadcrumbs }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const { data, setData, post, processing } = useForm({ semester_id: '' });
    const { flash } = usePage<{ flash: { success?: string; warning?: string; konflik?: Konflik[] } }>().props;
    const [showToast, setShowToast] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filters>(filters || {});

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/jadwal-master', localFilters, { preserveState: true });
    };

    const resetFilters = () => {
        setLocalFilters({});
        router.get('/jadwal-master', {}, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    useEffect(() => {
        if (flash.success || flash.warning) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                if (flash.konflik) router.reload({ only: ['konflik'] });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        const hasActiveFilters = Object.values(filters || {}).some(v => v !== undefined && v !== '');
        setShowFilters(hasActiveFilters);
    }, [filters]);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/jadwal-master/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/jadwal/generate', {
            onSuccess: () => setShowGenerateModal(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Master" />

            {showToast && flash.success && (
                <Alert className="fixed top-4 right-4 z-50 w-auto max-w-md animate-in slide-in-from-top">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Berhasil!</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}
            {showToast && flash.warning && (
                 <Alert variant="destructive" className="fixed top-4 right-4 z-50 w-auto max-w-md animate-in slide-in-from-top">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Peringatan Generate Jadwal</AlertTitle>
                    <AlertDescription>{flash.warning}</AlertDescription>
                </Alert>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {flash.konflik && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Ditemukan {flash.konflik.length} Konflik Jadwal</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5">
                                {flash.konflik.map(k => (
                                    <li key={k.master_id}><strong>{k.deskripsi}:</strong> {k.penyebab}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Jadwal Master</h1>
                            <p className="text-muted-foreground">
                                Kelola data mentah jadwal sebelum digenerate.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowGenerateModal(true)}>
                                <CalendarCog className="mr-2 h-4 w-4" />
                                Generate Jadwal
                            </Button>
                            <Link href="/jadwal-master/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Jadwal
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari kelas, mata kuliah, dosen, atau laboratorium..."
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

                                <Select
                                    value={localFilters.dosen_id || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('dosen_id', value === 'all' ? '' : value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Dosen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Dosen</SelectItem>
                                        {dosen.map(d => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.laboratorium_id || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('laboratorium_id', value === 'all' ? '' : value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Laboratorium" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Lab</SelectItem>
                                        {laboratorium.map(lab => (
                                            <SelectItem key={lab.id} value={String(lab.id)}>
                                                {lab.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.hari || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('hari', value === 'all' ? '' : value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Hari" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Hari</SelectItem>
                                        <SelectItem value="Senin">Senin</SelectItem>
                                        <SelectItem value="Selasa">Selasa</SelectItem>
                                        <SelectItem value="Rabu">Rabu</SelectItem>
                                        <SelectItem value="Kamis">Kamis</SelectItem>
                                        <SelectItem value="Jumat">Jumat</SelectItem>
                                        <SelectItem value="Sabtu">Sabtu</SelectItem>
                                        <SelectItem value="Minggu">Minggu</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={localFilters.status_konflik || 'all'}
                                    onValueChange={(value) => {
                                        handleFilterChange('status_konflik', value === 'all' ? '' : value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Konflik" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="true">Ada Konflik</SelectItem>
                                        <SelectItem value="false">Tidak Ada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kelas & Matkul</TableHead>
                                    <TableHead>Dosen</TableHead>
                                    <TableHead>Jadwal</TableHead>
                                    <TableHead>Laboratorium</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jadwalMaster.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-muted-foreground"
                                        >
                                            Belum ada data jadwal
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    jadwalMaster.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.kelas_matkul.kelas.nama} - Semester {item.kelas_matkul.kelas.tingkat_semester} - {item.kelas_matkul.mata_kuliah.nama}
                                            </TableCell>
                                            <TableCell>{item.dosen.user.name}</TableCell>
                                            <TableCell>
                                                {item.hari}, {item.slot_waktu_mulai.waktu_mulai.slice(0, 5)} -{' '}
                                                {item.slot_waktu_selesai.waktu_selesai.slice(0, 5)}
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    ({item.kelas_matkul.mata_kuliah.sks} SKS)
                                                </span>
                                            </TableCell>
                                            <TableCell>{item.laboratorium.nama}</TableCell>
                                            <TableCell>{item.semester.nama}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/jadwal-master/${item.id}/edit`}>
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
                                    Apakah Anda yakin ingin menghapus data jadwal ini?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate Jadwal</DialogTitle>
                                <DialogDescription>
                                    Pilih semester untuk membuat jadwal final. Proses ini akan menghapus jadwal lama (jika ada) untuk semester yang dipilih dan menggantinya dengan yang baru berdasarkan data dari Jadwal Master.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleGenerate} className="space-y-4">
                                <div>
                                    <Label htmlFor="semester_id">Semester</Label>
                                    <Select onValueChange={(value) => setData('semester_id', value)} required>
                                        <SelectTrigger id="semester_id">
                                            <SelectValue placeholder="Pilih Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {semester.map((item) => (
                                                <SelectItem key={item.id} value={String(item.id)}>{item.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setShowGenerateModal(false)}>Batal</Button>
                                    <Button type="submit" disabled={processing || !data.semester_id}>
                                        {processing ? 'Memproses...' : 'Mulai Generate'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
