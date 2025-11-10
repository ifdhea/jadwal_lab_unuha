<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    protected $table = 'kelas';
    
    protected $fillable = [
        'program_studi_id',
        'kampus_id',
        'tingkat_semester',
        'kode',
        'nama',
        'tahun_ajaran_id',
        'kapasitas',
        'is_aktif',
    ];
    
    protected $casts = [
        'is_aktif' => 'boolean',
    ];
    
    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }
    
    public function kampus(): BelongsTo
    {
        return $this->belongsTo(Kampus::class);
    }
    
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
