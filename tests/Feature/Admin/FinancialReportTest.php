<?php

use App\Models\Billing;
use App\Models\User;

it('renders the financial report with summary totals', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'status' => 'active',
    ]);

    Billing::create([
        'customer_name' => 'Asha Optics',
        'mobile_number' => '9876543210',
        'order_number' => 'ORD-1001',
        'order_date' => '2026-03-28',
        'delivery_date' => '2026-03-30',
        'frame_total' => 100,
        'lens_total' => 50,
        'discount' => 10,
        'net_total' => 140,
        'advance_paid' => 50,
        'balance' => 90,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.reports.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/FinancialReport')
            ->where('summary.total_billings', 1)
            ->where('summary.gross_amount', 150)
            ->where('summary.discount_amount', 10)
            ->where('summary.collected_amount', 50)
            ->where('summary.due_amount', 90)
            ->where('summary.net_amount', 140)
            ->has('reportRows.data', 1)
        );
});
