<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'nullable',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'foto_profil' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
        
        // Add dosen fields if user is dosen
        if ($this->user()->isDosen()) {
            $rules = array_merge($rules, [
                'nidn' => ['nullable', 'string', 'max:20'],
                'nip' => ['nullable', 'string', 'max:30'],
                'gelar_depan' => ['nullable', 'string', 'max:20'],
                'gelar_belakang' => ['nullable', 'string', 'max:50'],
                'no_telp' => ['nullable', 'string', 'max:20'],
                'alamat' => ['nullable', 'string'],
            ]);
        }
        
        return $rules;
    }
}
