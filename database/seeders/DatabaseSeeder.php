<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SlotWaktu;
use App\Models\Kampus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin
        User::firstOrCreate(
            ['email' => 'admin@unuha.ac.id'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'peran' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Kampus
        $kampusB = Kampus::firstOrCreate(
            ['kode' => 'B'],
            [
                'nama' => 'Kampus B',
                'alamat' => 'Alamat Kampus B',
                'is_aktif' => true,
            ]
        );

        $kampusC = Kampus::firstOrCreate(
            ['kode' => 'C'],
            [
                'nama' => 'Kampus C',
                'alamat' => 'Alamat Kampus C',
                'is_aktif' => true,
            ]
        );

        // 3. Slot Waktu (9 slot per hari + istirahat)
        $slots = [
            ['waktu_mulai' => '08:00', 'waktu_selesai' => '08:45', 'label' => 'Slot 1 (08:00-08:45)', 'urutan' => 1, 'is_aktif' => true],
            ['waktu_mulai' => '08:45', 'waktu_selesai' => '09:30', 'label' => 'Slot 2 (08:45-09:30)', 'urutan' => 2, 'is_aktif' => true],
            ['waktu_mulai' => '09:30', 'waktu_selesai' => '10:15', 'label' => 'Slot 3 (09:30-10:15)', 'urutan' => 3, 'is_aktif' => true],
            ['waktu_mulai' => '10:15', 'waktu_selesai' => '11:00', 'label' => 'Slot 4 (10:15-11:00)', 'urutan' => 4, 'is_aktif' => true],
            ['waktu_mulai' => '11:00', 'waktu_selesai' => '11:45', 'label' => 'Slot 5 (11:00-11:45)', 'urutan' => 5, 'is_aktif' => true],
            ['waktu_mulai' => '11:45', 'waktu_selesai' => '13:15', 'label' => 'Istirahat (11:45-13:15)', 'urutan' => 6, 'is_aktif' => false],
            ['waktu_mulai' => '13:15', 'waktu_selesai' => '14:00', 'label' => 'Slot 6 (13:15-14:00)', 'urutan' => 7, 'is_aktif' => true],
            ['waktu_mulai' => '14:00', 'waktu_selesai' => '14:45', 'label' => 'Slot 7 (14:00-14:45)', 'urutan' => 8, 'is_aktif' => true],
            ['waktu_mulai' => '14:45', 'waktu_selesai' => '15:30', 'label' => 'Slot 8 (14:45-15:30)', 'urutan' => 9, 'is_aktif' => true],
            ['waktu_mulai' => '15:30', 'waktu_selesai' => '16:15', 'label' => 'Slot 9 (15:30-16:15)', 'urutan' => 10, 'is_aktif' => true],
        ];

        foreach ($slots as $slot) {
            SlotWaktu::firstOrCreate(
                ['waktu_mulai' => $slot['waktu_mulai'], 'waktu_selesai' => $slot['waktu_selesai']],
                $slot
            );
        }
    }
}
