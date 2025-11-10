import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Definisikan tipe data yang diterima dari controller
interface Semester { id: number; nama: string; }
interface Kampus { id: number; kode: string; nama: string; }
interface Minggu { nomor: number; tanggal_mulai: string; tanggal_selesai: string; }
interface Hari { id: number; nama: string; }
interface Slot { id: number; waktu_mulai: string; waktu_selesai: string; }
interface JadwalCell {
    matkul: string;
    kelas: string;
    dosen: string;
    lab: string;
    sks: number;
    durasi_slot: number;
    waktu_mulai: string;
    waktu_selesai: string;
    status: string;
}
type JadwalData = Record<number, Record<number, Record<number, Record<number, JadwalCell[]>>>>;

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
    const [activeKampus, setActiveKampus] = useState(kampusList[0]?.kode || 'B');

    const handleSemesterChange = (semesterId: string) => {
        router.get('/jadwal', { semester_id: semesterId, minggu: 1 }, { preserveState: true });
    };

    const handleMingguChange = (minggu: number) => {
        router.get('/jadwal', { 
            semester_id: selectedSemesterId, 
            minggu 
        }, { preserveState: true });
    };

    const currentMinggu = mingguList.find(m => m.nomor === selectedMinggu);

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
                            value={selectedSemesterId ? String(selectedSemesterId) : ''}
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
                        <p className="font-semibold">Minggu ke-{selectedMinggu}</p>
                        {currentMinggu && (
                            <p className="text-xs text-muted-foreground">
                                {new Date(currentMinggu.tanggal_mulai).toLocaleDateString('id-ID')} -{' '}
                                {new Date(currentMinggu.tanggal_selesai).toLocaleDateString('id-ID')}
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
                    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${kampusList.length}, 1fr)` }}>
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
                            <TabsContent key={kampus.id} value={kampus.kode} className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Jadwal Kampus {kampus.nama}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse text-sm table-fixed">
                                                <thead>
                                                    <tr className="bg-muted/50">
                                                        <th className="w-32 border p-2 font-semibold sticky left-0 bg-muted/50 z-10">
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
                                                        const renderedCells: Record<number, Set<number>> = {};
                                                        hari.forEach(h => {
                                                            renderedCells[h.id] = new Set<number>();
                                                        });
                                                        
                                                        return slots.map((slot, slotIdx) => (
                                                            <tr key={slot.id} className="h-24">
                                                                <td className="border p-2 text-center font-mono text-xs font-semibold sticky left-0 bg-background h-24">
                                                                    {slot.waktu_mulai.slice(0, 5)}<br />-<br />{slot.waktu_selesai.slice(0, 5)}
                                                                </td>
                                                                {hari.map((h) => {
                                                                    // Skip jika cell ini sudah di-render sebagai bagian dari rowspan
                                                                    if (renderedCells[h.id].has(slot.id)) {
                                                                        return null;
                                                                    }
                                                                    
                                                                    const cellsData = jadwalKampus[selectedMinggu]?.[h.id]?.[slot.id] || [];
                                                                    
                                                                    // Hitung rowspan berdasarkan durasi_slot
                                                                    let maxRowSpan = 1;
                                                                    if (cellsData.length > 0) {
                                                                        maxRowSpan = Math.max(...cellsData.map(c => c.durasi_slot || 1));
                                                                        
                                                                        // Mark cells yang akan di-span
                                                                        for (let i = 0; i < maxRowSpan; i++) {
                                                                            const spanSlotIdx = slotIdx + i;
                                                                            if (spanSlotIdx < slots.length) {
                                                                                const spanSlotId = slots[spanSlotIdx].id;
                                                                                renderedCells[h.id].add(spanSlotId);
                                                                            }
                                                                        }
                                                                    }
                                                                    
                                                                    return (
                                                                        <td 
                                                                            key={h.id} 
                                                                            className="border p-0 h-full"
                                                                            rowSpan={maxRowSpan}
                                                                            style={{ height: `${maxRowSpan * 6}rem` }}
                                                                        >
                                                                            {cellsData.length > 0 ? (
                                                                                <div className="divide-y h-full flex flex-col">
                                                                                    {cellsData.map((cell, idx) => {
                                                                                        // Mapping status ke variant badge
                                                                                        const getStatusVariant = (status: string) => {
                                                                                            switch(status) {
                                                                                                case 'terjadwal': return 'default';
                                                                                                case 'selesai': return 'secondary';
                                                                                                case 'dibatalkan': return 'destructive';
                                                                                                default: return 'outline';
                                                                                            }
                                                                                        };
                                                                                        
                                                                                        return (
                                                                                            <div 
                                                                                                key={idx} 
                                                                                                className="bg-primary/10 p-3 h-full flex flex-col justify-center items-center text-center"
                                                                                            >
                                                                                                <p className="font-bold text-primary text-sm mb-1">
                                                                                                    {cell.matkul}
                                                                                                </p>
                                                                                                <p className="text-xs mb-1">{cell.kelas}</p>
                                                                                                <p className="text-xs text-muted-foreground mb-2">
                                                                                                    {cell.dosen}
                                                                                                </p>
                                                                                                <div className="flex flex-wrap gap-1 justify-center">
                                                                                                    <Badge variant="secondary" className="text-xs">
                                                                                                        {cell.lab}
                                                                                                    </Badge>
                                                                                                    <Badge variant="outline" className="text-xs">
                                                                                                        {cell.sks} SKS
                                                                                                    </Badge>
                                                                                                    <Badge variant="outline" className="text-xs">
                                                                                                        {cell.waktu_mulai.slice(0, 5)} - {cell.waktu_selesai.slice(0, 5)}
                                                                                                    </Badge>
                                                                                                    <Badge variant={getStatusVariant(cell.status)} className="text-xs">
                                                                                                        {cell.status}
                                                                                                    </Badge>
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="h-24"></div>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ));
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
                        <p className="text-muted-foreground">Belum ada jadwal. Silakan generate jadwal di menu Jadwal Master.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
