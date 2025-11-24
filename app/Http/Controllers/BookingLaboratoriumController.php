<?php

namespace App\Http\Controllers;

use App\Models\BookingLaboratorium;
use App\Models\Dosen;
use App\Models\Laboratorium;
use App\Models\SesiJadwal;
use App\Models\SlotWaktu;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\NotificationService;
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
            'dosen',
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

        $bookings = $query->orderBy('tanggal_diajukan', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $now = Carbon::now()->setTimezone('Asia/Jakarta');

        return Inertia::render('BookingLaboratorium/Index', [
            'bookings' => [
                'data' => $bookings->map(function ($item) use ($now) {
                    // Calculate is_past
                    $isPast = false;
                    if ($item->tanggal && $item->slotWaktuSelesai) {
                        $bookingEnd = Carbon::parse($item->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($item->slotWaktuSelesai->waktu_selesai);
                        $isPast = $now->greaterThan($bookingEnd);
                    }

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
                        'is_past' => $isPast,
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
            'dosen',
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

        $bookings = $query->orderBy('tanggal_diajukan', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $now = Carbon::now()->setTimezone('Asia/Jakarta');

        return Inertia::render('Admin/BookingLab/Index', [
            'bookings' => [
                'data' => $bookings->map(function ($item) use ($now) {
                    // Calculate is_past
                    $isPast = false;
                    if ($item->tanggal && $item->slotWaktuSelesai) {
                        $bookingEnd = Carbon::parse($item->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($item->slotWaktuSelesai->waktu_selesai);
                        $isPast = $now->greaterThan($bookingEnd);
                    }

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
                        'is_past' => $isPast,
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

        // Ambil lab dan kampusnya
        $lab = Laboratorium::with('kampus')->find($validated['laboratorium_id']);
        if (!$lab) {
            return response()->json([
                'available' => false,
                'message' => 'Laboratorium tidak ditemukan.',
            ]);
        }

        $slotMulai = SlotWaktu::find($validated['slot_waktu_mulai_id']);
        $slotSelesai = $this->_calculateSlotSelesai($slotMulai, $validated['durasi_slot']);

        if (!$slotSelesai) {
            return response()->json([
                'available' => false,
                'message' => 'Durasi slot tidak valid atau melebihi jam tersedia.',
            ]);
        }
        $slotSelesaiId = $slotSelesai->id;

        $tanggal = Carbon::parse($validated['tanggal']);
        $hari = $this->getHariIndonesia($tanggal->dayOfWeek);
        $urutanMulai = $slotMulai->urutan;
        $urutanSelesai = $slotSelesai->urutan;

        // Cek jadwal master yang bentrok (HANYA di kampus yang sama)
        $jadwalBentrok = SesiJadwal::whereDate('tanggal', $tanggal)
            ->where('status', 'terjadwal')
            ->whereHas('jadwalMaster', function ($query) use ($lab, $urutanMulai, $urutanSelesai, $hari) {
                // Filter berdasarkan kampus, bukan lab spesifik
                $query->whereHas('laboratorium', function ($q) use ($lab) {
                    $q->where('kampus_id', $lab->kampus_id);
                })
                ->where('hari', $hari)
                ->where(function ($q) use ($urutanMulai, $urutanSelesai) {
                    // Overlap detection
                    $q->whereHas('slotWaktuMulai', function ($sq) use ($urutanSelesai) {
                        $sq->where('urutan', '<', $urutanSelesai);
                    })
                    ->whereHas('slotWaktuSelesai', function ($sq) use ($urutanMulai) {
                        $sq->where('urutan', '>', $urutanMulai);
                    });
                });
            })
            ->exists();

        if ($jadwalBentrok) {
            return response()->json([
                'available' => false,
                'message' => 'Lab sudah terpakai pada waktu tersebut (jadwal perkuliahan)',
            ]);
        }

        // Cek booking yang bentrok (HANYA di kampus yang sama)
        $bookingBentrok = BookingLaboratorium::whereDate('tanggal', $tanggal)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->whereHas('laboratorium', function ($q) use ($lab) {
                $q->where('kampus_id', $lab->kampus_id);
            })
            ->where(function ($q) use ($urutanMulai, $urutanSelesai) {
                $q->whereHas('slotWaktuMulai', function ($sq) use ($urutanMulai, $urutanSelesai) {
                    $sq->where('urutan', '>=', $urutanMulai)
                       ->where('urutan', '<', $urutanSelesai);
                })
                ->orWhereHas('slotWaktuSelesai', function ($sq) use ($urutanMulai, $urutanSelesai) {
                    $sq->where('urutan', '>', $urutanMulai)
                       ->where('urutan', '<=', $urutanSelesai);
                })
                ->orWhere(function ($sq) use ($urutanMulai, $urutanSelesai) {
                    $sq->whereHas('slotWaktuMulai', function ($s) use ($urutanMulai) {
                        $s->where('urutan', '<=', $urutanMulai);
                    })
                    ->whereHas('slotWaktuSelesai', function ($s) use ($urutanSelesai) {
                        $s->where('urutan', '>=', $urutanSelesai);
                    });
                });
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

        $kelasMatKul = \App\Models\KelasMatKul::with(['mataKuliah', 'kelas.kampus'])->find($validated['kelas_mata_kuliah_id']);
        if (!$kelasMatKul) {
            return redirect()->back()->withInput()->with('error', 'Kelas mata kuliah tidak ditemukan');
        }

        // Validasi: kelas harus punya kampus
        if (!$kelasMatKul->kelas || !$kelasMatKul->kelas->kampus_id) {
            return redirect()->back()->withInput()->with('error', 'Kelas tidak memiliki kampus yang valid');
        }

        // Validasi: lab harus di kampus yang sama dengan kelas
        $lab = Laboratorium::with('kampus')->find($validated['laboratorium_id']);
        if (!$lab) {
            return redirect()->back()->withInput()->with('error', 'Laboratorium tidak ditemukan');
        }

        if ($lab->kampus_id !== $kelasMatKul->kelas->kampus_id) {
            return redirect()->back()->withInput()->with('error', 'Tidak dapat booking lab di kampus ' . $lab->kampus->nama . ' untuk kelas di kampus ' . $kelasMatKul->kelas->kampus->nama);
        }

        $sks = $kelasMatKul->mataKuliah->sks;
        $durasiSlot = $sks;

        $slotMulai = SlotWaktu::find($validated['slot_waktu_mulai_id']);
        
        $slotSelesai = $this->_calculateSlotSelesai($slotMulai, $durasiSlot);

        if (!$slotSelesai) {
            return redirect()->back()->withInput()->with('error', 'Durasi slot mata kuliah melebihi jadwal yang tersedia');
        }

        $tanggal = Carbon::parse($validated['tanggal']);
        $hari = $this->getHariIndonesia($tanggal->dayOfWeek);

        $urutanMulai = $slotMulai->urutan;
        $urutanSelesai = $slotSelesai->urutan;
        
        // Cek jadwal master yang bentrok (HANYA di lab dengan kampus yang sama)
        $jadwalBentrok = SesiJadwal::whereDate('tanggal', $tanggal)
            ->where('status', 'terjadwal')
            ->whereHas('jadwalMaster', function ($query) use ($lab, $urutanMulai, $urutanSelesai, $hari) {
                // Filter berdasarkan kampus, bukan lab spesifik
                $query->whereHas('laboratorium', function ($q) use ($lab) {
                    $q->where('kampus_id', $lab->kampus_id);
                })
                ->where('hari', $hari)
                ->where(function ($q) use ($urutanMulai, $urutanSelesai) {
                    // Overlap detection
                    $q->whereHas('slotWaktuMulai', function ($sq) use ($urutanSelesai) {
                        $sq->where('urutan', '<', $urutanSelesai);
                    })
                    ->whereHas('slotWaktuSelesai', function ($sq) use ($urutanMulai) {
                        $sq->where('urutan', '>', $urutanMulai);
                    });
                });
            })
            ->exists();

        if ($jadwalBentrok) {
            return redirect()->back()->withInput()->with('error', 'Lab di kampus ini sudah terpakai pada waktu tersebut (jadwal perkuliahan bentrok)');
        }

        // Cek booking yang bentrok (HANYA di kampus yang sama)
        $bookingBentrok = BookingLaboratorium::whereDate('tanggal', $tanggal)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->whereHas('laboratorium', function ($q) use ($lab) {
                $q->where('kampus_id', $lab->kampus_id);
            })
            ->where(function ($q) use ($urutanMulai, $urutanSelesai) {
                $q->whereHas('slotWaktuMulai', function ($sq) use ($urutanMulai, $urutanSelesai) {
                    $sq->where('urutan', '>=', $urutanMulai)
                       ->where('urutan', '<', $urutanSelesai);
                })
                ->orWhereHas('slotWaktuSelesai', function ($sq) use ($urutanMulai, $urutanSelesai) {
                    $sq->where('urutan', '>', $urutanMulai)
                       ->where('urutan', '<=', $urutanSelesai);
                })
                ->orWhere(function ($sq) use ($urutanMulai, $urutanSelesai) {
                    $sq->whereHas('slotWaktuMulai', function ($s) use ($urutanMulai) {
                        $s->where('urutan', '<=', $urutanMulai);
                    })
                    ->whereHas('slotWaktuSelesai', function ($s) use ($urutanSelesai) {
                        $s->where('urutan', '>=', $urutanSelesai);
                    });
                });
            })
            ->exists();

        if ($bookingBentrok) {
            return redirect()->back()->withInput()->with('error', 'Lab di kampus ini sudah dibooking pada waktu tersebut');
        }

        // Hapus jadwal "tidak_masuk" yang overlap dengan booking ini di kampus yang sama
        $jadwalTidakMasuk = SesiJadwal::whereDate('tanggal', $tanggal)
            ->where('status', 'tidak_masuk')
            ->whereHas('jadwalMaster', function ($query) use ($lab, $hari, $urutanMulai, $urutanSelesai) {
                $query->whereHas('laboratorium', function ($q) use ($lab) {
                    $q->where('kampus_id', $lab->kampus_id);
                })
                ->where('hari', $hari)
                ->whereHas('slotWaktuMulai', function ($q) use ($urutanSelesai) {
                    $q->where('urutan', '<', $urutanSelesai);
                })
                ->whereHas('slotWaktuSelesai', function ($q) use ($urutanMulai) {
                    $q->where('urutan', '>', $urutanMulai);
                });
            })
            ->get();
        
        // Hapus jadwal "tidak_masuk" yang overlap
        foreach ($jadwalTidakMasuk as $jadwal) {
            $jadwal->delete();
        }

        $booking = BookingLaboratorium::create([
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

        // Notifikasi ke admin
        $admins = User::whereIn('peran', ['super_admin', 'admin'])->get();
        foreach ($admins as $admin) {
            NotificationService::sendBookingRequest($admin, $booking);
        }

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

        // Load relasi yang diperlukan
        $bookingLab->load([
            'dosen',
            'laboratorium',
            'slotWaktuMulai',
            'slotWaktuSelesai'
        ]);

        // Notifikasi ke dosen
        if ($bookingLab->dosen && $bookingLab->dosen->user) {
            NotificationService::sendBookingApproved($bookingLab->dosen->user, $bookingLab);
        }

        // Log aktivitas
        ActivityLogService::logBookingLabDisetujui($bookingLab);

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

        // Notifikasi ke dosen
        NotificationService::sendBookingRejected($bookingLab->dosen->user, $bookingLab);

        return redirect()->route('admin.booking-lab.index')->with('success', 'Booking laboratorium ditolak');

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

    private function _calculateSlotSelesai(SlotWaktu $slotMulai, int $durasiSlot): ?SlotWaktu
    {
        // Hitung slot akhir dengan skip slot istirahat (is_aktif = false)
        $currentUrutan = $slotMulai->urutan;
        $slotTerpakai = 0;
        $slotSelesai = null;
        
        while ($slotTerpakai < $durasiSlot) {
            $slot = SlotWaktu::where('urutan', $currentUrutan)->first();
            
            if (!$slot) {
                // Melebihi slot yang ada di database
                return null;
            }
            
            if ($slot->is_aktif) {
                $slotTerpakai++;
                if ($slotTerpakai === $durasiSlot) {
                    $slotSelesai = $slot;
                    break;
                }
            }
            
            $currentUrutan++;
        }

        return $slotSelesai;
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
                ->with(['mataKuliah', 'kelas.kampus'])
                ->get()
                ->map(function ($km) {
                    return [
                        'id' => $km->id,
                        'nama' => $km->mataKuliah->nama,
                        'kelas' => $km->kelas->nama,
                        'sks' => $km->mataKuliah->sks,
                        'kampus_id' => $km->kelas->kampus_id,
                        'kampus_nama' => $km->kelas->kampus ? $km->kelas->kampus->nama : null,
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
        
        // Auto-navigate to current week if not specified
        $selectedMinggu = (int) $request->input('minggu');
        if (!$request->has('minggu')) {
            $tanggalMulai = Carbon::parse($selectedSemester->tanggal_mulai);
            $today = Carbon::now();

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

        $kampusList = \App\Models\Kampus::where('is_aktif', true)->get();
        
        // Ambil labs per kampus
        $labsByKampus = [];
        foreach ($kampusList as $kampus) {
            $labsByKampus[$kampus->id] = Laboratorium::where('kampus_id', $kampus->id)
                ->where('is_aktif', true)
                ->get(['id', 'nama', 'kode'])
                ->toArray();
        }
        
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

        // PENTING: Gunakan whereBetween tanggal, bukan where pertemuan_ke
        // Agar data sync dengan generate jadwal
        $mingguEnd = $mingguStart->copy()->addDays(5);
        
        $sesiJadwals = SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($selectedSemesterId) {
                $query->where('semester_id', $selectedSemesterId);
            })
            ->whereBetween('tanggal', [$mingguStart->format('Y-m-d'), $mingguEnd->format('Y-m-d')])
            ->whereNotIn('status', ['dibatalkan']) // Filter jadwal yang dibatalkan
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
            
            // PENTING: Gunakan tanggal dari sesi, bukan master->hari
            $tanggalSesi = Carbon::parse($sesi->tanggal);
            $hariNama = ucfirst($tanggalSesi->locale('id')->dayName);
            $hariId = $hariMap[$hariNama] ?? null;
            
            // Handle override untuk tukar jadwal
            $slotMulaiId = $sesi->override_slot_waktu_mulai_id ?? $master->slot_waktu_mulai_id;
            $slotSelesaiId = $sesi->override_slot_waktu_selesai_id ?? $master->slot_waktu_selesai_id;
            $labId = $sesi->override_laboratorium_id ?? $master->laboratorium_id;
            
            $slotMulai = $sesi->overrideSlotWaktuMulai ?? $master->slotWaktuMulai;
            $slotSelesai = $sesi->overrideSlotWaktuSelesai ?? $master->slotWaktuSelesai;
            $lab = $sesi->overrideLaboratorium ?? $master->laboratorium;
            
            $kampusId = $lab->kampus_id;
            $durasiSlot = $slotSelesai->urutan - $slotMulai->urutan + 1;

            if ($hariId) {
                for ($i = 0; $i < $durasiSlot; $i++) {
                    $currentSlot = SlotWaktu::where('urutan', $slotMulai->urutan + $i)->first();
                    if (!$currentSlot || !$currentSlot->is_aktif) continue;

                    $slotId = $currentSlot->id;
                    
                    if (!isset($jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId])) {
                        $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId] = [];
                    }
                    
                    $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [
                        'sesi_jadwal_id' => $sesi->id,
                        'matkul' => $master->kelasMatKul->mataKuliah->nama,
                        'kelas' => $master->kelasMatKul->kelas->nama,
                        'dosen' => $master->dosen->nama_lengkap,
                        'lab' => $lab->nama,
                        'laboratorium_id' => $labId,
                        'sks' => $master->kelasMatKul->mataKuliah->sks,
                        'durasi_slot' => $durasiSlot,
                        'waktu_mulai' => $slotMulai->waktu_mulai,
                        'waktu_selesai' => $slotSelesai->waktu_selesai,
                        'status' => $sesi->status,
                        'tanggal' => $sesi->tanggal,
                        'slot_position' => $i,
                        'is_first_slot' => $i === 0,
                        'is_last_slot' => $i === ($durasiSlot - 1),
                        'is_swapped' => ($sesi->override_slot_waktu_mulai_id || $sesi->override_laboratorium_id) ? true : false,
                    ];
                }
            }
        }

        $bookings = BookingLaboratorium::whereIn('status', ['disetujui', 'menunggu'])
            ->whereHas('laboratorium.kampus')
            ->with(['dosen.user', 'dosen', 'laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai', 'kelasMatKul.mataKuliah', 'kelasMatKul.kelas'])
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
                        'dosen' => $booking->dosen->nama_lengkap,
                        'lab' => $booking->laboratorium->nama,
                        'laboratorium_id' => $booking->laboratorium_id,
                        'sks' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->sks : $booking->durasi_slot,
                        'durasi_slot' => $booking->durasi_slot,
                        'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                        'waktu_selesai' => $booking->slotWaktuSelesai->waktu_selesai,
                        'status' => $booking->status === 'disetujui' ? 'booking' : 'pending',
                        'keperluan' => $booking->keperluan,
                        'tanggal' => $booking->tanggal,
                        'slot_position' => $slotCounter,
                        'is_first_slot' => $slotCounter === 0,
                        'is_last_slot' => $slotCounter === ($booking->durasi_slot - 1),
                    ];
                    
                    $slotCounter++;
                }
                
                $currentUrutan++;
            }
        }

        $myBookings = [];
        
        if ($dosen) {
            $now = Carbon::now()->setTimezone('Asia/Jakarta');
            
            $myBookings = BookingLaboratorium::where('dosen_id', $dosen->id)
                ->with(['laboratorium.kampus', 'slotWaktuMulai', 'slotWaktuSelesai', 'kelasMatKul.mataKuliah', 'kelasMatKul.kelas'])
                ->whereIn('status', ['menunggu', 'disetujui', 'ditolak'])
                ->orderBy('tanggal', 'desc')
                ->get()
                ->map(function ($booking) use ($now) {
                    // Calculate is_past
                    $isPast = false;
                    if ($booking->tanggal && $booking->slotWaktuSelesai) {
                        $bookingEnd = Carbon::parse($booking->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($booking->slotWaktuSelesai->waktu_selesai);
                        $isPast = $now->greaterThan($bookingEnd);
                    }

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
                        'is_past' => $isPast,
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
            'labsByKampus' => $labsByKampus,
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

    public function deleteAll(Request $request)
    {
        BookingLaboratorium::truncate();
        return redirect()->route('admin.booking-lab.index')->with('success', 'Semua data booking berhasil dihapus.');
    }
}
