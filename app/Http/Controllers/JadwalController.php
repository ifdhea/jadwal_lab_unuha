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
        if ($semester) {
            $totalMinggu = $semester->total_minggu ?? 16;
            $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
            
            for ($i = 1; $i <= $totalMinggu; $i++) {
                $mingguList[] = [
                    'nomor' => $i,
                    'tanggal_mulai' => $tanggalMulai->copy()->addWeeks($i - 1)->format('Y-m-d'),
                    'tanggal_selesai' => $tanggalMulai->copy()->addWeeks($i - 1)->addDays(6)->format('Y-m-d'),
                ];
            }
        }

        $hari = [
            ['id' => 1, 'nama' => 'Senin'],
            ['id' => 2, 'nama' => 'Selasa'],
            ['id' => 3, 'nama' => 'Rabu'],
            ['id' => 4, 'nama' => 'Kamis'],
            ['id' => 5, 'nama' => 'Jumat'],
            ['id' => 6, 'nama' => 'Sabtu'],
        ];

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
                
                $jadwalData[$kampusId][$minggu][$hariId][$slotId][] = [
                    'matkul' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'dosen' => $master->dosen->user->name,
                    'lab' => $master->laboratorium->nama,
                    'sks' => $master->kelasMatKul->mataKuliah->sks,
                    'durasi_slot' => $master->durasi_slot,
                    'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                    'status' => $sesi->status, // Tambahkan status dari sesi_jadwal
                ];
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
}
