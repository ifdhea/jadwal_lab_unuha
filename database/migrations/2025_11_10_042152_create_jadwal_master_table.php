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
        Schema::create('jadwal_master', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_mata_kuliah_id')->constrained('kelas_mata_kuliah')->onDelete('cascade');
            $table->foreignId('dosen_id')->constrained('dosen')->onDelete('cascade');
            $table->foreignId('laboratorium_id')->constrained('laboratorium')->onDelete('cascade');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
            $table->foreignId('slot_waktu_mulai_id')->constrained('slot_waktu')->onDelete('cascade');
            $table->foreignId('slot_waktu_selesai_id')->constrained('slot_waktu')->onDelete('cascade');
            $table->unsignedTinyInteger('durasi_slot')->default(1);
            $table->enum('status_konflik', ['bebas', 'konflik'])->default('bebas');
            $table->string('pola_minggu', 50)->nullable();
            $table->timestamps();
            
            $table->index(['hari', 'slot_waktu_mulai_id']);
            $table->index('laboratorium_id');
            $table->index('dosen_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_master');
    }
};
