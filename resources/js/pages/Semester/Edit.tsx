import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TahunAjaran {
    id: number;
    nama: string;
}

interface Semester {
    id: number;
    tahun_ajaran_id: number;
    nama: string;
    tipe: 'ganjil' | 'genap';
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_aktif: boolean;
}

interface Props {
    semester: Semester;
    tahunAjaran: TahunAjaran[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ semester, tahunAjaran, breadcrumbs }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        tahun_ajaran_id: semester.tahun_ajaran_id.toString(),
        nama: semester.nama,
        tipe: semester.tipe,
        tanggal_mulai: semester.tanggal_mulai,
        tanggal_selesai: semester.tanggal_selesai,
        is_aktif: semester.is_aktif,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/semester/${semester.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Semester" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/semester">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Semester</h1>
                        <p className="text-muted-foreground">
                            Perbarui data semester akademik
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Semester</CardTitle>
                        <CardDescription>
                            Perbarui informasi semester di bawah
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tahun_ajaran_id">Tahun Ajaran *</Label>
                                <Select
                                    value={data.tahun_ajaran_id}
                                    onValueChange={(value) =>
                                        setData('tahun_ajaran_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.tahun_ajaran_id ? 'border-destructive' : ''
                                        }
                                    >
                                        <SelectValue placeholder="Pilih Tahun Ajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tahunAjaran.map((ta) => (
                                            <SelectItem key={ta.id} value={ta.id.toString()}>
                                                {ta.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tahun_ajaran_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.tahun_ajaran_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Semester *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Contoh: Ganjil 2024/2025"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className={errors.nama ? 'border-destructive' : ''}
                                />
                                {errors.nama && (
                                    <p className="text-sm text-destructive">{errors.nama}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipe">Tipe Semester *</Label>
                                <Select
                                    value={data.tipe}
                                    onValueChange={(value) => setData('tipe', value)}
                                >
                                    <SelectTrigger
                                        className={errors.tipe ? 'border-destructive' : ''}
                                    >
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ganjil">Ganjil</SelectItem>
                                        <SelectItem value="genap">Genap</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipe && (
                                    <p className="text-sm text-destructive">{errors.tipe}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) =>
                                            setData('tanggal_mulai', e.target.value)
                                        }
                                        className={
                                            errors.tanggal_mulai ? 'border-destructive' : ''
                                        }
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_mulai}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai *</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) =>
                                            setData('tanggal_selesai', e.target.value)
                                        }
                                        className={
                                            errors.tanggal_selesai ? 'border-destructive' : ''
                                        }
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_selesai}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_aktif"
                                    checked={data.is_aktif}
                                    onCheckedChange={(checked) =>
                                        setData('is_aktif', checked as boolean)
                                    }
                                />
                                <Label
                                    htmlFor="is_aktif"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Aktifkan semester ini
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/semester">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            </div>
        </AppLayout>
    );
}
