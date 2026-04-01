<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillingFrame extends Model
{
    protected $fillable = ['billing_id', 'name', 'price'];

    public function billing()
    {
        return $this->belongsTo(Billing::class);
    }
}
