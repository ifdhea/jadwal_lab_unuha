<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SemesterController extends Controller
{
    public function index()
    {
        $semester = Semester::with(['tahunAjaran'])
            ->orderBy('tanggal_mulai', 'desc')
            ->get();
        
        return Inertia::render('Semester/Index', [
            'semester' => $semester,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Semester', 'href' => '/semester'],
            ],
        ]);
    }

    public function create()
    {
        $tahunAjaran = TahunAjaran::orderBy('nama', 'desc')->get();
        
        return Inertia::render('Semester/Create', [
            'tahunAjaran' => $tahunAjaran,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Semester', 'href' => '/semester'],
                ['title' => 'Tambah', 'href' => '/semester/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'nama' => 'required|string|max:100',
            'tipe' => 'required|in:ganjil,genap',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'is_aktif' => 'boolean',
        ]);

        // Hitung total minggu
        $tanggalMulai = Carbon::parse($validated['tanggal_mulai']);
        $tanggalSelesai = Carbon::parse($validated['tanggal_selesai']);
        $validated['total_minggu'] = $tanggalMulai->diffInWeeks($tanggalSelesai);

        if ($validated['is_aktif'] ?? false) {
            Semester::where('is_aktif', true)->update(['is_aktif' => false]);
        }

        Semester::create($validated);

        return redirect('/semester')
            ->with('success', 'Semester berhasil ditambahkan.');
    }

    public function edit(Semester $semester)
    {
        $semester->load('tahunAjaran');
        $tahunAjaran = TahunAjaran::orderBy('nama', 'desc')->get();
        
        return Inertia::render('Semester/Edit', [
            'semester' => $semester,
            'tahunAjaran' => $tahunAjaran,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Semester', 'href' => '/semester'],
                ['title' => 'Edit', 'href' => "/semester/{$semester->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, Semester $semester)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'nama' => 'required|string|max:100',
            'tipe' => 'required|in:ganjil,genap',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'is_aktif' => 'boolean',
        ]);

        // Hitung total minggu
        $tanggalMulai = Carbon::parse($validated['tanggal_mulai']);
        $tanggalSelesai = Carbon::parse($validated['tanggal_selesai']);
        $validated['total_minggu'] = $tanggalMulai->diffInWeeks($tanggalSelesai);

        if ($validated['is_aktif'] ?? false) {
            Semester::where('id', '!=', $semester->id)
                ->where('is_aktif', true)
                ->update(['is_aktif' => false]);
        }

        $semester->update($validated);

        return redirect('/semester')
            ->with('success', 'Semester berhasil diperbarui.');
    }

    public function destroy(Semester $semester)
    {
        $semester->delete();

        return redirect('/semester')
            ->with('success', 'Semester berhasil dihapus.');
    }
}
