<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kampus extends Model
{
    protected $table = 'kampus';
    
    protected $fillable = [
        'kode',
        'nama',
        'alamat',
        'is_aktif',
    ];
    
    protected $casts = [
        'is_aktif' => 'boolean',
    ];
    
    public function laboratorium(): HasMany
    {
        return $this->hasMany(Laboratorium::class);
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
