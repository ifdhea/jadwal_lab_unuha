import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Kelas {
    id: number;
    nama: string;
}
interface MataKuliah {
    id: number;
    nama: string;
}
interface Semester {
    id: number;
    nama: string;
}
interface Props {
    kelas: Kelas[];
    mataKuliah: MataKuliah[];
    semester: Semester[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Create({ kelas, mataKuliah, semester, breadcrumbs }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        kelas_id: '',
        mata_kuliah_id: '',
        semester_id: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/kelas-matkul');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Penugasan" />

            <Card>
                <CardHeader>
                    <CardTitle>Buat Penugasan Baru</CardTitle>
                    <CardDescription>
                        Tugaskan mata kuliah ke kelas pada semester tertentu.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Kelas */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="kelas_id">Kelas</Label>
                                <Select onValueChange={(value) => setData('kelas_id', value)} required>
                                    <SelectTrigger id="kelas_id">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelas.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kelas_id} />
                            </div>

                            {/* Mata Kuliah */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
                                <Select
                                    onValueChange={(value) => setData('mata_kuliah_id', value)}
                                    required
                                >
                                    <SelectTrigger id="mata_kuliah_id">
                                        <SelectValue placeholder="Pilih Mata Kuliah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mataKuliah.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.mata_kuliah_id} />
                            </div>

                            {/* Semester */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="semester_id">Semester Akademik</Label>
                                <Select
                                    onValueChange={(value) => setData('semester_id', value)}
                                    required
                                >
                                    <SelectTrigger id="semester_id">
                                        <SelectValue placeholder="Pilih Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {semester.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.semester_id} />
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-2">
                            <Button asChild variant="outline">
                                <Link href="/kelas-matkul">Batal</Link>
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
