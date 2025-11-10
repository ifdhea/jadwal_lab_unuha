<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tukar_jadwal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pemohon_id')->constrained('dosen')->onDelete('cascade');
            $table->foreignId('sesi_jadwal_pemohon_id')->constrained('sesi_jadwal')->onDelete('cascade');
            $table->foreignId('mitra_id')->nullable()->constrained('dosen')->onDelete('cascade');
            $table->foreignId('sesi_jadwal_mitra_id')->nullable()->constrained('sesi_jadwal')->onDelete('cascade');
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak', 'dibatalkan'])->default('menunggu');
            $table->text('alasan_pemohon')->nullable();
            $table->text('alasan_penolakan')->nullable();
            $table->timestamp('tanggal_diajukan')->useCurrent();
            $table->timestamp('tanggal_diproses')->nullable();
            $table->timestamps();

            $table->index(['pemohon_id', 'status']);
            $table->index(['mitra_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tukar_jadwal');
    }
};
