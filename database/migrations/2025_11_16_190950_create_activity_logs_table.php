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
            $table->string('actor_name');
            $table->string('actor_role'); 
            $table->string('action'); 
            $table->string('title'); 
            $table->text('description'); 
            $table->json('data')->nullable(); 
            $table->string('icon')->nullable();
            $table->string('color')->default('blue'); 
            $table->boolean('is_public')->default(true); 
            $table->timestamp('activity_date'); 
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
