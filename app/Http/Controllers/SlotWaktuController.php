<?php

namespace App\Http\Controllers;

use App\Models\SlotWaktu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SlotWaktuController extends Controller
{
    public function index()
    {
        return Inertia::render('SlotWaktu/Index', [
            'slotWaktu' => SlotWaktu::orderBy('urutan')->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Slot Waktu', 'href' => '/slot-waktu'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('SlotWaktu/Create', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Slot Waktu', 'href' => '/slot-waktu'],
                ['title' => 'Tambah', 'href' => '/slot-waktu/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'required|date_format:H:i|after:waktu_mulai',
            'label' => 'required|string|max:50',
            'urutan' => 'required|integer|min:0',
            'is_aktif' => 'boolean',
        ]);

        SlotWaktu::create($request->all());

        return redirect('/slot-waktu')->with('success', 'Slot Waktu berhasil ditambahkan.');
    }

    public function edit(SlotWaktu $slotWaktu)
    {
        return Inertia::render('SlotWaktu/Edit', [
            'slotWaktu' => $slotWaktu,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'Slot Waktu', 'href' => '/slot-waktu'],
                ['title' => 'Edit', 'href' => "/slot-waktu/{$slotWaktu->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, SlotWaktu $slotWaktu)
    {
        $request->validate([
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'required|date_format:H:i|after:waktu_mulai',
            'label' => 'required|string|max:50',
            'urutan' => 'required|integer|min:0',
            'is_aktif' => 'boolean',
        ]);

        $slotWaktu->update($request->all());

        return redirect('/slot-waktu')->with('success', 'Slot Waktu berhasil diperbarui.');
    }

    public function destroy(SlotWaktu $slotWaktu)
    {
        try {
            if ($slotWaktu->delete()) {
                return redirect('/slot-waktu')->with('success', 'Slot Waktu berhasil dihapus.');
            }
            return redirect('/slot-waktu')->with('error', 'Gagal menghapus Slot Waktu.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect('/slot-waktu')->with('error', 'Slot Waktu tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}