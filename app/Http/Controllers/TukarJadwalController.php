<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\SesiJadwal;
use App\Models\TukarJadwal;
use App\Services\ActivityLogService;
use App\Services\NotificationService;
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
            // For pindah jadwal - slot tujuan
            'slot_tujuan_mulai_id' => 'nullable|exists:slot_waktu,id',
            'slot_tujuan_selesai_id' => 'nullable|exists:slot_waktu,id',
            'lab_tujuan_id' => 'nullable|exists:laboratorium,id',
        ]);

        $sesiPemohon = SesiJadwal::with('jadwalMaster')->find($validated['sesi_jadwal_pemohon_id']);
        
        if ($validated['jenis'] === 'pindah' && !$validated['mitra_id'] && !$validated['sesi_jadwal_mitra_id']) {
            $tanggalTujuan = $request->tanggal_tujuan;
            $mingguTujuan = $request->minggu_tujuan;
            $jadwalPemohon = $sesiPemohon->jadwalMaster;
            
            // Cek bentrok di tanggal tujuan
            $bentrok = SesiJadwal::whereDate('tanggal', $tanggalTujuan)
                ->whereHas('jadwalMaster', function ($q) use ($jadwalPemohon) {
                    $q->where('laboratorium_id', $jadwalPemohon->laboratorium_id)
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
                // Debug log
                \Log::info('========== PINDAH JADWAL START ==========');
                \Log::info('Request Data', [
                    'tanggal_tujuan' => $tanggalTujuan,
                    'minggu_tujuan' => $mingguTujuan,
                ]);
                \Log::info('Sesi Pemohon - Before', [
                    'id' => $sesiPemohon->id,
                    'jadwal_master_id' => $sesiPemohon->jadwal_master_id,
                    'tanggal' => $sesiPemohon->tanggal,
                    'pertemuan_ke' => $sesiPemohon->pertemuan_ke,
                ]);
                
                // Check current value di DB
                $currentDbValue = DB::table('sesi_jadwal')->where('id', $sesiPemohon->id)->first();
                \Log::info('Current DB Value - Before Update', [
                    'id' => $currentDbValue->id,
                    'tanggal' => $currentDbValue->tanggal,
                    'pertemuan_ke' => $currentDbValue->pertemuan_ke,
                ]);
                
                // Update menggunakan query builder langsung
                // PINDAH = Update tanggal + minggu + OVERRIDE slot & lab
                $updateData = [
                    'tanggal' => $tanggalTujuan,
                    'pertemuan_ke' => (int)$mingguTujuan,
                    'updated_at' => now(),
                ];
                
                // Tambah override jika slot/lab tujuan berbeda
                if ($request->has('slot_tujuan_mulai_id')) {
                    $updateData['override_slot_waktu_mulai_id'] = $request->slot_tujuan_mulai_id;
                    $updateData['override_slot_waktu_selesai_id'] = $request->slot_tujuan_selesai_id;
                }
                
                if ($request->has('lab_tujuan_id')) {
                    $updateData['override_laboratorium_id'] = $request->lab_tujuan_id;
                }
                
                $updated = DB::table('sesi_jadwal')
                    ->where('id', $sesiPemohon->id)
                    ->update($updateData);

                \Log::info('Update Query Executed', [
                    'affected_rows' => $updated,
                    'id' => $sesiPemohon->id,
                    'update_data' => $updateData,
                ]);

                // Check value after update
                $afterUpdate = DB::table('sesi_jadwal')->where('id', $sesiPemohon->id)->first();
                \Log::info('DB Value - After Update', [
                    'id' => $afterUpdate->id,
                    'tanggal' => $afterUpdate->tanggal,
                    'pertemuan_ke' => $afterUpdate->pertemuan_ke,
                ]);

                // Create tukar jadwal record
                $tukarJadwal = TukarJadwal::create([
                    'pemohon_id' => $dosen->id,
                    'sesi_jadwal_pemohon_id' => $validated['sesi_jadwal_pemohon_id'],
                    'mitra_id' => null,
                    'sesi_jadwal_mitra_id' => null,
                    'alasan_pemohon' => $validated['alasan_pemohon'],
                    'status' => 'disetujui',
                    'jenis' => 'pindah',
                    'tanggal_diproses' => now(),
                ]);

                \Log::info('TukarJadwal Record Created', ['id' => $tukarJadwal->id]);

                // IMPORTANT: Commit BEFORE verify
                DB::commit();
                \Log::info('Transaction COMMITTED');
                
                // Verify after commit
                $verified = DB::table('sesi_jadwal')->where('id', $sesiPemohon->id)->first();
                \Log::info('Final Verification - After Commit', [
                    'id' => $verified->id,
                    'tanggal' => $verified->tanggal,
                    'pertemuan_ke' => $verified->pertemuan_ke,
                    'success' => ($verified->tanggal === $tanggalTujuan && $verified->pertemuan_ke == $mingguTujuan),
                ]);
                \Log::info('========== PINDAH JADWAL END ==========');
                
                return redirect()->route('tukar-jadwal.calendar', [
                    'semester_id' => request()->get('semester_id'),
                    'minggu' => $mingguTujuan
                ])->with('success', 'Jadwal berhasil dipindahkan ke ' . Carbon::parse($tanggalTujuan)->format('d M Y'));
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error('========== PINDAH JADWAL FAILED ==========');
                \Log::error('Error Message', ['error' => $e->getMessage()]);
                \Log::error('Stack Trace', ['trace' => $e->getTraceAsString()]);
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

        // Notifikasi
        if ($validated['jenis'] === 'tukar' && $validated['mitra_id']) {
            $mitra = Dosen::find($validated['mitra_id']);
            if ($mitra && $mitra->user) {
                NotificationService::sendTukarJadwalRequest($mitra->user, $tukarJadwal);
            }
        } elseif ($validated['jenis'] === 'pindah') {
            NotificationService::sendPindahJadwal($dosen->user, $sesiPemohon);
        }

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
            $sesiPemohon = $tukarJadwal->sesiJadwalPemohon;
            $sesiMitra = $tukarJadwal->sesiJadwalMitra;

            // Debug log
            \Log::info('Tukar Jadwal - Start', [
                'pemohon_id' => $sesiPemohon->id,
                'pemohon_tanggal' => $sesiPemohon->tanggal,
                'pemohon_minggu' => $sesiPemohon->pertemuan_ke,
                'mitra_id' => $sesiMitra->id,
                'mitra_tanggal' => $sesiMitra->tanggal,
                'mitra_minggu' => $sesiMitra->pertemuan_ke,
            ]);

            // Cek apakah same day swap (tanggal dan minggu sama)
            $isSameDay = ($sesiPemohon->tanggal->format('Y-m-d') === $sesiMitra->tanggal->format('Y-m-d'));
            
            \Log::info('Tukar Jadwal - Same Day Check', [
                'is_same_day' => $isSameDay,
                'pemohon_date' => $sesiPemohon->tanggal->format('Y-m-d'),
                'mitra_date' => $sesiMitra->tanggal->format('Y-m-d'),
            ]);

            if ($isSameDay) {
                // SAME DAY SWAP: Tukar slot MULAI saja (bukan selesai)
                // Durasi tetap mengikuti jadwal masing-masing (dari SKS MK asli)
                $masterPemohon = $sesiPemohon->jadwalMaster;
                $masterMitra = $sesiMitra->jadwalMaster;
                
                // PENTING: Ambil durasi dari SKS Mata Kuliah, bukan dari durasi_slot master lama!
                $pemohonDurasi = $masterPemohon->kelasMatKul->mataKuliah->sks;
                $mitraDurasi = $masterMitra->kelasMatKul->mataKuliah->sks;
                
                // Pemohon pakai slot mulai mitra, tapi durasi tetap sendiri
                $pemohonSlotSelesai = $masterMitra->slot_waktu_mulai_id + $pemohonDurasi - 1;
                
                // Mitra pakai slot mulai pemohon, tapi durasi tetap sendiri  
                $mitraSlotSelesai = $masterPemohon->slot_waktu_mulai_id + $mitraDurasi - 1;
                
                $updated1 = DB::table('sesi_jadwal')
                    ->where('id', $sesiPemohon->id)
                    ->update([
                        'override_slot_waktu_mulai_id' => $masterMitra->slot_waktu_mulai_id,
                        'override_slot_waktu_selesai_id' => $pemohonSlotSelesai,
                        'override_laboratorium_id' => $masterMitra->laboratorium_id,
                        'updated_at' => now(),
                    ]);
                
                $updated2 = DB::table('sesi_jadwal')
                    ->where('id', $sesiMitra->id)
                    ->update([
                        'override_slot_waktu_mulai_id' => $masterPemohon->slot_waktu_mulai_id,
                        'override_slot_waktu_selesai_id' => $mitraSlotSelesai,
                        'override_laboratorium_id' => $masterPemohon->laboratorium_id,
                        'updated_at' => now(),
                    ]);
                
                \Log::info('Tukar Jadwal - Same Day Swap', [
                    'pemohon_override_slot' => $masterMitra->slot_waktu_mulai_id . '-' . $pemohonSlotSelesai . ' (durasi: ' . $pemohonDurasi . ')',
                    'mitra_override_slot' => $masterPemohon->slot_waktu_mulai_id . '-' . $mitraSlotSelesai . ' (durasi: ' . $mitraDurasi . ')',
                ]);
            } else {
                // DIFFERENT DAY SWAP: Tukar tanggal DAN jam mulai
                // Tapi durasi tetap pakai punyanya sendiri (dari SKS MK asli)
                $masterPemohon = $sesiPemohon->jadwalMaster;
                $masterMitra = $sesiMitra->jadwalMaster;
                
                // PENTING: Ambil durasi dari SKS Mata Kuliah, bukan dari durasi_slot master lama!
                $pemohonDurasi = $masterPemohon->kelasMatKul->mataKuliah->sks;
                $mitraDurasi = $masterMitra->kelasMatKul->mataKuliah->sks;
                
                // Pemohon ke hari mitra, pakai jam mulai mitra, tapi durasi sendiri
                $pemohonSlotSelesai = $masterMitra->slot_waktu_mulai_id + $pemohonDurasi - 1;
                
                // Mitra ke hari pemohon, pakai jam mulai pemohon, tapi durasi sendiri
                $mitraSlotSelesai = $masterPemohon->slot_waktu_mulai_id + $mitraDurasi - 1;
                
                $tempTanggalPemohon = $sesiPemohon->tanggal;
                $tempPertemuanPemohon = $sesiPemohon->pertemuan_ke;
                
                $updated1 = DB::table('sesi_jadwal')
                    ->where('id', $sesiPemohon->id)
                    ->update([
                        'tanggal' => $sesiMitra->tanggal,
                        'pertemuan_ke' => $sesiMitra->pertemuan_ke,
                        'override_slot_waktu_mulai_id' => $masterMitra->slot_waktu_mulai_id,
                        'override_slot_waktu_selesai_id' => $pemohonSlotSelesai,
                        'override_laboratorium_id' => $masterMitra->laboratorium_id,
                        'updated_at' => now(),
                    ]);
                
                $updated2 = DB::table('sesi_jadwal')
                    ->where('id', $sesiMitra->id)
                    ->update([
                        'tanggal' => $tempTanggalPemohon,
                        'pertemuan_ke' => $tempPertemuanPemohon,
                        'override_slot_waktu_mulai_id' => $masterPemohon->slot_waktu_mulai_id,
                        'override_slot_waktu_selesai_id' => $mitraSlotSelesai,
                        'override_laboratorium_id' => $masterPemohon->laboratorium_id,
                        'updated_at' => now(),
                    ]);
                
                \Log::info('Tukar Jadwal - Different Day Swap', [
                    'pemohon_new_date' => $sesiMitra->tanggal->format('Y-m-d'),
                    'pemohon_new_slot' => $masterMitra->slot_waktu_mulai_id . '-' . $pemohonSlotSelesai . ' (durasi: ' . $pemohonDurasi . ')',
                    'mitra_new_date' => $tempTanggalPemohon->format('Y-m-d'),
                    'mitra_new_slot' => $masterPemohon->slot_waktu_mulai_id . '-' . $mitraSlotSelesai . ' (durasi: ' . $mitraDurasi . ')',
                    'note' => 'Tukar hari dan jam mulai, durasi tetap masing-masing',
                ]);
            }

            \Log::info('Tukar Jadwal - Update Results', [
                'pemohon_updated' => $updated1,
                'mitra_updated' => $updated2,
            ]);

            // Update status tukar jadwal
            DB::table('tukar_jadwal')
                ->where('id', $tukarJadwal->id)
                ->update([
                    'status' => 'disetujui',
                    'tanggal_diproses' => now(),
                    'updated_at' => now(),
                ]);

            DB::commit();
            
            // Verify
            $verifiedPemohon = SesiJadwal::find($sesiPemohon->id);
            $verifiedMitra = SesiJadwal::find($sesiMitra->id);
            \Log::info('Tukar Jadwal - Verified', [
                'pemohon' => [
                    'id' => $verifiedPemohon->id,
                    'tanggal' => $verifiedPemohon->tanggal,
                    'pertemuan_ke' => $verifiedPemohon->pertemuan_ke,
                ],
                'mitra' => [
                    'id' => $verifiedMitra->id,
                    'tanggal' => $verifiedMitra->tanggal,
                    'pertemuan_ke' => $verifiedMitra->pertemuan_ke,
                ],
            ]);

            // Reload relasi untuk notifikasi dan logging
            $tukarJadwal->load([
                'pemohon.user',
                'mitra.user',
                'sesiJadwalPemohon.jadwalMaster.kelasMatKul.mataKuliah',
                'sesiJadwalPemohon.jadwalMaster.laboratorium',
                'sesiJadwalMitra.jadwalMaster.kelasMatKul.mataKuliah',
                'sesiJadwalMitra.jadwalMaster.laboratorium',
            ]);

            // Notifikasi ke pemohon
            NotificationService::sendTukarJadwalApproved($tukarJadwal->pemohon->user, $tukarJadwal);

            // Log aktivitas
            if ($tukarJadwal->jenis === 'tukar') {
                ActivityLogService::logTukarJadwal($tukarJadwal);
            } else {
                ActivityLogService::logPindahJadwal($tukarJadwal);
            }
            
            return redirect()->route('tukar-jadwal.index')->with('success', 'Permintaan tukar jadwal berhasil disetujui (hanya untuk minggu ini)');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Tukar Jadwal Failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
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

        // Notifikasi ke pemohon
        NotificationService::sendTukarJadwalRejected($tukarJadwal->pemohon->user, $tukarJadwal);

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
        // Generate hari dengan tanggal
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

        $slots = \App\Models\SlotWaktu::where('is_aktif', true)->orderBy('urutan')->get();

        // Get jadwal data - PENTING: Query berdasarkan TANGGAL bukan pertemuan_ke
        // Karena jadwal bisa dipindah/ditukar ke tanggal lain dalam minggu yang berbeda
        $mingguEnd = $mingguStart->copy()->addDays(5); // Senin sampai Sabtu
        
        $sesiJadwals = SesiJadwal::whereHas('jadwalMaster.kelasMatKul', function ($query) use ($selectedSemesterId) {
                $query->where('semester_id', $selectedSemesterId);
            })
            ->whereBetween('tanggal', [$mingguStart->format('Y-m-d'), $mingguEnd->format('Y-m-d')])
            ->with([
                'jadwalMaster.laboratorium.kampus',
                'jadwalMaster.dosen.user',
                'jadwalMaster.kelasMatKul.kelas',
                'jadwalMaster.kelasMatKul.mataKuliah',
                'jadwalMaster.slotWaktuMulai',
                'jadwalMaster.slotWaktuSelesai',
                'overrideSlotWaktuMulai',
                'overrideSlotWaktuSelesai',
                'overrideLaboratorium',
            ])
            ->get();
        
        \Log::info('Calendar Query', [
            'selected_minggu' => $selectedMinggu,
            'date_range' => [$mingguStart->format('Y-m-d'), $mingguEnd->format('Y-m-d')],
            'total_sesi' => $sesiJadwals->count(),
        ]);

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
            // Karena sesi bisa dipindah ke hari lain
            $tanggalSesi = Carbon::parse($sesi->tanggal);
            $hariNamaSesi = $tanggalSesi->locale('id')->dayName;
            $hariNamaSesiCapitalized = ucfirst($hariNamaSesi);
            $hariId = $hariMap[$hariNamaSesiCapitalized] ?? null;
            
            // Gunakan override jika ada (untuk same-day swap)
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
                // Gunakan minggu yang ditampilkan (selectedMinggu) bukan pertemuan_ke
                // Karena kita query by date range
                if (!isset($jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId])) {
                    $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId] = [];
                }
                
                $isMySchedule = $master->dosen_id === $dosen->id;
                
                // Check if this is a swapped schedule
                $isSwapped = TukarJadwal::where(function($q) use ($sesi) {
                        $q->where('sesi_jadwal_pemohon_id', $sesi->id)
                          ->orWhere('sesi_jadwal_mitra_id', $sesi->id);
                    })
                    ->where('status', 'disetujui')
                    ->where('jenis', 'tukar')
                    ->exists();
                
                // Check if past using timezone-aware comparison
                $now = now(); // Already uses Asia/Jakarta from config
                $sesiDate = Carbon::parse($sesi->tanggal)->setTimezone('Asia/Jakarta');
                $sesiDate->setHours(23, 59, 59); // End of day
                $isPast = $now->greaterThan($sesiDate);
                
                // Check if currently active (berlangsung)
                $jadwalStart = Carbon::parse($sesi->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($slotMulai->waktu_mulai);
                $jadwalEnd = Carbon::parse($sesi->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($slotSelesai->waktu_selesai);
                $isActive = $now->between($jadwalStart, $jadwalEnd);
                
                // Re-check isPast: if schedule ended, mark as past
                if ($now->greaterThan($jadwalEnd)) {
                    $isPast = true;
                    $isActive = false;
                }
                
                $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [
                    'sesi_jadwal_id' => $sesi->id,
                    'matkul' => $master->kelasMatKul->mataKuliah->nama,
                    'kelas' => $master->kelasMatKul->kelas->nama,
                    'dosen' => $master->dosen->user->name,
                    'dosen_id' => $master->dosen->id,
                    'lab' => $lab->nama,
                    'laboratorium_id' => $labId,
                    'sks' => $master->kelasMatKul->mataKuliah->sks,
                    'durasi_slot' => $durasiSlot, // Gunakan durasi yang dihitung dari slot aktual
                    'waktu_mulai' => $slotMulai->waktu_mulai,
                    'waktu_selesai' => $slotSelesai->waktu_selesai,
                    'status' => $sesi->status,
                    'tanggal' => $sesi->tanggal->format('Y-m-d'),
                    'is_my_schedule' => $isMySchedule,
                    'is_past' => $isPast,
                    'is_active' => $isActive,
                    'is_swapped' => $isSwapped,
                    'has_override' => $sesi->override_slot_waktu_mulai_id !== null,
                ];
            }
        }

        // Tambahkan jadwal booking yang disetujui
        $bookings = \App\Models\BookingLaboratorium::where('status', 'disetujui')
            ->whereBetween('tanggal', [$mingguStart->format('Y-m-d'), $mingguStart->copy()->addDays(5)->format('Y-m-d')])
            ->with([
                'dosen.user',
                'kelasMatKul.kelas',
                'kelasMatKul.mataKuliah',
                'laboratorium.kampus',
                'slotWaktuMulai',
            ])
            ->get();

        foreach ($bookings as $booking) {
            $kampusId = $booking->laboratorium->kampus_id;
            $tanggalBooking = Carbon::parse($booking->tanggal);
            $hariNama = $tanggalBooking->locale('id')->dayName;
            $hariNamaCapitalized = ucfirst($hariNama);
            $hariId = $hariMap[$hariNamaCapitalized] ?? null;
            $slotId = $booking->slot_waktu_mulai_id;

            if ($hariId) {
                if (!isset($jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId])) {
                    $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId] = [];
                }
                
                $isMySchedule = $booking->dosen_id === $dosen->id;
                
                // Hitung waktu selesai dari slot waktu
                $slotWaktuSelesai = \App\Models\SlotWaktu::where('urutan', '>=', $booking->slotWaktuMulai->urutan)
                    ->orderBy('urutan')
                    ->skip($booking->durasi_slot - 1)
                    ->first();
                
                // Check if past and active using timezone-aware comparison
                $now = now(); // Already uses Asia/Jakarta from config
                $bookingStart = Carbon::parse($booking->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($booking->slotWaktuMulai->waktu_mulai);
                $bookingEnd = Carbon::parse($booking->tanggal)->setTimezone('Asia/Jakarta')->setTimeFromTimeString($slotWaktuSelesai ? $slotWaktuSelesai->waktu_selesai : $booking->slotWaktuMulai->waktu_selesai);
                $isActive = $now->between($bookingStart, $bookingEnd);
                $isPast = $now->greaterThan($bookingEnd);
                
                $jadwalData[$kampusId][$selectedMinggu][$hariId][$slotId][] = [
                    'booking_id' => $booking->id,
                    'matkul' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->nama : 'Booking Lab',
                    'kelas' => $booking->kelasMatKul ? $booking->kelasMatKul->kelas->nama : '-',
                    'dosen' => $booking->dosen->user->name,
                    'dosen_id' => $booking->dosen->id,
                    'lab' => $booking->laboratorium->nama,
                    'laboratorium_id' => $booking->laboratorium_id,
                    'sks' => $booking->kelasMatKul ? $booking->kelasMatKul->mataKuliah->sks : 2,
                    'durasi_slot' => $booking->durasi_slot,
                    'waktu_mulai' => $booking->slotWaktuMulai->waktu_mulai,
                    'waktu_selesai' => $slotWaktuSelesai ? $slotWaktuSelesai->waktu_selesai : $booking->slotWaktuMulai->waktu_selesai,
                    'status' => 'booking',
                    'tanggal' => $tanggalBooking->format('Y-m-d'),
                    'is_my_schedule' => $isMySchedule,
                    'is_past' => $isPast,
                    'is_active' => $isActive,
                    'is_swapped' => false,
                    'keperluan' => $booking->keperluan,
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
