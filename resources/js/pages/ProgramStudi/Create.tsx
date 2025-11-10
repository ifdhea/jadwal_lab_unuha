import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Create({ breadcrumbs }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        kode: '',
        nama: '',
        deskripsi: '',
        is_aktif: true,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/program-studi');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Program Studi" />

            <Card>
                <CardHeader>
                    <CardTitle>Tambah Program Studi Baru</CardTitle>
                    <CardDescription>
                        Buat program studi baru untuk ditambahkan ke sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="kode">Kode</Label>
                            <Input
                                id="kode"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                required
                            />
                            <InputError message={errors.kode} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="nama">Nama Program Studi</Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                required
                            />
                            <InputError message={errors.nama} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                            />
                            <InputError message={errors.deskripsi} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_aktif"
                                checked={data.is_aktif}
                                onCheckedChange={(checked) => setData('is_aktif', !!checked)}
                            />
                            <Label htmlFor="is_aktif">Aktif</Label>
                            <InputError message={errors.is_aktif} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button asChild variant="outline">
                                <Link href="/program-studi">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
