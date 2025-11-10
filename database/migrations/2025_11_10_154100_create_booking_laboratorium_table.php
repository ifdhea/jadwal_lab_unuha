<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_laboratorium', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosen_id')->constrained('dosen')->onDelete('cascade');
            $table->foreignId('laboratorium_id')->constrained('laboratorium')->onDelete('cascade');
            $table->date('tanggal');
            $table->foreignId('slot_waktu_mulai_id')->constrained('slot_waktu')->onDelete('cascade');
            $table->foreignId('slot_waktu_selesai_id')->constrained('slot_waktu')->onDelete('cascade');
            $table->tinyInteger('durasi_slot')->unsigned()->default(1);
            $table->string('keperluan', 200);
            $table->text('keterangan')->nullable();
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak', 'selesai', 'dibatalkan'])->default('menunggu');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('diproses_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('tanggal_diajukan')->useCurrent();
            $table->timestamp('tanggal_diproses')->nullable();
            $table->timestamps();

            $table->index(['dosen_id', 'status']);
            $table->index(['laboratorium_id', 'tanggal']);
            $table->index(['tanggal', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_laboratorium');
    }
};
