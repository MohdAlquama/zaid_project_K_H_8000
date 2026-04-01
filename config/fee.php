<?php

return [
    'late_fee' => [
        'grace_days' => (int) env('FEE_LATE_FEE_GRACE_DAYS', 0),
        'default_per_day' => (float) env('FEE_LATE_FEE_PER_DAY', 10),
        'default_max' => (float) env('FEE_LATE_FEE_MAX', 5000),
    ],

    'installments' => [
        'monthly' => 12,
        'quarterly' => 4,
        'half_yearly' => 2,
        'one_time' => 1,
    ],

    'receipt' => [
        'school_name' => env('SCHOOL_NAME', config('app.name', 'School ERP')),
        'logo_path' => env('SCHOOL_LOGO_PATH'),
        'digital_signature_name' => env('SCHOOL_SIGNATORY_NAME', 'Accounts Department'),
        'digital_signature_path' => env('SCHOOL_SIGNATORY_PATH'),
    ],
];
