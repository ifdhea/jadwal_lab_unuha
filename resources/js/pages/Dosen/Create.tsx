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

interface Kampus {
  id: number;
  nama: string;
}

interface ProgramStudi {
  id: number;
  nama: string;
}

interface Props {
  kampus: Kampus[];
  programStudi: ProgramStudi[];
  breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Create({ kampus, programStudi, breadcrumbs }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nidn: '',
    nip: '',
    program_studi_id: '' as string | number,
    kampus_utama_id: '' as string | number,
    gelar_depan: '',
    gelar_belakang: '',
    no_telp: '',
    alamat: '',
    is_aktif: true,
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post('/dosen');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Dosen" />

      <Card>
        <CardHeader>
          <CardTitle>Tambah Dosen Baru</CardTitle>
          <CardDescription>Buat akun dan data profil untuk dosen baru.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            {/* Akun Login */}
            <div className="space-y-4 rounded-md border p-4">
              <h3 className="font-semibold">Akun Login</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                  <InputError message={errors.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                  <InputError message={errors.email} />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                  <InputError message={errors.password} />
                </div>
                <div>
                  <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                  <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
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
                  <Input id="nidn" value={data.nidn} onChange={(e) => setData('nidn', e.target.value)} required />
                  <InputError message={errors.nidn} />
                </div>
                <div>
                  <Label htmlFor="nip">NIPY (Opsional)</Label>
                  <Input id="nip" value={data.nip} onChange={(e) => setData('nip', e.target.value)} />
                  <InputError message={errors.nip} />
                </div>
                <div>
                  <Label htmlFor="gelar_depan">Gelar Depan (Opsional)</Label>
                  <Input id="gelar_depan" value={data.gelar_depan} onChange={(e) => setData('gelar_depan', e.target.value)} placeholder="Dr., Prof., dll" />
                  <InputError message={errors.gelar_depan} />
                </div>
                <div>
                  <Label htmlFor="gelar_belakang">Gelar Belakang (Opsional)</Label>
                  <Input id="gelar_belakang" value={data.gelar_belakang} onChange={(e) => setData('gelar_belakang', e.target.value)} placeholder="M.Kom, S.Pd, dll" />
                  <InputError message={errors.gelar_belakang} />
                </div>

                <div>
                  <Label htmlFor="program_studi_id">Program Studi (Opsional)</Label>
                  <Select
                    value={data.program_studi_id ? String(data.program_studi_id) : 'none'}
                    onValueChange={(value) => setData('program_studi_id', value === 'none' ? '' : parseInt(value))}
                  >
                    <SelectTrigger id="program_studi_id">
                      <SelectValue placeholder="Pilih Program Studi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Semua Program Studi</SelectItem>
                      {programStudi.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.program_studi_id} />
                </div>

                <div>
                  <Label htmlFor="kampus_utama_id">Kampus Utama (Opsional)</Label>
                  <Select
                    value={data.kampus_utama_id ? String(data.kampus_utama_id) : 'none'}
                    onValueChange={(value) => setData('kampus_utama_id', value === 'none' ? '' : parseInt(value))}
                  >
                    <SelectTrigger id="kampus_utama_id">
                      <SelectValue placeholder="Pilih Kampus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Semua Kampus</SelectItem>
                      {kampus.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.kampus_utama_id} />
                  <p className="text-xs text-muted-foreground mt-1">Kosongkan jika dosen bisa mengajar di semua kampus</p>
                </div>

                <div>
                  <Label htmlFor="no_telp">No. Telepon (Opsional)</Label>
                  <Input id="no_telp" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} />
                  <InputError message={errors.no_telp} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="alamat">Alamat (Opsional)</Label>
                  <Input id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                  <InputError message={errors.alamat} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="is_aktif" checked={data.is_aktif} onCheckedChange={(checked) => setData('is_aktif', !!checked)} />
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
                {processing ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
