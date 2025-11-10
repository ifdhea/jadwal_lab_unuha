<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JadwalMaster extends Model
{
    protected $table = 'jadwal_master';
    
    protected $fillable = [
        'kelas_mata_kuliah_id',
        'dosen_id',
        'laboratorium_id',
        'hari',
        'slot_waktu_mulai_id',
        'slot_waktu_selesai_id',
        'durasi_slot',
        'status_konflik',
        'pola_minggu',
    ];
    
    public function kelasMatKul(): BelongsTo
    {
        return $this->belongsTo(KelasMatKul::class, 'kelas_mata_kuliah_id');
    }
    
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }
    
    public function laboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class);
    }
    
    public function slotWaktuMulai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_mulai_id');
    }
    
    public function slotWaktuSelesai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'slot_waktu_selesai_id');
    }
    
    public function sesiJadwal(): HasMany
    {
        return $this->hasMany(SesiJadwal::class);
    }
    
    public function scopeKonflik($query)
    {
        return $query->where('status_konflik', 'konflik');
    }
    
    public function scopeBebas($query)
    {
        return $query->where('status_konflik', 'bebas');
    }
}
