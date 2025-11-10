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
import { Textarea } from '@/components/ui/textarea';

interface MataKuliah {
    id: number;
    program_studi_id: number;
    kode: string;
    nama: string;
    sks: number;
    tingkat_semester: number;
    tipe_semester: 'ganjil' | 'genap' | 'both';
    butuh_lab: boolean;
    deskripsi: string | null;
    is_aktif: boolean;
}
interface ProgramStudi {
    id: number;
    nama: string;
}
interface Props {
    mataKuliah: MataKuliah;
    programStudi: ProgramStudi[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ mataKuliah, programStudi, breadcrumbs }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        program_studi_id: String(mataKuliah.program_studi_id),
        kode: mataKuliah.kode,
        nama: mataKuliah.nama,
        sks: mataKuliah.sks,
        tingkat_semester: mataKuliah.tingkat_semester,
        tipe_semester: mataKuliah.tipe_semester,
        butuh_lab: mataKuliah.butuh_lab,
        deskripsi: mataKuliah.deskripsi || '',
        is_aktif: mataKuliah.is_aktif,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/mata-kuliah/${mataKuliah.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Mata Kuliah: ${mataKuliah.nama}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Edit Mata Kuliah</CardTitle>
                    <CardDescription>
                        Perbarui data mata kuliah yang sudah ada di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Nama Mata Kuliah */}
                            <div className="md:col-span-2">
                                <Label htmlFor="nama">Nama Mata Kuliah</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nama} />
                            </div>

                            {/* Program Studi */}
                            <div>
                                <Label htmlFor="program_studi_id">Program Studi</Label>
                                <Select
                                    value={data.program_studi_id}
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

                            {/* Kode Mata Kuliah */}
                            <div>
                                <Label htmlFor="kode">Kode Mata Kuliah</Label>
                                <Input
                                    id="kode"
                                    value={data.kode}
                                    onChange={(e) => setData('kode', e.target.value)}
                                    required
                                />
                                <InputError message={errors.kode} />
                            </div>

                            {/* SKS */}
                            <div>
                                <Label htmlFor="sks">SKS</Label>
                                <Input
                                    id="sks"
                                    type="number"
                                    value={data.sks}
                                    onChange={(e) => setData('sks', parseInt(e.target.value))}
                                    required
                                />
                                <InputError message={errors.sks} />
                            </div>

                            {/* Tingkat Semester */}
                            <div>
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

                            {/* Tipe Semester */}
                            <div>
                                <Label htmlFor="tipe_semester">Tipe Semester</Label>
                                <Select
                                    value={data.tipe_semester}
                                    onValueChange={(value) =>
                                        setData(
                                            'tipe_semester',
                                            value as 'ganjil' | 'genap' | 'both',
                                        )
                                    }
                                    required
                                >
                                    <SelectTrigger id="tipe_semester">
                                        <SelectValue placeholder="Pilih Tipe Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ganjil">Ganjil</SelectItem>
                                        <SelectItem value="genap">Genap</SelectItem>
                                        <SelectItem value="both">Keduanya</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tipe_semester} />
                            </div>

                            {/* Deskripsi */}
                            <div className="md:col-span-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                />
                                <InputError message={errors.deskripsi} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="butuh_lab"
                                        checked={data.butuh_lab}
                                        onCheckedChange={(checked) =>
                                            setData('butuh_lab', !!checked)
                                        }
                                    />
                                    <Label htmlFor="butuh_lab">Butuh Laboratorium</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_aktif"
                                        checked={data.is_aktif}
                                        onCheckedChange={(checked) =>
                                            setData('is_aktif', !!checked)
                                        }
                                    />
                                    <Label htmlFor="is_aktif">Aktif</Label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button asChild variant="outline">
                                    <Link href="/mata-kuliah">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Perbarui'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
