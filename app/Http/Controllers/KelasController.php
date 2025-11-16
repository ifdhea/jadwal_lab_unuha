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
    public function index(Request $request)
    {
        $query = Kelas::with(['programStudi', 'kampus', 'tahunAjaran']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('kode', 'like', "%{$search}%");
            });
        }

        if ($request->filled('program_studi_id')) {
            $query->where('program_studi_id', $request->program_studi_id);
        }

        if ($request->filled('kampus_id')) {
            $query->where('kampus_id', $request->kampus_id);
        }

        if ($request->filled('tahun_ajaran_id')) {
            $query->where('tahun_ajaran_id', $request->tahun_ajaran_id);
        }

        if ($request->filled('tingkat_semester')) {
            $query->where('tingkat_semester', $request->tingkat_semester);
        }

        if ($request->filled('is_aktif')) {
            $query->where('is_aktif', $request->is_aktif === 'true');
        }

        $kelas = $query->orderBy('nama')->get();

        return Inertia::render('Kelas/Index', [
            'kelas' => $kelas,
            'programStudi' => ProgramStudi::where('is_aktif', true)->orderBy('nama')->get(),
            'kampus' => Kampus::where('is_aktif', true)->orderBy('nama')->get(),
            'tahunAjaran' => TahunAjaran::orderBy('nama', 'desc')->get(),
            'filters' => $request->only(['search', 'program_studi_id', 'kampus_id', 'tahun_ajaran_id', 'tingkat_semester', 'is_aktif']),
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
