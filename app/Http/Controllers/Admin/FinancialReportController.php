<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FinancialReportController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date', 'after_or_equal:from_date'],
            'customer_name' => ['nullable', 'string', 'max:255'],
            'mobile_number' => ['nullable', 'string', 'max:30'],
            'order_number' => ['nullable', 'string', 'max:255'],
            'payment_status' => ['nullable', Rule::in($this->paymentStatusOptions())],
        ]);

        $filters = [
            'from_date' => trim((string) ($validated['from_date'] ?? '')),
            'to_date' => trim((string) ($validated['to_date'] ?? '')),
            'customer_name' => trim((string) ($validated['customer_name'] ?? '')),
            'mobile_number' => trim((string) ($validated['mobile_number'] ?? '')),
            'order_number' => trim((string) ($validated['order_number'] ?? '')),
            'payment_status' => trim((string) ($validated['payment_status'] ?? '')),
        ];

        $reportInitialized = collect($filters)->contains(
            fn (string $value): bool => trim($value) !== ''
        );

        $emptySummary = [
            'total_billings' => 0,
            'gross_amount' => 0.0,
            'discount_amount' => 0.0,
            'collected_amount' => 0.0,
            'due_amount' => 0.0,
            'net_amount' => 0.0,
        ];

        $emptyReportRows = [
            'data' => [],
            'current_page' => 1,
            'last_page' => 1,
            'total' => 0,
            'from' => null,
            'to' => null,
        ];

        if (! $reportInitialized) {
            return Inertia::render('admin/FinancialReport', [
                'filters' => $filters,
                'summary' => $emptySummary,
                'reportRows' => $emptyReportRows,
                'exportRows' => [],
                'paymentStatusOptions' => $this->paymentStatusOptions(),
                'generatedAt' => now()->toIso8601String(),
                'reportInitialized' => false,
            ]);
        }

        $filteredQuery = $this->buildFilteredQuery($filters);

        $summaryData = (clone $filteredQuery)
            ->selectRaw('COUNT(*) as total_billings')
            ->selectRaw('COALESCE(SUM(COALESCE(frame_total, 0) + COALESCE(lens_total, 0)), 0) as gross_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(discount, 0)), 0) as discount_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(advance_paid, 0)), 0) as collected_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(balance, 0)), 0) as due_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(net_total, 0)), 0) as net_amount')
            ->first();

        $reportQuery = $this->buildReportQuery($filters);

        $rows = (clone $reportQuery)
            ->orderByDesc('order_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $rows->setCollection(
            $rows->getCollection()
                ->map(fn (Billing $billing): array => $this->mapBillingRow($billing))
                ->values()
        );

        $exportRows = (clone $reportQuery)
            ->orderByDesc('order_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Billing $billing): array => $this->mapBillingRow($billing))
            ->values();

        return Inertia::render('admin/FinancialReport', [
            'filters' => $filters,
            'summary' => [
                'total_billings' => (int) ($summaryData->total_billings ?? 0),
                'gross_amount' => round((float) ($summaryData->gross_amount ?? 0), 2),
                'discount_amount' => round((float) ($summaryData->discount_amount ?? 0), 2),
                'collected_amount' => round((float) ($summaryData->collected_amount ?? 0), 2),
                'due_amount' => round((float) ($summaryData->due_amount ?? 0), 2),
                'net_amount' => round((float) ($summaryData->net_amount ?? 0), 2),
            ],
            'reportRows' => $rows,
            'exportRows' => $exportRows,
            'paymentStatusOptions' => $this->paymentStatusOptions(),
            'generatedAt' => now()->toIso8601String(),
            'reportInitialized' => true,
        ]);
    }

    private function buildReportQuery(array $filters): Builder
    {
        return $this->buildFilteredQuery($filters)
            ->select([
                'id',
                'customer_name',
                'mobile_number',
                'order_number',
                'order_date',
                'delivery_date',
                'frame_total',
                'lens_total',
                'discount',
                'advance_paid',
                'balance',
                'net_total',
            ]);
    }

    private function buildFilteredQuery(array $filters): Builder
    {
        return Billing::query()
            ->when($filters['from_date'] !== '', function (Builder $query) use ($filters) {
                $query->whereDate('order_date', '>=', $filters['from_date']);
            })
            ->when($filters['to_date'] !== '', function (Builder $query) use ($filters) {
                $query->whereDate('order_date', '<=', $filters['to_date']);
            })
            ->when($filters['customer_name'] !== '', function (Builder $query) use ($filters) {
                $query->where('customer_name', 'like', '%'.$filters['customer_name'].'%');
            })
            ->when($filters['mobile_number'] !== '', function (Builder $query) use ($filters) {
                $query->where('mobile_number', 'like', '%'.$filters['mobile_number'].'%');
            })
            ->when($filters['order_number'] !== '', function (Builder $query) use ($filters) {
                $query->where('order_number', 'like', '%'.$filters['order_number'].'%');
            })
            ->when($filters['payment_status'] === 'paid', function (Builder $query) {
                $query->where('balance', '<=', 0);
            })
            ->when($filters['payment_status'] === 'due', function (Builder $query) {
                $query->where('balance', '>', 0);
            });
    }

    private function mapBillingRow(Billing $billing): array
    {
        $grossAmount = round((float) $billing->frame_total + (float) $billing->lens_total, 2);
        $balance = round((float) $billing->balance, 2);

        return [
            'id' => $billing->id,
            'customer_name' => $billing->customer_name,
            'mobile_number' => $billing->mobile_number ?: 'n/a',
            'order_number' => $billing->order_number,
            'order_date' => $billing->order_date,
            'delivery_date' => $billing->delivery_date,
            'gross_amount' => $grossAmount,
            'discount' => round((float) $billing->discount, 2),
            'advance_paid' => round((float) $billing->advance_paid, 2),
            'balance' => $balance,
            'net_total' => round((float) $billing->net_total, 2),
            'payment_status' => $balance > 0 ? 'due' : 'paid',
        ];
    }

    private function paymentStatusOptions(): array
    {
        return ['paid', 'due'];
    }
}
