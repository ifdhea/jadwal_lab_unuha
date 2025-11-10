<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TukarJadwal extends Model
{
    protected $table = 'tukar_jadwal';

    protected $fillable = [
        'pemohon_id',
        'sesi_jadwal_pemohon_id',
        'mitra_id',
        'sesi_jadwal_mitra_id',
        'status',
        'alasan_pemohon',
        'alasan_penolakan',
        'tanggal_diajukan',
        'tanggal_diproses',
    ];

    protected $casts = [
        'tanggal_diajukan' => 'datetime',
        'tanggal_diproses' => 'datetime',
    ];

    public function pemohon(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'pemohon_id');
    }

    public function mitra(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'mitra_id');
    }

    public function sesiJadwalPemohon(): BelongsTo
    {
        return $this->belongsTo(SesiJadwal::class, 'sesi_jadwal_pemohon_id');
    }

    public function sesiJadwalMitra(): BelongsTo
    {
        return $this->belongsTo(SesiJadwal::class, 'sesi_jadwal_mitra_id');
    }

    public function scopeMenunggu($query)
    {
        return $query->where('status', 'menunggu');
    }

    public function scopeDiproses($query)
    {
        return $query->whereIn('status', ['disetujui', 'ditolak']);
    }
}
