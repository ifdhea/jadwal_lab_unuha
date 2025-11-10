<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramStudi extends Model
{
    protected $table = 'program_studi';
    
    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'is_aktif',
    ];
    
    protected $casts = [
        'is_aktif' => 'boolean',
    ];
    
    public function mataKuliah(): HasMany
    {
        return $this->hasMany(MataKuliah::class);
    }
    
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }
    
    public function dosen(): HasMany
    {
        return $this->hasMany(Dosen::class);
    }
    
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
}
