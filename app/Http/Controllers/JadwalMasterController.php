<?php

namespace App\Http\Controllers;

use App\Models\JadwalMaster;
use App\Models\Semester;
use App\Models\KelasMatkul;
use App\Models\Dosen;
use App\Models\Laboratorium;
use App\Models\SlotWaktu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalMasterController extends Controller
{
    public function index()
    {
        $jadwalMaster = JadwalMaster::with([
            'kelasMatKul.semester',
            'kelasMatKul.kelas',
            'kelasMatKul.mataKuliah',
            'dosen.user',
            'laboratorium',
            'slotWaktuMulai',
            'slotWaktuSelesai'
        ])->get()->map(function ($jadwal) {
            return [
                'id' => $jadwal->id,
                'semester' => $jadwal->kelasMatKul->semester,
                'kelas_matkul' => [
                    'kelas' => $jadwal->kelasMatKul->kelas,
                    'mata_kuliah' => $jadwal->kelasMatKul->mataKuliah,
                ],
                'dosen' => $jadwal->dosen,
                'laboratorium' => $jadwal->laboratorium,
                'hari' => $jadwal->hari,
                'slot_waktu_mulai' => $jadwal->slotWaktuMulai,
                'slot_waktu_selesai' => $jadwal->slotWaktuSelesai,
                'durasi_slot' => $jadwal->durasi_slot,
                'status_konflik' => $jadwal->status_konflik,
                'pola_minggu' => $jadwal->pola_minggu,
            ];
        });

        return Inertia::render('JadwalMaster/Index', [
            'jadwalMaster' => $jadwalMaster,
            'semester' => Semester::where('is_aktif', true)->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Jadwal Master', 'href' => '/jadwal-master'],
            ],
        ]);
    }

    private function getFormData()
    {
        return [
            'semester' => Semester::where('is_aktif', true)->get(),
            'kelasMatkul' => KelasMatkul::with(['kelas', 'mataKuliah'])->get(),
            'dosen' => Dosen::with('user')->get(),
            'laboratorium' => Laboratorium::where('is_aktif', true)->get(),
            'slotWaktu' => SlotWaktu::where('is_aktif', true)->orderBy('urutan')->get(),
            'hari' => [
                ['id' => 1, 'nama' => 'Senin'],
                ['id' => 2, 'nama' => 'Selasa'],
                ['id' => 3, 'nama' => 'Rabu'],
                ['id' => 4, 'nama' => 'Kamis'],
                ['id' => 5, 'nama' => 'Jumat'],
                ['id' => 6, 'nama' => 'Sabtu'],
                ['id' => 7, 'nama' => 'Minggu'],
            ],
        ];
    }

    public function create()
    {
        return Inertia::render('JadwalMaster/Create', array_merge($this->getFormData(), [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Jadwal Master', 'href' => '/jadwal-master'],
                ['title' => 'Tambah', 'href' => '/jadwal-master/create'],
            ],
        ]));
    }

    public function store(Request $request)
    {
        $request->validate([
            'semester_id' => 'required|exists:semester,id',
            'kelas_mata_kuliah_id' => 'required|exists:kelas_mata_kuliah,id',
            'dosen_id' => 'required|exists:dosen,id',
            'laboratorium_id' => 'required|exists:laboratorium,id',
            'hari' => 'required|integer|between:1,7',
            'slot_waktu_mulai_id' => 'required|exists:slot_waktu,id',
            'slot_waktu_selesai_id' => 'required|exists:slot_waktu,id',
            'catatan' => 'nullable|string',
        ]);

        JadwalMaster::create($request->all());

        return redirect('/jadwal-master')->with('success', 'Jadwal Master berhasil ditambahkan.');
    }

    public function edit(JadwalMaster $jadwalMaster)
    {
        return Inertia::render('JadwalMaster/Edit', array_merge($this->getFormData(), [
            'jadwalMaster' => $jadwalMaster,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Jadwal Master', 'href' => '/jadwal-master'],
                ['title' => 'Edit', 'href' => "/jadwal-master/{$jadwalMaster->id}/edit"],
            ],
        ]));
    }

    public function update(Request $request, JadwalMaster $jadwalMaster)
    {
        $request->validate([
            'semester_id' => 'required|exists:semester,id',
            'kelas_mata_kuliah_id' => 'required|exists:kelas_mata_kuliah,id',
            'dosen_id' => 'required|exists:dosen,id',
            'laboratorium_id' => 'required|exists:laboratorium,id',
            'hari' => 'required|integer|between:1,7',
            'slot_waktu_mulai_id' => 'required|exists:slot_waktu,id',
            'slot_waktu_selesai_id' => 'required|exists:slot_waktu,id',
            'catatan' => 'nullable|string',
        ]);

        $jadwalMaster->update($request->all());

        return redirect('/jadwal-master')->with('success', 'Jadwal Master berhasil diperbarui.');
    }

    public function destroy(JadwalMaster $jadwalMaster)
    {
        try {
            if ($jadwalMaster->delete()) {
                return redirect('/jadwal-master')->with('success', 'Jadwal Master berhasil dihapus.');
            }
            return redirect('/jadwal-master')->with('error', 'Gagal menghapus Jadwal Master.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect('/jadwal-master')->with('error', 'Jadwal Master tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}
