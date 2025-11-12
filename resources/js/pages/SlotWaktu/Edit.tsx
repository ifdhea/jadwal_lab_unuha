import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

interface SlotWaktu {
    id: number;
    label: string;
    urutan: number;
    waktu_mulai: string;
    waktu_selesai: string;
    is_aktif: boolean;
}

interface Props {
    slotWaktu: SlotWaktu;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Edit({ slotWaktu, breadcrumbs }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        label: slotWaktu.label,
        urutan: slotWaktu.urutan,
        waktu_mulai: slotWaktu.waktu_mulai.substring(0, 5), // HH:MM
        waktu_selesai: slotWaktu.waktu_selesai.substring(0, 5), // HH:MM
        is_aktif: slotWaktu.is_aktif,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/slot-waktu/${slotWaktu.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Slot Waktu: ${slotWaktu.label}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Edit Slot Waktu</CardTitle>
                    <CardDescription>
                        Perbarui slot waktu yang sudah ada di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Label */}
                            <div>
                                <Label htmlFor="label">Label</Label>
                                <Input
                                    id="label"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    required
                                    placeholder="Contoh: Slot 1 (08:00-08:45)"
                                />
                                <InputError message={errors.label} />
                            </div>

                            {/* Urutan */}
                            <div>
                                <Label htmlFor="urutan">Urutan</Label>
                                <Input
                                    id="urutan"
                                    type="number"
                                    value={data.urutan}
                                    onChange={(e) => setData('urutan', parseInt(e.target.value))}
                                    required
                                />
                                <InputError message={errors.urutan} />
                            </div>

                            {/* Waktu Mulai */}
                            <div>
                                <Label htmlFor="waktu_mulai">Waktu Mulai</Label>
                                <Input
                                    id="waktu_mulai"
                                    type="time"
                                    value={data.waktu_mulai}
                                    onChange={(e) => setData('waktu_mulai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.waktu_mulai} />
                            </div>

                            {/* Waktu Selesai */}
                            <div>
                                <Label htmlFor="waktu_selesai">Waktu Selesai</Label>
                                <Input
                                    id="waktu_selesai"
                                    type="time"
                                    value={data.waktu_selesai}
                                    onChange={(e) => setData('waktu_selesai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.waktu_selesai} />
                            </div>
                        </div>

                        {/* Is Aktif */}
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
                                <Link href="/slot-waktu">Batal</Link>
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