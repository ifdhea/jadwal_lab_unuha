import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
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
    peran: string;
}

interface Props {
    user: User;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ user, breadcrumbs }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        peran: user.peran,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Edit User</CardTitle>
                    <CardDescription>Perbarui data user di sistem.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Nama */}
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

                            {/* Email */}
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

                            {/* Password */}
                            <div>
                                <Label htmlFor="password">Password Baru (kosongkan jika tidak diubah)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Password Confirmation */}
                            <div>
                                <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
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

                            {/* Peran */}
                            <div className="md:col-span-2">
                                <Label htmlFor="peran">Peran</Label>
                                <Select
                                    value={data.peran}
                                    onValueChange={(value) => setData('peran', value)}
                                    required
                                >
                                    <SelectTrigger id="peran">
                                        <SelectValue placeholder="Pilih Peran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="dosen">Dosen</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.peran} />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Super Admin memiliki akses penuh, Admin dapat mengelola data, Dosen hanya dapat melihat jadwal dan tukar jadwal
                                </p>
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-2">
                            <Button asChild variant="outline">
                                <Link href="/users">Batal</Link>
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
