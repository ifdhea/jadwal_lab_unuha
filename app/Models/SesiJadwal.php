<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SesiJadwal extends Model
{
    protected $table = 'sesi_jadwal';
    
    protected $fillable = [
        'jadwal_master_id',
        'pertemuan_ke',
        'tanggal',
        'status',
        'catatan',
        'override_slot_waktu_mulai_id',
        'override_slot_waktu_selesai_id',
        'override_laboratorium_id',
    ];
    
    protected $casts = [
        'tanggal' => 'date',
    ];
    
    public function jadwalMaster(): BelongsTo
    {
        return $this->belongsTo(JadwalMaster::class);
    }
    
    // Override relations
    public function overrideSlotWaktuMulai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'override_slot_waktu_mulai_id');
    }
    
    public function overrideSlotWaktuSelesai(): BelongsTo
    {
        return $this->belongsTo(SlotWaktu::class, 'override_slot_waktu_selesai_id');
    }
    
    public function overrideLaboratorium(): BelongsTo
    {
        return $this->belongsTo(Laboratorium::class, 'override_laboratorium_id');
    }
    
    public function scopeTerjadwal($query)
    {
        return $query->where('status', 'terjadwal');
    }
    
    public function scopeSelesai($query)
    {
        return $query->where('status', 'selesai');
    }

    public function scopeTidakMasuk($query)
    {
        return $query->where('status', 'tidak_masuk');
    }

    public function scopeDosenTidakHadir($query)
    {
        return $query->where('status', 'tidak_masuk');
    }

    public function scopeBerlangsung($query)
    {
        return $query->where('status', 'berlangsung');
    }

    public function scopeDibatalkan($query)
    {
        return $query->where('status', 'dibatalkan');
    }

    // Helper untuk cek apakah jadwal bisa di-booking
    public function isAvailableForBooking(): bool
    {
        return in_array($this->status, ['tidak_masuk']);
    }

    // Helper untuk cek apakah sudah lewat
    public function isPast(): bool
    {
        return $this->tanggal->isPast();
    }

    // Helper untuk cek apakah hari ini atau akan datang
    public function isTodayOrFuture(): bool
    {
        return $this->tanggal->isToday() || $this->tanggal->isFuture();
    }
}
