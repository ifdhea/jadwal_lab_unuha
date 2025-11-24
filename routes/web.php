<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\BookingLaboratoriumController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\JadwalGeneratorController;
use App\Http\Controllers\JadwalMasterController;
use App\Http\Controllers\KampusController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\KelasMataKuliahController;
use App\Http\Controllers\LaboratoriumController;
use App\Http\Controllers\MataKuliahController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProgramStudiController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\SesiJadwalController;
use App\Http\Controllers\SlotWaktuController;
use App\Http\Controllers\TahunAjaranController;
use App\Http\Controllers\TukarJadwalController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Public Routes
Route::get('/', [PublicController::class, 'beranda'])->name('home');
Route::get('/beranda', [PublicController::class, 'beranda'])->name('beranda');
Route::get('/jadwal-lab', [PublicController::class, 'jadwal'])->name('jadwal-lab');
Route::get('/tentang', [PublicController::class, 'tentang'])->name('tentang');

// Public Activity Log API - dengan web middleware untuk session
Route::middleware('web')->group(function () {
    Route::get('/api/activity-logs/recent', [ActivityLogController::class, 'getRecent'])->name('api.activity-logs.recent');
    Route::get('/api/activity-logs/today', [ActivityLogController::class, 'getToday'])->name('api.activity-logs.today');
    Route::get('/api/activity-logs/check-unread', [ActivityLogController::class, 'checkUnread'])->name('api.activity-logs.check-unread');
    Route::post('/api/activity-logs/mark-seen', [ActivityLogController::class, 'markAsSeen'])->name('api.activity-logs.mark-seen');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal.index');
    
    // Jadwal Embed (tanpa layout untuk iframe di dashboard)
    Route::get('/jadwal/embed', [JadwalController::class, 'embed'])->name('jadwal.embed');
    
    // Jadwal Export (Excel)
    Route::get('/jadwal/export', [JadwalController::class, 'export'])->name('jadwal.export');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread', [NotificationController::class, 'getUnread'])->name('notifications.unread');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications', [NotificationController::class, 'deleteAll'])->name('notifications.destroy-all');
    
    // Tukar Jadwal - Dosen only
    Route::middleware(['peran:dosen'])->group(function () {
        Route::get('/tukar-jadwal', [TukarJadwalController::class, 'calendar'])->name('tukar-jadwal.index');
        Route::get('/tukar-jadwal/calendar', [TukarJadwalController::class, 'calendar'])->name('tukar-jadwal.calendar');
        Route::get('/tukar-jadwal/requests', [TukarJadwalController::class, 'index'])->name('tukar-jadwal.requests');
        Route::get('/tukar-jadwal/create', [TukarJadwalController::class, 'create'])->name('tukar-jadwal.create');
        Route::post('/tukar-jadwal', [TukarJadwalController::class, 'store'])->name('tukar-jadwal.store');
        Route::get('/tukar-jadwal/jadwal-mitra', [TukarJadwalController::class, 'getJadwalMitra'])->name('tukar-jadwal.jadwal-mitra');
        Route::post('/tukar-jadwal/{tukarJadwal}/approve', [TukarJadwalController::class, 'approve'])->name('tukar-jadwal.approve');
        Route::post('/tukar-jadwal/{tukarJadwal}/reject', [TukarJadwalController::class, 'reject'])->name('tukar-jadwal.reject');
        Route::post('/tukar-jadwal/{tukarJadwal}/cancel', [TukarJadwalController::class, 'cancel'])->name('tukar-jadwal.cancel');
        
        // Sesi Jadwal - Update Status (Tidak Masuk)
        Route::post('/sesi-jadwal/{sesiJadwal}/update-status', [SesiJadwalController::class, 'updateStatus'])->name('sesi-jadwal.update-status');
        Route::post('/sesi-jadwal/{sesiJadwal}/reset-status', [SesiJadwalController::class, 'resetStatus'])->name('sesi-jadwal.reset-status');
    });

    // Booking Laboratorium
    Route::middleware(['peran:dosen,super_admin,admin'])->group(function () {
        Route::get('/booking-lab', [BookingLaboratoriumController::class, 'calendar'])->name('booking-lab.index');
        Route::get('/booking-lab/calendar', [BookingLaboratoriumController::class, 'calendar'])->name('booking-lab.calendar');
        Route::get('/booking-lab/requests', [BookingLaboratoriumController::class, 'index'])->name('booking-lab.requests');
        Route::get('/booking-lab/create', [BookingLaboratoriumController::class, 'create'])->name('booking-lab.create');
        Route::post('/booking-lab', [BookingLaboratoriumController::class, 'store'])->name('booking-lab.store');
        Route::post('/booking-lab/check-availability', [BookingLaboratoriumController::class, 'checkAvailability'])->name('booking-lab.check-availability');
        Route::post('/booking-lab/{bookingLab}/cancel', [BookingLaboratoriumController::class, 'cancel'])->name('booking-lab.cancel');
    });

    // Approve/Reject Booking - Admin only
    Route::middleware(['peran:super_admin,admin'])->group(function () {
        Route::get('/admin/booking-lab', [BookingLaboratoriumController::class, 'adminIndex'])->name('admin.booking-lab.index');
        Route::post('/booking-lab/{bookingLab}/approve', [BookingLaboratoriumController::class, 'approve'])->name('booking-lab.approve');
        Route::post('/booking-lab/{bookingLab}/reject', [BookingLaboratoriumController::class, 'reject'])->name('booking-lab.reject');
        Route::post('/admin/booking-lab/delete-all', [BookingLaboratoriumController::class, 'deleteAll'])->name('admin.booking-lab.delete-all');
        
        // Admin: Tandai dosen tidak hadir & batalkan jadwal
        Route::post('/sesi-jadwal/{sesiJadwal}/tandai-tidak-hadir', [SesiJadwalController::class, 'tandaiTidakHadir'])->name('sesi-jadwal.tandai-tidak-hadir');
        Route::post('/sesi-jadwal/{sesiJadwal}/batalkan', [SesiJadwalController::class, 'batalkan'])->name('sesi-jadwal.batalkan');
    });
    
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
        Route::resource('users', UserController::class);
        Route::resource('jadwal-master', JadwalMasterController::class);
        Route::post('/jadwal-master/bulk-delete', [JadwalMasterController::class, 'bulkDelete'])->name('jadwal-master.bulk-delete');

        Route::post('/jadwal/generate', [JadwalGeneratorController::class, 'generate'])->name('jadwal.generate');
    });
});


require __DIR__.'/settings.php';
