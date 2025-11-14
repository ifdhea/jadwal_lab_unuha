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
        Schema::table('sesi_jadwal', function (Blueprint $table) {
            // Override fields untuk tukar jadwal sama hari
            $table->unsignedBigInteger('override_slot_waktu_mulai_id')->nullable()->after('status');
            $table->unsignedBigInteger('override_slot_waktu_selesai_id')->nullable()->after('override_slot_waktu_mulai_id');
            $table->unsignedBigInteger('override_laboratorium_id')->nullable()->after('override_slot_waktu_selesai_id');
            
            // Foreign keys
            $table->foreign('override_slot_waktu_mulai_id')->references('id')->on('slot_waktu')->onDelete('set null');
            $table->foreign('override_slot_waktu_selesai_id')->references('id')->on('slot_waktu')->onDelete('set null');
            $table->foreign('override_laboratorium_id')->references('id')->on('laboratorium')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sesi_jadwal', function (Blueprint $table) {
            $table->dropForeign(['override_slot_waktu_mulai_id']);
            $table->dropForeign(['override_slot_waktu_selesai_id']);
            $table->dropForeign(['override_laboratorium_id']);
            
            $table->dropColumn('override_slot_waktu_mulai_id');
            $table->dropColumn('override_slot_waktu_selesai_id');
            $table->dropColumn('override_laboratorium_id');
        });
    }
};
