<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\SesiJadwal;
use App\Models\TukarJadwal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TukarJadwalController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if (!$dosen) {
            return redirect()->route('dashboard')->with('error', 'Data dosen tidak ditemukan');
        }

        $query = TukarJadwal::with([
            'pemohon.user',
            'mitra.user',
            'sesiJadwalPemohon.jadwalMaster.kelasMatKul.mataKuliah',
            'sesiJadwalPemohon.jadwalMaster.laboratorium',
            'sesiJadwalMitra.jadwalMaster.kelasMatKul.mataKuliah',
            'sesiJadwalMitra.jadwalMaster.laboratorium',
        ]);

        // Filter berdasarkan role
        if ($user->peran === 'dosen') {
            $query->where(function ($q) use ($dosen) {
                $q->where('pemohon_id', $dosen->id)
                    ->orWhere('mitra_id', $dosen->id);
            });
        }

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tukarJadwals = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('TukarJadwal/Index', [
            'tukarJadwals' => $tukarJadwals->through(function ($item) use ($dosen) {
                return [
                    'id' => $item->id,
                    'pemohon' => [
                        'id' => $item->pemohon->id,
                        'nama' => $item->pemohon->user->name,
                    ],
                    'sesi_pemohon' => [
                        'id' => $item->sesiJadwalPemohon->id,
                        'mata_kuliah' => $item->sesiJadwalPemohon->jadwalMaster->kelasMatKul->mataKuliah->nama,
                        'tanggal' => $item->sesiJadwalPemohon->tanggal,
                        'hari' => $item->sesiJadwalPemohon->jadwalMaster->hari,
                        'laboratorium' => $item->sesiJadwalPemohon->jadwalMaster->laboratorium->nama,
                        'waktu_mulai' => $item->sesiJadwalPemohon->jadwalMaster->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $item->sesiJadwalPemohon->jadwalMaster->slotWaktuSelesai->waktu_selesai,
                    ],
                    'mitra' => $item->mitra ? [
                        'id' => $item->mitra->id,
                        'nama' => $item->mitra->user->name,
                    ] : null,
                    'sesi_mitra' => $item->sesiJadwalMitra ? [
                        'id' => $item->sesiJadwalMitra->id,
                        'mata_kuliah' => $item->sesiJadwalMitra->jadwalMaster->kelasMatKul->mataKuliah->nama,
                        'tanggal' => $item->sesiJadwalMitra->tanggal,
                        'hari' => $item->sesiJadwalMitra->jadwalMaster->hari,
                        'laboratorium' => $item->sesiJadwalMitra->jadwalMaster->laboratorium->nama,
                        'waktu_mulai' => $item->sesiJadwalMitra->jadwalMaster->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $item->sesiJadwalMitra->jadwalMaster->slotWaktuSelesai->waktu_selesai,
                    ] : null,
                    'status' => $item->status,
                    'alasan_pemohon' => $item->alasan_pemohon,
                    'alasan_penolakan' => $item->alasan_penolakan,
                    'tanggal_diajukan' => $item->tanggal_diajukan,
                    'tanggal_diproses' => $item->tanggal_diproses,
                    'is_pemohon' => $item->pemohon_id === $dosen->id,
                    'is_mitra' => $item->mitra_id === $dosen->id,
                ];
            }),
            'filters' => $request->only(['status']),
            'dosenId' => $dosen->id,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if (!$dosen) {
            return redirect()->route('dashboard')->with('error', 'Data dosen tidak ditemukan');
        }

        // Ambil jadwal dosen yang bisa ditukar (status terjadwal, tanggal di masa depan)
        $jadwalDosen = SesiJadwal::whereHas('jadwalMaster', function ($query) use ($dosen) {
            $query->where('dosen_id', $dosen->id);
        })
            ->where('status', 'terjadwal')
            ->where('tanggal', '>=', Carbon::today())
            ->with([
                'jadwalMaster.kelasMatKul.mataKuliah',
                'jadwalMaster.kelasMatKul.kelas',
                'jadwalMaster.laboratorium',
                'jadwalMaster.slotWaktuMulai',
                'jadwalMaster.slotWaktuSelesai',
            ])
            ->orderBy('tanggal')
            ->get()
            ->map(function ($sesi) {
                $master = $sesi->jadwalMaster;
                return [
                    'id' => $sesi->id,
                    'tanggal' => $sesi->tanggal,
                    'hari' => $master->hari,
                    'mata_kuliah' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'laboratorium' => $master->laboratorium->nama,
                    'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                    'pertemuan_ke' => $sesi->pertemuan_ke,
                ];
            });

        // Ambil daftar dosen lain untuk mitra tukar
        $dosenLain = Dosen::where('id', '!=', $dosen->id)
            ->where('is_aktif', true)
            ->with('user')
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->id,
                    'nama' => $d->user->name,
                    'nidn' => $d->nidn,
                ];
            });

        return Inertia::render('TukarJadwal/Create', [
            'jadwalDosen' => $jadwalDosen,
            'dosenLain' => $dosenLain,
        ]);
    }

    public function getJadwalMitra(Request $request)
    {
        $mitraId = $request->mitra_id;
        $tanggal = $request->tanggal;

        $jadwalMitra = SesiJadwal::whereHas('jadwalMaster', function ($query) use ($mitraId) {
            $query->where('dosen_id', $mitraId);
        })
            ->where('status', 'terjadwal')
            ->where('tanggal', $tanggal)
            ->with([
                'jadwalMaster.kelasMatKul.mataKuliah',
                'jadwalMaster.kelasMatKul.kelas',
                'jadwalMaster.laboratorium',
                'jadwalMaster.slotWaktuMulai',
                'jadwalMaster.slotWaktuSelesai',
            ])
            ->get()
            ->map(function ($sesi) {
                $master = $sesi->jadwalMaster;
                return [
                    'id' => $sesi->id,
                    'tanggal' => $sesi->tanggal,
                    'hari' => $master->hari,
                    'mata_kuliah' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'laboratorium' => $master->laboratorium->nama,
                    'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                    'pertemuan_ke' => $sesi->pertemuan_ke,
                ];
            });

        return response()->json(['jadwal' => $jadwalMitra]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if (!$dosen) {
            return redirect()->route('dashboard')->with('error', 'Data dosen tidak ditemukan');
        }

        $validated = $request->validate([
            'sesi_jadwal_pemohon_id' => 'required|exists:sesi_jadwal,id',
            'mitra_id' => 'nullable|exists:dosen,id',
            'sesi_jadwal_mitra_id' => 'nullable|exists:sesi_jadwal,id',
            'alasan_pemohon' => 'required|string|max:1000',
            'jenis' => 'required|in:tukar,pindah',
        ]);

        $sesiPemohon = SesiJadwal::with('jadwalMaster')->find($validated['sesi_jadwal_pemohon_id']);
        
        if ($validated['jenis'] === 'pindah' && !$validated['mitra_id'] && !$validated['sesi_jadwal_mitra_id']) {
            $tanggalPemohon = $sesiPemohon->tanggal;
            $jadwalPemohon = $sesiPemohon->jadwalMaster;
            
            $bentrok = SesiJadwal::whereDate('tanggal', $tanggalPemohon)
                ->where('id', '!=', $sesiPemohon->id)
                ->whereHas('jadwalMaster', function ($q) use ($jadwalPemohon) {
                    $q->where('laboratorium_id', $jadwalPemohon->laboratorium_id)
                        ->where('hari', $jadwalPemohon->hari)
                        ->where(function ($sq) use ($jadwalPemohon) {
                            $sq->where(function ($s) use ($jadwalPemohon) {
                                $s->whereRaw('slot_waktu_mulai_id BETWEEN ? AND ?', [$jadwalPemohon->slot_waktu_mulai_id, $jadwalPemohon->slot_waktu_selesai_id])
                                  ->orWhereRaw('slot_waktu_selesai_id BETWEEN ? AND ?', [$jadwalPemohon->slot_waktu_mulai_id, $jadwalPemohon->slot_waktu_selesai_id]);
                            })->orWhere(function ($s) use ($jadwalPemohon) {
                                $s->where('slot_waktu_mulai_id', '<=', $jadwalPemohon->slot_waktu_mulai_id)
                                  ->where('slot_waktu_selesai_id', '>=', $jadwalPemohon->slot_waktu_selesai_id);
                            });
                        });
                })
                ->where('status', 'terjadwal')
                ->exists();

            if ($bentrok) {
                return redirect()->back()->with('error', 'Tidak dapat pindah: slot waktu yang dipilih bentrok dengan jadwal lain');
            }

            DB::beginTransaction();
            try {
                $sesiPemohon->update([
                    'tanggal' => $request->tanggal_tujuan,
                    'pertemuan_ke' => $request->minggu_tujuan,
                ]);

                TukarJadwal::create([
                    'pemohon_id' => $dosen->id,
                    'sesi_jadwal_pemohon_id' => $validated['sesi_jadwal_pemohon_id'],
                    'mitra_id' => null,
                    'sesi_jadwal_mitra_id' => null,
                    'alasan_pemohon' => $validated['alasan_pemohon'],
                    'status' => 'disetujui',
                    'jenis' => 'pindah',
                    'tanggal_diproses' => now(),
                ]);

                DB::commit();
                return redirect()->route('tukar-jadwal.index')->with('success', 'Jadwal berhasil dipindahkan (langsung disetujui karena slot kosong)');
            } catch (\Exception $e) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Gagal memproses pindah jadwal: ' . $e->getMessage());
            }
        }

        $status = ($validated['jenis'] === 'pindah') ? 'disetujui' : 'menunggu';

        $tukarJadwal = TukarJadwal::create([
            'pemohon_id' => $dosen->id,
            'sesi_jadwal_pemohon_id' => $validated['sesi_jadwal_pemohon_id'],
            'mitra_id' => $validated['mitra_id'] ?? null,
            'sesi_jadwal_mitra_id' => $validated['sesi_jadwal_mitra_id'] ?? null,
            'alasan_pemohon' => $validated['alasan_pemohon'],
            'jenis' => $validated['jenis'],
            'status' => $status,
            'tanggal_diproses' => $status === 'disetujui' ? now() : null,
        ]);

        $message = $status === 'disetujui' 
            ? 'Jadwal berhasil dipindahkan' 
            : 'Permintaan tukar jadwal berhasil diajukan';

        return redirect()->route('tukar-jadwal.index')->with('success', $message);
    }

    public function approve(TukarJadwal $tukarJadwal)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        // Validasi: hanya mitra yang bisa approve
        if ($tukarJadwal->mitra_id !== $dosen->id) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menyetujui permintaan ini');
        }

        if ($tukarJadwal->status !== 'menunggu') {
            return redirect()->back()->with('error', 'Permintaan tukar jadwal sudah diproses');
        }

        DB::beginTransaction();
        try {
            // Tukar dosen di jadwal master
            $jadwalMasterPemohon = $tukarJadwal->sesiJadwalPemohon->jadwalMaster;
            $jadwalMasterMitra = $tukarJadwal->sesiJadwalMitra->jadwalMaster;

            $tempDosenId = $jadwalMasterPemohon->dosen_id;
            $jadwalMasterPemohon->update(['dosen_id' => $jadwalMasterMitra->dosen_id]);
            $jadwalMasterMitra->update(['dosen_id' => $tempDosenId]);

            // Update status tukar jadwal
            $tukarJadwal->update([
                'status' => 'disetujui',
                'tanggal_diproses' => now(),
            ]);

            DB::commit();
            return redirect()->route('tukar-jadwal.index')->with('success', 'Permintaan tukar jadwal berhasil disetujui');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memproses tukar jadwal: ' . $e->getMessage());
        }
    }

    public function reject(Request $request, TukarJadwal $tukarJadwal)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        // Validasi: hanya mitra yang bisa reject
        if ($tukarJadwal->mitra_id !== $dosen->id) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menolak permintaan ini');
        }

        if ($tukarJadwal->status !== 'menunggu') {
            return redirect()->back()->with('error', 'Permintaan tukar jadwal sudah diproses');
        }

        $validated = $request->validate([
            'alasan_penolakan' => 'required|string|max:1000',
        ]);

        $tukarJadwal->update([
            'status' => 'ditolak',
            'alasan_penolakan' => $validated['alasan_penolakan'],
            'tanggal_diproses' => now(),
        ]);

        return redirect()->route('tukar-jadwal.index')->with('success', 'Permintaan tukar jadwal ditolak');
    }

    public function cancel(TukarJadwal $tukarJadwal)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        // Validasi: hanya pemohon yang bisa cancel
        if ($tukarJadwal->pemohon_id !== $dosen->id) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk membatalkan permintaan ini');
        }

        if ($tukarJadwal->status !== 'menunggu') {
            return redirect()->back()->with('error', 'Permintaan tukar jadwal sudah diproses');
        }

        $tukarJadwal->update([
            'status' => 'dibatalkan',
            'tanggal_diproses' => now(),
        ]);

        return redirect()->route('tukar-jadwal.index')->with('success', 'Permintaan tukar jadwal dibatalkan');
    }

    public function calendar(Request $request)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if (!$dosen) {
            return redirect()->route('dashboard')->with('error', 'Data dosen tidak ditemukan');
        }

        // Reuse logic dari JadwalController
        $semesters = \App\Models\Semester::where('is_aktif', true)->get();
        $selectedSemesterId = $request->get('semester_id', $semesters->first()?->id);
        $selectedSemester = \App\Models\Semester::find($selectedSemesterId);
        
        if (!$selectedSemester) {
            return redirect()->route('dashboard')->with('error', 'Semester tidak ditemukan');
        }

        $totalMinggu = $selectedSemester->total_minggu ?? 20;
        $selectedMinggu = $request->get('minggu', 1);

        $kampusList = \App\Models\Kampus::where('is_aktif', true)->get();
        
        // Generate hari dengan tanggal
        $tanggalMulai = Carbon::parse($selectedSemester->tanggal_mulai);
        $mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek();
        
        $hari = [];
        foreach ([1 => 'Senin', 2 => 'Selasa', 3 => 'Rabu', 4 => 'Kamis', 5 => 'Jumat', 6 => 'Sabtu'] as $id => $nama) {
            $tanggalHari = $mingguStart->copy()->addDays($id - 1);
            $hari[] = [
                'id' => $id,
                'nama' => $nama,
                'tanggal' => $tanggalHari->format('Y-m-d'),
            ];
        }

        $slots = \App\Models\SlotWaktu::where('is_aktif', true)->orderBy('urutan')->get();

        // Get jadwal data
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
                if (!isset($jadwalData[$kampusId][$minggu][$hariId][$slotId])) {
                    $jadwalData[$kampusId][$minggu][$hariId][$slotId] = [];
                }
                
                $isMySchedule = $master->dosen_id === $dosen->id;
                $isPast = $sesi->tanggal->isPast();
                
                $jadwalData[$kampusId][$minggu][$hariId][$slotId][] = [
                    'sesi_jadwal_id' => $sesi->id,
                    'matkul' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'dosen' => $master->dosen->user->name,
                    'dosen_id' => $master->dosen->id,
                    'lab' => $master->laboratorium->nama,
                    'laboratorium_id' => $master->laboratorium_id,
                    'sks' => $master->kelasMatKul->mataKuliah->sks,
                    'durasi_slot' => $master->durasi_slot,
                    'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                    'status' => $sesi->status,
                    'tanggal' => $sesi->tanggal->format('Y-m-d'),
                    'is_my_schedule' => $isMySchedule,
                    'is_past' => $isPast,
                ];
            }
        }

        // Get my requests (request keluar)
        $myRequests = TukarJadwal::where('pemohon_id', $dosen->id)
            ->with([
                'pemohon.user',
                'mitra.user',
                'sesiJadwalPemohon.jadwalMaster.kelasMatKul.mataKuliah',
                'sesiJadwalPemohon.jadwalMaster.laboratorium',
                'sesiJadwalMitra.jadwalMaster.kelasMatKul.mataKuliah',
                'sesiJadwalMitra.jadwalMaster.laboratorium',
            ])
            ->whereIn('status', ['menunggu', 'disetujui', 'ditolak'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) use ($dosen) {
                return [
                    'id' => $item->id,
                    'pemohon' => [
                        'id' => $item->pemohon->id,
                        'nama' => $item->pemohon->user->name,
                    ],
                    'sesi_pemohon' => [
                        'id' => $item->sesiJadwalPemohon->id,
                        'mata_kuliah' => $item->sesiJadwalPemohon->jadwalMaster->kelasMatKul->mataKuliah->nama,
                        'tanggal' => $item->sesiJadwalPemohon->tanggal,
                        'hari' => $item->sesiJadwalPemohon->jadwalMaster->hari,
                        'laboratorium' => $item->sesiJadwalPemohon->jadwalMaster->laboratorium->nama,
                        'waktu_mulai' => $item->sesiJadwalPemohon->jadwalMaster->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $item->sesiJadwalPemohon->jadwalMaster->slotWaktuSelesai->waktu_selesai,
                    ],
                    'mitra' => $item->mitra ? [
                        'id' => $item->mitra->id,
                        'nama' => $item->mitra->user->name,
                    ] : null,
                    'sesi_mitra' => $item->sesiJadwalMitra ? [
                        'id' => $item->sesiJadwalMitra->id,
                        'mata_kuliah' => $item->sesiJadwalMitra->jadwalMaster->kelasMatKul->mataKuliah->nama,
                        'tanggal' => $item->sesiJadwalMitra->tanggal,
                        'hari' => $item->sesiJadwalMitra->jadwalMaster->hari,
                        'laboratorium' => $item->sesiJadwalMitra->jadwalMaster->laboratorium->nama,
                        'waktu_mulai' => $item->sesiJadwalMitra->jadwalMaster->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $item->sesiJadwalMitra->jadwalMaster->slotWaktuSelesai->waktu_selesai,
                    ] : null,
                    'status' => $item->status,
                    'alasan_pemohon' => $item->alasan_pemohon,
                    'alasan_penolakan' => $item->alasan_penolakan,
                    'tanggal_diajukan' => $item->tanggal_diajukan,
                    'tanggal_diproses' => $item->tanggal_diproses,
                    'is_pemohon' => true,
                    'is_mitra' => false,
                ];
            });

        // Get incoming requests (request masuk)
        $incomingRequests = TukarJadwal::where('mitra_id', $dosen->id)
            ->with([
                'pemohon.user',
                'mitra.user',
                'sesiJadwalPemohon.jadwalMaster.kelasMatKul.mataKuliah',
                'sesiJadwalPemohon.jadwalMaster.laboratorium',
                'sesiJadwalMitra.jadwalMaster.kelasMatKul.mataKuliah',
                'sesiJadwalMitra.jadwalMaster.laboratorium',
            ])
            ->whereIn('status', ['menunggu', 'disetujui', 'ditolak'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) use ($dosen) {
                return [
                    'id' => $item->id,
                    'pemohon' => [
                        'id' => $item->pemohon->id,
                        'nama' => $item->pemohon->user->name,
                    ],
                    'sesi_pemohon' => [
                        'id' => $item->sesiJadwalPemohon->id,
                        'mata_kuliah' => $item->sesiJadwalPemohon->jadwalMaster->kelasMatKul->mataKuliah->nama,
                        'tanggal' => $item->sesiJadwalPemohon->tanggal,
                        'hari' => $item->sesiJadwalPemohon->jadwalMaster->hari,
                        'laboratorium' => $item->sesiJadwalPemohon->jadwalMaster->laboratorium->nama,
                        'waktu_mulai' => $item->sesiJadwalPemohon->jadwalMaster->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $item->sesiJadwalPemohon->jadwalMaster->slotWaktuSelesai->waktu_selesai,
                    ],
                    'mitra' => $item->mitra ? [
                        'id' => $item->mitra->id,
                        'nama' => $item->mitra->user->name,
                    ] : null,
                    'sesi_mitra' => $item->sesiJadwalMitra ? [
                        'id' => $item->sesiJadwalMitra->id,
                        'mata_kuliah' => $item->sesiJadwalMitra->jadwalMaster->kelasMatKul->mataKuliah->nama,
                        'tanggal' => $item->sesiJadwalMitra->tanggal,
                        'hari' => $item->sesiJadwalMitra->jadwalMaster->hari,
                        'laboratorium' => $item->sesiJadwalMitra->jadwalMaster->laboratorium->nama,
                        'waktu_mulai' => $item->sesiJadwalMitra->jadwalMaster->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $item->sesiJadwalMitra->jadwalMaster->slotWaktuSelesai->waktu_selesai,
                    ] : null,
                    'status' => $item->status,
                    'alasan_pemohon' => $item->alasan_pemohon,
                    'alasan_penolakan' => $item->alasan_penolakan,
                    'tanggal_diajukan' => $item->tanggal_diajukan,
                    'tanggal_diproses' => $item->tanggal_diproses,
                    'is_pemohon' => false,
                    'is_mitra' => true,
                ];
            });

        $mingguData = [];
        foreach (range(1, $totalMinggu) as $m) {
            $start = $tanggalMulai->copy()->addWeeks($m - 1)->startOfWeek();
            $end = $start->copy()->endOfWeek()->subDay();
            $mingguData[] = [
                'nomor' => $m,
                'tanggal_mulai' => $start->format('Y-m-d'),
                'tanggal_selesai' => $end->format('Y-m-d'),
            ];
        }

        return Inertia::render('TukarJadwal/Calendar', [
            'semesters' => $semesters,
            'selectedSemesterId' => $selectedSemesterId,
            'kampusList' => $kampusList,
            'mingguList' => $mingguData,
            'selectedMinggu' => $selectedMinggu,
            'hari' => $hari,
            'slots' => $slots,
            'jadwalData' => $jadwalData,
            'myRequests' => $myRequests,
            'incomingRequests' => $incomingRequests,
            'dosenId' => $dosen->id,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Tukar Jadwal', 'href' => '/tukar-jadwal'],
                ['title' => 'Kalender', 'href' => '/tukar-jadwal/calendar'],
            ],
        ]);
    }
}
