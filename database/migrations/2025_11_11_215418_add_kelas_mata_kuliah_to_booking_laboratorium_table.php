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
        Schema::table('booking_laboratorium', function (Blueprint $table) {
            $table->foreignId('kelas_mata_kuliah_id')->nullable()->after('dosen_id')->constrained('kelas_mata_kuliah')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_laboratorium', function (Blueprint $table) {
            $table->dropForeign(['kelas_mata_kuliah_id']);
            $table->dropColumn('kelas_mata_kuliah_id');
        });
    }
};
