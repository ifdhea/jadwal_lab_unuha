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
        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_studi_id')->constrained('program_studi')->onDelete('cascade');
            $table->string('kode', 20);
            $table->string('nama', 200);
            $table->unsignedTinyInteger('sks');
            $table->unsignedTinyInteger('tingkat_semester');
            $table->enum('tipe_semester', ['ganjil', 'genap', 'both'])->default('both');
            $table->boolean('butuh_lab')->default(true);
            $table->text('deskripsi')->nullable();
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();
            
            $table->unique(['program_studi_id', 'kode']);
            $table->index(['tingkat_semester', 'tipe_semester']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_kuliah');
    }
};
