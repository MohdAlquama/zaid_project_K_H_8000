<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceControl extends Model
{
    use HasFactory;

    protected $table = 'invoice_controls';

    protected $fillable = [
        'business_name',
        'mobile_number',
        'address',
        'customer_copy',
        'shop_copy',
        'order_no',
        'show_logo',
        'vertical_line_show',
        'line_type',
        'custom_line_width',
        'custom_line_type',
        'header_line_show',
        'header_line_width',
        'header_line_spacing',
        'header_line_spacing_top',
        'header_line_spacing_bottom',
        'terms_and_conditions', // Add this line    
    ];
}