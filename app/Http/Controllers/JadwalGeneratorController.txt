<?php

namespace App\Http\Controllers;

use App\Models\JadwalMaster;
use App\Models\SesiJadwal;
use App\Models\Semester;
use App\Models\SlotWaktu;
use App\Models\Laboratorium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class JadwalGeneratorController extends Controller
{
    private $konflikDiselesaikan = [];
    private $konflikTidakTerpecahkan = [];
    private $statistik = [
        'total_jadwal' => 0,
        'konflik_dosen' => 0,
        'konflik_lab' => 0,
        'konflik_dipindah_waktu' => 0,
        'konflik_dipindah_hari' => 0,
        'konflik_rolling' => 0,
    ];

    public function generate(Request $request)
    {
        $request->validate([
            'semester_id' => 'required|exists:semester,id',
        ]);

        $semesterId = $request->semester_id;
        $semester = Semester::findOrFail($semesterId);
        $sesiDibuat = 0;

        DB::transaction(function () use ($semester, &$sesiDibuat) {
            // 1. Hapus sesi jadwal lama
            $masterIds = JadwalMaster::whereHas('kelasMatKul', function ($query) use ($semester) {
                $query->where('semester_id', $semester->id);
            })->pluck('id');
            
            SesiJadwal::whereIn('jadwal_master_id', $masterIds)->delete();

            // 2. Ambil semua jadwal master
            $masterJadwals = JadwalMaster::whereHas('kelasMatKul', function ($query) use ($semester) {
                $query->where('semester_id', $semester->id);
            })
            ->with(['kelasMatKul.kelas', 'kelasMatKul.mataKuliah', 'slotWaktuMulai', 'slotWaktuSelesai', 'dosen', 'laboratorium'])
            ->orderBy('hari')
            ->orderBy('slot_waktu_mulai_id')
            ->get();

            $this->statistik['total_jadwal'] = $masterJadwals->count();

            // 3. Deteksi dan pecahkan konflik
            $jadwalTanpaKonflik = $this->deteksiDanPecahkanKonflik($masterJadwals, $semester);

            // 4. Generate sesi untuk semua jadwal
            $tanggalMulai = Carbon::parse($semester->tanggal_mulai);
            $tanggalSelesai = Carbon::parse($semester->tanggal_selesai);
            $totalMinggu = $semester->total_minggu ?? 16;

            foreach ($jadwalTanpaKonflik as $jadwalInfo) {
                $this->generateSesiJadwal(
                    $jadwalInfo['master'],
                    $jadwalInfo['hari_num'],
                    $jadwalInfo['slot_mulai'],
                    $jadwalInfo['slot_selesai'],
                    $jadwalInfo['lab_id'],
                    $jadwalInfo['pola_minggu'],
                    $totalMinggu,
                    $tanggalMulai,
                    $tanggalSelesai,
                    $sesiDibuat
                );
            }
        });

        // Prepare success message with statistics
        $message = $this->buatPesanHasil($sesiDibuat);

        return redirect('/jadwal?semester_id=' . $semesterId . '&minggu=1')
            ->with('success', $message)
            ->with('statistik', $this->statistik)
            ->with('konflik_diselesaikan', $this->konflikDiselesaikan)
            ->with('konflik_tidak_terpecahkan', $this->konflikTidakTerpecahkan);
    }

    private function deteksiDanPecahkanKonflik($masterJadwals, $semester)
    {
        $jadwalTerproses = [];
        $hariMapping = [
            'Senin' => 1, 'Selasa' => 2, 'Rabu' => 3, 
            'Kamis' => 4, 'Jumat' => 5, 'Sabtu' => 6
        ];

        // Load semua slot waktu untuk referensi
        $allSlots = SlotWaktu::where('is_aktif', 1)
            ->orderBy('urutan')
            ->get()
            ->keyBy('id');

        // Load semua lab untuk referensi
        $allLabs = Laboratorium::where('is_aktif', 1)->get()->keyBy('id');

        foreach ($masterJadwals as $master) {
            $hariNum = is_numeric($master->hari) ? (int) $master->hari : ($hariMapping[$master->hari] ?? 1);
            
            // Expand slot range untuk cek konflik
            $slotsYangDigunakan = $this->expandSlotRange(
                $master->slot_waktu_mulai_id,
                $master->slot_waktu_selesai_id,
                $allSlots
            );

            $jadwalInfo = [
                'master' => $master,
                'hari_num' => $hariNum,
                'slot_mulai' => $master->slot_waktu_mulai_id,
                'slot_selesai' => $master->slot_waktu_selesai_id,
                'slots_digunakan' => $slotsYangDigunakan,
                'lab_id' => $master->laboratorium_id,
                'dosen_id' => $master->dosen_id,
                'pola_minggu' => null, // null = semua minggu
            ];

            // Cek konflik dengan jadwal yang sudah diproses
            $konflikDitemukan = $this->cekKonflik($jadwalInfo, $jadwalTerproses, $allSlots, $allLabs);

            if ($konflikDitemukan) {
                // Coba pecahkan konflik
                $jadwalInfo = $this->pecahkanKonflik($jadwalInfo, $jadwalTerproses, $allSlots, $allLabs, $hariMapping);
            }

            $jadwalTerproses[] = $jadwalInfo;
        }

        return $jadwalTerproses;
    }

    private function expandSlotRange($slotMulaiId, $slotSelesaiId, $allSlots)
    {
        $slots = [];
        $mulai = $allSlots[$slotMulaiId]->urutan ?? 1;
        $selesai = $allSlots[$slotSelesaiId]->urutan ?? 1;

        foreach ($allSlots as $slot) {
            if ($slot->urutan >= $mulai && $slot->urutan <= $selesai) {
                $slots[] = $slot->id;
            }
        }

        return $slots;
    }

    private function cekKonflik($jadwalBaru, $jadwalTerproses, $allSlots, $allLabs)
    {
        foreach ($jadwalTerproses as $jadwalLama) {
            // Skip jika hari berbeda
            if ($jadwalBaru['hari_num'] !== $jadwalLama['hari_num']) {
                continue;
            }

            // Cek konflik slot waktu
            $slotBertabrakan = !empty(array_intersect(
                $jadwalBaru['slots_digunakan'],
                $jadwalLama['slots_digunakan']
            ));

            if (!$slotBertabrakan) {
                continue;
            }

            // Ada konflik waktu di hari yang sama
            
            // 1. Konflik Dosen (dosen sama mengajar di waktu sama)
            if ($jadwalBaru['dosen_id'] === $jadwalLama['dosen_id']) {
                $this->statistik['konflik_dosen']++;
                return [
                    'tipe' => 'dosen',
                    'jadwal_konflik' => $jadwalLama,
                    'detail' => "Dosen {$jadwalBaru['master']->dosen->user->name} konflik"
                ];
            }

            // 2. Konflik Lab (lab sama digunakan di waktu sama)
            if ($jadwalBaru['lab_id'] === $jadwalLama['lab_id']) {
                $this->statistik['konflik_lab']++;
                return [
                    'tipe' => 'lab',
                    'jadwal_konflik' => $jadwalLama,
                    'detail' => "Lab {$allLabs[$jadwalBaru['lab_id']]->nama} penuh"
                ];
            }
        }

        return false;
    }

    private function pecahkanKonflik($jadwalInfo, $jadwalTerproses, $allSlots, $allLabs, $hariMapping)
    {
        $master = $jadwalInfo['master'];

        // STRATEGI 1: Coba pindah ke SLOT WAKTU lain di hari yang sama
        $slotAlternatif = $this->cariSlotAlternatif($jadwalInfo, $jadwalTerproses, $allSlots);
        if ($slotAlternatif) {
            $jadwalInfo['slot_mulai'] = $slotAlternatif['mulai'];
            $jadwalInfo['slot_selesai'] = $slotAlternatif['selesai'];
            $jadwalInfo['slots_digunakan'] = $slotAlternatif['slots'];
            
            // Update jadwal_master dengan slot baru
            $master->update([
                'slot_waktu_mulai_id' => $slotAlternatif['mulai'],
                'slot_waktu_selesai_id' => $slotAlternatif['selesai'],
                'status_konflik' => 'bebas'
            ]);

            $this->statistik['konflik_dipindah_waktu']++;
            $this->konflikDiselesaikan[] = [
                'jadwal' => $master->kelasMatKul->kelas->nama . ' - ' . $master->kelasMatKul->mataKuliah->nama,
                'solusi' => 'Dipindah ke slot ' . $allSlots[$slotAlternatif['mulai']]->label,
                'tipe' => 'pindah_waktu'
            ];

            return $jadwalInfo;
        }

        // STRATEGI 2: Coba pindah ke HARI lain
        $hariAlternatif = $this->cariHariAlternatif($jadwalInfo, $jadwalTerproses, $hariMapping, $allSlots);
        if ($hariAlternatif) {
            $jadwalInfo['hari_num'] = $hariAlternatif;
            
            // Update jadwal_master dengan hari baru
            $namaHari = array_search($hariAlternatif, $hariMapping);
            $master->update([
                'hari' => $namaHari,
                'status_konflik' => 'bebas'
            ]);

            $this->statistik['konflik_dipindah_hari']++;
            $this->konflikDiselesaikan[] = [
                'jadwal' => $master->kelasMatKul->kelas->nama . ' - ' . $master->kelasMatKul->mataKuliah->nama,
                'solusi' => "Dipindah ke hari {$namaHari}",
                'tipe' => 'pindah_hari'
            ];

            return $jadwalInfo;
        }

        // STRATEGI 3: Coba pindah ke LAB lain (jika konflik lab)
        $labAlternatif = $this->cariLabAlternatif($jadwalInfo, $jadwalTerproses, $allLabs);
        if ($labAlternatif) {
            $jadwalInfo['lab_id'] = $labAlternatif;
            
            // Update jadwal_master dengan lab baru
            $master->update([
                'laboratorium_id' => $labAlternatif,
                'status_konflik' => 'bebas'
            ]);

            $this->konflikDiselesaikan[] = [
                'jadwal' => $master->kelasMatKul->kelas->nama . ' - ' . $master->kelasMatKul->mataKuliah->nama,
                'solusi' => 'Dipindah ke ' . $allLabs[$labAlternatif]->nama,
                'tipe' => 'pindah_lab'
            ];

            return $jadwalInfo;
        }

        // STRATEGI 4: ROLLING SYSTEM (last resort)
        // Gunakan pola minggu bergantian
        $this->statistik['konflik_rolling']++;
        $polaMinggu = $this->buatPolaMingguBergantian($jadwalInfo, $jadwalTerproses);
        $jadwalInfo['pola_minggu'] = $polaMinggu;

        $master->update([
            'pola_minggu' => implode(',', $polaMinggu),
            'status_konflik' => 'konflik'
        ]);

        $this->konflikTidakTerpecahkan[] = [
            'jadwal' => $master->kelasMatKul->kelas->nama . ' - ' . $master->kelasMatKul->mataKuliah->nama,
            'alasan' => 'Tidak ada slot/hari/lab alternatif, menggunakan rolling system',
            'pola' => 'Bergantian setiap ' . (count($polaMinggu) > 0 ? count(array_filter($polaMinggu)) : 1) . ' minggu'
        ];

        return $jadwalInfo;
    }

    private function cariSlotAlternatif($jadwalInfo, $jadwalTerproses, $allSlots)
    {
        $hariNum = $jadwalInfo['hari_num'];
        $labId = $jadwalInfo['lab_id'];
        $dosenId = $jadwalInfo['dosen_id'];
        $durasiSlot = count($jadwalInfo['slots_digunakan']);

        // Cari semua slot yang berdekatan dan cukup durasi
        $slotsUrutan = $allSlots->sortBy('urutan')->values();
        
        for ($i = 0; $i < $slotsUrutan->count() - $durasiSlot + 1; $i++) {
            $slotMulai = $slotsUrutan[$i];
            $slotSelesai = $slotsUrutan[$i + $durasiSlot - 1];
            
            // Skip slot istirahat
            if ($slotMulai->is_aktif == 0 || $slotSelesai->is_aktif == 0) {
                continue;
            }

            $slotsTest = $this->expandSlotRange($slotMulai->id, $slotSelesai->id, $allSlots);
            
            // Cek apakah slot ini bebas konflik
            $adaKonflik = false;
            foreach ($jadwalTerproses as $jadwalLama) {
                if ($jadwalLama['hari_num'] !== $hariNum) {
                    continue;
                }

                $slotBertabrakan = !empty(array_intersect($slotsTest, $jadwalLama['slots_digunakan']));
                
                if ($slotBertabrakan) {
                    // Cek konflik dosen atau lab
                    if ($jadwalLama['dosen_id'] === $dosenId || $jadwalLama['lab_id'] === $labId) {
                        $adaKonflik = true;
                        break;
                    }
                }
            }

            if (!$adaKonflik) {
                return [
                    'mulai' => $slotMulai->id,
                    'selesai' => $slotSelesai->id,
                    'slots' => $slotsTest
                ];
            }
        }

        return null;
    }

    private function cariHariAlternatif($jadwalInfo, $jadwalTerproses, $hariMapping, $allSlots)
    {
        $hariSekarang = $jadwalInfo['hari_num'];
        $slotMulai = $jadwalInfo['slot_mulai'];
        $slotSelesai = $jadwalInfo['slot_selesai'];
        $slotsDigunakan = $jadwalInfo['slots_digunakan'];
        $labId = $jadwalInfo['lab_id'];
        $dosenId = $jadwalInfo['dosen_id'];

        // Coba semua hari lain
        foreach ($hariMapping as $namaHari => $hariNum) {
            if ($hariNum === $hariSekarang) {
                continue;
            }

            // Cek apakah hari ini bebas konflik
            $adaKonflik = false;
            foreach ($jadwalTerproses as $jadwalLama) {
                if ($jadwalLama['hari_num'] !== $hariNum) {
                    continue;
                }

                $slotBertabrakan = !empty(array_intersect($slotsDigunakan, $jadwalLama['slots_digunakan']));
                
                if ($slotBertabrakan) {
                    if ($jadwalLama['dosen_id'] === $dosenId || $jadwalLama['lab_id'] === $labId) {
                        $adaKonflik = true;
                        break;
                    }
                }
            }

            if (!$adaKonflik) {
                return $hariNum;
            }
        }

        return null;
    }

    private function cariLabAlternatif($jadwalInfo, $jadwalTerproses, $allLabs)
    {
        $hariNum = $jadwalInfo['hari_num'];
        $slotsDigunakan = $jadwalInfo['slots_digunakan'];
        $labSekarang = $jadwalInfo['lab_id'];
        $kampusId = $allLabs[$labSekarang]->kampus_id;

        // Cari lab lain di kampus yang sama
        foreach ($allLabs as $lab) {
            if ($lab->id === $labSekarang || $lab->kampus_id !== $kampusId) {
                continue;
            }

            // Cek apakah lab ini bebas di waktu tersebut
            $labBebas = true;
            foreach ($jadwalTerproses as $jadwalLama) {
                if ($jadwalLama['hari_num'] !== $hariNum || $jadwalLama['lab_id'] !== $lab->id) {
                    continue;
                }

                $slotBertabrakan = !empty(array_intersect($slotsDigunakan, $jadwalLama['slots_digunakan']));
                
                if ($slotBertabrakan) {
                    $labBebas = false;
                    break;
                }
            }

            if ($labBebas) {
                return $lab->id;
            }
        }

        return null;
    }

    private function buatPolaMingguBergantian($jadwalInfo, $jadwalTerproses)
    {
        // Hitung berapa jadwal yang konflik di slot yang sama
        $jadwalKonflik = [];
        foreach ($jadwalTerproses as $jadwalLama) {
            if ($jadwalLama['hari_num'] === $jadwalInfo['hari_num']) {
                $slotBertabrakan = !empty(array_intersect(
                    $jadwalInfo['slots_digunakan'],
                    $jadwalLama['slots_digunakan']
                ));

                if ($slotBertabrakan && 
                    ($jadwalLama['lab_id'] === $jadwalInfo['lab_id'] || 
                     $jadwalLama['dosen_id'] === $jadwalInfo['dosen_id'])) {
                    $jadwalKonflik[] = $jadwalLama;
                }
            }
        }

        $jumlahKonflik = count($jadwalKonflik) + 1; // +1 untuk jadwal ini
        $totalMinggu = 16; // default

        // Buat pola: 1,0,0,1,0,0,... (bergantian setiap N minggu)
        $pola = [];
        for ($i = 0; $i < $totalMinggu; $i++) {
            $pola[] = ($i % $jumlahKonflik) === (count($jadwalKonflik)) ? 1 : 0;
        }

        return $pola;
    }

    private function generateSesiJadwal($master, $hariNum, $slotMulai, $slotSelesai, $labId, $polaMinggu, $totalMinggu, $tanggalMulai, $tanggalSelesai, &$sesiDibuat)
    {
        $tanggalPertemuan = $this->cariTanggalHari($tanggalMulai, $hariNum);
        
        if ($tanggalPertemuan->gt($tanggalSelesai)) {
            return;
        }

        for ($minggu = 1; $minggu <= $totalMinggu; $minggu++) {
            // Cek pola minggu: jika ada pola dan minggu ini = 0, skip
            if ($polaMinggu !== null && isset($polaMinggu[$minggu - 1]) && $polaMinggu[$minggu - 1] == 0) {
                $tanggalPertemuan->addWeek();
                continue;
            }

            if ($tanggalPertemuan->lte($tanggalSelesai)) {
                // Gunakan override jika slot/lab berbeda dari master
                $overrideSlotMulai = ($slotMulai !== $master->slot_waktu_mulai_id) ? $slotMulai : null;
                $overrideSlotSelesai = ($slotSelesai !== $master->slot_waktu_selesai_id) ? $slotSelesai : null;
                $overrideLab = ($labId !== $master->laboratorium_id) ? $labId : null;

                SesiJadwal::create([
                    'jadwal_master_id' => $master->id,
                    'pertemuan_ke' => $minggu,
                    'tanggal' => $tanggalPertemuan->format('Y-m-d'),
                    'status' => 'terjadwal',
                    'override_slot_waktu_mulai_id' => $overrideSlotMulai,
                    'override_slot_waktu_selesai_id' => $overrideSlotSelesai,
                    'override_laboratorium_id' => $overrideLab,
                    'catatan' => ($overrideSlotMulai || $overrideLab) ? 'Dijadwalkan ulang oleh sistem' : null,
                ]);
                $sesiDibuat++;
            }
            $tanggalPertemuan->addWeek();
        }
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

    private function buatPesanHasil($sesiDibuat)
    {
        $pesan = "✅ Generate Jadwal Selesai! {$sesiDibuat} sesi berhasil dibuat.\n\n";
        
        $pesan .= "📊 Statistik:\n";
        $pesan .= "- Total Jadwal: {$this->statistik['total_jadwal']}\n";
        $pesan .= "- Konflik Dosen: {$this->statistik['konflik_dosen']}\n";
        $pesan .= "- Konflik Lab: {$this->statistik['konflik_lab']}\n\n";
        
        $pesan .= "🔧 Solusi Diterapkan:\n";
        $pesan .= "- Dipindah Waktu: {$this->statistik['konflik_dipindah_waktu']}\n";
        $pesan .= "- Dipindah Hari: {$this->statistik['konflik_dipindah_hari']}\n";
        $pesan .= "- Menggunakan Rolling: {$this->statistik['konflik_rolling']}\n";

        if (count($this->konflikTidakTerpecahkan) > 0) {
            $pesan .= "\n⚠️ {" . count($this->konflikTidakTerpecahkan) . "} jadwal menggunakan rolling system (bergantian).";
        }

        return $pesan;
    }
}