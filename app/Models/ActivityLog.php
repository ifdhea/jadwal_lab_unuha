<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'actor_name',
        'actor_role',
        'action',
        'title',
        'description',
        'data',
        'icon',
        'color',
        'is_public',
        'activity_date',
    ];

    protected $casts = [
        'data' => 'array',
        'is_public' => 'boolean',
        'activity_date' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('activity_date', '>=', now()->subDays($days));
    }

    public function scopeToday($query)
    {
        return $query->whereDate('activity_date', today());
    }
}
