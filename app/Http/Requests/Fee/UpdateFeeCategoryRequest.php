<?php

namespace App\Http\Requests\Fee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeeCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $adminId = (int) $this->user()?->id;
        $categoryId = is_object($this->route('category')) ? $this->route('category')->id : $this->route('category');

        return [
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('fee_types', 'name')
                    ->where(fn ($q) => $q->where('created_by', $adminId))
                    ->ignore($categoryId),
            ],
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:active,inactive',
            'is_compulsory' => 'nullable|boolean',
        ];
    }
}
