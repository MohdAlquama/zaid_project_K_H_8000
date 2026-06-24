<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvoiceControl;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class InvoiceControlController extends Controller
{
    public function index()
    {
        $settings = InvoiceControl::first() ?? new InvoiceControl();
        
        return Inertia::render('admin/InvoiceControl/InvoiceControl', [
            'settings' => $settings
        ]);
    }

    public function store(Request $request)
    {
        // 1. Inertia FormData ke booleans ko properly handle karna
        $request->merge([
            'customer_copy' => $request->boolean('customer_copy'),
            'shop_copy' => $request->boolean('shop_copy'),
            'order_no' => $request->boolean('order_no'),
            'show_logo' => $request->boolean('show_logo'),
            'vertical_line_show' => $request->boolean('vertical_line_show'),
            'header_line_show' => $request->boolean('header_line_show'),
        ]);

        // 2. Data Validation
        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'mobile_number' => 'nullable|string|max:90',
            'address' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'customer_copy' => 'boolean',
            'shop_copy' => 'boolean',
            'order_no' => 'boolean',
            'show_logo' => 'boolean',
            'vertical_line_show' => 'boolean',
            'line_type' => 'nullable|string',
            'custom_line_width' => 'nullable|string',
            'custom_line_type' => 'nullable|string',
            'header_line_show' => 'boolean',
            'header_line_width' => 'nullable|integer|min:0',
            'header_line_spacing' => 'nullable|integer|min:0',
            'header_line_spacing_top' => 'nullable|integer|min:0',
            'header_line_spacing_bottom' => 'nullable|integer|min:0',
            'terms_and_conditions' => 'nullable|string', // Add this line
        ]);

        $settings = InvoiceControl::first() ?? new InvoiceControl();

        // 3. Logo Image Upload Logic
        if ($request->hasFile('logo')) {
            if ($settings->logo_path) {
                Storage::disk('public')->delete($settings->logo_path); 
            }
            $settings->logo_path = $request->file('logo')->store('invoice_logos', 'public');
        }

        unset($validated['logo']);

        // 4. Data Save karna
        $settings->fill($validated);
        $settings->save();

        return back()->with('success', 'Invoice settings updated successfully!');
    }
}