<?php

namespace App\Http\Controllers;

use App\Models\BookingLaboratorium;
use App\Models\Dosen;
use App\Models\Laboratorium;
use App\Models\SesiJadwal;
use App\Models\SlotWaktu;
use App\Models\User;
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

        // Cek jadwal master yang bentrok
        // HANYA jadwal dengan status 'terjadwal' yang dianggap bentrok
        
        // Debug: Cek semua jadwal di tanggal tersebut
        $allJadwalCheck = SesiJadwal::whereDate('tanggal', $tanggal)
            ->whereHas('jadwalMaster', function ($query) use ($validated, $hari) {
                $query->where('laboratorium_id', $validated['laboratorium_id'])
                    ->where('hari', $hari);
            })
            ->with('jadwalMaster.slotWaktuMulai', 'jadwalMaster.slotWaktuSelesai')
            ->get(['id', 'status', 'tanggal', 'jadwal_master_id']);
        
        \Log::info('checkAvailability - Semua jadwal:', [
            'tanggal' => $tanggal->format('Y-m-d'),
            'hari' => $hari,
            'lab_id' => $validated['laboratorium_id'],
            'slot_request' => [$slotMulai->id, $slotSelesaiId],
            'jadwal_count' => $allJadwalCheck->count(),
            'jadwal_detail' => $allJadwalCheck->map(function($j) {
                return [
                    'id' => $j->id,
                    'status' => $j->status,
                    'slot_mulai' => $j->jadwalMaster->slotWaktuMulai->urutan ?? null,
                    'slot_selesai' => $j->jadwalMaster->slotWaktuSelesai->urutan ?? null,
                ];
            })->toArray()
        ]);
        
        $jadwalBentrok = SesiJadwal::whereDate('tanggal', $tanggal)
            ->where('status', 'terjadwal') // Hanya cek yang terjadwal, tidak_masuk bisa di-override
            ->whereHas('jadwalMaster', function ($query) use ($validated, $slotMulai, $slotSelesaiId, $hari) {
                $query->where('laboratorium_id', $validated['laboratorium_id'])
                    ->where('hari', $hari)
                    ->where(function ($q) use ($slotMulai, $slotSelesaiId) {
                        $q->whereBetween('slot_waktu_mulai_id', [$slotMulai->id, $slotSelesaiId])
                            ->orWhereBetween('slot_waktu_selesai_id', [$slotMulai->id, $slotSelesaiId]);
                    });
            })
            ->exists();
        
        \Log::info('checkAvailability - Hasil bentrok:', [
            'jadwal_bentrok' => $jadwalBentrok
        ]);

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
        
        $slotSelesai = $this->_calculateSlotSelesai($slotMulai, $durasiSlot);

        if (!$slotSelesai) {
            return redirect()->back()->withInput()->with('error', 'Durasi slot mata kuliah melebihi jadwal yang tersedia');
        }

        $tanggal = Carbon::parse($validated['tanggal']);
        $hari = $this->getHariIndonesia($tanggal->dayOfWeek);

        // Cek jadwal master yang bentrok (overlap detection)
        // HANYA jadwal dengan status 'terjadwal' yang dianggap bentrok
        // Jadwal 'tidak_masuk' BISA di-override dengan booking baru
        $urutanMulai = $slotMulai->urutan;
        $urutanSelesai = $slotSelesai->urutan;
        
        // Debug: Cek semua jadwal di tanggal tersebut
        $allJadwal = SesiJadwal::whereDate('tanggal', $tanggal)
            ->whereHas('jadwalMaster', function ($query) use ($validated, $hari) {
                $query->where('laboratorium_id', $validated['laboratorium_id'])
                    ->where('hari', $hari);
            })
            ->with('jadwalMaster.kelasMatKul.mataKuliah', 'jadwalMaster.slotWaktuMulai', 'jadwalMaster.slotWaktuSelesai')
            ->get();
        
        \Log::info('Debug Booking - Semua jadwal di tanggal ini:', [
            'tanggal' => $tanggal->format('Y-m-d'),
            'hari' => $hari,
            'lab_id' => $validated['laboratorium_id'],
            'booking_slot' => ['mulai' => $urutanMulai, 'selesai' => $urutanSelesai],
            'jadwal' => $allJadwal->map(function($j) {
                return [
                    'id' => $j->id,
                    'matkul' => $j->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'Unknown',
                    'status' => $j->status,
                    'slot_mulai' => $j->jadwalMaster->slotWaktuMulai->urutan ?? null,
                    'slot_selesai' => $j->jadwalMaster->slotWaktuSelesai->urutan ?? null,
                    'jam' => ($j->jadwalMaster->slotWaktuMulai->waktu_mulai ?? '-') . ' - ' . ($j->jadwalMaster->slotWaktuSelesai->waktu_selesai ?? '-'),
                ];
            })->toArray(),
        ]);
        
        $jadwalBentrok = SesiJadwal::whereDate('tanggal', $tanggal)
            ->where('status', 'terjadwal') // Filter status dulu sebelum cek overlap
            ->whereHas('jadwalMaster', function ($query) use ($validated, $urutanMulai, $urutanSelesai, $hari) {
                $query->where('laboratorium_id', $validated['laboratorium_id'])
                    ->where('hari', $hari)
                    ->where(function ($q) use ($urutanMulai, $urutanSelesai) {
                        // Overlap terjadi jika:
                        // 1. Jadwal mulai sebelum booking selesai DAN
                        // 2. Jadwal selesai setelah booking mulai
                        // Ini adalah standard interval overlap detection
                        $q->whereHas('slotWaktuMulai', function ($sq) use ($urutanSelesai) {
                            $sq->where('urutan', '<', $urutanSelesai);
                        })
                        ->whereHas('slotWaktuSelesai', function ($sq) use ($urutanMulai) {
                            $sq->where('urutan', '>', $urutanMulai);
                        });
                    });
            })
            ->exists();
        
        \Log::info('Debug Booking - Hasil cek bentrok:', [
            'bentrok' => $jadwalBentrok,
            'urutan_mulai' => $urutanMulai,
            'urutan_selesai' => $urutanSelesai,
        ]);

        if ($jadwalBentrok) {
            // Debug info untuk development
            $jadwalYangBentrok = SesiJadwal::whereDate('tanggal', $tanggal)
                ->where('status', 'terjadwal')
                ->whereHas('jadwalMaster', function ($query) use ($validated, $urutanMulai, $urutanSelesai, $hari) {
                    $query->where('laboratorium_id', $validated['laboratorium_id'])
                        ->where('hari', $hari)
                        ->where(function ($q) use ($urutanMulai, $urutanSelesai) {
                            $q->whereHas('slotWaktuMulai', function ($sq) use ($urutanSelesai) {
                                $sq->where('urutan', '<', $urutanSelesai);
                            })
                            ->whereHas('slotWaktuSelesai', function ($sq) use ($urutanMulai) {
                                $sq->where('urutan', '>', $urutanMulai);
                            });
                        });
                })
                ->with('jadwalMaster.kelasMatKul.mataKuliah', 'jadwalMaster.slotWaktuMulai', 'jadwalMaster.slotWaktuSelesai')
                ->first();
            
            $debugInfo = '';
            if ($jadwalYangBentrok) {
                $debugInfo = sprintf(
                    ' [DEBUG: %s - Slot %s s/d %s (urutan %d-%d), Status: %s | Booking: urutan %d-%d]',
                    $jadwalYangBentrok->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'Unknown',
                    $jadwalYangBentrok->jadwalMaster->slotWaktuMulai->waktu_mulai ?? '-',
                    $jadwalYangBentrok->jadwalMaster->slotWaktuSelesai->waktu_selesai ?? '-',
                    $jadwalYangBentrok->jadwalMaster->slotWaktuMulai->urutan ?? 0,
                    $jadwalYangBentrok->jadwalMaster->slotWaktuSelesai->urutan ?? 0,
                    $jadwalYangBentrok->status,
                    $urutanMulai,
                    $urutanSelesai
                );
            }
            
            return redirect()->back()->withInput()->with('error', 'Lab sudah terpakai pada waktu tersebut (jadwal perkuliahan bentrok)' . $debugInfo);
        }

        $bookingBentrok = BookingLaboratorium::where('laboratorium_id', $validated['laboratorium_id'])
            ->whereDate('tanggal', $tanggal)
            ->whereIn('status', ['menunggu', 'disetujui'])
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
            return redirect()->back()->withInput()->with('error', 'Lab sudah dibooking pada waktu tersebut');
        }

        // Hapus jadwal "tidak_masuk" yang overlap dengan booking ini.
        // Query ini secara spesifik mencari sesi "tidak_masuk" yang slotnya
        // tumpang tindih dengan slot booking yang baru, langsung di database.
        $jadwalTidakMasuk = SesiJadwal::whereDate('tanggal', $tanggal)
            ->where('status', 'tidak_masuk')
            ->whereHas('jadwalMaster', function ($query) use ($validated, $hari, $urutanMulai, $urutanSelesai) {
                $query->where('laboratorium_id', $validated['laboratorium_id'])
                    ->where('hari', $hari)
                    // Logika overlap:
                    // Sebuah jadwal lama (A) tumpang tindih dengan booking baru (B) jika:
                    // A.mulai < B.selesai DAN A.selesai > B.mulai
                    ->whereHas('slotWaktuMulai', function ($q) use ($urutanSelesai) {
                        $q->where('urutan', '<', $urutanSelesai);
                    })
                    ->whereHas('slotWaktuSelesai', function ($q) use ($urutanMulai) {
                        $q->where('urutan', '>', $urutanMulai);
                    });
            })
            ->get();
        
        \Log::info('Jadwal tidak_masuk yang akan digantikan:', [
            'count' => $jadwalTidakMasuk->count(),
            'tanggal' => $tanggal->format('Y-m-d'),
            'hari' => $hari,
            'lab_id' => $validated['laboratorium_id'],
            'booking_urutan' => [$urutanMulai, $urutanSelesai],
            'jadwal' => $jadwalTidakMasuk->map(function($j) {
                return [
                    'id' => $j->id,
                    'matkul' => $j->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'Unknown',
                    'status' => $j->status,
                    'urutan' => [
                        $j->jadwalMaster->slotWaktuMulai->urutan ?? 0,
                        $j->jadwalMaster->slotWaktuSelesai->urutan ?? 0
                    ],
                ];
            })->toArray()
        ]);
        
        // Hapus jadwal "tidak_masuk" yang overlap dengan booking ini
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

        // Notifikasi ke dosen
        NotificationService::sendBookingApproved($bookingLab->dosen->user, $bookingLab);

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
            ->whereNotIn('status', ['dibatalkan']) // Filter jadwal yang dibatalkan
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

                    // Re-calculate date on the fly to ensure synchronization
                    $weekStartDateForSesi = $tanggalMulai->copy()->addWeeks($sesi->pertemuan_ke - 1)->startOfWeek(Carbon::MONDAY);
                    $correctDateForSesi = $weekStartDateForSesi->copy()->addDays($hariId - 1);
                    
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
                        'tanggal' => $correctDateForSesi->format('Y-m-d'),
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
