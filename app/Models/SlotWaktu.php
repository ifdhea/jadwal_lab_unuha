<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SlotWaktu extends Model
{
    use HasFactory;

    protected $table = 'slot_waktu';

    protected $fillable = [
        'waktu_mulai',
        'waktu_selesai',
        'label',
        'urutan',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
    ];

    protected $appends = ['waktu_mulai_formatted', 'waktu_selesai_formatted'];

    public function getWaktuMulaiFormattedAttribute()
    {
        return substr($this->waktu_mulai, 0, 5);
    }

    public function getWaktuSelesaiFormattedAttribute()
    {
        return substr($this->waktu_selesai, 0, 5);
    }
}