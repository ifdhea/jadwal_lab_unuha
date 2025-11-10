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

interface TahunAjaran {
    id: number;
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_aktif: boolean;
}

interface Props {
    tahunAjaran: TahunAjaran;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ tahunAjaran, breadcrumbs }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama: tahunAjaran.nama,
        tanggal_mulai: tahunAjaran.tanggal_mulai.split('T')[0],
        tanggal_selesai: tahunAjaran.tanggal_selesai.split('T')[0],
        is_aktif: tahunAjaran.is_aktif,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tahun-ajaran/${tahunAjaran.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Tahun Ajaran" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/tahun-ajaran">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Tahun Ajaran</h1>
                        <p className="text-muted-foreground">
                            Perbarui data tahun ajaran akademik
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Tahun Ajaran</CardTitle>
                        <CardDescription>
                            Perbarui informasi tahun ajaran di bawah
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Tahun Ajaran *</Label>
                                <Input
                                    id="nama"
                                    placeholder="Contoh: 2024/2025"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className={errors.nama ? 'border-destructive' : ''}
                                />
                                {errors.nama && (
                                    <p className="text-sm text-destructive">{errors.nama}</p>
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
                                    Aktifkan tahun ajaran ini
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/tahun-ajaran">
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
