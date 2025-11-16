<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;

class ActivityLogService
{
    public static function log(
        ?User $user,
        string $actorName,
        string $actorRole,
        string $action,
        string $title,
        string $description,
        array $data = [],
        string $icon = '📌',
        string $color = 'blue',
        bool $isPublic = true,
        ?Carbon $activityDate = null
    ) {
        return ActivityLog::create([
            'user_id' => $user?->id,
            'actor_name' => $actorName,
            'actor_role' => $actorRole,
            'action' => $action,
            'title' => $title,
            'description' => $description,
            'data' => $data,
            'icon' => $icon,
            'color' => $color,
            'is_public' => $isPublic,
            'activity_date' => $activityDate ?? now(),
        ]);
    }

    public static function logTukarJadwal($tukarJadwal)
    {
        $pemohon = $tukarJadwal->pemohon;
        $mitra = $tukarJadwal->mitra;
        
        if (!$pemohon || !$pemohon->user || !$mitra || !$mitra->user) {
            return null; // Skip logging jika data tidak lengkap
        }

        $sesiPemohon = $tukarJadwal->sesiJadwalPemohon;
        $sesiMitra = $tukarJadwal->sesiJadwalMitra;

        $mkPemohon = $sesiPemohon->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'N/A';
        $mkMitra = $sesiMitra->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'N/A';
        $labPemohon = $sesiPemohon->jadwalMaster->laboratorium->nama ?? 'N/A';
        $labMitra = $sesiMitra->jadwalMaster->laboratorium->nama ?? 'N/A';

        $description = sprintf(
            '%s menukar jadwal %s di %s dengan %s untuk jadwal %s di %s',
            $pemohon->user->name,
            $mkPemohon,
            $labPemohon,
            $mitra->user->name,
            $mkMitra,
            $labMitra
        );

        return self::log(
            $pemohon->user,
            $pemohon->user->name,
            'Dosen',
            'tukar_jadwal',
            'Tukar Jadwal',
            $description,
            [
                'pemohon' => $pemohon->user->name,
                'mitra' => $mitra->user->name,
                'mk_pemohon' => $mkPemohon,
                'mk_mitra' => $mkMitra,
                'lab_pemohon' => $labPemohon,
                'lab_mitra' => $labMitra,
                'tanggal_pemohon' => $sesiPemohon->tanggal->format('d M Y'),
                'tanggal_mitra' => $sesiMitra->tanggal->format('d M Y'),
            ],
            '🔄',
            'blue',
            true,
            $sesiPemohon->tanggal
        );
    }

    public static function logPindahJadwal($tukarJadwal)
    {
        $pemohon = $tukarJadwal->pemohon;
        
        if (!$pemohon || !$pemohon->user) {
            return null; // Skip logging jika data tidak lengkap
        }

        $sesiPemohon = $tukarJadwal->sesiJadwalPemohon;

        $mk = $sesiPemohon->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'N/A';
        $lab = $sesiPemohon->jadwalMaster->laboratorium->nama ?? 'N/A';
        $tanggalBaru = $sesiPemohon->tanggal->format('d M Y');

        $description = sprintf(
            '%s memindahkan jadwal %s di %s ke %s',
            $pemohon->user->name,
            $mk,
            $lab,
            $tanggalBaru
        );

        return self::log(
            $pemohon->user,
            $pemohon->user->name,
            'Dosen',
            'pindah_jadwal',
            'Pindah Jadwal',
            $description,
            [
                'dosen' => $pemohon->user->name,
                'mata_kuliah' => $mk,
                'laboratorium' => $lab,
                'tanggal_baru' => $tanggalBaru,
            ],
            '📌',
            'orange',
            true,
            $sesiPemohon->tanggal
        );
    }

    public static function logTidakMasuk($sesiJadwal, $dosen)
    {
        if (!$dosen || !$dosen->user) {
            return null; // Skip logging jika data tidak lengkap
        }

        $mk = $sesiJadwal->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'N/A';
        $kelas = $sesiJadwal->jadwalMaster->kelasMatKul->kelas->nama ?? 'N/A';
        $lab = $sesiJadwal->jadwalMaster->laboratorium->nama ?? 'N/A';
        $tanggal = $sesiJadwal->tanggal->format('d M Y');
        $waktu = sprintf(
            '%s - %s',
            $sesiJadwal->jadwalMaster->slotWaktuMulai->waktu_mulai ?? 'N/A',
            $sesiJadwal->jadwalMaster->slotWaktuSelesai->waktu_selesai ?? 'N/A'
        );

        $description = sprintf(
            '%s tidak masuk untuk %s (%s) di %s pada %s pukul %s',
            $dosen->user->name,
            $mk,
            $kelas,
            $lab,
            $tanggal,
            $waktu
        );

        return self::log(
            $dosen->user,
            $dosen->user->name,
            'Dosen',
            'tidak_masuk',
            'Dosen Tidak Masuk',
            $description,
            [
                'dosen' => $dosen->user->name,
                'mata_kuliah' => $mk,
                'kelas' => $kelas,
                'laboratorium' => $lab,
                'tanggal' => $tanggal,
                'waktu' => $waktu,
            ],
            '❌',
            'red',
            true,
            $sesiJadwal->tanggal
        );
    }

    public static function logBookingLabDisetujui($booking)
    {
        $dosen = $booking->dosen;
        
        if (!$dosen || !$dosen->user) {
            return null; // Skip logging jika data dosen tidak lengkap
        }

        $lab = $booking->laboratorium->nama ?? 'N/A';
        $tanggal = $booking->tanggal->format('d M Y');
        $waktu = sprintf(
            '%s - %s',
            $booking->slotWaktuMulai->waktu_mulai ?? 'N/A',
            $booking->slotWaktuSelesai->waktu_selesai ?? 'N/A'
        );

        $description = sprintf(
            '%s booking %s pada %s pukul %s untuk %s',
            $dosen->user->name,
            $lab,
            $tanggal,
            $waktu,
            $booking->keperluan
        );

        return self::log(
            $dosen->user,
            $dosen->user->name,
            'Dosen',
            'booking_lab',
            'Booking Lab Disetujui',
            $description,
            [
                'dosen' => $dosen->user->name,
                'laboratorium' => $lab,
                'tanggal' => $tanggal,
                'waktu' => $waktu,
                'keperluan' => $booking->keperluan,
            ],
            '✅',
            'green',
            true,
            $booking->tanggal
        );
    }

    public static function logJadwalDibatalkan($sesiJadwal, $adminName)
    {
        $mk = $sesiJadwal->jadwalMaster->kelasMatKul->mataKuliah->nama ?? 'N/A';
        $kelas = $sesiJadwal->jadwalMaster->kelasMatKul->kelas->nama ?? 'N/A';
        $dosen = $sesiJadwal->jadwalMaster->kelasMatKul->dosen;
        $dosenName = $dosen && $dosen->user ? $dosen->user->name : 'N/A';
        $lab = $sesiJadwal->jadwalMaster->laboratorium->nama ?? 'N/A';
        $tanggal = $sesiJadwal->tanggal->format('d M Y');

        $description = sprintf(
            'Jadwal %s (%s) oleh %s di %s pada %s dibatalkan oleh admin',
            $mk,
            $kelas,
            $dosenName,
            $lab,
            $tanggal
        );

        return self::log(
            null,
            $adminName,
            'Admin',
            'jadwal_dibatalkan',
            'Jadwal Dibatalkan',
            $description,
            [
                'mata_kuliah' => $mk,
                'kelas' => $kelas,
                'dosen' => $dosenName,
                'laboratorium' => $lab,
                'tanggal' => $tanggal,
                'admin' => $adminName,
            ],
            '🚫',
            'red',
            true,
            $sesiJadwal->tanggal
        );
    }
}
