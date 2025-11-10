<?php

namespace App\Http\Controllers;

use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramStudiController extends Controller
{
    public function index()
    {
        return Inertia::render('ProgramStudi/Index', [
            'programStudi' => ProgramStudi::orderBy('kode')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Program Studi', 'href' => '/program-studi'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('ProgramStudi/Create', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Program Studi', 'href' => '/program-studi'],
                ['title' => 'Tambah', 'href' => '/program-studi/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:20|unique:program_studi,kode',
            'nama' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        ProgramStudi::create($validated);

        return redirect('/program-studi')->with('success', 'Program Studi berhasil ditambahkan.');
    }

    public function edit(ProgramStudi $programStudi)
    {
        return Inertia::render('ProgramStudi/Edit', [
            'programStudi' => $programStudi,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Program Studi', 'href' => '/program-studi'],
                ['title' => 'Edit', 'href' => "/program-studi/{$programStudi->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, ProgramStudi $programStudi)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:20|unique:program_studi,kode,' . $programStudi->id,
            'nama' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        $programStudi->update($validated);

        return redirect('/program-studi')->with('success', 'Program Studi berhasil diperbarui.');
    }

    public function destroy(ProgramStudi $programStudi)
    {
        try {
            if ($programStudi->delete()) {
                return redirect('/program-studi')->with('success', 'Program Studi berhasil dihapus.');
            }
            return redirect('/program-studi')->with('error', 'Gagal menghapus Program Studi.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect('/program-studi')->with('error', 'Program Studi tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}
