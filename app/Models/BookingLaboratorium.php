<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingLaboratorium extends Model
{
    protected $table = 'booking_laboratorium';

    protected $fillable = [
        'dosen_id',
        'kelas_mata_kuliah_id',
        'laboratorium_id',
        'tanggal',
        'slot_waktu_mulai_id',
        'slot_waktu_selesai_id',
        'durasi_slot',
        'keperluan',
        'keterangan',
        'status',
        'catatan_admin',
        'diproses_oleh',
        'tanggal_diajukan',
        'tanggal_diproses',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'tanggal_diajukan' => 'datetime',
        'tanggal_diproses' => 'datetime',
    ];

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

    public function diprosesOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diproses_oleh');
    }

    public function kelasMatKul(): BelongsTo
    {
        return $this->belongsTo(KelasMatKul::class, 'kelas_mata_kuliah_id');
    }

    public function scopeMenunggu($query)
    {
        return $query->where('status', 'menunggu');
    }

    public function scopeDisetujui($query)
    {
        return $query->where('status', 'disetujui');
    }

    public function scopeAktif($query)
    {
        return $query->whereIn('status', ['menunggu', 'disetujui']);
    }
}
