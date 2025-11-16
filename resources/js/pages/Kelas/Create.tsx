import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Definisikan tipe data untuk props
interface ProgramStudi {
    id: number;
    nama: string;
}
interface Kampus {
    id: number;
    nama: string;
}
interface TahunAjaran {
    id: number;
    nama: string;
}
interface Props {
    programStudi: ProgramStudi[];
    kampus: Kampus[];
    tahunAjaran: TahunAjaran[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Create({ programStudi, kampus, tahunAjaran, breadcrumbs }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        program_studi_id: '',
        kampus_id: '',
        tahun_ajaran_id: '',
        tingkat_semester: 1,
        kode: '',
        nama: '',
        kapasitas: 30,
        is_aktif: true,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/kelas');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kelas" />

            <Card>
                <CardHeader>
                    <CardTitle>Tambah Kelas Baru</CardTitle>
                    <CardDescription>Buat kelas baru untuk ditambahkan ke sistem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Program Studi */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="program_studi_id">Program Studi</Label>
                                <Select
                                    onValueChange={(value) => setData('program_studi_id', value)}
                                    required
                                >
                                    <SelectTrigger id="program_studi_id">
                                        <SelectValue placeholder="Pilih Program Studi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {programStudi.map((prodi) => (
                                            <SelectItem key={prodi.id} value={String(prodi.id)}>
                                                {prodi.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.program_studi_id} />
                            </div>

                            {/* Kampus */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="kampus_id">Kampus</Label>
                                <Select onValueChange={(value) => setData('kampus_id', value)} required>
                                    <SelectTrigger id="kampus_id">
                                        <SelectValue placeholder="Pilih Kampus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kampus.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kampus_id} />
                            </div>

                            {/* Tahun Ajaran */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="tahun_ajaran_id">Tahun Ajaran</Label>
                                <Select
                                    onValueChange={(value) => setData('tahun_ajaran_id', value)}
                                    required
                                >
                                    <SelectTrigger id="tahun_ajaran_id">
                                        <SelectValue placeholder="Pilih Tahun Ajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tahunAjaran.map((th) => (
                                            <SelectItem key={th.id} value={String(th.id)}>
                                                {th.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tahun_ajaran_id} />
                            </div>

                            {/* Nama Kelas */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="nama">Nama Kelas</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nama} />
                            </div>

                            {/* Kode Kelas */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="kode">Kode Kelas</Label>
                                <Input
                                    id="kode"
                                    value={data.kode}
                                    onChange={(e) => setData('kode', e.target.value)}
                                    required
                                />
                                <InputError message={errors.kode} />
                            </div>

                            {/* Tingkat Semester */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="tingkat_semester">Tingkat Semester</Label>
                                <Input
                                    id="tingkat_semester"
                                    type="number"
                                    value={data.tingkat_semester}
                                    onChange={(e) =>
                                        setData('tingkat_semester', parseInt(e.target.value))
                                    }
                                    required
                                />
                                <InputError message={errors.tingkat_semester} />
                            </div>

                            {/* Kapasitas */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="kapasitas">Kapasitas</Label>
                                <Input
                                    id="kapasitas"
                                    type="number"
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', parseInt(e.target.value))}
                                    required
                                />
                                <InputError message={errors.kapasitas} />
                            </div>
                        </div>

                        {/* Status Aktif */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_aktif"
                                checked={data.is_aktif}
                                onCheckedChange={(checked) => setData('is_aktif', !!checked)}
                            />
                            <Label htmlFor="is_aktif">Aktif</Label>
                            <InputError message={errors.is_aktif} />
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-2">
                            <Button asChild variant="outline">
                                <Link href="/kelas">Batal</Link>
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
