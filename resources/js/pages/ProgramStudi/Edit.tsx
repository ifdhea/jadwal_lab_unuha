import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface ProgramStudi {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    is_aktif: boolean;
}

interface Props {
    programStudi: ProgramStudi;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ programStudi, breadcrumbs }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        kode: programStudi.kode,
        nama: programStudi.nama,
        deskripsi: programStudi.deskripsi || '',
        is_aktif: programStudi.is_aktif,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/program-studi/${programStudi.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Program Studi: ${programStudi.nama}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Edit Program Studi</CardTitle>
                    <CardDescription>
                        Perbarui data program studi yang sudah ada di sistem.
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
                                {processing ? 'Memperbarui...' : 'Perbarui'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
