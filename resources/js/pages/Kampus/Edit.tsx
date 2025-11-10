import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Kampus {
    id: number;
    kode: string;
    nama: string;
    alamat: string | null;
    is_aktif: boolean;
}

interface Props {
    kampus: Kampus;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ kampus, breadcrumbs }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        kode: kampus.kode,
        nama: kampus.nama,
        alamat: kampus.alamat || '',
        is_aktif: kampus.is_aktif,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/kampus/${kampus.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kampus" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/kampus">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Kampus</h1>
                            <p className="text-muted-foreground">
                                Perbarui data kampus UNUHA
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Form Kampus</CardTitle>
                            <CardDescription>
                                Perbarui informasi kampus di bawah
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kode">Kode Kampus *</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Contoh: B, C"
                                        value={data.kode}
                                        onChange={(e) => setData('kode', e.target.value)}
                                        className={errors.kode ? 'border-destructive' : ''}
                                    />
                                    {errors.kode && (
                                        <p className="text-sm text-destructive">{errors.kode}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Kampus *</Label>
                                    <Input
                                        id="nama"
                                        placeholder="Contoh: Kampus B"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        className={errors.nama ? 'border-destructive' : ''}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-destructive">{errors.nama}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        placeholder="Masukkan alamat kampus"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        rows={3}
                                        className={errors.alamat ? 'border-destructive' : ''}
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-destructive">{errors.alamat}</p>
                                    )}
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
                                        Aktifkan kampus ini
                                    </Label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                    <Link href="/kampus">
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
