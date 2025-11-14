<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\JadwalMaster;
use App\Models\Kampus;
use App\Models\Kelas;
use App\Models\Laboratorium;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use App\Models\Semester;
use App\Models\SesiJadwal;
use App\Models\TahunAjaran;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->peran === 'super_admin' || $user->peran === 'admin') {
            return $this->superAdminDashboard();
        }

        if ($user->peran === 'dosen') {
            return $this->dosenDashboard();
        }

        return Inertia::render('dashboard');
    }

    private function superAdminDashboard()
    {
        $semesterAktif = Semester::where('is_aktif', true)->first();
        $tahunAjaranAktif = TahunAjaran::where('is_aktif', true)->first();

        // Statistik Umum
        $stats = [
            'total_kampus' => Kampus::where('is_aktif', true)->count(),
            'total_laboratorium' => Laboratorium::where('is_aktif', true)->count(),
            'total_program_studi' => ProgramStudi::where('is_aktif', true)->count(),
            'total_dosen' => Dosen::where('is_aktif', true)->count(),
            'total_kelas' => Kelas::where('is_aktif', true)->count(),
            'total_mata_kuliah' => MataKuliah::where('is_aktif', true)->count(),
        ];

        // Statistik Jadwal
        if ($semesterAktif) {
            $jadwalStats = [
                'total_jadwal_master' => JadwalMaster::whereHas('kelasMatKul', function ($query) use ($semesterAktif) {
                    $query->where('semester_id', $semesterAktif->id);
                })->count(),
                'jadwal_konflik' => JadwalMaster::whereHas('kelasMatKul', function ($query) use ($semesterAktif) {
                    $query->where('semester_id', $semesterAktif->id);
                })->where('status_konflik', 'konflik')->count(),
                'total_sesi_terjadwal' => SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($semesterAktif) {
                    $query->where('semester_id', $semesterAktif->id);
                })->count(),
            ];
        } else {
            $jadwalStats = [
                'total_jadwal_master' => 0,
                'jadwal_konflik' => 0,
                'total_sesi_terjadwal' => 0,
            ];
        }

        // Penggunaan Lab per Kampus
        $labUsage = [];
        if ($semesterAktif) {
            $kampusList = Kampus::where('is_aktif', true)->with('laboratorium')->get();
            foreach ($kampusList as $kampus) {
                $labUsage[] = [
                    'kampus' => $kampus->nama,
                    'total_lab' => $kampus->laboratorium()->where('is_aktif', true)->count(),
                    'lab_terpakai' => JadwalMaster::whereHas('kelasMatKul', function ($query) use ($semesterAktif) {
                        $query->where('semester_id', $semesterAktif->id);
                    })->whereHas('laboratorium', function ($query) use ($kampus) {
                        $query->where('kampus_id', $kampus->id);
                    })->distinct('laboratorium_id')->count('laboratorium_id'),
                ];
            }
        }

        // Jadwal Hari Ini
        $jadwalHariIni = [];
        if ($semesterAktif) {
            $today = Carbon::today();
            $hariIni = $this->getHariIndonesia($today->dayOfWeek);
            
            $jadwalHariIni = SesiJadwal::whereDate('tanggal', $today)
                ->with([
                    'jadwalMaster.laboratorium.kampus',
                    'jadwalMaster.dosen.user',
                    'jadwalMaster.kelasMatKul.kelas',
                    'jadwalMaster.kelasMatKul.mataKuliah',
                    'jadwalMaster.slotWaktuMulai',
                    'jadwalMaster.slotWaktuSelesai'
                ])
                ->get()
                ->map(function ($sesi) {
                    $master = $sesi->jadwalMaster;
                    return [
                        'id' => $sesi->id,
                        'mata_kuliah' => $master->kelasMatKul->mataKuliah->nama,
                        'kelas' => $master->kelasMatKul->kelas->nama,
                        'dosen' => $master->dosen->user->name,
                        'laboratorium' => $master->laboratorium->nama,
                        'kampus' => $master->laboratorium->kampus->nama,
                        'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                        'status' => $sesi->status,
                        'pertemuan_ke' => $sesi->pertemuan_ke,
                    ];
                })
                ->sortBy('waktu_mulai')
                ->values();
        }

        return Inertia::render('dashboard', [
            'userRole' => 'super_admin',
            'semesterAktif' => $semesterAktif ? [
                'id' => $semesterAktif->id,
                'nama' => $semesterAktif->nama,
                'tanggal_mulai' => $semesterAktif->tanggal_mulai,
                'tanggal_selesai' => $semesterAktif->tanggal_selesai,
            ] : null,
            'tahunAjaranAktif' => $tahunAjaranAktif ? [
                'id' => $tahunAjaranAktif->id,
                'nama' => $tahunAjaranAktif->nama,
            ] : null,
            'stats' => $stats,
            'jadwalStats' => $jadwalStats,
            'labUsage' => $labUsage,
            'jadwalHariIni' => $jadwalHariIni,
        ]);
    }

    private function dosenDashboard()
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if (!$dosen) {
            return Inertia::render('dashboard', [
                'userRole' => 'dosen',
                'error' => 'Data dosen tidak ditemukan',
            ]);
        }

        $semesterAktif = Semester::where('is_aktif', true)->first();

        // Statistik Dosen
        $stats = [
            'total_mata_kuliah' => 0,
            'total_kelas' => 0,
            'total_pertemuan' => 0,
            'pertemuan_selesai' => 0,
        ];

        if ($semesterAktif) {
            // Jadwal Master dosen
            $jadwalMasterIds = JadwalMaster::where('dosen_id', $dosen->id)
                ->whereHas('kelasMatKul', function ($query) use ($semesterAktif) {
                    $query->where('semester_id', $semesterAktif->id);
                })
                ->pluck('id');

            $stats['total_mata_kuliah'] = JadwalMaster::where('dosen_id', $dosen->id)
                ->whereHas('kelasMatKul', function ($query) use ($semesterAktif) {
                    $query->where('semester_id', $semesterAktif->id);
                })
                ->distinct('kelas_mata_kuliah_id')
                ->count('kelas_mata_kuliah_id');

            $stats['total_kelas'] = JadwalMaster::where('dosen_id', $dosen->id)
                ->whereHas('kelasMatKul', function ($query) use ($semesterAktif) {
                    $query->where('semester_id', $semesterAktif->id);
                })
                ->join('kelas_mata_kuliah', 'jadwal_master.kelas_mata_kuliah_id', '=', 'kelas_mata_kuliah.id')
                ->distinct('kelas_mata_kuliah.kelas_id')
                ->count('kelas_mata_kuliah.kelas_id');

            $stats['total_pertemuan'] = SesiJadwal::whereIn('jadwal_master_id', $jadwalMasterIds)->count();
            
            // PERBAIKAN: Hitung pertemuan selesai berdasarkan jadwal yang sudah lewat
            $now = Carbon::now();
            $stats['pertemuan_selesai'] = SesiJadwal::whereIn('jadwal_master_id', $jadwalMasterIds)
                ->where(function($query) use ($now) {
                    // Status selesai ATAU jadwal sudah lewat
                    $query->where('status', 'selesai')
                          ->orWhere(function($q) use ($now) {
                              $q->whereDate('tanggal', '<', $now->toDateString());
                          });
                })
                ->count();

            // Jadwal Hari Ini - Menampilkan SEMUA jadwal (generate, booking, tukar, pindah)
            $today = Carbon::today();
            $now = Carbon::now();
            
            // 1. Ambil sesi jadwal dari jadwal master
            $sesiJadwalHariIni = SesiJadwal::whereIn('jadwal_master_id', $jadwalMasterIds)
                ->whereDate('tanggal', $today)
                ->with([
                    'jadwalMaster.laboratorium.kampus',
                    'jadwalMaster.kelasMatKul.kelas',
                    'jadwalMaster.kelasMatKul.mataKuliah',
                    'jadwalMaster.slotWaktuMulai',
                    'jadwalMaster.slotWaktuSelesai',
                    'jadwalMaster.dosen.user',
                    'overrideSlotWaktuMulai',
                    'overrideSlotWaktuSelesai',
                    'overrideLaboratorium.kampus'
                ])
                ->get();
            
            // 2. Ambil booking hari ini yang disetujui
            $bookingHariIni = \App\Models\BookingLaboratorium::where('dosen_id', $dosen->id)
                ->where('status', 'disetujui')
                ->whereDate('tanggal', $today)
                ->with([
                    'laboratorium.kampus',
                    'kelasMatKul.kelas',
                    'kelasMatKul.mataKuliah',
                    'slotWaktuMulai',
                    'slotWaktuSelesai'
                ])
                ->get();
            
            // Gabungkan kedua collection
            $jadwalHariIni = collect();
            
            // Proses sesi jadwal
            foreach ($sesiJadwalHariIni as $sesi) {
                $master = $sesi->jadwalMaster;
                
                // Gunakan override jika ada
                $slotMulai = $sesi->overrideSlotWaktuMulai ?? $master->slotWaktuMulai;
                $slotSelesai = $sesi->overrideSlotWaktuSelesai ?? $master->slotWaktuSelesai;
                $lab = $sesi->overrideLaboratorium ?? $master->laboratorium;
                
                // Cek apakah jadwal sudah lewat atau sedang berlangsung
                $tanggalWaktuMulai = Carbon::parse($sesi->tanggal . ' ' . $slotMulai->waktu_mulai);
                $tanggalWaktuSelesai = Carbon::parse($sesi->tanggal . ' ' . $slotSelesai->waktu_selesai);
                $isPast = $now->greaterThan($tanggalWaktuSelesai);
                $isActive = $now->between($tanggalWaktuMulai, $tanggalWaktuSelesai);
                
                // Cek apakah jadwal milik dosen ini
                $isMySchedule = $master->dosen_id == $dosen->id;
                
                // Cek apakah jadwal hasil tukar
                $isSwapped = \App\Models\TukarJadwal::where(function($q) use ($sesi) {
                        $q->where('sesi_jadwal_pemohon_id', $sesi->id)
                          ->orWhere('sesi_jadwal_mitra_id', $sesi->id);
                    })
                    ->where('status', 'disetujui')
                    ->where('jenis', 'tukar')
                    ->exists();
                
                $jadwalHariIni->push([
                    'id' => $sesi->id,
                    'tanggal' => $sesi->tanggal,
                    'hari' => $master->hari,
                    'mata_kuliah' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'laboratorium' => $lab->nama,
                    'kampus' => $lab->kampus->nama,
                    'waktu_mulai' => $slotMulai->waktu_mulai,
                    'waktu_selesai' => $slotSelesai->waktu_selesai,
                    'status' => $sesi->status,
                    'pertemuan_ke' => $sesi->pertemuan_ke,
                    'is_my_schedule' => $isMySchedule,
                    'is_past' => $isPast,
                    'is_active' => $isActive,
                    'is_swapped' => $isSwapped,
                    'source' => 'jadwal',
                ]);
            }
            
            // Proses booking
            foreach ($bookingHariIni as $booking) {
                // Parse tanggal dengan benar (tanggal sudah datetime, ambil hanya tanggalnya)
                $tanggalOnly = Carbon::parse($booking->tanggal)->format('Y-m-d');
                $tanggalWaktuMulai = Carbon::parse($tanggalOnly . ' ' . $booking->slotWaktuMulai->waktu_mulai);
                $tanggalWaktuSelesai = Carbon::parse($tanggalOnly . ' ' . $booking->slotWaktuSelesai->waktu_selesai);
                $isPast = $now->greaterThan($tanggalWaktuSelesai);
                $isActive = $now->between($tanggalWaktuMulai, $tanggalWaktuSelesai);
                
                $jadwalHariIni->push([
                    'id' => 'booking_' . $booking->id,
                    'tanggal' => $tanggalOnly,
                    'hari' => Carbon::parse($booking->tanggal)->locale('id')->dayName,
                    'mata_kuliah' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->nama : $booking->keperluan,
                    'kelas' => $booking->kelasMatKul ? $booking->kelasMatKul->kelas->nama : '-',
                    'laboratorium' => $booking->laboratorium->nama,
                    'kampus' => $booking->laboratorium->kampus->nama,
                    'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                    'status' => 'booking',
                    'pertemuan_ke' => null,
                    'is_my_schedule' => true,
                    'is_past' => $isPast,
                    'is_active' => $isActive,
                    'is_swapped' => false,
                    'source' => 'booking',
                ]);
            }
            
            // Sort by waktu_mulai
            $jadwalHariIni = $jadwalHariIni->sortBy('waktu_mulai')->values()->all();
        } else {
            $jadwalHariIni = [];
        }

        return Inertia::render('dashboard', [
            'userRole' => 'dosen',
            'dosen' => [
                'id' => $dosen->id,
                'nama' => $user->name,
                'nidn' => $dosen->nidn,
                'email' => $user->email,
                'program_studi' => $dosen->programStudi ? $dosen->programStudi->nama : null,
            ],
            'semesterAktif' => $semesterAktif ? [
                'id' => $semesterAktif->id,
                'nama' => $semesterAktif->nama,
            ] : null,
            'stats' => $stats,
            'jadwalHariIni' => $jadwalHariIni,
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
