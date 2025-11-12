import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
    dosenData,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    dosenData?: any;
}) {
    const { auth } = usePage<SharedData>().props;
    const [previewImage, setPreviewImage] = useState<string | null>(auth.user.avatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your profile photo, name, email and personal information"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                            forceFormData: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Photo Upload Section */}
                                <div className="grid gap-4">
                                    <Label>Profile Photo</Label>
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={previewImage || undefined} alt={auth.user.name} />
                                            <AvatarFallback className="text-2xl bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                name="foto_profil"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Photo
                                            </Button>
                                            <p className="text-xs text-muted-foreground">
                                                JPG, PNG or GIF (max. 2MB)
                                            </p>
                                        </div>
                                    </div>
                                    <InputError
                                        className="mt-2"
                                        message={errors.foto_profil}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {/* Dosen Fields */}
                                {dosenData && (
                                    <>
                                        <div className="border-t pt-6">
                                            <h3 className="text-lg font-semibold mb-4">Informasi Dosen</h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="nidn">NIDN</Label>
                                                    <Input
                                                        id="nidn"
                                                        name="nidn"
                                                        defaultValue={dosenData.nidn || ''}
                                                        placeholder="NIDN"
                                                    />
                                                    <InputError message={errors.nidn} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="nip">NIPY</Label>
                                                    <Input
                                                        id="nip"
                                                        name="nip"
                                                        defaultValue={dosenData.nip || ''}
                                                        placeholder="NIPY"
                                                    />
                                                    <InputError message={errors.nip} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="gelar_depan">Gelar Depan</Label>
                                                    <Input
                                                        id="gelar_depan"
                                                        name="gelar_depan"
                                                        defaultValue={dosenData.gelar_depan || ''}
                                                        placeholder="Dr., Prof., dll"
                                                    />
                                                    <InputError message={errors.gelar_depan} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="gelar_belakang">Gelar Belakang</Label>
                                                    <Input
                                                        id="gelar_belakang"
                                                        name="gelar_belakang"
                                                        defaultValue={dosenData.gelar_belakang || ''}
                                                        placeholder="S.Kom., M.Kom., dll"
                                                    />
                                                    <InputError message={errors.gelar_belakang} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="no_telp">No. Telepon</Label>
                                                    <Input
                                                        id="no_telp"
                                                        name="no_telp"
                                                        defaultValue={dosenData.no_telp || ''}
                                                        placeholder="08xxxxxxxxxx"
                                                    />
                                                    <InputError message={errors.no_telp} />
                                                </div>

                                                <div className="grid gap-2 md:col-span-2">
                                                    <Label htmlFor="alamat">Alamat</Label>
                                                    <Textarea
                                                        id="alamat"
                                                        name="alamat"
                                                        defaultValue={dosenData.alamat || ''}
                                                        placeholder="Alamat lengkap"
                                                        rows={3}
                                                    />
                                                    <InputError message={errors.alamat} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Program Studi</Label>
                                                    <Input
                                                        value={dosenData.program_studi?.nama || '-'}
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Kampus Utama</Label>
                                                    <Input
                                                        value={dosenData.kampus_utama?.nama || 'Semua Kampus'}
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
