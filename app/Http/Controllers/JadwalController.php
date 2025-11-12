<?php

namespace App\Http\Controllers;

use App\Models\JadwalMaster;
use App\Models\SesiJadwal;
use App\Models\Kampus;
use App\Models\Semester;
use App\Models\SlotWaktu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class JadwalController extends Controller
{
    public function index(Request $request)
    {
        $semesters = Semester::where('is_aktif', true)->orderBy('tanggal_mulai', 'desc')->get();
        $selectedSemesterId = $request->input('semester_id', $semesters->first()->id ?? null);
        $selectedMinggu = (int) $request->input('minggu', 1);

        if (!$selectedSemesterId) {
            return Inertia::render('Jadwal/Index', [
                'semesters' => $semesters,
                'selectedSemesterId' => null,
                'kampusList' => [],
                'mingguList' => [],
                'selectedMinggu' => 1,
                'hari' => [],
                'slots' => [],
                'jadwalData' => [],
                'breadcrumbs' => [
                    ['title' => 'Dashboard', 'href' => '/dashboard'],
                    ['title' => 'Jadwal Final', 'href' => '/jadwal'],
                ],
            ]);
        }

        $semester = Semester::find($selectedSemesterId);
        
        // Data kampus
        $kampusList = Kampus::where('is_aktif', true)
            ->orderBy('kode')
            ->get(['id', 'kode', 'nama']);

        // Generate daftar minggu
        $mingguList = [];
        $tanggalMulai = null;
        if ($semester) {
            $totalMinggu = $semester->total_minggu ?? 16;
            $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
            
            for ($i = 1; $i <= $totalMinggu; $i++) {
                $start = $tanggalMulai->copy()->addWeeks($i - 1)->startOfWeek(Carbon::MONDAY);
                $end = $start->copy()->addDays(5); // Senin + 5 hari = Sabtu
                $mingguList[] = [
                    'nomor' => $i,
                    'tanggal_mulai' => $start->format('Y-m-d'),
                    'tanggal_selesai' => $end->format('Y-m-d'),
                ];
            }
        }

        // Generate hari dengan tanggal untuk minggu yang dipilih
        $hari = [];
        if ($tanggalMulai) {
            $mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek(Carbon::MONDAY);
            foreach ([1 => 'Senin', 2 => 'Selasa', 3 => 'Rabu', 4 => 'Kamis', 5 => 'Jumat', 6 => 'Sabtu'] as $id => $nama) {
                $tanggalHari = $mingguStart->copy()->addDays($id - 1);
                $hari[] = [
                    'id' => $id,
                    'nama' => $nama,
                    'tanggal' => $tanggalHari->format('Y-m-d'),
                ];
            }
        } else {
            $hari = [
                ['id' => 1, 'nama' => 'Senin'],
                ['id' => 2, 'nama' => 'Selasa'],
                ['id' => 3, 'nama' => 'Rabu'],
                ['id' => 4, 'nama' => 'Kamis'],
                ['id' => 5, 'nama' => 'Jumat'],
                ['id' => 6, 'nama' => 'Sabtu'],
            ];
        }

        $slots = SlotWaktu::orderBy('waktu_mulai')
            ->get(['id', 'waktu_mulai', 'waktu_selesai']);

        // Ambil sesi jadwal untuk minggu yang dipilih
        $sesiJadwals = SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($selectedSemesterId) {
                $query->where('semester_id', $selectedSemesterId);
            })
            ->where('pertemuan_ke', $selectedMinggu)
            ->with([
                'jadwalMaster.laboratorium.kampus',
                'jadwalMaster.dosen.user',
                'jadwalMaster.kelasMatKul.kelas',
                'jadwalMaster.kelasMatKul.mataKuliah',
                'jadwalMaster.slotWaktuMulai',
                'jadwalMaster.slotWaktuSelesai'
            ])
            ->whereNotIn('status', ['dibatalkan']) // Filter jadwal yang dibatalkan
            ->get();

        // Struktur data: jadwalData[kampus_id][minggu][hari_id][slot_id][] = { matkul, kelas, dosen, lab, sks, durasi_slot, waktu_mulai, waktu_selesai }
        $jadwalData = [];
        $hariMap = [
            'Senin' => 1,
            'Selasa' => 2,
            'Rabu' => 3,
            'Kamis' => 4,
            'Jumat' => 5,
            'Sabtu' => 6,
        ];

        foreach ($sesiJadwals as $sesi) {
            $master = $sesi->jadwalMaster;
            $kampusId = $master->laboratorium->kampus_id;
            $hariId = $hariMap[$master->hari] ?? null;
            $slotId = $master->slot_waktu_mulai_id;
            $minggu = $sesi->pertemuan_ke;

            if ($hariId) {
                // Gunakan array untuk support multiple jadwal di slot yang sama
                if (!isset($jadwalData[$kampusId][$minggu][$hariId][$slotId])) {
                    $jadwalData[$kampusId][$minggu][$hariId][$slotId] = [];
                }
                
                // Cek apakah user adalah dosen pemilik jadwal ini
                $user = $request->user();
                $isMySchedule = false;
                if ($user && $user->peran === 'dosen' && $user->dosen) {
                    $isMySchedule = ($master->dosen_id === $user->dosen->id);
                }
                
                // Re-calculate date on the fly to ensure synchronization
                $weekStartDateForSesi = $tanggalMulai->copy()->addWeeks($sesi->pertemuan_ke - 1)->startOfWeek(Carbon::MONDAY);
                $correctDateForSesi = $weekStartDateForSesi->copy()->addDays($hariId - 1);

                $jadwalData[$kampusId][$minggu][$hariId][$slotId][] = [
                    'sesi_jadwal_id' => $sesi->id,
                    'matkul' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'dosen' => $master->dosen->user->name,
                    'lab' => $master->laboratorium->nama,
                    'sks' => $master->kelasMatKul->mataKuliah->sks,
                    'durasi_slot' => $master->durasi_slot,
                    'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                    'status' => $sesi->status,
                    'is_my_schedule' => $isMySchedule,
                    'tanggal' => $correctDateForSesi->format('Y-m-d'),
                    'is_past' => $correctDateForSesi->isPast() && !$correctDateForSesi->isToday(),
                    'slot_waktu_mulai_id' => $master->slot_waktu_mulai_id,
                    'laboratorium_id' => $master->laboratorium_id,
                ];
            }
        }

        // Tambahkan booking yang disetujui ke jadwal
        if ($tanggalMulai && $selectedMinggu) {
            $mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek(Carbon::MONDAY);
            $weekEnd = $mingguStart->copy()->addDays(5);
            
            $bookings = \App\Models\BookingLaboratorium::where('status', 'disetujui')
                ->whereDate('tanggal', '>=', $mingguStart)
                ->whereDate('tanggal', '<=', $weekEnd)
                ->with(['dosen.user', 'laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai', 'kelasMatKul.mataKuliah', 'kelasMatKul.kelas'])
                ->get();

            foreach ($bookings as $booking) {
                $tanggal = Carbon::parse($booking->tanggal);
                $hariId = $hariMap[$this->getHariIndonesia($tanggal->dayOfWeek)] ?? null;
                
                if (!$hariId) continue;

                $kampusId = $booking->laboratorium->kampus_id;

                // Iterasi hanya untuk slot aktif (skip slot istirahat)
                $currentUrutan = $booking->slotWaktuMulai->urutan;
                $slotCounter = 0;
                
                while ($slotCounter < $booking->durasi_slot) {
                    $currentSlot = SlotWaktu::where('urutan', $currentUrutan)->first();
                    
                    if (!$currentSlot) break;
                    
                    // Hanya proses slot aktif
                    if ($currentSlot->is_aktif) {
                        $slotId = $currentSlot->id;

                        if (!isset($jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId])) {
                            $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId] = [];
                        }

                        $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [
                            'booking_id' => $booking->id,
                            'matkul' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->nama : '-',
                            'kelas' => $booking->kelasMatKul ? $booking->kelasMatKul->kelas->nama : '-',
                            'dosen' => $booking->dosen->user->name,
                            'lab' => $booking->laboratorium->nama,
                            'sks' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->sks : $booking->durasi_slot,
                            'durasi_slot' => $booking->durasi_slot,
                            'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                            'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                            'status' => 'booking',
                            'tanggal' => $booking->tanggal,
                            'is_past' => $tanggal->isPast() && !$tanggal->isToday(),
                            'slot_position' => $slotCounter,
                            'is_first_slot' => $slotCounter === 0,
                            'is_last_slot' => $slotCounter === ($booking->durasi_slot - 1),
                        ];
                        
                        $slotCounter++;
                    }
                    
                    $currentUrutan++;
                }
            }
        }

        return Inertia::render('Jadwal/Index', [
            'semesters' => $semesters,
            'selectedSemesterId' => $selectedSemesterId,
            'kampusList' => $kampusList,
            'mingguList' => $mingguList,
            'selectedMinggu' => $selectedMinggu,
            'hari' => $hari,
            'slots' => $slots,
            'jadwalData' => $jadwalData,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Jadwal Final', 'href' => '/jadwal'],
            ],
        ]);
    }

    private function getHariIndonesia($dayOfWeek)
    {
        $hari = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        return $hari[$dayOfWeek] ?? '';
    }
}
