<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\JadwalStatusService;

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
    protected $description = 'Update status jadwal otomatis (terjadwal -> berlangsung -> selesai)';

    protected $statusService;

    public function __construct(JadwalStatusService $statusService)
    {
        parent::__construct();
        $this->statusService = $statusService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memulai update status jadwal...');

        try {
            $result = $this->statusService->updateStatusOtomatis();

            $this->info("✅ Status berhasil diupdate:");
            $this->line("   - Berlangsung: {$result['berlangsung']}");
            $this->line("   - Selesai: {$result['selesai']}");

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("❌ Gagal update status: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
