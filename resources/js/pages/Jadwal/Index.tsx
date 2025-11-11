import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    User,
} from 'lucide-react';
import { useState } from 'react';

// Definisikan tipe data yang diterima dari controller
interface Semester {
    id: number;
    nama: string;
}
interface Kampus {
    id: number;
    kode: string;
    nama: string;
}
interface Minggu {
    nomor: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
}
interface Hari {
    id: number;
    nama: string;
}
interface Slot {
    id: number;
    waktu_mulai: string;
    waktu_selesai: string;
}
interface JadwalCell {
    sesi_jadwal_id: number;
    matkul: string;
    kelas: string;
    dosen: string;
    lab: string;
    sks: number;
    durasi_slot: number;
    waktu_mulai: string;
    waktu_selesai: string;
    status: string;
    is_my_schedule: boolean;
    tanggal: string;
    is_past: boolean;
}
type JadwalData = Record<
    number,
    Record<number, Record<number, Record<number, JadwalCell[]>>>
>;

interface Props {
    semesters: Semester[];
    selectedSemesterId: number | null;
    kampusList: Kampus[];
    mingguList: Minggu[];
    selectedMinggu: number;
    hari: Hari[];
    slots: Slot[];
    jadwalData: JadwalData;
    breadcrumbs: Array<{ title: string; href: string }>;
}

export default function Index({
    semesters,
    selectedSemesterId,
    kampusList,
    mingguList,
    selectedMinggu,
    hari,
    slots,
    jadwalData,
    breadcrumbs,
}: Props) {
    const [activeKampus, setActiveKampus] = useState(
        kampusList[0]?.kode || 'B',
    );

    const handleSemesterChange = (semesterId: string) => {
        router.get(
            '/jadwal',
            { semester_id: semesterId, minggu: 1 },
            { preserveState: true },
        );
    };

    const handleMingguChange = (minggu: number) => {
        router.get(
            '/jadwal',
            {
                semester_id: selectedSemesterId,
                minggu,
            },
            { preserveState: true },
        );
    };

    const currentMinggu = mingguList.find((m) => m.nomor === selectedMinggu);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Final" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Jadwal Final</h1>
                        <p className="text-muted-foreground">
                            Tampilan jadwal mingguan per kampus
                        </p>
                    </div>
                    <div className="w-72">
                        <Select
                            value={
                                selectedSemesterId
                                    ? String(selectedSemesterId)
                                    : ''
                            }
                            onValueChange={handleSemesterChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Navigasi Minggu */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMingguChange(selectedMinggu - 1)}
                        disabled={selectedMinggu <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <p className="font-semibold">
                            Minggu ke-{selectedMinggu}
                        </p>
                        {currentMinggu && (
                            <p className="text-xs text-muted-foreground">
                                {new Date(
                                    currentMinggu.tanggal_mulai,
                                ).toLocaleDateString('id-ID')}{' '}
                                -{' '}
                                {new Date(
                                    currentMinggu.tanggal_selesai,
                                ).toLocaleDateString('id-ID')}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMingguChange(selectedMinggu + 1)}
                        disabled={selectedMinggu >= mingguList.length}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Tab Kampus */}
                <Tabs value={activeKampus} onValueChange={setActiveKampus}>
                    <TabsList
                        className="grid w-full"
                        style={{
                            gridTemplateColumns: `repeat(${kampusList.length}, 1fr)`,
                        }}
                    >
                        {kampusList.map((kampus) => (
                            <TabsTrigger key={kampus.id} value={kampus.kode}>
                                Kampus {kampus.kode}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {kampusList.map((kampus) => {
                        // Filter jadwal untuk kampus ini saja
                        const jadwalKampus = jadwalData[kampus.id] || {};

                        return (
                            <TabsContent
                                key={kampus.id}
                                value={kampus.kode}
                                className="space-y-4"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Jadwal Kampus {kampus.nama}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full table-fixed border-collapse text-sm">
                                                <thead>
                                                    <tr className="bg-muted/50">
                                                        <th className="sticky left-0 z-10 w-32 border bg-muted/50 p-2 font-semibold">
                                                            Jam
                                                        </th>
                                                        {hari.map((h) => (
                                                            <th
                                                                key={h.id}
                                                                className="border p-2 font-semibold"
                                                            >
                                                                {h.nama}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(() => {
                                                        // Track slot yang sudah di-render untuk rowspan (per hari)
                                                        const renderedCells: Record<
                                                            number,
                                                            Set<number>
                                                        > = {};
                                                        hari.forEach((h) => {
                                                            renderedCells[
                                                                h.id
                                                            ] =
                                                                new Set<number>();
                                                        });

                                                        return slots.map(
                                                            (slot, slotIdx) => (
                                                                <tr
                                                                    key={
                                                                        slot.id
                                                                    }
                                                                    className="h-24"
                                                                >
                                                                    <td className="sticky left-0 h-24 border bg-background p-2 text-center font-mono text-xs font-semibold">
                                                                        {slot.waktu_mulai.slice(
                                                                            0,
                                                                            5,
                                                                        )}{' '}
                                                                        -{' '}
                                                                        {slot.waktu_selesai.slice(
                                                                            0,
                                                                            5,
                                                                        )}
                                                                    </td>
                                                                    {hari.map(
                                                                        (h) => {
                                                                            // Skip jika cell ini sudah di-render sebagai bagian dari rowspan
                                                                            if (
                                                                                renderedCells[
                                                                                    h
                                                                                        .id
                                                                                ].has(
                                                                                    slot.id,
                                                                                )
                                                                            ) {
                                                                                return null;
                                                                            }

                                                                            const cellsData =
                                                                                jadwalKampus[
                                                                                    selectedMinggu
                                                                                ]?.[
                                                                                    h
                                                                                        .id
                                                                                ]?.[
                                                                                    slot
                                                                                        .id
                                                                                ] ||
                                                                                [];

                                                                            // Hitung rowspan dinamis berdasarkan waktu mulai dan selesai aktual
                                                                            let maxRowSpan = 1;
                                                                            if (
                                                                                cellsData.length >
                                                                                0
                                                                            ) {
                                                                                maxRowSpan =
                                                                                    Math.max(
                                                                                        ...cellsData.map(
                                                                                            (
                                                                                                cell,
                                                                                            ) => {
                                                                                                const startIdx =
                                                                                                    slots.findIndex(
                                                                                                        (
                                                                                                            s,
                                                                                                        ) =>
                                                                                                            s.waktu_mulai <=
                                                                                                                cell.waktu_mulai &&
                                                                                                            s.waktu_selesai >
                                                                                                                cell.waktu_mulai,
                                                                                                    );
                                                                                                const endIdx =
                                                                                                    slots.findIndex(
                                                                                                        (
                                                                                                            s,
                                                                                                        ) =>
                                                                                                            s.waktu_mulai <
                                                                                                                cell.waktu_selesai &&
                                                                                                            s.waktu_selesai >=
                                                                                                                cell.waktu_selesai,
                                                                                                    );
                                                                                                if (
                                                                                                    startIdx !==
                                                                                                        -1 &&
                                                                                                    endIdx !==
                                                                                                        -1
                                                                                                ) {
                                                                                                    return (
                                                                                                        endIdx -
                                                                                                        startIdx +
                                                                                                        1
                                                                                                    );
                                                                                                }
                                                                                                return (
                                                                                                    cell.durasi_slot ||
                                                                                                    1
                                                                                                );
                                                                                            },
                                                                                        ),
                                                                                    );

                                                                                // Mark cells yang akan di-span
                                                                                for (
                                                                                    let i = 0;
                                                                                    i <
                                                                                    maxRowSpan;
                                                                                    i++
                                                                                ) {
                                                                                    const spanSlotIdx =
                                                                                        slotIdx +
                                                                                        i;
                                                                                    if (
                                                                                        spanSlotIdx <
                                                                                        slots.length
                                                                                    ) {
                                                                                        const spanSlotId =
                                                                                            slots[
                                                                                                spanSlotIdx
                                                                                            ]
                                                                                                .id;
                                                                                        renderedCells[
                                                                                            h
                                                                                                .id
                                                                                        ].add(
                                                                                            spanSlotId,
                                                                                        );
                                                                                    }
                                                                                }
                                                                            }

                                                                            return (
                                                                                <td
                                                                                    key={
                                                                                        h.id
                                                                                    }
                                                                                    className="h-full border p-0 align-middle"
                                                                                    rowSpan={
                                                                                        maxRowSpan
                                                                                    }
                                                                                    style={{
                                                                                        height: `${maxRowSpan * 6}rem`,
                                                                                    }}
                                                                                >
                                                                                    {cellsData.length >
                                                                                    0 ? (
                                                                                        <div className="flex h-full flex-col divide-y">
                                                                                            {cellsData.map(
                                                                                                (
                                                                                                    cell,
                                                                                                    idx,
                                                                                                ) => {
                                                                                                    // Mapping status ke variant badge
                                                                                                    const getStatusVariant =
                                                                                                        (
                                                                                                            status: string,
                                                                                                        ) => {
                                                                                                            switch (
                                                                                                                status
                                                                                                            ) {
                                                                                                                case 'terjadwal':
                                                                                                                    return 'default';
                                                                                                                case 'selesai':
                                                                                                                    return 'secondary';
                                                                                                                case 'tidak_masuk':
                                                                                                                    return 'outline';
                                                                                                                case 'dibatalkan':
                                                                                                                    return 'destructive';
                                                                                                                default:
                                                                                                                    return 'outline';
                                                                                                            }
                                                                                                        };

                                                                                                    // Generate warna berbeda untuk setiap jadwal berdasarkan dosen
                                                                                                    const getColorScheme =
                                                                                                        (
                                                                                                            dosen: string, // <-- DIGANTI DARI MATKUL
                                                                                                            index: number,
                                                                                                        ) => {
                                                                                                            const colors =
                                                                                                                [
                                                                                                                    {
                                                                                                                        from: 'from-blue-50',
                                                                                                                        to: 'to-blue-100',
                                                                                                                        border: 'border-blue-500',
                                                                                                                        icon: 'text-blue-600',
                                                                                                                        text: 'text-blue-900',
                                                                                                                        hover: 'hover:from-blue-100 hover:to-blue-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-green-50',
                                                                                                                        to: 'to-green-100',
                                                                                                                        border: 'border-green-500',
                                                                                                                        icon: 'text-green-600',
                                                                                                                        text: 'text-green-900',
                                                                                                                        hover: 'hover:from-green-100 hover:to-green-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-purple-50',
                                                                                                                        to: 'to-purple-100',
                                                                                                                        border: 'border-purple-500',
                                                                                                                        icon: 'text-purple-600',
                                                                                                                        text: 'text-purple-900',
                                                                                                                        hover: 'hover:from-purple-100 hover:to-purple-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-orange-50',
                                                                                                                        to: 'to-orange-100',
                                                                                                                        border: 'border-orange-500',
                                                                                                                        icon: 'text-orange-600',
                                                                                                                        text: 'text-orange-900',
                                                                                                                        hover: 'hover:from-orange-100 hover:to-orange-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-pink-50',
                                                                                                                        to: 'to-pink-100',
                                                                                                                        border: 'border-pink-500',
                                                                                                                        icon: 'text-pink-600',
                                                                                                                        text: 'text-pink-900',
                                                                                                                        hover: 'hover:from-pink-100 hover:to-pink-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-teal-50',
                                                                                                                        to: 'to-teal-100',
                                                                                                                        border: 'border-teal-500',
                                                                                                                        icon: 'text-teal-600',
                                                                                                                        text: 'text-teal-900',
                                                                                                                        hover: 'hover:from-teal-100 hover:to-teal-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-indigo-50',
                                                                                                                        to: 'to-indigo-100',
                                                                                                                        border: 'border-indigo-500',
                                                                                                                        icon: 'text-indigo-600',
                                                                                                                        text: 'text-indigo-900',
                                                                                                                        hover: 'hover:from-indigo-100 hover:to-indigo-200',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        from: 'from-amber-50',
                                                                                                                        to: 'to-amber-100',
                                                                                                                        border: 'border-amber-500',
                                                                                                                        icon: 'text-amber-600',
                                                                                                                        text: 'text-amber-900',
                                                                                                                        hover: 'hover:from-amber-100 hover:to-amber-200',
                                                                                                                    },
                                                                                                                ];

                                                                                                            // Hash sederhana berdasarkan nama dosen
                                                                                                            const hash =
                                                                                                                dosen // <-- DIGANTI DARI MATKUL
                                                                                                                    .split(
                                                                                                                        '',
                                                                                                                    )
                                                                                                                    .reduce(
                                                                                                                        (
                                                                                                                            acc,
                                                                                                                            char,
                                                                                                                        ) =>
                                                                                                                            acc +
                                                                                                                            char.charCodeAt(
                                                                                                                                0,
                                                                                                                            ),
                                                                                                                        0,
                                                                                                                    );
                                                                                                            const colorIndex =
                                                                                                                (hash +
                                                                                                                    index) %
                                                                                                                colors.length;
                                                                                                            return colors[
                                                                                                                colorIndex
                                                                                                            ];
                                                                                                        };

                                                                                                    const colorScheme =
                                                                                                        getColorScheme(
                                                                                                            cell.dosen, // <-- DIGANTI DARI MATKUL
                                                                                                            idx,
                                                                                                        );

                                                                                                    return (
                                                                                                        <div
                                                                                                            key={
                                                                                                                idx
                                                                                                            }
                                                                                                            className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} border-l-4 ${colorScheme.border} flex h-full flex-col justify-center p-2 ${colorScheme.hover} mx-0.5 my-0.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
                                                                                                        >
                                                                                                            {/* Header dengan nama mata kuliah */}
                                                                                                            <div className="mb-2 flex items-start gap-1.5">
                                                                                                                <BookOpen
                                                                                                                    className={`h-4 w-4 ${colorScheme.icon} mt-0.5 flex-shrink-0`}
                                                                                                                />
                                                                                                                <div className="min-w-0 flex-1">
                                                                                                                    <p
                                                                                                                        className={`font-bold ${colorScheme.text} truncate text-xs leading-tight`}
                                                                                                                    >
                                                                                                                        {
                                                                                                                            cell.matkul
                                                                                                                        }
                                                                                                                    </p>
                                                                                                                    <div className="mt-0.5 flex items-center gap-1">
                                                                                                                        <Badge
                                                                                                                            variant="secondary"
                                                                                                                            // --- PERUBAHAN DI SINI ---
                                                                                                                            // max-w-[130px] dihapus agar bisa fleksibel
                                                                                                                            className="truncate px-1.5 py-0.5 text-xs font-medium"
                                                                                                                        >
                                                                                                                            {
                                                                                                                                cell.kelas
                                                                                                                            }
                                                                                                                        </Badge>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Info detail */}
                                                                                                            <div className="space-y-0.5 text-xs">
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 truncate font-medium">
                                                                                                                        {
                                                                                                                            cell.dosen
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 truncate font-medium">
                                                                                                                        {
                                                                                                                            cell.lab
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-1 text-gray-700">
                                                                                                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                                                                                                    <span className="flex-1 font-medium">
                                                                                                                        {cell.waktu_mulai.slice(
                                                                                                                            0,
                                                                                                                            5,
                                                                                                                        )}{' '}
                                                                                                                        -{' '}
                                                                                                                        {cell.waktu_selesai.slice(
                                                                                                                            0,
                                                                                                                            5,
                                                                                                                        )}
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Footer badges */}
                                                                                                            <div
                                                                                                                className={`mt-1.5 flex items-center justify-between border-t pt-1.5 ${colorScheme.border.replace('border-', 'border-opacity-20 border-')}`}
                                                                                                            >
                                                                                                                <div className="flex gap-0.5">
                                                                                                                    <Badge
                                                                                                                        variant="outline"
                                                                                                                        className="px-1.5 py-0.5 text-xs font-medium"
                                                                                                                    >
                                                                                                                        {
                                                                                                                            cell.sks
                                                                                                                        }{' '}
                                                                                                                        SKS
                                                                                                                    </Badge>
                                                                                                                </div>
                                                                                                                <Badge
                                                                                                                    variant={getStatusVariant(
                                                                                                                        cell.status,
                                                                                                                    )}
                                                                                                                    className="px-1.5 py-0.5 text-xs font-medium"
                                                                                                                >
                                                                                                                    {cell.status === 'terjadwal' ? 'Terjadwal' : 
                                                                                                                     cell.status === 'selesai' ? 'Selesai' :
                                                                                                                     cell.status === 'tidak_masuk' ? 'Tidak Masuk' :
                                                                                                                     cell.status === 'dibatalkan' ? 'Dibatalkan' : cell.status}
                                                                                                                </Badge>
                                                                                                            </div>

                                                                                                            {/* Button Tidak Masuk (hanya untuk dosen pemilik jadwal) */}
                                                                                                            {cell.is_my_schedule && !cell.is_past && cell.status === 'terjadwal' && (
                                                                                                                <div className="mt-2">
                                                                                                                    <Button
                                                                                                                        variant="outline"
                                                                                                                        size="sm"
                                                                                                                        className="w-full text-xs h-7"
                                                                                                                        onClick={() => {
                                                                                                                            if (confirm('Tandai jadwal ini sebagai "Tidak Masuk"?')) {
                                                                                                                                router.post(`/sesi-jadwal/${cell.sesi_jadwal_id}/update-status`, {
                                                                                                                                    status: 'tidak_masuk',
                                                                                                                                    catatan: null,
                                                                                                                                });
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Tidak Masuk
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            )}

                                                                                                            {/* Button Reset Status */}
                                                                                                            {cell.is_my_schedule && !cell.is_past && cell.status === 'tidak_masuk' && (
                                                                                                                <div className="mt-2">
                                                                                                                    <Button
                                                                                                                        variant="default"
                                                                                                                        size="sm"
                                                                                                                        className="w-full text-xs h-7"
                                                                                                                        onClick={() => {
                                                                                                                            if (confirm('Kembalikan status ke "Terjadwal"?')) {
                                                                                                                                router.post(`/sesi-jadwal/${cell.sesi_jadwal_id}/reset-status`);
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Reset Status
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    );
                                                                                                },
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="h-24"></div>
                                                                                    )}
                                                                                </td>
                                                                            );
                                                                        },
                                                                    )}
                                                                </tr>
                                                            ),
                                                        );
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        );
                    })}
                </Tabs>

                {mingguList.length === 0 && (
                    <div className="flex h-64 items-center justify-center rounded-md border">
                        <p className="text-muted-foreground">
                            Belum ada jadwal. Silakan generate jadwal di menu
                            Jadwal Master.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}