<?php

namespace App\Http\Controllers;

use App\Models\Kampus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KampusController extends Controller
{
    public function index()
    {
        $kampus = Kampus::orderBy('kode', 'asc')->get();
        
        return Inertia::render('Kampus/Index', [
            'kampus' => $kampus,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kampus', 'href' => '/kampus'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Kampus/Create', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kampus', 'href' => '/kampus'],
                ['title' => 'Tambah', 'href' => '/kampus/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:10|unique:kampus,kode',
            'nama' => 'required|string|max:100',
            'alamat' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        Kampus::create($validated);

        return redirect('/kampus')
            ->with('success', 'Kampus berhasil ditambahkan.');
    }

    public function edit(Kampus $kampus)
    {
        return Inertia::render('Kampus/Edit', [
            'kampus' => $kampus,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Kampus', 'href' => '/kampus'],
                ['title' => 'Edit', 'href' => "/kampus/{$kampus->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, Kampus $kampus)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:10|unique:kampus,kode,' . $kampus->id,
            'nama' => 'required|string|max:100',
            'alamat' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);

        $kampus->update($validated);

        return redirect('/kampus')
            ->with('success', 'Kampus berhasil diperbarui.');
    }

    public function destroy(Kampus $kampus)
    {
        $kampus->delete();

        return redirect('/kampus')
            ->with('success', 'Kampus berhasil dihapus.');
    }
}
