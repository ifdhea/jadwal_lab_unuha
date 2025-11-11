<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SesiJadwal;
use Carbon\Carbon;

class UpdateJadwalStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jadwal:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update status jadwal otomatis berdasarkan tanggal (jadwal lewat -> selesai)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memulai update status jadwal...');

        // Update jadwal yang sudah lewat menjadi 'selesai'
        // Hanya untuk yang masih status 'terjadwal'
        $updated = SesiJadwal::where('status', 'terjadwal')
            ->where('tanggal', '<', Carbon::today())
            ->update(['status' => 'selesai']);

        $this->info("✅ {$updated} jadwal berhasil diupdate ke status 'selesai'");

        return Command::SUCCESS;
    }
}
