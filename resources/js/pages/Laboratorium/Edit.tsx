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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Kampus {
    id: number;
    kode: string;
    nama: string;
}

interface Laboratorium {
    id: number;
    kampus_id: number;
    kode: string;
    nama: string;
    kapasitas: number;
    deskripsi: string | null;
    is_aktif: boolean;
}

interface Props {
    laboratorium: Laboratorium;
    kampus: Kampus[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ laboratorium, kampus, breadcrumbs }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        kampus_id: laboratorium.kampus_id.toString(),
        kode: laboratorium.kode,
        nama: laboratorium.nama,
        kapasitas: laboratorium.kapasitas.toString(),
        deskripsi: laboratorium.deskripsi || '',
        is_aktif: laboratorium.is_aktif,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/laboratorium/${laboratorium.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Laboratorium" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/laboratorium">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Laboratorium</h1>
                            <p className="text-muted-foreground">
                                Perbarui data laboratorium komputer
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Form Laboratorium</CardTitle>
                            <CardDescription>
                                Perbarui informasi laboratorium di bawah
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kampus_id">Kampus *</Label>
                                    <Select
                                        value={data.kampus_id}
                                        onValueChange={(value) => setData('kampus_id', value)}
                                    >
                                        <SelectTrigger
                                            className={errors.kampus_id ? 'border-destructive' : ''}
                                        >
                                            <SelectValue placeholder="Pilih Kampus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kampus.map((k) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>
                                                    {k.kode} - {k.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kampus_id && (
                                        <p className="text-sm text-destructive">{errors.kampus_id}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="kode">Kode Lab *</Label>
                                        <Input
                                            id="kode"
                                            placeholder="Contoh: LAB-01"
                                            value={data.kode}
                                            onChange={(e) => setData('kode', e.target.value)}
                                            className={errors.kode ? 'border-destructive' : ''}
                                        />
                                        {errors.kode && (
                                            <p className="text-sm text-destructive">{errors.kode}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kapasitas">Kapasitas *</Label>
                                        <Input
                                            id="kapasitas"
                                            type="number"
                                            min="1"
                                            placeholder="30"
                                            value={data.kapasitas}
                                            onChange={(e) => setData('kapasitas', e.target.value)}
                                            className={errors.kapasitas ? 'border-destructive' : ''}
                                        />
                                        {errors.kapasitas && (
                                            <p className="text-sm text-destructive">{errors.kapasitas}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Laboratorium *</Label>
                                    <Input
                                        id="nama"
                                        placeholder="Contoh: Laboratorium Komputer 1"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        className={errors.nama ? 'border-destructive' : ''}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-destructive">{errors.nama}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi"
                                        placeholder="Masukkan deskripsi laboratorium"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        rows={3}
                                        className={errors.deskripsi ? 'border-destructive' : ''}
                                    />
                                    {errors.deskripsi && (
                                        <p className="text-sm text-destructive">{errors.deskripsi}</p>
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
                                        Aktifkan laboratorium ini
                                    </Label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                    <Link href="/laboratorium">
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
