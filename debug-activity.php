<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DEBUG ACTIVITY BADGE ===\n\n";

// Check latest activities
echo "Latest Activities:\n";
$activities = \App\Models\ActivityLog::latest()->take(5)->get();
foreach ($activities as $activity) {
    echo "  ID: {$activity->id}\n";
    echo "  Title: {$activity->title}\n";
    echo "  Created: {$activity->created_at}\n";
    echo "  Is Public: " . ($activity->is_public ? 'Yes' : 'No') . "\n";
    echo "  ---\n";
}

echo "\n";

// Check activities in last 7 days
$count7days = \App\Models\ActivityLog::query()
    ->public()
    ->where('created_at', '>', now()->subDays(7))
    ->count();
echo "Activities in last 7 days: {$count7days}\n";
echo "Should show badge for new users: " . ($count7days > 0 ? 'YES' : 'NO') . "\n\n";

// Check user's last seen
$users = \App\Models\User::whereNotNull('last_seen_activity_at')->get();
echo "Users with last_seen_activity_at:\n";
if ($users->isEmpty()) {
    echo "  (None - all users are 'new' and should see badge if activities exist)\n";
} else {
    foreach ($users as $user) {
        echo "  {$user->name}: {$user->last_seen_activity_at}\n";
    }
}

echo "\n=== END DEBUG ===\n";
