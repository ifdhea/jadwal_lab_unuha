<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TahunAjaran extends Model
{
    protected $table = 'tahun_ajaran';
    
    protected $fillable = [
        'nama',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_aktif',
    ];
    
    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'is_aktif' => 'boolean',
    ];
    
    public function semester(): HasMany
    {
        return $this->hasMany(Semester::class);
    }
    
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }
    
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
}
