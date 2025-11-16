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
            ->orderBy('activity_date', 'desc')
            ->orderBy('created_at', 'desc')
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
            ->get();

        return response()->json([
            'activities' => $activities,
            'total' => $activities->count(),
        ]);
    }
}
