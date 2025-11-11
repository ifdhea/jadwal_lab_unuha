<?php

namespace App\Http\Controllers;

use App\Models\BookingLaboratorium;
use App\Models\Dosen;
use App\Models\Laboratorium;
use App\Models\SesiJadwal;
use App\Models\SlotWaktu;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingLaboratoriumController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = BookingLaboratorium::with([
            'dosen.user',
            'laboratorium.kampus',
            'slotWaktuMulai',
            'slotWaktuSelesai',
            'diprosesOleh',
            'kelasMatKul.mataKuliah',
            'kelasMatKul.kelas',
        ]);

        if ($user->peran === 'dosen') {
            $dosen = Dosen::where('user_id', $user->id)->first();
            if ($dosen) {
                $query->where('dosen_id', $dosen->id);
            }
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        $bookings = $query->orderBy('tanggal', 'desc')
            ->orderBy('slot_waktu_mulai_id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('BookingLaboratorium/Index', [
            'bookings' => [
                'data' => $bookings->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'dosen' => $item->dosen ? [
                            'id' => $item->dosen->id,
                            'nama' => $item->dosen->user ? $item->dosen->user->name : '-',
                            'nidn' => $item->dosen->nidn ?? '-',
                        ] : null,
                        'mata_kuliah' => $item->kelasMatKul && $item->kelasMatKul->mataKuliah ? [
                            'nama' => $item->kelasMatKul->mataKuliah->nama,
                            'sks' => $item->kelasMatKul->mataKuliah->sks,
                        ] : null,
                        'kelas' => $item->kelasMatKul && $item->kelasMatKul->kelas ? $item->kelasMatKul->kelas->nama : null,
                        'laboratorium' => $item->laboratorium ? [
                            'id' => $item->laboratorium->id,
                            'nama' => $item->laboratorium->nama ?? '-',
                            'kampus' => $item->laboratorium->kampus ? $item->laboratorium->kampus->nama : '-',
                        ] : null,
                        'tanggal' => $item->tanggal ?? '-',
                        'waktu_mulai' => $item->slotWaktuMulai ? $item->slotWaktuMulai->waktu_mulai : '-',
                        'waktu_selesai' => $item->slotWaktuSelesai ? $item->slotWaktuSelesai->waktu_selesai : '-',
                        'durasi_slot' => $item->durasi_slot ?? 1,
                        'keperluan' => $item->keperluan ?? '-',
                        'keterangan' => $item->keterangan,
                        'status' => $item->status ?? 'menunggu',
                        'catatan_admin' => $item->catatan_admin,
                        'diproses_oleh' => $item->diprosesOleh ? $item->diprosesOleh->name : null,
                        'tanggal_diajukan' => $item->tanggal_diajukan ?? $item->created_at,
                        'tanggal_diproses' => $item->tanggal_diproses,
                    ];
                })->values()->all(),
                'links' => $bookings->linkCollection()->toArray(),
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
            'filters' => $request->only(['status', 'tanggal']),
            'canApprove' => $user->peran === 'super_admin' || $user->peran === 'admin',
        ]);
    }

    public function adminIndex(Request $request)
    {
        $query = BookingLaboratorium::with([
            'dosen.user',
            'laboratorium.kampus',
            'slotWaktuMulai',
            'slotWaktuSelesai',
            'diprosesOleh',
            'kelasMatKul.mataKuliah',
            'kelasMatKul.kelas',
        ]);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        $bookings = $query->orderBy('tanggal', 'desc')
            ->orderBy('slot_waktu_mulai_id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/BookingLab/Index', [
            'bookings' => [
                'data' => $bookings->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'dosen' => $item->dosen ? [
                            'id' => $item->dosen->id,
                            'nama' => $item->dosen->user ? $item->dosen->user->name : '-',
                            'nidn' => $item->dosen->nidn ?? '-',
                        ] : null,
                        'mata_kuliah' => $item->kelasMatKul && $item->kelasMatKul->mataKuliah ? [
                            'nama' => $item->kelasMatKul->mataKuliah->nama,
                            'sks' => $item->kelasMatKul->mataKuliah->sks,
                        ] : null,
                        'kelas' => $item->kelasMatKul && $item->kelasMatKul->kelas ? $item->kelasMatKul->kelas->nama : null,
                        'laboratorium' => $item->laboratorium ? [
                            'id' => $item->laboratorium->id,
                            'nama' => $item->laboratorium->nama ?? '-',
                            'kampus' => $item->laboratorium->kampus ? $item->laboratorium->kampus->nama : '-',
                        ] : null,
                        'tanggal' => $item->tanggal ?? '-',
                        'waktu_mulai' => $item->slotWaktuMulai ? $item->slotWaktuMulai->waktu_mulai : '-',
                        'waktu_selesai' => $item->slotWaktuSelesai ? $item->slotWaktuSelesai->waktu_selesai : '-',
                        'durasi_slot' => $item->durasi_slot ?? 1,
                        'keperluan' => $item->keperluan ?? '-',
                        'keterangan' => $item->keterangan,
                        'status' => $item->status ?? 'menunggu',
                        'catatan_admin' => $item->catatan_admin,
                        'diproses_oleh' => $item->diprosesOleh ? $item->diprosesOleh->name : null,
                        'tanggal_diajukan' => $item->tanggal_diajukan ?? $item->created_at,
                        'tanggal_diproses' => $item->tanggal_diproses,
                    ];
                })->values()->all(),
                'links' => $bookings->linkCollection()->toArray(),
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
            'filters' => $request->only(['status', 'tanggal']),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if (!$dosen) {
            return redirect()->route('dashboard')->with('error', 'Data dosen tidak ditemukan');
        }

        $laboratoriums = Laboratorium::where('is_aktif', true)
            ->with('kampus')
            ->get()
            ->map(function ($lab) {
                return [
                    'id' => $lab->id,
                    'nama' => $lab->nama,
                    'kode' => $lab->kode,
                    'kampus' => $lab->kampus->nama,
                    'kapasitas' => $lab->kapasitas,
                ];
            });

        $slotWaktu = SlotWaktu::where('is_aktif', true)
            ->orderBy('waktu_mulai')
            ->get()
            ->map(function ($slot) {
                return [
                    'id' => $slot->id,
                    'label' => $slot->label,
                    'waktu_mulai' => $slot->waktu_mulai,
                    'waktu_selesai' => $slot->waktu_selesai,
                ];
            });

        return Inertia::render('BookingLaboratorium/Create', [
            'laboratoriums' => $laboratoriums,
            'slotWaktu' => $slotWaktu,
        ]);
    }

    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'laboratorium_id' => 'required|exists:laboratorium,id',
            'tanggal' => 'required|date',
            'slot_waktu_mulai_id' => 'required|exists:slot_waktu,id',
            'durasi_slot' => 'required|integer|min:1|max:10',
        ]);

        $slotMulai = SlotWaktu::find($validated['slot_waktu_mulai_id']);
        $slotSelesaiId = SlotWaktu::where('urutan', $slotMulai->urutan + $validated['durasi_slot'] - 1)
            ->first()
            ->id ?? null;

        if (!$slotSelesaiId) {
            return response()->json([
                'available' => false,
                'message' => 'Durasi slot tidak valid',
            ]);
        }

        $tanggal = Carbon::parse($validated['tanggal']);
        $hari = $this->getHariIndonesia($tanggal->dayOfWeek);

        // Cek jadwal master yang bentrok
        $jadwalBentrok = SesiJadwal::whereDate('tanggal', $tanggal)
            ->whereHas('jadwalMaster', function ($query) use ($validated, $slotMulai, $slotSelesaiId, $hari) {
                $query->where('laboratorium_id', $validated['laboratorium_id'])
                    ->where('hari', $hari)
                    ->where(function ($q) use ($slotMulai, $slotSelesaiId) {
                        $q->whereBetween('slot_waktu_mulai_id', [$slotMulai->id, $slotSelesaiId])
                            ->orWhereBetween('slot_waktu_selesai_id', [$slotMulai->id, $slotSelesaiId]);
                    });
            })
            ->exists();

        if ($jadwalBentrok) {
            return response()->json([
                'available' => false,
                'message' => 'Lab sudah terpakai pada waktu tersebut (jadwal perkuliahan)',
            ]);
        }

        // Cek booking yang bentrok
        $bookingBentrok = BookingLaboratorium::where('laboratorium_id', $validated['laboratorium_id'])
            ->whereDate('tanggal', $tanggal)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->where(function ($q) use ($slotMulai, $slotSelesaiId) {
                $q->whereBetween('slot_waktu_mulai_id', [$slotMulai->id, $slotSelesaiId])
                    ->orWhereBetween('slot_waktu_selesai_id', [$slotMulai->id, $slotSelesaiId]);
            })
            ->exists();

        if ($bookingBentrok) {
            return response()->json([
                'available' => false,
                'message' => 'Lab sudah dibooking pada waktu tersebut',
            ]);
        }

        return response()->json([
            'available' => true,
            'message' => 'Lab tersedia',
            'slot_waktu_selesai_id' => $slotSelesaiId,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if (!$dosen) {
            return redirect()->route('dashboard')->with('error', 'Data dosen tidak ditemukan');
        }

        $validated = $request->validate([
            'kelas_mata_kuliah_id' => 'required|exists:kelas_mata_kuliah,id',
            'laboratorium_id' => 'required|exists:laboratorium,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'slot_waktu_mulai_id' => 'required|exists:slot_waktu,id',
            'keperluan' => 'required|string|max:200',
            'keterangan' => 'nullable|string|max:1000',
        ]);

        $kelasMatKul = \App\Models\KelasMatKul::with('mataKuliah')->find($validated['kelas_mata_kuliah_id']);
        if (!$kelasMatKul) {
            return redirect()->back()->withInput()->with('error', 'Kelas mata kuliah tidak ditemukan');
        }

        $sks = $kelasMatKul->mataKuliah->sks;
        $durasiSlot = $sks;

        $slotMulai = SlotWaktu::find($validated['slot_waktu_mulai_id']);
        $slotSelesai = SlotWaktu::where('urutan', $slotMulai->urutan + $durasiSlot - 1)
            ->where('is_aktif', true)
            ->first();

        if (!$slotSelesai) {
            return redirect()->back()->withInput()->with('error', 'Durasi slot mata kuliah melebihi jadwal yang tersedia');
        }

        $tanggal = Carbon::parse($validated['tanggal']);
        $hari = $this->getHariIndonesia($tanggal->dayOfWeek);

        $jadwalBentrok = SesiJadwal::whereDate('tanggal', $tanggal)
            ->whereHas('jadwalMaster', function ($query) use ($validated, $slotMulai, $slotSelesai, $hari) {
                $query->where('laboratorium_id', $validated['laboratorium_id'])
                    ->where('hari', $hari)
                    ->where(function ($q) use ($slotMulai, $slotSelesai) {
                        $q->where(function ($sq) use ($slotMulai, $slotSelesai) {
                            $sq->whereRaw('slot_waktu_mulai_id BETWEEN ? AND ?', [$slotMulai->id, $slotSelesai->id])
                               ->orWhereRaw('slot_waktu_selesai_id BETWEEN ? AND ?', [$slotMulai->id, $slotSelesai->id]);
                        })->orWhere(function ($sq) use ($slotMulai, $slotSelesai) {
                            $sq->where('slot_waktu_mulai_id', '<=', $slotMulai->id)
                               ->where('slot_waktu_selesai_id', '>=', $slotSelesai->id);
                        });
                    });
            })
            ->where('status', 'terjadwal')
            ->exists();

        if ($jadwalBentrok) {
            return redirect()->back()->withInput()->with('error', 'Lab sudah terpakai pada waktu tersebut (jadwal perkuliahan bentrok)');
        }

        $bookingBentrok = BookingLaboratorium::where('laboratorium_id', $validated['laboratorium_id'])
            ->whereDate('tanggal', $tanggal)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->where(function ($q) use ($slotMulai, $slotSelesai) {
                $q->where(function ($sq) use ($slotMulai, $slotSelesai) {
                    $sq->whereRaw('slot_waktu_mulai_id BETWEEN ? AND ?', [$slotMulai->id, $slotSelesai->id])
                       ->orWhereRaw('slot_waktu_selesai_id BETWEEN ? AND ?', [$slotMulai->id, $slotSelesai->id]);
                })->orWhere(function ($sq) use ($slotMulai, $slotSelesai) {
                    $sq->where('slot_waktu_mulai_id', '<=', $slotMulai->id)
                       ->where('slot_waktu_selesai_id', '>=', $slotSelesai->id);
                });
            })
            ->exists();

        if ($bookingBentrok) {
            return redirect()->back()->withInput()->with('error', 'Lab sudah dibooking pada waktu tersebut');
        }

        BookingLaboratorium::create([
            'dosen_id' => $dosen->id,
            'kelas_mata_kuliah_id' => $validated['kelas_mata_kuliah_id'],
            'laboratorium_id' => $validated['laboratorium_id'],
            'tanggal' => $validated['tanggal'],
            'slot_waktu_mulai_id' => $validated['slot_waktu_mulai_id'],
            'slot_waktu_selesai_id' => $slotSelesai->id,
            'durasi_slot' => $durasiSlot,
            'keperluan' => $validated['keperluan'],
            'keterangan' => $validated['keterangan'],
            'status' => 'menunggu',
            'tanggal_diajukan' => now(),
        ]);

        return redirect()->route('booking-lab.index')->with('success', 'Booking laboratorium berhasil diajukan');
    }

    public function approve(Request $request, BookingLaboratorium $bookingLab)
    {
        $user = Auth::user();

        if ($user->peran !== 'super_admin' && $user->peran !== 'admin') {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menyetujui booking');
        }

        if ($bookingLab->status !== 'menunggu') {
            return redirect()->back()->with('error', 'Booking sudah diproses');
        }

        $validated = $request->validate([
            'catatan_admin' => 'nullable|string|max:1000',
        ]);

        $bookingLab->update([
            'status' => 'disetujui',
            'catatan_admin' => $validated['catatan_admin'] ?? null,
            'diproses_oleh' => $user->id,
            'tanggal_diproses' => now(),
        ]);

        return redirect()->route('admin.booking-lab.index')->with('success', 'Booking laboratorium disetujui');
    }

    public function reject(Request $request, BookingLaboratorium $bookingLab)
    {
        $user = Auth::user();

        if ($user->peran !== 'super_admin' && $user->peran !== 'admin') {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menolak booking');
        }

        if ($bookingLab->status !== 'menunggu') {
            return redirect()->back()->with('error', 'Booking sudah diproses');
        }

        $validated = $request->validate([
            'catatan_admin' => 'required|string|max:1000',
        ]);

        $bookingLab->update([
            'status' => 'ditolak',
            'catatan_admin' => $validated['catatan_admin'],
            'diproses_oleh' => $user->id,
            'tanggal_diproses' => now(),
        ]);

        return redirect()->route('admin.booking-lab.index')->with('success', 'Booking laboratorium ditolak');
    }

    public function cancel(BookingLaboratorium $bookingLab)
    {
        $user = Auth::user();
        $dosen = Dosen::where('user_id', $user->id)->first();

        if ($bookingLab->dosen_id !== $dosen->id) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk membatalkan booking ini');
        }

        if (!in_array($bookingLab->status, ['menunggu', 'disetujui'])) {
            return redirect()->back()->with('error', 'Booking tidak dapat dibatalkan');
        }

        $bookingLab->update([
            'status' => 'dibatalkan',
            'tanggal_diproses' => now(),
        ]);

        return redirect()->route('booking-lab.index')->with('success', 'Booking laboratorium dibatalkan');
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

    /**
     * Tampilkan kalender booking lab (untuk UI grid seperti jadwal)
     */
    public function calendar(Request $request)
    {
        $user = Auth::user();
        $dosen = null;
        $myMatKuls = [];

        if ($user->peran === 'dosen') {
            $dosen = Dosen::where('user_id', $user->id)->first();
            if ($dosen) {
                $myMatKuls = \App\Models\KelasMatKul::whereHas('jadwalMaster', function ($q) use ($dosen) {
                    $q->where('dosen_id', $dosen->id);
                })
                ->with(['mataKuliah', 'kelas'])
                ->get()
                ->map(function ($km) {
                    return [
                        'id' => $km->id,
                        'nama' => $km->mataKuliah->nama,
                        'kelas' => $km->kelas->nama,
                        'sks' => $km->mataKuliah->sks,
                    ];
                });
            }
        }

        $semesters = \App\Models\Semester::where('is_aktif', true)->get();
        $selectedSemesterId = $request->get('semester_id', $semesters->first()?->id);
        $selectedSemester = \App\Models\Semester::find($selectedSemesterId);
        
        if (!$selectedSemester) {
            return redirect()->route('dashboard')->with('error', 'Semester tidak ditemukan');
        }

        $totalMinggu = $selectedSemester->total_minggu ?? 20;
        $selectedMinggu = $request->get('minggu', 1);

        $kampusList = \App\Models\Kampus::where('is_aktif', true)->get();
        
        $tanggalMulai = Carbon::parse($selectedSemester->tanggal_mulai);
        $mingguStart = $tanggalMulai->copy()->addWeeks($selectedMinggu - 1)->startOfWeek(Carbon::MONDAY);
        
        $hari = [];
        foreach ([1 => 'Senin', 2 => 'Selasa', 3 => 'Rabu', 4 => 'Kamis', 5 => 'Jumat', 6 => 'Sabtu'] as $id => $nama) {
            $tanggalHari = $mingguStart->copy()->addDays($id - 1);
            $hari[] = [
                'id' => $id,
                'nama' => $nama,
                'tanggal' => $tanggalHari->format('Y-m-d'),
            ];
        }

        $slots = SlotWaktu::where('is_aktif', true)->orderBy('urutan')->get();

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
            $slotMulaiId = $master->slot_waktu_mulai_id;
            $minggu = $sesi->pertemuan_ke;

            if ($hariId) {
                for ($i = 0; $i < $master->durasi_slot; $i++) {
                    $currentSlot = SlotWaktu::where('urutan', $master->slotWaktuMulai->urutan + $i)->first();
                    if (!$currentSlot) continue;

                    $slotId = $currentSlot->id;
                    
                    if (!isset($jadwalData[$kampusId][$minggu][$hariId][$slotId])) {
                        $jadwalData[$kampusId][$minggu][$hariId][$slotId] = [];
                    }

                    $jadwalData[$kampusId][$minggu][$hariId][$slotId][] = [
                        'sesi_jadwal_id' => $sesi->id,
                        'matkul' => $master->kelasMatKul->mataKuliah->nama,
                        'kelas' => $master->kelasMatKul->kelas->nama,
                        'dosen' => $master->dosen->user->name,
                        'lab' => $master->laboratorium->nama,
                        'laboratorium_id' => $master->laboratorium_id,
                        'sks' => $master->kelasMatKul->mataKuliah->sks,
                        'durasi_slot' => $master->durasi_slot,
                        'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                        'status' => $sesi->status,
                        'tanggal' => $sesi->tanggal->format('Y-m-d'),
                        'slot_position' => $i,
                        'is_first_slot' => $i === 0,
                        'is_last_slot' => $i === ($master->durasi_slot - 1),
                    ];
                }
            }
        }

        $bookings = BookingLaboratorium::whereIn('status', ['disetujui', 'menunggu'])
            ->whereHas('laboratorium.kampus')
            ->with(['dosen.user', 'laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai', 'kelasMatKul.mataKuliah', 'kelasMatKul.kelas'])
            ->get();

        foreach ($bookings as $booking) {
            $tanggal = Carbon::parse($booking->tanggal);
            $hariId = $hariMap[$this->getHariIndonesia($tanggal->dayOfWeek)] ?? null;
            
            if (!$hariId) continue;

            $kampusId = $booking->laboratorium->kampus_id;
            
            // Cek apakah tanggal booking ada di minggu yang dipilih
            $weekStart = $mingguStart->copy();
            $weekEnd = $mingguStart->copy()->addDays(5); // Senin - Sabtu
            
            if ($tanggal->lt($weekStart) || $tanggal->gt($weekEnd)) continue;

            for ($i = 0; $i < $booking->durasi_slot; $i++) {
                $currentSlot = SlotWaktu::where('urutan', $booking->slotWaktuMulai->urutan + $i)->first();
                if (!$currentSlot) continue;

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
                    'laboratorium_id' => $booking->laboratorium_id,
                    'sks' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->sks : $booking->durasi_slot,
                    'durasi_slot' => $booking->durasi_slot,
                    'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                    'status' => 'booking_' . $booking->status,
                    'keperluan' => $booking->keperluan,
                    'tanggal' => $booking->tanggal,
                    'slot_position' => $i,
                    'is_first_slot' => $i === 0,
                    'is_last_slot' => $i === ($booking->durasi_slot - 1),
                ];
            }
        }

        $myBookings = [];
        
        if ($dosen) {
            $myBookings = BookingLaboratorium::where('dosen_id', $dosen->id)
                ->with(['laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai', 'kelasMatKul.mataKuliah', 'kelasMatKul.kelas'])
                ->whereIn('status', ['menunggu', 'disetujui', 'ditolak'])
                ->orderBy('tanggal', 'desc')
                ->get()
                ->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'mata_kuliah' => $booking->kelasMatKul ? [
                            'nama' => $booking->kelasMatKul->mataKuliah->nama,
                            'sks' => $booking->kelasMatKul->mataKuliah->sks,
                        ] : null,
                        'kelas' => $booking->kelasMatKul ? $booking->kelasMatKul->kelas->nama : null,
                        'laboratorium' => [
                            'id' => $booking->laboratorium->id,
                            'nama' => $booking->laboratorium->nama,
                            'kampus' => $booking->laboratorium->kampus->nama,
                        ],
                        'tanggal' => $booking->tanggal,
                        'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                        'durasi_slot' => $booking->durasi_slot,
                        'keperluan' => $booking->keperluan,
                        'keterangan' => $booking->keterangan,
                        'status' => $booking->status,
                    ];
                });
        }

        $mingguData = [];
        foreach (range(1, $totalMinggu) as $m) {
            $start = $tanggalMulai->copy()->addWeeks($m - 1)->startOfWeek(Carbon::MONDAY);
            $end = $start->copy()->addDays(5); // Senin + 5 hari = Sabtu
            $mingguData[] = [
                'nomor' => $m,
                'tanggal_mulai' => $start->format('Y-m-d'),
                'tanggal_selesai' => $end->format('Y-m-d'),
            ];
        }

        return Inertia::render('BookingLaboratorium/Calendar', [
            'semesters' => $semesters,
            'selectedSemesterId' => $selectedSemesterId,
            'kampusList' => $kampusList,
            'mingguList' => $mingguData,
            'selectedMinggu' => $selectedMinggu,
            'hari' => $hari,
            'slots' => $slots,
            'jadwalData' => $jadwalData,
            'myBookings' => $myBookings,
            'myMatKuls' => $myMatKuls,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Booking Lab', 'href' => '/booking-lab'],
            ],
        ]);
    }
}
