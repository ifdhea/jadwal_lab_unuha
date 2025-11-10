<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KelasMatKul extends Model
{
    protected $table = 'kelas_mata_kuliah';
    
    protected $fillable = [
        'kelas_id',
        'mata_kuliah_id',
        'semester_id',
    ];
    
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }
    
    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }
    
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
    
    public function jadwalMaster(): HasMany
    {
        return $this->hasMany(JadwalMaster::class);
    }
}
