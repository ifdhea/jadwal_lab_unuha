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

        // Auto-navigate to current week if not specified
        $selectedMinggu = (int) $request->input('minggu');
        if ($semester && !$request->has('minggu')) {
            $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
            $today = Carbon::now();
            $totalMinggu = $semester->total_minggu ?? 16;

            if ($today->lt($tanggalMulai)) {
                $selectedMinggu = 1;
            } else {
                // Hitung minggu dengan memperhitungkan hari Senin sebagai awal minggu
                // Cari Senin dari tanggal mulai semester
                $seninPertama = $tanggalMulai->copy()->startOfWeek(Carbon::MONDAY);
                // Cari Senin dari minggu saat ini
                $seninSekarang = $today->copy()->startOfWeek(Carbon::MONDAY);
                // Hitung selisih minggu
                $diffInWeeks = $seninPertama->diffInWeeks($seninSekarang);
                $currentWeek = $diffInWeeks + 1;
                $selectedMinggu = max(1, min($currentWeek, $totalMinggu));
            }
        } elseif (!$selectedMinggu) {
            $selectedMinggu = 1;
        }
        
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

        // Ambil sesi jadwal - QUERY BY DATE RANGE bukan pertemuan_ke
        // Gunakan $tanggalMulai dan $mingguStart yang sudah ada di atas
        if ($tanggalMulai) {
            $mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek();
            $mingguEnd = $mingguStart->copy()->addDays(5); // Senin - Sabtu
        } else {
            // Fallback jika tanggalMulai null
            $mingguStart = Carbon::now()->startOfWeek();
            $mingguEnd = $mingguStart->copy()->addDays(5);
        }

        $sesiJadwals = SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($selectedSemesterId) {
                $query->where('semester_id', $selectedSemesterId);
            })
            ->whereBetween('tanggal', [$mingguStart->format('Y-m-d'), $mingguEnd->format('Y-m-d')])
            ->with([
                'jadwalMaster.laboratorium.kampus',
                'jadwalMaster.dosen.user',
                'jadwalMaster.dosen',
                'jadwalMaster.kelasMatKul.kelas',
                'jadwalMaster.kelasMatKul.mataKuliah',
                'jadwalMaster.slotWaktuMulai',
                'jadwalMaster.slotWaktuSelesai'
            ])
            ->whereNotIn('status', ['dibatalkan']) // Filter jadwal yang dibatalkan
            ->get();
        
        \Log::info('Jadwal Utama - Calendar Query', [
            'selected_minggu' => $selectedMinggu,
            'date_range' => [$mingguStart->format('Y-m-d'), $mingguEnd->format('Y-m-d')],
            'total_sesi' => $sesiJadwals->count(),
        ]);

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
            
            // PENTING: Gunakan hari dari TANGGAL SESI, bukan dari master
            // Karena sesi bisa dipindah ke hari lain via tukar jadwal
            $tanggalSesi = Carbon::parse($sesi->tanggal);
            $hariNamaSesi = $tanggalSesi->locale('id')->dayName;
            $hariNamaSesiCapitalized = ucfirst($hariNamaSesi);
            $hariId = $hariMap[$hariNamaSesiCapitalized] ?? null;
            
            // Gunakan override jika ada (untuk jadwal yang ditukar)
            $slotMulaiId = $sesi->override_slot_waktu_mulai_id ?? $master->slot_waktu_mulai_id;
            $slotSelesaiId = $sesi->override_slot_waktu_selesai_id ?? $master->slot_waktu_selesai_id;
            $labId = $sesi->override_laboratorium_id ?? $master->laboratorium_id;
            
            // Hitung durasi_slot yang BENAR berdasarkan slot aktual (dengan override)
            $durasiSlot = $slotSelesaiId - $slotMulaiId + 1;
            
            // Load actual slot/lab objects
            $slotMulai = $sesi->overrideSlotWaktuMulai ?? $master->slotWaktuMulai;
            $slotSelesai = $sesi->overrideSlotWaktuSelesai ?? $master->slotWaktuSelesai;
            $lab = $sesi->overrideLaboratorium ?? $master->laboratorium;
            
            $slotId = $slotMulaiId;

            if ($hariId) {
                // Gunakan selectedMinggu sebagai key, bukan pertemuan_ke
                if (!isset($jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId])) {
                    $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId] = [];
                }
                
                // Cek apakah user adalah dosen pemilik jadwal ini
                $user = $request->user();
                $isMySchedule = false;
                if ($user && $user->peran === 'dosen' && $user->dosen) {
                    $isMySchedule = ($master->dosen_id === $user->dosen->id);
                }
                
                // Check if this is a swapped schedule
                $isSwapped = \App\Models\TukarJadwal::where(function($q) use ($sesi) {
                        $q->where('sesi_jadwal_pemohon_id', $sesi->id)
                          ->orWhere('sesi_jadwal_mitra_id', $sesi->id);
                    })
                    ->where('status', 'disetujui')
                    ->where('jenis', 'tukar')
                    ->exists();
                
                // Check if past and active using timezone-aware comparison
                $now = now(); // Already uses Asia/Jakarta from config
                $jadwalStart = Carbon::parse($sesi->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($slotMulai->waktu_mulai);
                $jadwalEnd = Carbon::parse($sesi->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($slotSelesai->waktu_selesai);
                $isActive = $now->between($jadwalStart, $jadwalEnd);
                $isPast = $now->greaterThan($jadwalEnd);
                
                $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [
                    'sesi_jadwal_id' => $sesi->id,
                    'matkul' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'dosen' => $master->dosen->nama_lengkap,
                    'lab' => $lab->nama,
                    'sks' => $master->kelasMatKul->mataKuliah->sks,
                    'durasi_slot' => $durasiSlot, // Gunakan durasi yang dihitung dari slot aktual
                    'waktu_mulai' => $slotMulai->waktu_mulai,
                    'waktu_selesai' => $slotSelesai->waktu_selesai,
                    'status' => $sesi->status,
                    'is_my_schedule' => $isMySchedule,
                    'tanggal' => $sesi->tanggal->format('Y-m-d'),
                    'is_past' => $isPast,
                    'is_active' => $isActive,
                    'is_swapped' => $isSwapped,
                    'slot_waktu_mulai_id' => $slotMulaiId,
                    'laboratorium_id' => $labId,
                    'has_override' => $sesi->override_slot_waktu_mulai_id !== null,
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
                ->with(['dosen.user', 'dosen', 'laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai', 'kelasMatKul.mataKuliah', 'kelasMatKul.kelas'])
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

                        // Check if past and active using timezone-aware comparison
                        $now = now(); // Already uses Asia/Jakarta from config
                        $jadwalStart = Carbon::parse($tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($booking->slotWaktuMulai->waktu_mulai);
                        $jadwalEnd = Carbon::parse($tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($booking->slotWaktuSelesai->waktu_selesai);
                        $isActive = $now->between($jadwalStart, $jadwalEnd);
                        $isPast = $now->greaterThan($jadwalEnd);
                        
                        // Check if this is my schedule
                        $user = $request->user();
                        $isMySchedule = false;
                        if ($user && $user->peran === 'dosen' && $user->dosen) {
                            $isMySchedule = ($booking->dosen_id === $user->dosen->id);
                        }
                        
                        $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [
                            'booking_id' => $booking->id,
                            'matkul' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->nama : '-',
                            'kelas' => $booking->kelasMatKul ? $booking->kelasMatKul->kelas->nama : '-',
                            'dosen' => $booking->dosen->nama_lengkap,
                            'lab' => $booking->laboratorium->nama,
                            'sks' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->sks : $booking->durasi_slot,
                            'durasi_slot' => $booking->durasi_slot,
                            'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                            'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                            'status' => 'booking',
                            'tanggal' => $booking->tanggal,
                            'is_my_schedule' => $isMySchedule,
                            'is_past' => $isPast,
                            'is_active' => $isActive,
                            'is_swapped' => false,
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

        // Build table data
        $tableData = [];
        foreach ($jadwalData as $kampusId => $mingguData2) {
            $kampus = $kampusList->firstWhere('id', $kampusId);
            foreach ($mingguData2 as $minggu => $hariData) {
                foreach ($hariData as $hariId => $slotData) {
                    foreach ($slotData as $slotId => $cells) {
                        foreach ($cells as $cell) {
                            $tableData[] = array_merge($cell, [
                                'kampus' => $kampus ? $kampus->nama : '-',
                            ]);
                        }
                    }
                }
            }
        }

        // Sort by tanggal and waktu_mulai
        usort($tableData, function ($a, $b) {
            $dateCompare = strcmp($a['tanggal'], $b['tanggal']);
            if ($dateCompare !== 0) return $dateCompare;
            return strcmp($a['waktu_mulai'], $b['waktu_mulai']);
        });

        return Inertia::render('Jadwal/Index', [
            'semesters' => $semesters,
            'selectedSemesterId' => $selectedSemesterId,
            'kampusList' => $kampusList,
            'mingguList' => $mingguList,
            'selectedMinggu' => $selectedMinggu,
            'hari' => $hari,
            'slots' => $slots,
            'jadwalData' => $jadwalData,
            'tableData' => $tableData,
            'isEmbed' => $request->has('embed'),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Jadwal Final', 'href' => '/jadwal'],
            ],
        ]);
    }

    public function embed(Request $request)
    {
        // Gunakan logic yang sama dengan index(), tapi render ke layout embed
        $semesters = Semester::where('is_aktif', true)->orderBy('tanggal_mulai', 'desc')->get();
        $selectedSemesterId = $request->input('semester_id', $semesters->first()->id ?? null);

        if (!$selectedSemesterId) {
            return Inertia::render('Jadwal/Embed', [
                'semesters' => $semesters,
                'selectedSemesterId' => null,
                'kampusList' => [],
                'mingguList' => [],
                'selectedMinggu' => 1,
                'hari' => [],
                'slots' => [],
                'jadwalData' => [],
            ]);
        }

        $semester = Semester::find($selectedSemesterId);

        // Auto-navigate to current week if not specified
        $selectedMinggu = (int) $request->input('minggu');
        if ($semester && !$request->has('minggu')) {
            $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
            $today = Carbon::now();
            $totalMinggu = $semester->total_minggu ?? 16;

            if ($today->lt($tanggalMulai)) {
                $selectedMinggu = 1;
            } else {
                $diffInDays = $tanggalMulai->startOfDay()->diffInDays($today->startOfDay());
                $currentWeek = (int)floor($diffInDays / 7) + 1;
                $selectedMinggu = max(1, min($currentWeek, $totalMinggu));
            }
        } elseif (!$selectedMinggu) {
            $selectedMinggu = 1;
        }
        
        // Panggil method index untuk mendapatkan data
        // Tapi kita perlu duplikasi logic atau extract ke method terpisah
        // Untuk sementara, redirect ke index dengan parameter yang sama
        return redirect()->route('jadwal.index', [
            'semester_id' => $selectedSemesterId,
            'minggu' => $selectedMinggu
        ]);
    }

    public function export(Request $request)
    {
        $semesters = Semester::where('is_aktif', true)->orderBy('tanggal_mulai', 'desc')->get();
        $selectedSemesterId = $request->input('semester_id', $semesters->first()->id ?? null);

        if (!$selectedSemesterId) {
            return back()->with('error', 'Semester tidak ditemukan');
        }

        $semester = Semester::find($selectedSemesterId);
        $kampusList = Kampus::where('is_aktif', true)->orderBy('kode')->get();
        $slots = SlotWaktu::where('is_aktif', true)->orderBy('waktu_mulai')->get();
        
        $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
        $totalMinggu = $semester->total_minggu ?? 16;

        // Generate sheets untuk setiap minggu
        $sheets = [];
        
        for ($mingguNomor = 1; $mingguNomor <= $totalMinggu; $mingguNomor++) {
            $mingguStart = $tanggalMulai->copy()->addWeeks($mingguNomor - 1)->startOfWeek(Carbon::MONDAY);
            $mingguEnd = $mingguStart->copy()->addDays(5);

            // Ambil semua jadwal untuk minggu ini
            $sesiJadwals = SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($selectedSemesterId) {
                    $query->where('semester_id', $selectedSemesterId);
                })
                ->whereBetween('tanggal', [$mingguStart->format('Y-m-d'), $mingguEnd->format('Y-m-d')])
                ->with([
                    'jadwalMaster.laboratorium.kampus',
                    'jadwalMaster.dosen.user',
                    'jadwalMaster.dosen',
                    'jadwalMaster.kelasMatKul.kelas',
                    'jadwalMaster.kelasMatKul.mataKuliah',
                    'jadwalMaster.slotWaktuMulai',
                    'jadwalMaster.slotWaktuSelesai',
                    'overrideSlotWaktuMulai',
                    'overrideSlotWaktuSelesai',
                    'overrideLaboratorium.kampus'
                ])
                ->whereNotIn('status', ['dibatalkan'])
                ->get();

            // Ambil booking yang disetujui
            $bookings = \App\Models\BookingLaboratorium::where('status', 'disetujui')
                ->whereDate('tanggal', '>=', $mingguStart)
                ->whereDate('tanggal', '<=', $mingguEnd)
                ->with(['dosen.user', 'dosen', 'laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai', 'kelasMatKul.mataKuliah', 'kelasMatKul.kelas'])
                ->get();

            // Build struktur jadwal per lab/hari/slot
            $jadwalMap = [];
            
            // Process sesi jadwal reguler
            foreach ($sesiJadwals as $sesi) {
                $master = $sesi->jadwalMaster;
                $tanggalSesi = Carbon::parse($sesi->tanggal);
                $hariNama = ucfirst($tanggalSesi->locale('id')->dayName);
                
                $slotMulaiId = $sesi->override_slot_waktu_mulai_id ?? $master->slot_waktu_mulai_id;
                $slotSelesaiId = $sesi->override_slot_waktu_selesai_id ?? $master->slot_waktu_selesai_id;
                $labId = $sesi->override_laboratorium_id ?? $master->laboratorium_id;
                $lab = $sesi->overrideLaboratorium ?? $master->laboratorium;
                
                $slotMulai = $sesi->overrideSlotWaktuMulai ?? $master->slotWaktuMulai;
                $slotSelesai = $sesi->overrideSlotWaktuSelesai ?? $master->slotWaktuSelesai;
                
                $key = $labId . '_' . $tanggalSesi->format('Y-m-d') . '_' . $slotMulaiId;
                
                // Tentukan status berdasarkan kondisi sesi
                $statusText = 'Terjadwal';
                if ($sesi->status === 'tidak_masuk') {
                    $statusText = 'Tidak Masuk';
                } elseif ($sesi->override_slot_waktu_mulai_id || $sesi->override_laboratorium_id) {
                    $statusText = 'Terjadwal (Ditukar)';
                }
                
                $jadwalMap[$key] = [
                    'kampus' => $lab->kampus->nama,
                    'laboratorium' => $lab->nama,
                    'hari' => $hariNama,
                    'tanggal' => $tanggalSesi->format('Y-m-d'),
                    'waktu_mulai' => $slotMulai->waktu_mulai,
                    'waktu_selesai' => $slotSelesai->waktu_selesai,
                    'status' => $statusText,
                    'mata_kuliah' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'dosen' => $master->dosen->nama_lengkap,
                    'sks' => $master->kelasMatKul->mataKuliah->sks,
                    'keperluan' => '-',
                ];
            }

            // Process booking
            foreach ($bookings as $booking) {
                $tanggalBooking = Carbon::parse($booking->tanggal);
                $hariNama = $this->getHariIndonesia($tanggalBooking->dayOfWeek);
                
                $key = $booking->laboratorium_id . '_' . $tanggalBooking->format('Y-m-d') . '_' . $booking->slot_waktu_mulai_id;
                
                $jadwalMap[$key] = [
                    'kampus' => $booking->laboratorium->kampus->nama,
                    'laboratorium' => $booking->laboratorium->nama,
                    'hari' => $hariNama,
                    'tanggal' => $tanggalBooking->format('Y-m-d'),
                    'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                    'status' => 'Booking',
                    'mata_kuliah' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->nama : '-',
                    'kelas' => $booking->kelasMatKul ? $booking->kelasMatKul->kelas->nama : '-',
                    'dosen' => $booking->dosen->nama_lengkap,
                    'sks' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->sks : '-',
                    'keperluan' => $booking->keperluan,
                ];
            }

            // Build complete data including empty slots untuk minggu ini
            $mingguData = [];
            
            foreach ($kampusList as $kampus) {
                $labs = \App\Models\Laboratorium::where('kampus_id', $kampus->id)
                    ->where('is_aktif', true)
                    ->orderBy('nama')
                    ->get();
                
                foreach ($labs as $lab) {
                    // Loop untuk setiap hari
                    for ($dayOffset = 0; $dayOffset < 6; $dayOffset++) {
                        $currentDate = $mingguStart->copy()->addDays($dayOffset);
                        $hariNama = $this->getHariIndonesia($currentDate->dayOfWeek);
                        
                        // Loop untuk setiap slot
                        foreach ($slots as $slot) {
                            $key = $lab->id . '_' . $currentDate->format('Y-m-d') . '_' . $slot->id;
                            
                            if (isset($jadwalMap[$key])) {
                                // Slot terisi
                                $mingguData[] = $jadwalMap[$key];
                            } else {
                                // Slot kosong
                                $mingguData[] = [
                                    'kampus' => $kampus->nama,
                                    'laboratorium' => $lab->nama,
                                    'hari' => $hariNama,
                                    'tanggal' => $currentDate->format('Y-m-d'),
                                    'waktu_mulai' => $slot->waktu_mulai,
                                    'waktu_selesai' => $slot->waktu_selesai,
                                    'status' => 'Kosong',
                                    'mata_kuliah' => '-',
                                    'kelas' => '-',
                                    'dosen' => '-',
                                    'sks' => '-',
                                    'keperluan' => '-',
                                ];
                            }
                        }
                    }
                }
            }
            
            // Buat sheet untuk minggu ini
            $sheets[] = new \App\Exports\JadwalMingguSheet(
                $mingguData,
                $mingguNomor,
                $mingguStart->format('Y-m-d'),
                $mingguEnd->format('Y-m-d')
            );
        }

        // Bersihkan nama semester dari karakter yang tidak diperbolehkan dalam nama file
        $semesterNama = str_replace(['/', '\\'], '-', $semester->nama);
        $filename = 'jadwal-lab-semester-' . $semesterNama . '-' . date('Y-m-d') . '.xlsx';
        
        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\JadwalExport($sheets),
            $filename
        );
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
