<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dosen extends Model
{
    protected $table = 'dosen';
    
    protected $fillable = [
        'user_id',
        'nidn',
        'nip',
        'program_studi_id',
        'kampus_utama_id',
        'gelar_depan',
        'gelar_belakang',
        'no_telp',
        'alamat',
        'is_aktif',
    ];
    
    protected $casts = [
        'is_aktif' => 'boolean',
    ];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }
    
    public function kampusUtama(): BelongsTo
    {
        return $this->belongsTo(Kampus::class, 'kampus_utama_id');
    }
    
    public function jadwalMaster(): HasMany
    {
        return $this->hasMany(JadwalMaster::class);
    }
    
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
    
    public function getNamaLengkapAttribute()
    {
        $nama = $this->user->name;
        $gelar_depan = $this->gelar_depan ? $this->gelar_depan . ' ' : '';
        $gelar_belakang = $this->gelar_belakang ? ', ' . $this->gelar_belakang : '';
        
        return $gelar_depan . $nama . $gelar_belakang;
    }
}
