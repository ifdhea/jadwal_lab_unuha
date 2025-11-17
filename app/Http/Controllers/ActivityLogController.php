<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function getRecent(Request $request)
    {
        $days = $request->input('days', 7); // Default 7 hari terakhir
        
        $activities = ActivityLog::query()
            ->public()
            ->recent($days)
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'activities' => $activities,
            'total' => $activities->count(),
        ]);
    }

    public function getToday()
    {
        $activities = ActivityLog::query()
            ->public()
            ->today()
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'activities' => $activities,
            'total' => $activities->count(),
        ]);
    }

    public function checkUnread(Request $request)
    {
        $user = $request->user();
        
        // Untuk authenticated user
        if ($user) {
            $lastSeenAt = $user->last_seen_activity_at;
            
            // Jika user belum pernah lihat aktivitas
            if (!$lastSeenAt) {
                // Cek apakah ada aktivitas dalam 7 hari terakhir
                $hasActivities = ActivityLog::query()
                    ->public()
                    ->where('created_at', '>', now()->subDays(7))
                    ->exists();
                    
                return response()->json([
                    'has_unread' => $hasActivities,
                    'last_seen_at' => null,
                ]);
            }
            
            // User sudah pernah lihat, cek aktivitas baru setelah waktu tersebut
            $hasUnread = ActivityLog::query()
                ->public()
                ->where('created_at', '>', $lastSeenAt)
                ->exists();
                
            return response()->json([
                'has_unread' => $hasUnread,
                'last_seen_at' => $lastSeenAt,
            ]);
        }
        
        // Untuk guest, gunakan parameter dari client (localStorage)
        $clientLastSeen = $request->input('client_last_seen');
        
        // Jika guest belum pernah lihat (tidak ada di localStorage)
        if (!$clientLastSeen) {
            // Cek apakah ada aktivitas dalam 7 hari terakhir
            $hasActivities = ActivityLog::query()
                ->public()
                ->where('created_at', '>', now()->subDays(7))
                ->exists();
                
            return response()->json([
                'has_unread' => $hasActivities,
                'last_seen_at' => null,
            ]);
        }

        // Guest sudah pernah lihat, cek aktivitas baru
        // Parse string datetime ke Carbon untuk perbandingan yang konsisten
        try {
            $lastSeenCarbon = \Carbon\Carbon::parse($clientLastSeen);
            
            $hasUnread = ActivityLog::query()
                ->public()
                ->where('created_at', '>', $lastSeenCarbon)
                ->exists();

            return response()->json([
                'has_unread' => $hasUnread,
                'last_seen_at' => $lastSeenCarbon->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            // Jika parsing gagal, anggap tidak ada unread
            return response()->json([
                'has_unread' => false,
                'last_seen_at' => $clientLastSeen,
                'error' => 'Invalid date format',
            ]);
        }
    }

    public function markAsSeen(Request $request)
    {
        $user = $request->user();
        
        // Ambil waktu dari aktivitas terbaru untuk memastikan semua sudah ditandai sebagai dibaca
        $latestActivity = ActivityLog::query()
            ->public()
            ->latest('created_at')
            ->first();
            
        $markTime = $latestActivity ? $latestActivity->created_at : now();
        
        if ($user) {
            // Update database untuk authenticated user
            $user->update([
                'last_seen_activity_at' => $markTime,
            ]);
        }
        // Untuk guest, tidak perlu simpan di session karena frontend akan simpan di localStorage

        return response()->json([
            'success' => true,
            'marked_at' => $markTime->toDateTimeString(), // Kirim sebagai string untuk localStorage
        ]);
    }
}
