<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    public static function send(User $user, string $type, string $title, string $message, array $data = [])
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function sendJadwalHariIni(User $user, array $jadwalData)
    {
        return self::send(
            $user,
            'jadwal_hari_ini',
            'Jadwal Hari Ini',
            'Anda memiliki ' . count($jadwalData) . ' jadwal mengajar hari ini',
            ['jadwal' => $jadwalData]
        );
    }

    public static function sendTukarJadwalRequest(User $user, $tukarJadwal)
    {
        return self::send(
            $user,
            'tukar_jadwal_request',
            'Permintaan Tukar Jadwal',
            $tukarJadwal->pemohon->nama . ' meminta tukar jadwal dengan Anda',
            [
                'tukar_jadwal_id' => $tukarJadwal->id,
                'pemohon' => $tukarJadwal->pemohon->nama,
                'link' => route('tukar-jadwal.requests'),
            ]
        );
    }

    public static function sendTukarJadwalApproved(User $user, $tukarJadwal)
    {
        return self::send(
            $user,
            'tukar_jadwal_approved',
            'Tukar Jadwal Disetujui',
            'Permintaan tukar jadwal Anda telah disetujui oleh ' . $tukarJadwal->mitra->nama,
            [
                'tukar_jadwal_id' => $tukarJadwal->id,
                'mitra' => $tukarJadwal->mitra->nama,
                'link' => route('tukar-jadwal.requests'),
            ]
        );
    }

    public static function sendTukarJadwalRejected(User $user, $tukarJadwal)
    {
        return self::send(
            $user,
            'tukar_jadwal_rejected',
            'Tukar Jadwal Ditolak',
            'Permintaan tukar jadwal Anda ditolak oleh ' . $tukarJadwal->mitra->nama,
            [
                'tukar_jadwal_id' => $tukarJadwal->id,
                'mitra' => $tukarJadwal->mitra->nama,
                'alasan' => $tukarJadwal->alasan_penolakan,
                'link' => route('tukar-jadwal.requests'),
            ]
        );
    }

    public static function sendBookingRequest(User $user, $booking)
    {
        return self::send(
            $user,
            'booking_request',
            'Permintaan Booking Lab Baru',
            $booking->dosen->nama . ' mengajukan booking lab ' . $booking->laboratorium->nama,
            [
                'booking_id' => $booking->id,
                'dosen' => $booking->dosen->nama,
                'laboratorium' => $booking->laboratorium->nama,
                'tanggal' => $booking->tanggal->format('d M Y'),
                'link' => route('admin.booking-lab.index'),
            ]
        );
    }

    public static function sendBookingApproved(User $user, $booking)
    {
        return self::send(
            $user,
            'booking_approved',
            'Booking Lab Disetujui',
            'Booking lab Anda untuk ' . $booking->laboratorium->nama . ' telah disetujui',
            [
                'booking_id' => $booking->id,
                'laboratorium' => $booking->laboratorium->nama,
                'tanggal' => $booking->tanggal->format('d M Y'),
                'link' => route('booking-lab.requests'),
            ]
        );
    }

    public static function sendBookingRejected(User $user, $booking)
    {
        return self::send(
            $user,
            'booking_rejected',
            'Booking Lab Ditolak',
            'Booking lab Anda untuk ' . $booking->laboratorium->nama . ' ditolak',
            [
                'booking_id' => $booking->id,
                'laboratorium' => $booking->laboratorium->nama,
                'tanggal' => $booking->tanggal->format('d M Y'),
                'catatan' => $booking->catatan_admin,
                'link' => route('booking-lab.requests'),
            ]
        );
    }

    public static function sendPindahJadwal(User $user, $sesiJadwal)
    {
        return self::send(
            $user,
            'pindah_jadwal',
            'Jadwal Dipindahkan',
            'Jadwal Anda telah dipindahkan ke waktu yang baru',
            [
                'sesi_jadwal_id' => $sesiJadwal->id,
                'mata_kuliah' => $sesiJadwal->kelasMatKul->mataKuliah->nama ?? '',
                'link' => route('jadwal.index'),
            ]
        );
    }
}
