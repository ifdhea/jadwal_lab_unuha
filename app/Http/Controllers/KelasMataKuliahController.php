<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\KelasMatKul;
use App\Models\MataKuliah;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class KelasMataKuliahController extends Controller
{
    public function index()
    {
        return Inertia::render('KelasMataKuliah/Index', [
            'kelasMataKuliah' => KelasMatKul::with(['kelas.programStudi', 'mataKuliah', 'semester'])->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kelas & Mata Kuliah', 'href' => '/kelas-matkul'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('KelasMataKuliah/Create', [
            'kelas' => Kelas::where('is_aktif', true)->orderBy('nama')->get(),
            'mataKuliah' => MataKuliah::where('is_aktif', true)->orderBy('nama')->get(),
            'semester' => Semester::where('is_aktif', true)->orderBy('nama', 'desc')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kelas & Mata Kuliah', 'href' => '/kelas-matkul'],
                ['title' => 'Tambah', 'href' => '/kelas-matkul/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mata_kuliah_id' => 'required|exists:mata_kuliah,id',
            'semester_id' => [
                'required',
                'exists:semester,id',
                Rule::unique('kelas_mata_kuliah')->where(function ($query) use ($request) {
                    return $query->where('kelas_id', $request->kelas_id)
                                 ->where('mata_kuliah_id', $request->mata_kuliah_id);
                }),
            ],
        ]);

        KelasMatKul::create($request->all());

        return redirect('/kelas-matkul')->with('success', 'Penugasan berhasil ditambahkan.');
    }

    public function edit(KelasMatKul $kelasMatkul)
    {
        $kelasMatkul->load(['kelas', 'mataKuliah', 'semester']);
        return Inertia::render('KelasMataKuliah/Edit', [
            'kelasMataKuliah' => $kelasMatkul,
            'kelas' => Kelas::where('is_aktif', true)->orderBy('nama')->get(),
            'mataKuliah' => MataKuliah::where('is_aktif', true)->orderBy('nama')->get(),
            'semester' => Semester::orderBy('nama', 'desc')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kelas & Mata Kuliah', 'href' => '/kelas-matkul'],
                ['title' => 'Edit', 'href' => "/kelas-matkul/{$kelasMatkul->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, KelasMatKul $kelasMatkul)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mata_kuliah_id' => 'required|exists:mata_kuliah,id',
            'semester_id' => [
                'required',
                'exists:semester,id',
                Rule::unique('kelas_mata_kuliah')->where(function ($query) use ($request) {
                    return $query->where('kelas_id', $request->kelas_id)
                                 ->where('mata_kuliah_id', $request->mata_kuliah_id);
                })->ignore($kelasMatkul->id),
            ],
        ]);

        $kelasMatkul->update($request->all());

        return redirect('/kelas-matkul')->with('success', 'Penugasan berhasil diperbarui.');
    }

    public function destroy(KelasMatKul $kelasMatkul)
    {
        try {
            if ($kelasMatkul->delete()) {
                return redirect('/kelas-matkul')->with('success', 'Penugasan berhasil dihapus.');
            }
            return redirect('/kelas-matkul')->with('error', 'Gagal menghapus penugasan.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect('/kelas-matkul')->with('error', 'Penugasan tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}