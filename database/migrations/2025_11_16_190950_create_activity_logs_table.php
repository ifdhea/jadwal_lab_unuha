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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('actor_name'); // Nama user yang melakukan aksi
            $table->string('actor_role'); // Role user (dosen, admin)
            $table->string('action'); // tukar_jadwal, pindah_jadwal, tidak_masuk, booking_lab, dll
            $table->string('title'); // Judul aktivitas
            $table->text('description'); // Deskripsi lengkap
            $table->json('data')->nullable(); // Data tambahan (jadwal detail, dll)
            $table->string('icon')->nullable(); // Icon emoji untuk UI
            $table->string('color')->default('blue'); // Warna badge (blue, green, orange, red)
            $table->boolean('is_public')->default(true); // Apakah ditampilkan ke publik
            $table->timestamp('activity_date'); // Tanggal aktivitas terjadi
            $table->timestamps();

            $table->index(['is_public', 'activity_date']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
