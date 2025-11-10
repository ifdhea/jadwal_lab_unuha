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
        Schema::create('slot_waktu', function (Blueprint $table) {
            $table->id();
            $table->time('waktu_mulai');
            $table->time('waktu_selesai');
            $table->string('label', 50);
            $table->unsignedTinyInteger('urutan');
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();
            
            $table->unique(['waktu_mulai', 'waktu_selesai']);
            $table->index('urutan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slot_waktu');
    }
};
