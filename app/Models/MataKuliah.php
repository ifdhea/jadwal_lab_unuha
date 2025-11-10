<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MataKuliah extends Model
{
    protected $table = 'mata_kuliah';
    
    protected $fillable = [
        'program_studi_id',
        'kode',
        'nama',
        'sks',
        'tingkat_semester',
        'tipe_semester',
        'butuh_lab',
        'deskripsi',
        'is_aktif',
    ];
    
    protected $casts = [
        'butuh_lab' => 'boolean',
        'is_aktif' => 'boolean',
    ];
    
    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }
    
    public function kelasMatKul(): HasMany
    {
        return $this->hasMany(KelasMatKul::class);
    }
    
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
    
    public function scopeButuhLab($query)
    {
        return $query->where('butuh_lab', true);
    }
}
