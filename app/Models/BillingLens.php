<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillingLens extends Model
{
    protected $fillable = [
        'billing_id',
        'lens_type',
        'add',
        'price',
        'right_sph',
        'right_cyl',
        'right_axis',
        'right_va',
        'left_sph',
        'left_cyl',
        'left_axis',
        'left_va',
        'is_linked',
        'linked_to_index',
    ];

    public function billing()
    {
        return $this->belongsTo(Billing::class);
    }
}
