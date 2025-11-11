<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Untuk MySQL, kita harus gunakan raw SQL untuk alter enum
        DB::statement("ALTER TABLE sesi_jadwal MODIFY COLUMN status ENUM('terjadwal', 'berlangsung', 'selesai', 'tidak_masuk', 'dibatalkan') NOT NULL DEFAULT 'terjadwal'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback: kembalikan ke enum semula
        DB::statement("ALTER TABLE sesi_jadwal MODIFY COLUMN status ENUM('terjadwal', 'berlangsung', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'terjadwal'");
    }
};
