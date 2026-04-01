<?php

namespace App\Http\Controllers\Staff\FindBilling;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FindBillingController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $this->filtersFromRequest($request);
        $hasFilters = $this->hasFilters($filters);

        if (! $hasFilters) {
            return Inertia::render('staff/FindBilling/FindBilling', [
                'billings' => $this->emptyBillings(),
                'filters' => $filters,
                'active_tab' => $filters['active_tab'],
                'has_filters' => false,
            ]);
        }

        $billings = Billing::query()
            ->select([
                'id',
                'customer_name',
                'order_number',
                'mobile_number',
                'order_date',
                'delivery_date',
                'discount',
                'advance_paid',
                'net_total',
                'balance',
                'created_at',
            ])
            ->when($filters['customer_name'] !== '', function ($query) use ($filters) {
                $query->where('customer_name', 'like', '%'.$filters['customer_name'].'%');
            })
            ->when($filters['mobile_number'] !== '', function ($query) use ($filters) {
                $query->where('mobile_number', 'like', '%'.$filters['mobile_number'].'%');
            })
            ->when($filters['order_number'] !== '', function ($query) use ($filters) {
                $query->where('order_number', 'like', '%'.$filters['order_number'].'%');
            })
            ->when($filters['single_date'] !== '', function ($query) use ($filters) {
                $column = $filters['single_date_field'] === 'delivery_date'
                    ? 'delivery_date'
                    : 'order_date';

                $query->whereDate($column, $filters['single_date']);
            })
            ->when($filters['date_from'] !== '' || $filters['date_to'] !== '', function ($query) use ($filters) {
                if ($filters['date_from'] !== '' && $filters['date_to'] !== '') {
                    $query->whereDate('order_date', '>=', $filters['date_from'])
                        ->whereDate('order_date', '<=', $filters['date_to']);

                    return;
                }

                if ($filters['date_from'] !== '') {
                    $query->whereDate('order_date', '>=', $filters['date_from']);
                }

                if ($filters['date_to'] !== '') {
                    $query->whereDate('order_date', '<=', $filters['date_to']);
                }
            })
            ->when($filters['order_date'] !== '', function ($query) use ($filters) {
                $query->whereDate('order_date', $filters['order_date']);
            })
            ->latest()
            ->paginate(8)
            ->withQueryString();

        $billings->setCollection(
            $billings->getCollection()->map(function (Billing $billing): array {
                return [
                    'id' => $billing->id,
                    'customer_name' => $billing->customer_name,
                    'order_number' => $billing->order_number,
                    'mobile_number' => $billing->mobile_number,
                    'order_date' => $billing->order_date,
                    'delivery_date' => $billing->delivery_date,
                    'discount' => (string) $billing->discount,
                    'advance_paid' => (string) $billing->advance_paid,
                    'net_total' => (string) $billing->net_total,
                    'balance' => (string) $billing->balance,
                    'created_at' => optional($billing->created_at)->toISOString(),
                    'can_edit' => $billing->created_at?->greaterThan(now()->subMinutes(3)) ?? false,
                ];
            })->values()
        );

        return Inertia::render('staff/FindBilling/FindBilling', [
            'billings' => $billings,
            'filters' => $filters,
            'active_tab' => $filters['active_tab'],
            'has_filters' => true,
        ]);
    }

    private function filtersFromRequest(Request $request): array
    {
        return [
            'active_tab' => trim((string) $request->input('active_tab', 'customer')),
            'customer_name' => trim((string) $request->input('customer_name', '')),
            'mobile_number' => trim((string) $request->input('mobile_number', '')),
            'order_number' => trim((string) $request->input('order_number', '')),
            'single_date_field' => trim((string) $request->input('single_date_field', 'delivery_date')),
            'single_date' => trim((string) $request->input('single_date', '')),
            'date_from' => trim((string) $request->input('date_from', '')),
            'date_to' => trim((string) $request->input('date_to', '')),
            'order_date' => trim((string) $request->input('order_date', '')),
        ];
    }

    private function hasFilters(array $filters): bool
    {
        foreach ([
            'customer_name',
            'mobile_number',
            'order_number',
            'single_date',
            'date_from',
            'date_to',
            'order_date',
        ] as $key) {
            if ($filters[$key] !== '') {
                return true;
            }
        }

        return false;
    }

    private function emptyBillings(): array
    {
        return [
            'data' => [],
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 8,
            'total' => 0,
            'from' => null,
            'to' => null,
        ];
    }
}
