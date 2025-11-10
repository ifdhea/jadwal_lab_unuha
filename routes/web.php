<?php

use App\Http\Controllers\KampusController;
use App\Http\Controllers\LaboratoriumController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\TahunAjaranController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Master Data - Super Admin & Admin only
    Route::middleware(['peran:super_admin,admin'])->group(function () {
        Route::resource('tahun-ajaran', TahunAjaranController::class);
        Route::resource('semester', SemesterController::class);
        Route::resource('kampus', KampusController::class);
        Route::resource('laboratorium', LaboratoriumController::class);
    });
});

require __DIR__.'/settings.php';
