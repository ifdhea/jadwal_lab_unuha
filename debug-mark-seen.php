<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "=== DEBUG MARK AS SEEN ===\n\n";

// Get latest activity
$latestActivity = \App\Models\ActivityLog::query()
    ->public()
    ->latest('created_at')
    ->first();

if ($latestActivity) {
    echo "Latest Activity:\n";
    echo "  ID: {$latestActivity->id}\n";
    echo "  Title: {$latestActivity->title}\n";
    echo "  Created: {$latestActivity->created_at}\n";
    echo "  Created (raw): {$latestActivity->created_at->toDateTimeString()}\n";
    echo "\n";
    
    // Simulate marking as seen
    $markTime = $latestActivity->created_at;
    echo "Mark Time: {$markTime->toDateTimeString()}\n";
    echo "\n";
    
    // Check if there would be unread after marking
    $countAfter = \App\Models\ActivityLog::query()
        ->public()
        ->where('created_at', '>', $markTime)
        ->count();
    
    echo "Activities AFTER mark time: {$countAfter}\n";
    echo "Should show badge: " . ($countAfter > 0 ? 'YES' : 'NO') . "\n\n";
    
    // Show comparison
    echo "All activities comparison:\n";
    $all = \App\Models\ActivityLog::query()->public()->orderBy('created_at', 'desc')->get();
    foreach ($all as $act) {
        $isAfter = $act->created_at > $markTime;
        echo "  ID {$act->id}: {$act->created_at} " . ($isAfter ? '> (AFTER)' : '<= (BEFORE/EQUAL)') . " {$markTime}\n";
    }
}

echo "\n=== END DEBUG ===\n";
