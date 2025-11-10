<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SesiJadwal extends Model
{
    protected $table = 'sesi_jadwal';
    
    protected $fillable = [
        'jadwal_master_id',
        'pertemuan_ke',
        'tanggal',
        'status',
        'catatan',
    ];
    
    protected $casts = [
        'tanggal' => 'date',
    ];
    
    public function jadwalMaster(): BelongsTo
    {
        return $this->belongsTo(JadwalMaster::class);
    }
    
    public function scopeTerjadwal($query)
    {
        return $query->where('status', 'terjadwal');
    }
    
    public function scopeSelesai($query)
    {
        return $query->where('status', 'selesai');
    }
}
