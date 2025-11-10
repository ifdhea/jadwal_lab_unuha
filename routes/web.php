<?php

use App\Http\Controllers\DosenController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\JadwalGeneratorController;
use App\Http\Controllers\JadwalMasterController;
use App\Http\Controllers\KampusController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\KelasMataKuliahController;
use App\Http\Controllers\LaboratoriumController;
use App\Http\Controllers\MataKuliahController;
use App\Http\Controllers\ProgramStudiController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\SlotWaktuController;
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

    Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal.index');
    
    // Master Data - Super Admin & Admin only
    Route::middleware(['peran:super_admin,admin'])->group(function () {
        Route::resource('tahun-ajaran', TahunAjaranController::class);
        Route::resource('semester', SemesterController::class);
        Route::resource('kampus', KampusController::class)->parameters(['kampus' => 'kampus']);
        Route::resource('laboratorium', LaboratoriumController::class);
        Route::resource('program-studi', ProgramStudiController::class);
        Route::resource('kelas', KelasController::class)->parameters(['kelas' => 'kelas']);
        Route::resource('mata-kuliah', MataKuliahController::class);
        Route::resource('kelas-matkul', KelasMataKuliahController::class)->parameters(['kelas_matkul' => 'kelasMatkul']);
        Route::resource('slot-waktu', SlotWaktuController::class);
        Route::resource('dosen', DosenController::class);
        Route::resource('jadwal-master', JadwalMasterController::class);
        Route::post('/jadwal/generate', [JadwalGeneratorController::class, 'generate'])->name('jadwal.generate');
    });
});


require __DIR__.'/settings.php';
