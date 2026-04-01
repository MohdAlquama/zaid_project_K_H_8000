<?php

namespace App\Http\Requests\Fee;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeeLogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:4096',
            'type' => 'required|in:school_logo,trust_logo,signature,watermark',
            'status' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ];
    }
}
