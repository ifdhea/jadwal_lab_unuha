<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    protected $table = 'semester';
    
    protected $fillable = [
        'tahun_ajaran_id',
        'nama',
        'tipe',
        'tanggal_mulai',
        'tanggal_selesai',
        'total_minggu',
        'is_aktif',
    ];
    
    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'is_aktif' => 'boolean',
    ];
    
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }
    
    public function kelasMatKul(): HasMany
    {
        return $this->hasMany(KelasMatKul::class);
    }
    
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
}
