<?php

namespace App\Http\Requests\Fee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeeReceiptDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $adminId = (int) $this->user()?->id;

        return [
            'name' => 'required|string|max:150',
            'school_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'logo_id' => [
                'nullable',
                'integer',
                Rule::exists('fee_logos', 'id')->where(fn ($q) => $q->where('created_by', $adminId)),
            ],
            'receipt_title' => 'required|string|max:255',
            'footer_text' => 'nullable|string|max:1000',
            'signature_label' => 'nullable|string|max:150',
            'logo_alignment' => 'required|in:left,center,right',
            'header_style' => 'nullable|string|max:50',
            'table_style' => 'nullable|string|max:50',
            'signature_placement' => 'nullable|string|max:50',
            'status' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ];
    }
}
