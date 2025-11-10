<?php

namespace App\Http\Controllers;

use App\Models\Laboratorium;
use App\Models\Kampus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaboratoriumController extends Controller
{
    public function index()
    {
        $laboratorium = Laboratorium::with('kampus')
            ->orderBy('kampus_id', 'asc')
            ->orderBy('kode', 'asc')
            ->get();
        
        return Inertia::render('Laboratorium/Index', [
            'laboratorium' => $laboratorium,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Laboratorium', 'href' => '/laboratorium'],
            ],
        ]);
    }

    public function create()
    {
        $kampus = Kampus::where('is_aktif', true)
            ->orderBy('kode', 'asc')
            ->get();
        
        return Inertia::render('Laboratorium/Create', [
            'kampus' => $kampus,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Laboratorium', 'href' => '/laboratorium'],
                ['title' => 'Tambah', 'href' => '/laboratorium/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kampus_id' => 'required|exists:kampus,id',
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:100',
            'kapasitas' => 'nullable|integer|min:1',
            'deskripsi' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        $validated['kapasitas'] = $validated['kapasitas'] ?? 30;

        Laboratorium::create($validated);

        return redirect('/laboratorium')
            ->with('success', 'Laboratorium berhasil ditambahkan.');
    }

    public function edit(Laboratorium $laboratorium)
    {
        $laboratorium->load('kampus');
        $kampus = Kampus::where('is_aktif', true)
            ->orderBy('kode', 'asc')
            ->get();
        
        return Inertia::render('Laboratorium/Edit', [
            'laboratorium' => $laboratorium,
            'kampus' => $kampus,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Laboratorium', 'href' => '/laboratorium'],
                ['title' => 'Edit', 'href' => "/laboratorium/{$laboratorium->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, Laboratorium $laboratorium)
    {
        $validated = $request->validate([
            'kampus_id' => 'required|exists:kampus,id',
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:100',
            'kapasitas' => 'nullable|integer|min:1',
            'deskripsi' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        $validated['kapasitas'] = $validated['kapasitas'] ?? 30;

        $laboratorium->update($validated);

        return redirect('/laboratorium')
            ->with('success', 'Laboratorium berhasil diperbarui.');
    }

    public function destroy(Laboratorium $laboratorium)
    {
        $laboratorium->delete();

        return redirect('/laboratorium')
            ->with('success', 'Laboratorium berhasil dihapus.');
    }
}
