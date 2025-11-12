<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Index', [
            'users' => User::latest()->get(),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'User', 'href' => '/users'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('User/Create', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'User', 'href' => '/users'],
                ['title' => 'Tambah', 'href' => '/users/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'peran' => 'required|in:super_admin,admin,dosen',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'peran' => $request->peran,
        ]);

        return redirect('/users')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        return Inertia::render('User/Edit', [
            'user' => $user,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard'],
                ['title' => 'User', 'href' => '/users'],
                ['title' => 'Edit', 'href' => "/users/{$user->id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'peran' => 'required|in:super_admin,admin,dosen',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'peran' => $request->peran,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect('/users')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        try {
            $user->delete();
            return redirect('/users')->with('success', 'User berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect('/users')->with('error', 'User tidak dapat dihapus karena memiliki relasi dengan data lain.');
        }
    }
}
