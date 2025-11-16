<?php

namespace App\Http\Controllers;

use App\Models\SesiJadwal;
use App\Services\ActivityLogService;
use App\Services\JadwalStatusService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SesiJadwalController extends Controller
{
    protected $statusService;

    public function __construct(JadwalStatusService $statusService)
    {
        $this->statusService = $statusService;
    }
    /**
     * Update status sesi jadwal (untuk dosen set tidak masuk)
     */
    public function updateStatus(Request $request, SesiJadwal $sesiJadwal)
    {
        $request->validate([
            'status' => 'required|in:terjadwal,tidak_masuk,dibatalkan',
            'catatan' => 'nullable|string|max:500',
        ]);

        // Validasi: hanya dosen pemilik jadwal yang bisa update
        $user = $request->user();
        $dosen = $user->dosen;

        if (!$dosen) {
            return back()->with('error', 'Anda bukan dosen.');
        }

        // Load relasi untuk cek kepemilikan
        $sesiJadwal->load('jadwalMaster.dosen');

        if ($sesiJadwal->jadwalMaster->dosen_id !== $dosen->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengubah jadwal ini.');
        }

        // Validasi: hanya bisa update jadwal hari ini atau yang akan datang
        if ($sesiJadwal->tanggal->isPast() && !$sesiJadwal->tanggal->isToday()) {
            return back()->with('error', 'Tidak dapat mengubah status jadwal yang sudah lewat.');
        }

        // Update status
        $sesiJadwal->update([
            'status' => $request->status,
            'catatan' => $request->catatan,
        ]);

        // Log aktivitas jika tidak masuk
        if ($request->status === 'tidak_masuk') {
            // Load relasi yang diperlukan
            $sesiJadwal->load([
                'jadwalMaster.kelasMatKul.mataKuliah',
                'jadwalMaster.kelasMatKul.kelas',
                'jadwalMaster.laboratorium',
                'jadwalMaster.slotWaktuMulai',
                'jadwalMaster.slotWaktuSelesai'
            ]);
            
            $dosen->load('user');
            ActivityLogService::logTidakMasuk($sesiJadwal, $dosen);
        }

        $statusText = $request->status === 'tidak_masuk' ? 'Tidak Masuk' : ucfirst($request->status);

        return back()->with('success', "Status jadwal berhasil diubah menjadi: {$statusText}");
    }

    /**
     * Batalkan perubahan status (kembalikan ke terjadwal)
     */
    public function resetStatus(SesiJadwal $sesiJadwal)
    {
        $user = auth()->user();
        $dosen = $user->dosen;

        if (!$dosen) {
            return back()->with('error', 'Anda bukan dosen.');
        }

        $sesiJadwal->load('jadwalMaster.dosen');

        if ($sesiJadwal->jadwalMaster->dosen_id !== $dosen->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengubah jadwal ini.');
        }

        // Hanya bisa reset jika masih hari ini atau akan datang
        if ($sesiJadwal->tanggal->isPast() && !$sesiJadwal->tanggal->isToday()) {
            return back()->with('error', 'Tidak dapat mengubah jadwal yang sudah lewat.');
        }

        $sesiJadwal->update([
            'status' => 'terjadwal',
            'catatan' => null,
        ]);

        return back()->with('success', 'Status jadwal dikembalikan ke Terjadwal.');
    }

    /**
     * Admin tandai dosen tidak hadir
     */
    public function tandaiTidakHadir(Request $request, SesiJadwal $sesiJadwal)
    {
        $request->validate([
            'catatan' => 'nullable|string|max:500',
        ]);

        try {
            $this->statusService->tandaiDosenTidakHadir(
                $sesiJadwal->id,
                $request->catatan
            );

            return back()->with('success', 'Jadwal berhasil ditandai: Dosen tidak hadir');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Admin batalkan jadwal
     */
    public function batalkan(Request $request, SesiJadwal $sesiJadwal)
    {
        $request->validate([
            'alasan' => 'required|string|max:500',
        ]);

        try {
            $this->statusService->batalkanJadwal($sesiJadwal->id, $request->alasan);

            return back()->with('success', 'Jadwal berhasil dibatalkan');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
