<?php

namespace App\Http\Controllers\Staff\UpdateBilling;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UpdateBillingController extends Controller
{
    public function index(Request $request, ?Billing $billing = null): Response
    {
        $searchOrderNumber = $billing?->order_number ?? trim((string) $request->input('order_number', ''));
        $resolvedBilling = $billing;

        if ($resolvedBilling === null && $searchOrderNumber !== '') {
            $resolvedBilling = Billing::query()
                ->whereRaw('LOWER(order_number) = ?', [strtolower($searchOrderNumber)])
                ->first();
        }

        return Inertia::render('staff/UpdateBilling/UpdateBilling', [
            'billing' => $resolvedBilling ? $this->mapBillingForUpdate($resolvedBilling) : null,
            'search_order_number' => $searchOrderNumber,
            'not_found' => $searchOrderNumber !== '' && $resolvedBilling === null,
        ]);
    }

    private function mapBillingForUpdate(Billing $billing): array
    {
        return [
            'id' => $billing->id,
            'customer_name' => $billing->customer_name,
            'mobile_number' => $billing->mobile_number === 'n/a' ? '' : $billing->mobile_number,
            'order_number' => $billing->order_number,
            'order_date' => $billing->order_date,
            'delivery_date' => $billing->delivery_date,
            'created_at' => optional($billing->created_at)->toISOString(),
        ];
    }

    private function isWithinWindow(Billing $billing, int $minutes): bool
    {
        if ($billing->created_at === null) {
            return false;
        }

        return $billing->created_at->greaterThanOrEqualTo(now()->subMinutes($minutes));
    }
}
