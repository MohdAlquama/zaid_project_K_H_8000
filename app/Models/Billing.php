<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    protected $fillable = [
        'customer_name',
        'mobile_number',
        'order_number',
        'order_date',
        'delivery_date',
        'frame_total',
        'lens_total',
        'discount',
        'net_total',
        'advance_paid',
        'balance'
    ];

    public function frames()
    {
        return $this->hasMany(BillingFrame::class);
    }

    public function lenses()
    {
        return $this->hasMany(BillingLens::class);
    }
}
