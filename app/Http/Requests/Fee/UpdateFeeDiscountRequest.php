<?php

namespace App\Http\Requests\Fee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeeDiscountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $adminId = (int) $this->user()?->id;

        return [
            'student_id' => [
                'required',
                'integer',
                Rule::exists('students', 'id')->where(fn ($q) => $q->where('created_by', $adminId)),
            ],
            'academic_year_id' => [
                'nullable',
                'integer',
                Rule::exists('academic_years', 'id')->where(fn ($q) => $q->where('created_by', $adminId)),
            ],
            'fee_structure_id' => [
                'nullable',
                'integer',
                Rule::exists('fee_structures', 'id')->where(fn ($q) => $q->where('created_by', $adminId)),
            ],
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0.01',
            'reason' => 'nullable|string|max:500',
            'status' => 'nullable|boolean',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->input('discount_type') === 'percentage' && (float) $this->input('discount_value') > 100) {
                $validator->errors()->add('discount_value', 'Percentage discount cannot exceed 100%.');
            }
        });
    }
}
