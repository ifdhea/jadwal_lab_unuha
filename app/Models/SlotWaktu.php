<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SlotWaktu extends Model
{
    protected $table = 'slot_waktu';
    
    protected $fillable = [
        'waktu_mulai',
        'waktu_selesai',
        'label',
        'urutan',
        'is_aktif',
    ];
    
    protected $casts = [
        'waktu_mulai' => 'datetime:H:i',
        'waktu_selesai' => 'datetime:H:i',
        'is_aktif' => 'boolean',
    ];
    
    public function jadwalMasterMulai(): HasMany
    {
        return $this->hasMany(JadwalMaster::class, 'slot_waktu_mulai_id');
    }
    
    public function jadwalMasterSelesai(): HasMany
    {
        return $this->hasMany(JadwalMaster::class, 'slot_waktu_selesai_id');
    }
    
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
}
