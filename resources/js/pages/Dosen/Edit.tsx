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

interface User {
    id: number;
    name: string;
    email: string;
}

interface Dosen {
    id: number;
    nidn: string;
    nip: string | null;
    no_telp: string | null;
    is_aktif: boolean;
    kampus_utama_id: number | null;
    user: User;
}

interface Kampus {
    id: number;
    nama: string;
}
interface Props {
    dosen: Dosen;
    kampus: Kampus[];
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ dosen, kampus, breadcrumbs }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        name: dosen.user.name,
        email: dosen.user.email,
        password: '',
        password_confirmation: '',
        nidn: dosen.nidn,
        nip: dosen.nip || '',
        no_telp: dosen.no_telp || '',
        kampus_utama_id: dosen.kampus_utama_id ? String(dosen.kampus_utama_id) : '',
        is_aktif: dosen.is_aktif,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/dosen/${dosen.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Dosen: ${dosen.user.name}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Edit Dosen</CardTitle>
                    <CardDescription>
                        Perbarui akun dan data profil untuk dosen.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        {/* Akun User */}
                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Akun Login</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div>
                                    <Label htmlFor="password">
                                        Password Baru (kosongkan jika tidak diubah)
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <div>
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Password Baru
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>
                        </div>

                        {/* Profil Dosen */}
                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="font-semibold">Profil Dosen</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="nidn">NIDN</Label>
                                    <Input
                                        id="nidn"
                                        value={data.nidn}
                                        onChange={(e) => setData('nidn', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nidn} />
                                </div>
                                <div>
                                    <Label htmlFor="nip">NIP (Opsional)</Label>
                                    <Input
                                        id="nip"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                    />
                                    <InputError message={errors.nip} />
                                </div>
                                <div>
                                    <Label htmlFor="no_telp">No. Telepon (Opsional)</Label>
                                    <Input
                                        id="no_telp"
                                        value={data.no_telp}
                                        onChange={(e) => setData('no_telp', e.target.value)}
                                    />
                                    <InputError message={errors.no_telp} />
                                </div>
                                <div>
                                    <Label htmlFor="kampus_utama_id">Kampus Utama (Opsional)</Label>
                                    <Select
                                        value={data.kampus_utama_id}
                                        onValueChange={(value) =>
                                            setData('kampus_utama_id', value)
                                        }
                                    >
                                        <SelectTrigger id="kampus_utama_id">
                                            <SelectValue placeholder="Semua Kampus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua Kampus</SelectItem>
                                            {kampus.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={String(item.id)}
                                                >
                                                    {item.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.kampus_utama_id} />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Kosongkan jika dosen bisa mengajar di semua kampus
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_aktif"
                                    checked={data.is_aktif}
                                    onCheckedChange={(checked) =>
                                        setData('is_aktif', checked as boolean)
                                    }
                                />
                                <Label htmlFor="is_aktif" className="font-normal cursor-pointer">
                                    Aktifkan akun dosen ini
                                </Label>
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-2">
                            <Button asChild variant="outline">
                                <Link href="/dosen">Batal</Link>
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
