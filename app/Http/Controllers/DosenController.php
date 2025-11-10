<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\User;
use App\Models\Kampus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class DosenController extends Controller
{
    public function index()
    {
        return Inertia::render('Dosen/Index', [
            'dosen' => Dosen::with(['user', 'kampusUtama'])->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Dosen', 'href' => '/dosen'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dosen/Create', [
            'kampus' => Kampus::where('is_aktif', true)->orderBy('nama')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Dosen', 'href' => '/dosen'],
                ['title' => 'Tambah', 'href' => '/dosen/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nidn' => 'required|string|max:20|unique:'.Dosen::class,
            'nip' => 'nullable|string|max:30',
            'no_telp' => 'nullable|string|max:20',
            'kampus_utama_id' => 'nullable|exists:kampus,id',
            'is_aktif' => 'boolean',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'peran' => 'dosen',
            ]);

            $user->dosen()->create([
                'nidn' => $request->nidn,
                'nip' => $request->nip,
                'no_telp' => $request->no_telp,
                'kampus_utama_id' => $request->kampus_utama_id ?? null,
                'is_aktif' => $request->is_aktif ?? true,
            ]);
        });

        return redirect('/dosen')->with('success', 'Dosen berhasil ditambahkan.');
    }

    public function edit(Dosen $dosen)
    {
        $dosen->load('user');
        return Inertia::render('Dosen/Edit', [
            'dosen' => $dosen,
            'kampus' => Kampus::where('is_aktif', true)->orderBy('nama')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Dosen', 'href' => '/dosen'],
                ['title' => 'Edit', 'href' => "/dosen/{$dosen->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, Dosen $dosen)
    {
        $user = $dosen->user;

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class.',email,'.$user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'nidn' => 'required|string|max:20|unique:'.Dosen::class.',nidn,'.$dosen->id,
            'nip' => 'nullable|string|max:30',
            'no_telp' => 'nullable|string|max:20',
            'kampus_utama_id' => 'nullable|exists:kampus,id',
            'is_aktif' => 'boolean',
        ]);

        DB::transaction(function () use ($request, $user, $dosen) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($request->password)]);
            }

            $dosen->update([
                'nidn' => $request->nidn,
                'nip' => $request->nip,
                'no_telp' => $request->no_telp,
                'kampus_utama_id' => $request->kampus_utama_id ?? null,
                'is_aktif' => $request->is_aktif ?? true,
            ]);
        });

        return redirect('/dosen')->with('success', 'Data Dosen berhasil diperbarui.');
    }

    public function destroy(Dosen $dosen)
    {
        try {
            // Dengan ON DELETE CASCADE di database, menghapus user akan menghapus dosen juga.
            if ($dosen->user()->delete()) {
                return redirect('/dosen')->with('success', 'Dosen berhasil dihapus.');
            }
            return redirect('/dosen')->with('error', 'Gagal menghapus Dosen.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect('/dosen')->with('error', 'Dosen tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}
