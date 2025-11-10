<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sesi_jadwal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_master_id')->constrained('jadwal_master')->onDelete('cascade');
            $table->unsignedTinyInteger('pertemuan_ke');
            $table->date('tanggal');
            $table->enum('status', ['terjadwal', 'berlangsung', 'selesai', 'dibatalkan'])->default('terjadwal');
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            $table->unique(['jadwal_master_id', 'pertemuan_ke']);
            $table->index('tanggal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sesi_jadwal');
    }
};
