<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Laboratorium extends Model
{
    protected $table = 'laboratorium';
    
    protected $fillable = [
        'kampus_id',
        'kode',
        'nama',
        'kapasitas',
        'deskripsi',
        'is_aktif',
    ];
    
    protected $casts = [
        'is_aktif' => 'boolean',
    ];
    
    public function kampus(): BelongsTo
    {
        return $this->belongsTo(Kampus::class);
    }
    
    public function jadwalMaster(): HasMany
    {
        return $this->hasMany(JadwalMaster::class);
    }
    
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
}
