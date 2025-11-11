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
        ]);

        // Filter berdasarkan role
        if ($user->peran === 'dosen') {
            $dosen = Dosen::where('user_id', $user->id)->first();
            if ($dosen) {
                $query->where('dosen_id', $dosen->id);
            }
        }

        // Filter status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter tanggal
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
            'canApprove' => $user->peran === 'super_admin',
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
            'laboratorium_id' => 'required|exists:laboratorium,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'slot_waktu_mulai_id' => 'required|exists:slot_waktu,id',
            'slot_waktu_selesai_id' => 'required|exists:slot_waktu,id',
            'durasi_slot' => 'required|integer|min:1|max:10',
            'keperluan' => 'required|string|max:200',
            'keterangan' => 'nullable|string|max:1000',
        ]);

        // Validasi ketersediaan ulang
        $availability = $this->checkAvailability($request);
        $availabilityData = json_decode($availability->getContent(), true);

        if (!$availabilityData['available']) {
            return redirect()->back()->withInput()->with('error', $availabilityData['message']);
        }

        BookingLaboratorium::create([
            'dosen_id' => $dosen->id,
            'laboratorium_id' => $validated['laboratorium_id'],
            'tanggal' => $validated['tanggal'],
            'slot_waktu_mulai_id' => $validated['slot_waktu_mulai_id'],
            'slot_waktu_selesai_id' => $validated['slot_waktu_selesai_id'],
            'durasi_slot' => $validated['durasi_slot'],
            'keperluan' => $validated['keperluan'],
            'keterangan' => $validated['keterangan'],
            'status' => 'menunggu',
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

        return redirect()->route('booking-lab.index')->with('success', 'Booking laboratorium disetujui');
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

        return redirect()->route('booking-lab.index')->with('success', 'Booking laboratorium ditolak');
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
        // Reuse logic dari JadwalController untuk consistency
        $semesters = \App\Models\Semester::where('is_aktif', true)->get();
        $selectedSemesterId = $request->get('semester_id', $semesters->first()?->id);
        $selectedSemester = \App\Models\Semester::find($selectedSemesterId);
        
        if (!$selectedSemester) {
            return redirect()->route('dashboard')->with('error', 'Semester tidak ditemukan');
        }

        // Get minggu list
        $totalMinggu = $selectedSemester->total_minggu ?? 20;
        $mingguList = range(1, $totalMinggu);
        $selectedMinggu = $request->get('minggu', 1);

        // Get kampus list
        $kampusList = \App\Models\Kampus::where('is_aktif', true)->get();
        
        // Get hari
        $hari = [
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        // Get slots (exclude istirahat)
        $slots = SlotWaktu::where('is_aktif', true)->orderBy('urutan')->get();

        // Get jadwal data (sama seperti JadwalController)
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
        $availableSlots = [];
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
                
                // Cek apakah slot ini available untuk booking (status = tidak_masuk)
                $isAvailable = ($sesi->status === 'tidak_masuk');
                
                $jadwalData[$kampusId][$minggu][$hariId][$slotId][] = [
                    'sesi_jadwal_id' => $sesi->id,
                    'matkul' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'dosen' => $master->dosen->user->name,
                    'lab' => $master->laboratorium->nama,
                    'lab_id' => $master->laboratorium_id,
                    'sks' => $master->kelasMatKul->mataKuliah->sks,
                    'durasi_slot' => $master->durasi_slot,
                    'waktu_mulai' => $master->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $master->slotWaktuSelesai->waktu_selesai,
                    'status' => $sesi->status,
                    'tanggal' => $sesi->tanggal->format('Y-m-d'),
                    'is_available' => $isAvailable,
                ];

                // Track available slots
                if ($isAvailable) {
                    $availableSlots[] = [
                        'kampus_id' => $kampusId,
                        'hari_id' => $hariId,
                        'slot_id' => $slotId,
                        'lab_id' => $master->laboratorium_id,
                        'tanggal' => $sesi->tanggal->format('Y-m-d'),
                        'reason' => 'dosen_tidak_masuk',
                    ];
                }
            }
        }

        // Get approved bookings untuk minggu ini
        $bookings = BookingLaboratorium::where('status', 'disetujui')
            ->whereHas('laboratorium.kampus')
            ->with(['dosen.user', 'laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai'])
            ->get();

        $bookingData = [];
        foreach ($bookings as $booking) {
            $tanggal = Carbon::parse($booking->tanggal);
            $hariId = $hariMap[$this->getHariIndonesia($tanggal->dayOfWeek)] ?? null;
            
            if ($hariId) {
                $bookingData[] = [
                    'id' => $booking->id,
                    'kampus_id' => $booking->laboratorium->kampus_id,
                    'hari_id' => $hariId,
                    'slot_mulai_id' => $booking->slot_waktu_mulai_id,
                    'slot_selesai_id' => $booking->slot_waktu_selesai_id,
                    'lab_id' => $booking->laboratorium_id,
                    'lab_nama' => $booking->laboratorium->nama,
                    'dosen_nama' => $booking->dosen->user->name,
                    'keperluan' => $booking->keperluan,
                    'tanggal' => $booking->tanggal,
                    'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                ];
            }
        }

        return Inertia::render('BookingLaboratorium/Index', [
            'semesters' => $semesters,
            'selectedSemesterId' => $selectedSemesterId,
            'kampusList' => $kampusList,
            'mingguList' => $mingguList,
            'selectedMinggu' => $selectedMinggu,
            'hari' => $hari,
            'slots' => $slots,
            'jadwalData' => $jadwalData,
            'availableSlots' => $availableSlots,
            'bookings' => $bookingData,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Booking Lab', 'href' => '/booking-lab'],
            ],
        ]);
    }
}
