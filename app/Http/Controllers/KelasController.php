<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\ProgramStudi;
use App\Models\Kampus;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        return Inertia::render('Kelas/Index', [
            'kelas' => Kelas::with(['programStudi', 'kampus', 'tahunAjaran'])->orderBy('nama')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kelas', 'href' => '/kelas'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Kelas/Create', [
            'programStudi' => ProgramStudi::where('is_aktif', true)->orderBy('nama')->get(),
            'kampus' => Kampus::where('is_aktif', true)->orderBy('nama')->get(),
            'tahunAjaran' => TahunAjaran::where('is_aktif', true)->orderBy('nama', 'desc')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kelas', 'href' => '/kelas'],
                ['title' => 'Tambah', 'href' => '/kelas/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'program_studi_id' => 'required|exists:program_studi,id',
            'kampus_id' => 'required|exists:kampus,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'tingkat_semester' => 'required|integer|min:1|max:8',
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:100',
            'kapasitas' => 'required|integer|min:1',
            'is_aktif' => 'boolean',
        ]);

        Kelas::create($request->all());

        return redirect('/kelas')->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function edit(Kelas $kelas)
    {
        return Inertia::render('Kelas/Edit', [
            'kelas' => $kelas,
            'programStudi' => ProgramStudi::where('is_aktif', true)->orderBy('nama')->get(),
            'kampus' => Kampus::where('is_aktif', true)->orderBy('nama')->get(),
            'tahunAjaran' => TahunAjaran::orderBy('nama', 'desc')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kelas', 'href' => '/kelas'],
                ['title' => 'Edit', 'href' => "/kelas/{$kelas->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, Kelas $kelas)
    {
        $request->validate([
            'program_studi_id' => 'required|exists:program_studi,id',
            'kampus_id' => 'required|exists:kampus,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'tingkat_semester' => 'required|integer|min:1|max:8',
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:100',
            'kapasitas' => 'required|integer|min:1',
            'is_aktif' => 'boolean',
        ]);

        $kelas->update($request->all());

        return redirect('/kelas')->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(Kelas $kelas)
    {
        try {
            if ($kelas->delete()) {
                return redirect('/kelas')->with('success', 'Kelas berhasil dihapus.');
            }
            return redirect('/kelas')->with('error', 'Gagal menghapus Kelas.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect('/kelas')->with('error', 'Kelas tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}
