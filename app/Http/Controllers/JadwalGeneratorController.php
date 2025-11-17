<?php

namespace App\Http\Controllers;

use App\Models\JadwalMaster;
use App\Models\SesiJadwal;
use App\Models\Semester;
use App\Models\SlotWaktu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class JadwalGeneratorController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'semester_id' => 'required|exists:semester,id',
        ]);

        $semesterId = $request->semester_id;
        $semester = Semester::findOrFail($semesterId);
        $konflikTerdeteksi = [];
        $sesiDibuat = 0;

        DB::transaction(function () use ($semester, &$konflikTerdeteksi, &$sesiDibuat) {
            // 1. Hapus sesi jadwal lama untuk semester ini
            $masterIds = JadwalMaster::whereHas('kelasMatKul', function ($query) use ($semester) {
                $query->where('semester_id', $semester->id);
            })->pluck('id');
            
            SesiJadwal::whereIn('jadwal_master_id', $masterIds)->delete();

            // 2. Ambil semua master jadwal untuk semester ini
            $masterJadwals = JadwalMaster::whereHas('kelasMatKul', function ($query) use ($semester) {
                $query->where('semester_id', $semester->id);
            })
            ->with(['kelasMatKul.kelas', 'kelasMatKul.mataKuliah', 'slotWaktuMulai', 'slotWaktuSelesai', 'dosen', 'laboratorium'])
            ->orderBy('hari')
            ->orderBy('slot_waktu_mulai_id')
            ->get();

            // 3. Hitung jumlah minggu
            $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
            $tanggalSelesai = Carbon::parse($semester->tanggal_selesai);
            $totalMinggu = $semester->total_minggu ?? 20;

            // 4. Group jadwal berdasarkan konflik slot pertama saja (bukan semua slot)
            $kelompokKonflik = [];
            $processedMasters = []; // Track master yang sudah diproses
            $hariMapping = [
                'Senin' => 1, 'Selasa' => 2, 'Rabu' => 3, 
                'Kamis' => 4, 'Jumat' => 5, 'Sabtu' => 6, 'Minggu' => 7
            ];

            foreach ($masterJadwals as $master) {
                // Skip jika sudah diproses
                if (in_array($master->id, $processedMasters)) {
                    continue;
                }

                $hariNum = is_numeric($master->hari) ? (int) $master->hari : ($hariMapping[$master->hari] ?? 1);
                
                // Ambil HANYA slot pertama untuk identifikasi konflik
                $slotMulaiId = $master->slot_waktu_mulai_id;

                // Key untuk identifikasi konflik: lab + hari + slot_mulai
                $key = "{$master->laboratorium_id}_{$hariNum}_{$slotMulaiId}";
                
                if (!isset($kelompokKonflik[$key])) {
                    $kelompokKonflik[$key] = [];
                }
                
                $kelompokKonflik[$key][] = [
                    'master' => $master,
                    'hari_num' => $hariNum,
                ];

                $processedMasters[] = $master->id;
            }

            // 5. Proses setiap grup konflik
            foreach ($kelompokKonflik as $key => $grup) {
                if (count($grup) === 1) {
                    // Tidak ada konflik - generate untuk semua minggu
                    $this->generateSesiSemua($grup[0]['master'], $totalMinggu, $tanggalMulai, $tanggalSelesai, $grup[0]['hari_num'], $sesiDibuat);
                    
                    // Update pola_minggu menjadi semua 1 (jalan semua minggu)
                    $polaMinggu = array_fill(0, $totalMinggu, 1);
                    $grup[0]['master']->update(['pola_minggu' => implode(',', $polaMinggu)]);
                } else {
                    // Ada konflik - gunakan rolling system
                    $jumlahKonflik = count($grup);
                    $konflikTerdeteksi[] = [
                        'key' => $key,
                        'jumlah' => $jumlahKonflik,
                        'jadwal' => array_map(function($item) {
                            return $item['master']->kelasMatKul->kelas->nama . ' - ' . $item['master']->kelasMatKul->mataKuliah->nama;
                        }, $grup)
                    ];

                    // Rolling: bagi minggu secara bergiliran
                    for ($minggu = 1; $minggu <= $totalMinggu; $minggu++) {
                        $indexYangJalan = ($minggu - 1) % $jumlahKonflik;
                        $itemYangJalan = $grup[$indexYangJalan];
                        
                        $this->generateSesiSatu(
                            $itemYangJalan['master'], 
                            $minggu, 
                            $tanggalMulai, 
                            $itemYangJalan['hari_num'], 
                            $sesiDibuat
                        );
                    }

                    // Update pola_minggu di jadwal_master
                    foreach ($grup as $idx => $item) {
                        $polaMinggu = [];
                        for ($m = 1; $m <= $totalMinggu; $m++) {
                            $polaMinggu[] = (($m - 1) % $jumlahKonflik) === $idx ? 1 : 0;
                        }
                        $item['master']->update(['pola_minggu' => implode(',', $polaMinggu)]);
                    }
                }
            }
        });

        $message = "Generate Jadwal Selesai! {$sesiDibuat} sesi berhasil dibuat.";
        
        if (count($konflikTerdeteksi) > 0) {
            $message .= " Ditemukan " . count($konflikTerdeteksi) . " grup konflik yang diselesaikan dengan rolling system.";
        }

        return redirect('/jadwal?semester_id=' . $semesterId . '&minggu=1')->with('success', $message);
    }

    private function generateSesiSemua($master, $totalMinggu, $tanggalMulai, $tanggalSelesai, $hariTarget, &$sesiDibuat)
    {
        // Generate untuk semua minggu
        $tanggalPertemuan = $this->cariTanggalHari($tanggalMulai, $hariTarget);
        
        if ($tanggalPertemuan->gt($tanggalSelesai)) {
            return;
        }

        for ($minggu = 1; $minggu <= $totalMinggu; $minggu++) {
            if ($tanggalPertemuan->lte($tanggalSelesai)) {
                SesiJadwal::create([
                    'jadwal_master_id' => $master->id,
                    'pertemuan_ke' => $minggu,
                    'tanggal' => $tanggalPertemuan->format('Y-m-d'),
                    'status' => 'terjadwal',
                ]);
                $sesiDibuat++;
            }
            $tanggalPertemuan->addWeek();
        }
    }

    private function generateSesiSatu($master, $mingguKe, $tanggalMulai, $hariTarget, &$sesiDibuat)
    {
        // Generate hanya untuk 1 minggu tertentu
        $tanggalPertemuan = $this->cariTanggalHari($tanggalMulai, $hariTarget);
        $tanggalPertemuan->addWeeks($mingguKe - 1);

        SesiJadwal::create([
            'jadwal_master_id' => $master->id,
            'pertemuan_ke' => $mingguKe,
            'tanggal' => $tanggalPertemuan->format('Y-m-d'),
            'status' => 'terjadwal',
        ]);
        $sesiDibuat++;
    }

    private function cariTanggalHari($tanggalMulai, $hariTarget)
    {
        $tanggal = $tanggalMulai->copy();
        $iterasi = 0;
        
        while ($tanggal->dayOfWeekIso != $hariTarget && $iterasi < 7) {
            $tanggal->addDay();
            $iterasi++;
        }
        
        return $tanggal;
    }
}