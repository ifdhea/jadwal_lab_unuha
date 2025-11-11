<?php

namespace App\Services;

use App\Models\SesiJadwal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class JadwalStatusService
{
    /**
     * Update status jadwal berdasarkan waktu saat ini
     * Dipanggil secara otomatis via scheduler
     */
    public function updateStatusOtomatis(): array
    {
        $updated = [
            'berlangsung' => 0,
            'selesai' => 0,
        ];

        try {
            DB::beginTransaction();

            $now = Carbon::now();
            $today = $now->toDateString();

            // Get jadwal hari ini yang masih terjadwal
            $jadwalHariIni = SesiJadwal::where('tanggal', $today)
                ->where('status', 'terjadwal')
                ->with(['jadwalMaster.slotWaktuMulai', 'jadwalMaster.slotWaktuSelesai'])
                ->get();

            foreach ($jadwalHariIni as $sesi) {
                // Skip jika jadwal master tidak ada
                if (!$sesi->jadwalMaster) {
                    Log::warning("Sesi jadwal #{$sesi->id} tidak memiliki jadwal master");
                    continue;
                }

                // Skip jika slot waktu tidak ada
                if (!$sesi->jadwalMaster->slotWaktuMulai || !$sesi->jadwalMaster->slotWaktuSelesai) {
                    Log::warning("Jadwal master #{$sesi->jadwalMaster->id} tidak memiliki slot waktu lengkap");
                    continue;
                }

                // Skip jika waktu null
                if (!$sesi->jadwalMaster->slotWaktuMulai->waktu || !$sesi->jadwalMaster->slotWaktuSelesai->waktu) {
                    Log::warning("Slot waktu untuk jadwal master #{$sesi->jadwalMaster->id} memiliki nilai waktu null");
                    continue;
                }

                $waktuMulai = $this->parseWaktu($sesi->jadwalMaster->slotWaktuMulai->waktu);
                $waktuSelesai = $this->parseWaktu($sesi->jadwalMaster->slotWaktuSelesai->waktu);

                // Jika sekarang >= waktu mulai dan < waktu selesai = berlangsung
                if ($now->greaterThanOrEqualTo($waktuMulai) && $now->lessThan($waktuSelesai)) {
                    $sesi->update(['status' => 'berlangsung']);
                    $updated['berlangsung']++;
                }
                
                // Jika sekarang >= waktu selesai = selesai
                if ($now->greaterThanOrEqualTo($waktuSelesai)) {
                    $sesi->update(['status' => 'selesai']);
                    $updated['selesai']++;
                }
            }

            // Update jadwal masa lalu yang masih terjadwal/berlangsung jadi selesai
            $jadwalLewat = SesiJadwal::where('tanggal', '<', $today)
                ->whereIn('status', ['terjadwal', 'berlangsung'])
                ->update(['status' => 'selesai']);

            $updated['selesai'] += $jadwalLewat;

            DB::commit();

            Log::info('Status jadwal diupdate otomatis', $updated);

            return $updated;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal update status jadwal: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Tandai dosen tidak hadir
     * Hanya bisa dilakukan oleh admin atau pada hari yang sama
     */
    public function tandaiDosenTidakHadir(int $sesiJadwalId, ?string $catatan = null): bool
    {
        try {
            DB::beginTransaction();

            $sesi = SesiJadwal::findOrFail($sesiJadwalId);

            // Validasi: hanya bisa tandai dosen tidak hadir jika jadwal hari ini atau masa lalu
            if ($sesi->tanggal->isFuture()) {
                throw new \Exception('Tidak dapat menandai dosen tidak hadir untuk jadwal masa depan');
            }

            // Validasi: hanya bisa tandai jika status terjadwal atau berlangsung
            if (!in_array($sesi->status, ['terjadwal', 'berlangsung'])) {
                throw new \Exception('Status jadwal tidak valid untuk ditandai tidak hadir');
            }

            $sesi->update([
                'status' => 'tidak_masuk',
                'catatan' => $catatan ?? 'Dosen tidak hadir tanpa keterangan',
            ]);

            DB::commit();

            Log::info("Sesi jadwal #{$sesiJadwalId} ditandai dosen tidak hadir");

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal tandai dosen tidak hadir: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Batalkan jadwal
     * Hanya untuk jadwal masa depan
     */
    public function batalkanJadwal(int $sesiJadwalId, string $alasan): bool
    {
        try {
            DB::beginTransaction();

            $sesi = SesiJadwal::findOrFail($sesiJadwalId);

            // Validasi: hanya bisa batalkan jadwal masa depan
            if ($sesi->tanggal->isPast()) {
                throw new \Exception('Tidak dapat membatalkan jadwal yang sudah lewat');
            }

            // Validasi: hanya bisa batalkan jika status terjadwal
            if ($sesi->status !== 'terjadwal') {
                throw new \Exception('Hanya jadwal dengan status terjadwal yang bisa dibatalkan');
            }

            $sesi->update([
                'status' => 'dibatalkan',
                'catatan' => $alasan,
            ]);

            DB::commit();

            Log::info("Sesi jadwal #{$sesiJadwalId} dibatalkan: {$alasan}");

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal batalkan jadwal: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get jadwal yang bisa dibooking (slot kosong atau dosen tidak hadir)
     */
    public function getSlotTersediaBooking(string $tanggal, int $laboratoriumId): array
    {
        $allSlots = DB::table('slot_waktu')
            ->where('is_istirahat', false)
            ->orderBy('waktu')
            ->get();

        $jadwalTerisi = SesiJadwal::whereDate('tanggal', $tanggal)
            ->whereHas('jadwalMaster', function ($q) use ($laboratoriumId) {
                $q->where('laboratorium_id', $laboratoriumId);
            })
            ->whereNotIn('status', ['dibatalkan', 'tidak_masuk'])
            ->with(['jadwalMaster.slotWaktuMulai', 'jadwalMaster.slotWaktuSelesai'])
            ->get();

        $slotTersedia = [];

        foreach ($allSlots as $slot) {
            $isAvailable = true;

            foreach ($jadwalTerisi as $jadwal) {
                $mulai = $jadwal->jadwalMaster->slotWaktuMulai->waktu;
                $selesai = $jadwal->jadwalMaster->slotWaktuSelesai->waktu;

                // Cek apakah slot ini terisi
                if ($slot->waktu >= $mulai && $slot->waktu < $selesai) {
                    $isAvailable = false;
                    break;
                }
            }

            if ($isAvailable) {
                $slotTersedia[] = $slot;
            }
        }

        return $slotTersedia;
    }

    /**
     * Parse waktu dari string HH:MM:SS ke Carbon datetime hari ini
     */
    private function parseWaktu(string $waktu): Carbon
    {
        list($hour, $minute, $second) = explode(':', $waktu);
        return Carbon::today()->setTime((int)$hour, (int)$minute, (int)$second);
    }

    /**
     * Get statistik status jadwal
     */
    public function getStatistikStatus(string $tanggalMulai, string $tanggalSelesai): array
    {
        return SesiJadwal::whereBetween('tanggal', [$tanggalMulai, $tanggalSelesai])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn($item) => [$item->status => $item->total])
            ->toArray();
    }
}
