<?php

namespace App\Http\Controllers;

use App\Models\SesiJadwal;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SesiJadwalController extends Controller
{
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
}
