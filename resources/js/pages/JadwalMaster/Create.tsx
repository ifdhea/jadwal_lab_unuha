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
import { Textarea } from '@/components/ui/textarea';

// Definisikan tipe data untuk props
interface Semester { id: number; nama: string; }
interface KelasMatkul { id: number; kelas: { nama: string }; mata_kuliah: { id: number; nama: string; kode: string; sks: number; }; }
interface Dosen { id: number; user: { name: string }; }
interface Laboratorium { id: number; nama: string; }
interface SlotWaktu { id: number; label: string; }
interface Hari { id: number; nama: string; }

interface Props {
    semester: Semester[];
    kelasMatkul: KelasMatkul[];
    dosen: Dosen[];
    laboratorium: Laboratorium[];
    slotWaktu: SlotWaktu[];
    hari: Hari[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Create({ semester, kelasMatkul, dosen, laboratorium, slotWaktu, hari, breadcrumbs }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        semester_id: '',
        kelas_mata_kuliah_id: '',
        dosen_id: '',
        laboratorium_id: '',
        hari: '',
        slot_waktu_mulai_id: '',
        slot_waktu_selesai_id: '',
        catatan: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/jadwal-master');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Jadwal Master" />

            <Card>
                <CardHeader>
                    <CardTitle>Tambah Jadwal Master Baru</CardTitle>
                    <CardDescription>
                        Masukkan data mentah jadwal untuk satu semester.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Semester */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="semester_id">Semester</Label>
                                <Select onValueChange={(value) => setData('semester_id', value)} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih Semester" /></SelectTrigger>
                                    <SelectContent>
                                        {semester.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>{item.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.semester_id} />
                            </div>

                            {/* Kelas & Mata Kuliah */}
                            <div className="flex flex-col gap-1.5 lg:col-span-2">
                                <Label htmlFor="kelas_mata_kuliah_id">Kelas & Mata Kuliah</Label>
                                <Select onValueChange={(value) => setData('kelas_mata_kuliah_id', value)} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih Kelas & Mata Kuliah" /></SelectTrigger>
                                    <SelectContent>
                                        {kelasMatkul.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.kelas.nama} - {item.mata_kuliah.nama} ({item.mata_kuliah.sks} SKS)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kelas_mata_kuliah_id} />
                            </div>

                            {/* Dosen */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="dosen_id">Dosen</Label>
                                <Select onValueChange={(value) => setData('dosen_id', value)} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih Dosen" /></SelectTrigger>
                                    <SelectContent>
                                        {dosen.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>{item.user.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.dosen_id} />
                            </div>

                            {/* Laboratorium */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="laboratorium_id">Laboratorium</Label>
                                <Select onValueChange={(value) => setData('laboratorium_id', value)} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih Laboratorium" /></SelectTrigger>
                                    <SelectContent>
                                        {laboratorium.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>{item.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.laboratorium_id} />
                            </div>

                            {/* Hari */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="hari">Hari</Label>
                                <Select onValueChange={(value) => setData('hari', value)} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih Hari" /></SelectTrigger>
                                    <SelectContent>
                                        {hari.map((item) => (
                                            <SelectItem key={item.id} value={item.nama}>{item.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.hari} />
                            </div>

                            {/* Slot Waktu Mulai */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="slot_waktu_mulai_id">Jam Mulai</Label>
                                <Select onValueChange={(value) => setData('slot_waktu_mulai_id', value)} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih Jam Mulai" /></SelectTrigger>
                                    <SelectContent>
                                        {slotWaktu.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>{item.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.slot_waktu_mulai_id} />
                            </div>

                            {/* Slot Waktu Selesai */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="slot_waktu_selesai_id">Jam Selesai</Label>
                                <Select onValueChange={(value) => setData('slot_waktu_selesai_id', value)} required>
                                    <SelectTrigger><SelectValue placeholder="Pilih Jam Selesai" /></SelectTrigger>
                                    <SelectContent>
                                        {slotWaktu.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>{item.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.slot_waktu_selesai_id} />
                            </div>

                            {/* Catatan */}
                            <div className="lg:col-span-3">
                                <Label htmlFor="catatan">Catatan (Opsional)</Label>
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                />
                                <InputError message={errors.catatan} />
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-2">
                            <Button asChild variant="outline">
                                <Link href="/jadwal-master">Batal</Link>
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
