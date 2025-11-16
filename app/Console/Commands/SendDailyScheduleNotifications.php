<?php

namespace App\Console\Commands;

use App\Models\SesiJadwal;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendDailyScheduleNotifications extends Command
{
    protected $signature = 'notifications:send-daily-schedule';
    protected $description = 'Send daily schedule notifications to lecturers';

    public function handle()
    {
        $today = Carbon::today();
        
        // Get all schedules for today that are active (terjadwal)
        $jadwalHariIni = SesiJadwal::with([
            'jadwalMaster.kelasMatKul.mataKuliah',
            'jadwalMaster.kelasMatKul.dosen.user',
            'jadwalMaster.laboratorium',
            'jadwalMaster.slotWaktuMulai',
            'jadwalMaster.slotWaktuSelesai'
        ])
            ->whereDate('tanggal', $today)
            ->where('status', 'terjadwal')
            ->get()
            ->groupBy(function ($jadwal) {
                return $jadwal->jadwalMaster->kelasMatKul->dosen_id;
            });

        $notificationCount = 0;

        foreach ($jadwalHariIni as $dosenId => $jadwals) {
            $dosen = $jadwals->first()->jadwalMaster->kelasMatKul->dosen;
            
            if (!$dosen || !$dosen->user) {
                continue;
            }

            $jadwalData = $jadwals->map(function ($jadwal) {
                return [
                    'mata_kuliah' => $jadwal->jadwalMaster->kelasMatKul->mataKuliah->nama ?? '',
                    'kelas' => $jadwal->jadwalMaster->kelasMatKul->kelas->nama ?? '',
                    'laboratorium' => $jadwal->jadwalMaster->laboratorium->nama ?? '',
                    'waktu_mulai' => $jadwal->jadwalMaster->slotWaktuMulai->waktu_mulai ?? '',
                    'waktu_selesai' => $jadwal->jadwalMaster->slotWaktuSelesai->waktu_selesai ?? '',
                ];
            })->toArray();

            NotificationService::sendJadwalHariIni($dosen->user, $jadwalData);
            $notificationCount++;
        }

        $this->info("Sent {$notificationCount} daily schedule notifications.");
        
        return Command::SUCCESS;
    }
}
