<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $today = now();
        $todayDate = $today->toDateString();
        $monthStart = $today->copy()->startOfMonth()->toDateString();
        $monthEnd = $today->copy()->endOfMonth()->toDateString();
        $previousMonthStart = $today->copy()->subMonthNoOverflow()->startOfMonth()->toDateString();
        $previousMonthEnd = $today->copy()->subMonthNoOverflow()->endOfMonth()->toDateString();

        $range = $this->normalizeDashboardRange(trim((string) $request->input('range', 'today')));
        $fromDateInput = trim((string) $request->input('from_date', ''));
        $toDateInput = trim((string) $request->input('to_date', ''));

        [$rangeStart, $rangeEnd, $rangeLabel] = $this->resolveDashboardRange($range, $fromDateInput, $toDateInput);

        $metrics = [
            'total_billings' => Billing::count(),
            'today_billings' => Billing::whereDate('order_date', $todayDate)->count(),
            'month_revenue' => (float) Billing::whereBetween('order_date', [$monthStart, $monthEnd])->sum('net_total'),
            'previous_month_revenue' => (float) Billing::whereBetween('order_date', [$previousMonthStart, $previousMonthEnd])->sum('net_total'),
            'pending_balance' => (float) Billing::where('balance', '>', 0)->sum('balance'),
            'open_due_billings' => Billing::where('balance', '>', 0)->count(),
            'deliveries_due_today' => Billing::whereDate('delivery_date', $todayDate)->count(),
            'average_order_value' => round((float) Billing::avg('net_total'), 2),
            'active_staff' => User::where('role', 'staff')->where('status', 'active')->count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'inactive_users' => User::where('status', 'inactive')->count(),
        ];

        $rangeSummaryQuery = Billing::query()
            ->whereDate('order_date', '>=', $rangeStart->toDateString())
            ->whereDate('order_date', '<=', $rangeEnd->toDateString());

        $rangeSummaryData = (clone $rangeSummaryQuery)
            ->selectRaw('COUNT(*) as total_billings')
            ->selectRaw('COALESCE(SUM(COALESCE(frame_total, 0) + COALESCE(lens_total, 0)), 0) as gross_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(discount, 0)), 0) as discount_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(advance_paid, 0)), 0) as collected_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(balance, 0)), 0) as due_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(net_total, 0)), 0) as net_amount')
            ->first();

        $chartRows = (clone $rangeSummaryQuery)
            ->selectRaw('order_date as chart_date')
            ->selectRaw('COUNT(*) as total_billings')
            ->selectRaw('COALESCE(SUM(COALESCE(discount, 0)), 0) as discount_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(advance_paid, 0)), 0) as collected_amount')
            ->selectRaw('COALESCE(SUM(COALESCE(balance, 0)), 0) as due_amount')
            ->groupBy('order_date')
            ->orderBy('order_date')
            ->get()
            ->keyBy(fn ($row): string => (string) $row->chart_date);

        $chartData = collect(CarbonPeriod::create($rangeStart->copy()->startOfDay(), '1 day', $rangeEnd->copy()->startOfDay()))
            ->map(function (Carbon $date) use ($chartRows): array {
                $row = $chartRows->get($date->toDateString());

                return [
                    'date' => $date->toDateString(),
                    'orders' => (int) ($row->total_billings ?? 0),
                    'collection' => round((float) ($row->collected_amount ?? 0), 2),
                    'discount' => round((float) ($row->discount_amount ?? 0), 2),
                    'due_balance' => round((float) ($row->due_amount ?? 0), 2),
                ];
            })
            ->values()
            ->all();

        $recentBillings = Billing::query()
            ->select([
                'id',
                'customer_name',
                'order_number',
                'order_date',
                'delivery_date',
                'net_total',
                'advance_paid',
                'balance',
            ])
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Billing $billing): array => [
                'id' => $billing->id,
                'customer_name' => $billing->customer_name,
                'order_number' => $billing->order_number,
                'order_date' => $billing->order_date,
                'delivery_date' => $billing->delivery_date,
                'net_total' => (float) $billing->net_total,
                'advance_paid' => (float) $billing->advance_paid,
                'balance' => (float) $billing->balance,
            ])
            ->values();

        $dueBillings = Billing::query()
            ->select([
                'id',
                'customer_name',
                'order_number',
                'order_date',
                'delivery_date',
                'advance_paid',
                'net_total',
                'balance',
            ])
            ->where('balance', '>', 0)
            ->orderByDesc('balance')
            ->orderBy('delivery_date')
            ->orderByDesc('id')
            ->limit(6)
            ->get()
            ->map(fn (Billing $billing): array => [
                'id' => $billing->id,
                'customer_name' => $billing->customer_name,
                'order_number' => $billing->order_number,
                'order_date' => $billing->order_date,
                'delivery_date' => $billing->delivery_date,
                'advance_paid' => (float) $billing->advance_paid,
                'net_total' => (float) $billing->net_total,
                'balance' => (float) $billing->balance,
            ])
            ->values();

        $upcomingDeliveries = Billing::query()
            ->select([
                'id',
                'customer_name',
                'order_number',
                'delivery_date',
                'balance',
            ])
            ->whereNotNull('delivery_date')
            ->whereDate('delivery_date', '>=', $todayDate)
            ->orderBy('delivery_date')
            ->limit(6)
            ->get()
            ->map(fn (Billing $billing): array => [
                'id' => $billing->id,
                'customer_name' => $billing->customer_name,
                'order_number' => $billing->order_number,
                'delivery_date' => $billing->delivery_date,
                'balance' => (float) $billing->balance,
            ])
            ->values();

        $recentUsers = User::query()
            ->select([
                'id',
                'name',
                'email',
                'role',
                'status',
                'created_at',
            ])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?: 'staff',
                'status' => $user->status ?: 'active',
                'created_at' => optional($user->created_at)->toISOString(),
            ])
            ->values();

        return Inertia::render('admin/Dashboard', [
            'metrics' => $metrics,
            'rangeSummary' => [
                'total_billings' => (int) ($rangeSummaryData->total_billings ?? 0),
                'gross_amount' => round((float) ($rangeSummaryData->gross_amount ?? 0), 2),
                'discount_amount' => round((float) ($rangeSummaryData->discount_amount ?? 0), 2),
                'collected_amount' => round((float) ($rangeSummaryData->collected_amount ?? 0), 2),
                'due_amount' => round((float) ($rangeSummaryData->due_amount ?? 0), 2),
                'net_amount' => round((float) ($rangeSummaryData->net_amount ?? 0), 2),
            ],
            'dashboardFilters' => [
                'range' => $range,
                'from_date' => $range === 'custom' ? $rangeStart->toDateString() : '',
                'to_date' => $range === 'custom' ? $rangeEnd->toDateString() : '',
                'range_label' => $rangeLabel,
            ],
            'chartData' => $chartData,
            'recentBillings' => $recentBillings,
            'dueBillings' => $dueBillings,
            'upcomingDeliveries' => $upcomingDeliveries,
            'recentUsers' => $recentUsers,
            'generatedAt' => $today->toIso8601String(),
        ]);
    }

    private function normalizeDashboardRange(string $range): string
    {
        return in_array($range, ['today', 'yesterday', '7d', '30d', 'custom'], true)
            ? $range
            : 'today';
    }

    /**
     * @return array{0: Carbon, 1: Carbon, 2: string}
     */
    private function resolveDashboardRange(string $range, string $fromDate, string $toDate): array
    {
        $today = now()->startOfDay();

        return match ($range) {
            'yesterday' => [
                $today->copy()->subDay(),
                $today->copy()->subDay(),
                'Yesterday',
            ],
            '7d' => [
                $today->copy()->subDays(6),
                $today->copy(),
                'Last 7 days',
            ],
            '30d' => [
                $today->copy()->subDays(29),
                $today->copy(),
                'Last 30 days',
            ],
            'custom' => $this->resolveCustomDashboardRange($fromDate, $toDate, $today),
            default => [
                $today->copy(),
                $today->copy(),
                'Today',
            ],
        };
    }

    /**
     * @return array{0: Carbon, 1: Carbon, 2: string}
     */
    private function resolveCustomDashboardRange(string $fromDate, string $toDate, Carbon $fallbackDate): array
    {
        $startDate = $this->parseDashboardDate($fromDate, $fallbackDate);
        $endDate = $this->parseDashboardDate($toDate, $startDate);

        if ($endDate->lt($startDate)) {
            $endDate = $startDate->copy();
        }

        return [
            $startDate->copy()->startOfDay(),
            $endDate->copy()->startOfDay(),
            sprintf('Custom range: %s - %s', $startDate->format('d M Y'), $endDate->format('d M Y')),
        ];
    }

    private function parseDashboardDate(string $value, Carbon $fallbackDate): Carbon
    {
        if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return $fallbackDate->copy();
        }

        return Carbon::createFromFormat('Y-m-d', $value)->startOfDay();
    }
}
