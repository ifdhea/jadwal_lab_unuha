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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_studi_id')->constrained('program_studi')->onDelete('cascade');
            $table->foreignId('kampus_id')->constrained('kampus')->onDelete('cascade');
            $table->unsignedTinyInteger('tingkat_semester');
            $table->string('kode', 20);
            $table->string('nama', 100);
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->unsignedSmallInteger('kapasitas')->default(30);
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();
            
            $table->unique(['program_studi_id', 'kampus_id', 'kode', 'tahun_ajaran_id']);
            $table->index('kampus_id');
            $table->index('tingkat_semester');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
