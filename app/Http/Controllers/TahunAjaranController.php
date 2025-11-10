<?php

namespace App\Http\Controllers;

use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TahunAjaranController extends Controller
{
    public function index()
    {
        $tahunAjaran = TahunAjaran::orderBy('tanggal_mulai', 'desc')->get();
        
        return Inertia::render('TahunAjaran/Index', [
            'tahunAjaran' => $tahunAjaran,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Tahun Ajaran', 'href' => '/tahun-ajaran'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('TahunAjaran/Create', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Tahun Ajaran', 'href' => '/tahun-ajaran'],
                ['title' => 'Tambah', 'href' => '/tahun-ajaran/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:50|unique:tahun_ajaran,nama',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'is_aktif' => 'boolean',
        ]);

        if ($validated['is_aktif'] ?? false) {
            TahunAjaran::where('is_aktif', true)->update(['is_aktif' => false]);
        }

        TahunAjaran::create($validated);

        return redirect()->route('tahun-ajaran.index')
            ->with('success', 'Tahun Ajaran berhasil ditambahkan.');
    }

    public function edit(TahunAjaran $tahunAjaran)
    {
        return Inertia::render('TahunAjaran/Edit', [
            'tahunAjaran' => $tahunAjaran,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Tahun Ajaran', 'href' => '/tahun-ajaran'],
                ['title' => 'Edit', 'href' => "/tahun-ajaran/{$tahunAjaran->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, TahunAjaran $tahunAjaran)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:50|unique:tahun_ajaran,nama,' . $tahunAjaran->id,
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'is_aktif' => 'boolean',
        ]);

        if ($validated['is_aktif'] ?? false) {
            TahunAjaran::where('id', '!=', $tahunAjaran->id)
                ->where('is_aktif', true)
                ->update(['is_aktif' => false]);
        }

        $tahunAjaran->update($validated);

        return redirect()->route('tahun-ajaran.index')
            ->with('success', 'Tahun Ajaran berhasil diperbarui.');
    }

    public function destroy(TahunAjaran $tahunAjaran)
    {
        $tahunAjaran->delete();

        return redirect()->route('tahun-ajaran.index')
            ->with('success', 'Tahun Ajaran berhasil dihapus.');
    }
}
