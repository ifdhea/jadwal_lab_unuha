<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MataKuliahController extends Controller
{
    public function index()
    {
        return Inertia::render('MataKuliah/Index', [
            'mataKuliah' => MataKuliah::with('programStudi')->orderBy('nama')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Mata Kuliah', 'href' => '/mata-kuliah'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('MataKuliah/Create', [
            'programStudi' => ProgramStudi::where('is_aktif', true)->orderBy('nama')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Mata Kuliah', 'href' => '/mata-kuliah'],
                ['title' => 'Tambah', 'href' => '/mata-kuliah/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'program_studi_id' => 'required|exists:program_studi,id',
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:200',
            'sks' => 'required|integer|min:1',
            'tingkat_semester' => 'required|integer|min:1|max:8',
            'tipe_semester' => ['required', Rule::in(['ganjil', 'genap', 'both'])],
            'butuh_lab' => 'boolean',
            'deskripsi' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        MataKuliah::create($request->all());

        return redirect('/mata-kuliah')->with('success', 'Mata Kuliah berhasil ditambahkan.');
    }

    public function edit(MataKuliah $mataKuliah)
    {
        return Inertia::render('MataKuliah/Edit', [
            'mataKuliah' => $mataKuliah,
            'programStudi' => ProgramStudi::where('is_aktif', true)->orderBy('nama')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Mata Kuliah', 'href' => '/mata-kuliah'],
                ['title' => 'Edit', 'href' => "/mata-kuliah/{$mataKuliah->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, MataKuliah $mataKuliah)
    {
        $request->validate([
            'program_studi_id' => 'required|exists:program_studi,id',
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:200',
            'sks' => 'required|integer|min:1',
            'tingkat_semester' => 'required|integer|min:1|max:8',
            'tipe_semester' => ['required', Rule::in(['ganjil', 'genap', 'both'])],
            'butuh_lab' => 'boolean',
            'deskripsi' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        $mataKuliah->update($request->all());

        return redirect('/mata-kuliah')->with('success', 'Mata Kuliah berhasil diperbarui.');
    }

    public function destroy(MataKuliah $mataKuliah)
    {
        try {
            if ($mataKuliah->delete()) {
                return redirect('/mata-kuliah')->with('success', 'Mata Kuliah berhasil dihapus.');
            }
            return redirect('/mata-kuliah')->with('error', 'Gagal menghapus Mata Kuliah.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect('/mata-kuliah')->with('error', 'Mata Kuliah tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}
