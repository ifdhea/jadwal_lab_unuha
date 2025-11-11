<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule auto-update status jadwal setiap 5 menit (untuk real-time update status)
Schedule::command('jadwal:update-status')->everyFiveMinutes();
