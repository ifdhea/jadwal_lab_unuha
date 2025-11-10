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
        Schema::create('laboratorium', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kampus_id')->constrained('kampus')->onDelete('cascade');
            $table->string('kode', 20);
            $table->string('nama', 100);
            $table->unsignedSmallInteger('kapasitas')->default(30);
            $table->text('deskripsi')->nullable();
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();
            
            $table->unique(['kampus_id', 'kode']);
            $table->index(['kampus_id', 'is_aktif']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratorium');
    }
};
