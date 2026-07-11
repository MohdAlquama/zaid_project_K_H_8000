<?php

namespace App\Http\Controllers\Admin\Billing;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\BillingFrame;
use App\Models\BillingLens;
use App\Models\InvoiceControl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    private const PREVIOUS_DUE_FRAME_NAME = 'Previous Due Carry';

    public function index(Request $request): Response
    {
        return Inertia::render('admin/Billing/CreateBilling', [
            'phoneSettings' => $this->phoneSettings(),
        ]);
    }

    public function view(Request $request): Response
    {
        $filters = [
            'customer_name' => trim((string) $request->input('customer_name', '')),
            'order_number' => trim((string) $request->input('order_number', '')),
            'mobile_number' => trim((string) $request->input('mobile_number', '')),
            'order_date' => trim((string) $request->input('order_date', '')),
            'delivery_date' => trim((string) $request->input('delivery_date', '')),
        ];

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
            ])
            ->when($filters['customer_name'] !== '', function ($query) use ($filters) {
                $query->where('customer_name', 'like', '%'.$filters['customer_name'].'%');
            })
            ->when($filters['order_number'] !== '', function ($query) use ($filters) {
                $query->where('order_number', 'like', '%'.$filters['order_number'].'%');
            })
            ->when($filters['mobile_number'] !== '', function ($query) use ($filters) {
                $query->where('mobile_number', 'like', '%'.$filters['mobile_number'].'%');
            })
            ->when($filters['order_date'] !== '', function ($query) use ($filters) {
                $query->whereDate('order_date', $filters['order_date']);
            })
            ->when($filters['delivery_date'] !== '', function ($query) use ($filters) {
                $query->whereDate('delivery_date', $filters['delivery_date']);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $billings->setCollection(
            $billings->getCollection()->map(fn (Billing $billing): array => [
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
            ])
            ->values()
        );

        return Inertia::render( 'admin/Billing/ViewBilling', [
            'billings' => $billings,
            'filters' => $filters,
        ]);
    }

    public function dueSummary(Request $request): JsonResponse
    {
        $mobileNumber = trim((string) $request->input('mobile_number', ''));
        $excludeBillingId = $request->filled('billing_id') ? (int) $request->input('billing_id') : null;

        if ($mobileNumber === '' || $mobileNumber === 'n/a') {
            return response()->json([
                'mobile_number' => $mobileNumber,
                'total_due' => 0,
                'billings' => [],
            ]);
        }

        $dueBillings = $this->getOutstandingDueBillings($mobileNumber, $excludeBillingId);

        return response()->json([
            'mobile_number' => $mobileNumber,
            'total_due' => round($dueBillings->sum(fn (Billing $billing): float => (float) $billing->balance), 2),
            'billings' => $dueBillings->map(fn (Billing $billing): array => [
                'id' => $billing->id,
                'order_number' => $billing->order_number,
                'order_date' => $billing->order_date,
                'delivery_date' => $billing->delivery_date,
                'balance' => (float) $billing->balance,
            ])->values(),
        ]);
    }

    public function collectPayment(Request $request, Billing $billing): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $amount = round((float) $validated['amount'], 2);
        $currentBalance = round((float) $billing->balance, 2);

        if ($currentBalance <= 0) {
            return back()->with('error', "Billing {$billing->order_number} does not have any due balance.");
        }

        if ($amount > $currentBalance) {
            throw ValidationException::withMessages([
                'amount' => 'Collection amount cannot be greater than the due balance.',
            ]);
        }

        $billing->update([
            'advance_paid' => round((float) $billing->advance_paid + $amount, 2),
            'balance' => round($currentBalance - $amount, 2),
        ]);

        return back()->with(
            'success',
            "Collected Rs. {$amount} for billing {$billing->order_number}. Remaining due: Rs. {$billing->fresh()->balance}."
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $this->validateBillingData($request);

        $billing = DB::transaction(function () use ($payload) {
            $billing = Billing::create([
                'customer_name' => $payload['validated']['customer_name'],
                'mobile_number' => $payload['validated']['mobile_number'] ?: 'n/a',
                'order_number' => 'TMP-'.Str::uuid(),
                'order_date' => $payload['validated']['order_date'] ?? null,
                'delivery_date' => $payload['validated']['delivery_date'] ?? null,
                'frame_total' => $payload['frame_total'],
                'lens_total' => $payload['lens_total'],
                'discount' => $payload['discount'],
                'net_total' => $payload['net_total'],
                'advance_paid' => $payload['advance_paid'],
                'balance' => $payload['balance'],
            ]);

            $billing->update([
                'order_number' => $this->generateOrderNumber($billing->id),
            ]);

            $this->saveRelatedItems($billing->id, $payload['frames'], $payload['lenses']);
            if ($payload['due_transfer_mobile_number'] !== null && $payload['due_carry_amount'] > 0) {
                $this->transferOutstandingDue($payload['due_transfer_mobile_number'], $billing->id);
            }

            return $billing->fresh();
        });

        $routePrefix = 'admin';

        return redirect()
            ->route($routePrefix.'.billing.invoice', $billing)
            ->with('success', "Billing saved successfully. Order number: {$billing->order_number}");
    }

    public function edit(Billing $billing): Response
    {
        $billing->load(['frames', 'lenses']);

        return Inertia::render('admin/Billing/EditBilling', [
            'billing' => $this->mapBillingForForm($billing),
            'phoneSettings' => $this->phoneSettings(),
        ]);
    }

    public function invoice(Request $request, Billing $billing): Response
    {
        $billing->load(['frames', 'lenses']);
        $settings = InvoiceControl::first() ?? new InvoiceControl();

        return Inertia::render( 'admin/Billing/InvoiceBilling', [
            'billing' => $this->mapBillingForInvoice($billing),
            // 'logo_url' => asset('assets/logo.png'),
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, Billing $billing): RedirectResponse
    {
        $payload = $this->validateBillingData($request, $billing);

        DB::transaction(function () use ($billing, $payload) {
            $billing->update([
                'customer_name' => $payload['validated']['customer_name'],
                'mobile_number' => $payload['validated']['mobile_number'] ?: 'n/a',
                'order_date' => $payload['validated']['order_date'] ?? null,
                'delivery_date' => $payload['validated']['delivery_date'] ?? null,
                'frame_total' => $payload['frame_total'],
                'lens_total' => $payload['lens_total'],
                'discount' => $payload['discount'],
                'net_total' => $payload['net_total'],
                'advance_paid' => $payload['advance_paid'],
                'balance' => $payload['balance'],
            ]);

            BillingFrame::where('billing_id', $billing->id)->delete();
            BillingLens::where('billing_id', $billing->id)->delete();

            $this->saveRelatedItems($billing->id, $payload['frames'], $payload['lenses']);
        });

        return redirect()
            ->route('admin.billing.edit', $billing)
            ->with('success', "Billing updated successfully. Order number: {$billing->order_number}");
    }

    public function destroy(Billing $billing): RedirectResponse
    {
        $orderNumber = $billing->order_number;
        $billing->delete();

        return back()->with('success', "Billing {$orderNumber} deleted successfully.");
    }

    private function validateBillingData(Request $request, ?Billing $billing = null): array
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'mobile_number' => $this->mobileNumberRules(),
            'order_date' => ['nullable', 'date'],
            'delivery_date' => ['nullable', 'date', 'after_or_equal:order_date'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'advance_paid' => ['nullable', 'numeric', 'min:0'],
            'frames' => ['nullable', 'array'],
            'frames.*.name' => ['required', 'string', 'max:255'],
            'frames.*.price' => ['required', 'numeric', 'min:0'],
            'lenses' => ['nullable', 'array'],
            'lenses.*.lensType' => ['required', 'string', 'max:255'],
            'lenses.*.add' => ['nullable', 'string', 'max:255'],
            'lenses.*.price' => ['required', 'numeric', 'min:0'],
            'lenses.*.linkedLensIndex' => ['nullable', 'integer', 'min:1'],
            'lenses.*.right.sph' => ['nullable', 'string', 'max:255'],
            'lenses.*.right.cyl' => ['nullable', 'string', 'max:255'],
            'lenses.*.right.axis' => ['nullable', 'string', 'max:255'],
            'lenses.*.right.va' => ['nullable', 'string', 'max:255'],
            'lenses.*.left.sph' => ['nullable', 'string', 'max:255'],
            'lenses.*.left.cyl' => ['nullable', 'string', 'max:255'],
            'lenses.*.left.axis' => ['nullable', 'string', 'max:255'],
            'lenses.*.left.va' => ['nullable', 'string', 'max:255'],
        ]);

        $submittedFrames = collect($validated['frames'] ?? []);
        $lenses = collect($validated['lenses'] ?? []);
        $mobileNumber = trim((string) ($validated['mobile_number'] ?? ''));
        $existingDueCarryAmount = $billing
            ? (float) $billing->frames()->where('name', self::PREVIOUS_DUE_FRAME_NAME)->sum('price')
            : 0.0;
        $submittedDueCarryRequested = $submittedFrames->contains(
            fn (array $frame): bool => $this->isPreviousDueFrameName((string) ($frame['name'] ?? ''))
        );
        $dueCarryAmount = 0.0;
        $dueTransferMobileNumber = null;

        if ($billing !== null && $existingDueCarryAmount > 0) {
            $dueCarryAmount = round($existingDueCarryAmount, 2);
        } elseif ($submittedDueCarryRequested && $mobileNumber !== '' && $mobileNumber !== 'n/a') {
            $dueCarryAmount = round(
                $this->getOutstandingDueBillings($mobileNumber)->sum(fn (Billing $dueBilling): float => (float) $dueBilling->balance),
                2
            );
            $dueTransferMobileNumber = $dueCarryAmount > 0 ? $mobileNumber : null;
        }

        $frames = $this->normalizeFrames($submittedFrames, $dueCarryAmount);

        if ($frames->isEmpty() && $lenses->isEmpty()) {
            throw ValidationException::withMessages([
                'frames' => 'Add at least one frame or lens before saving the billing.',
            ]);
        }

        $frameTotal = $frames->sum(fn (array $frame): float => (float) $frame['price']);
        $lensTotal = $lenses->sum(fn (array $lens): float => (float) $lens['price']);
        $grossTotal = $frameTotal + $lensTotal;
        $discount = (float) ($validated['discount'] ?? 0);
        $advancePaid = (float) ($validated['advance_paid'] ?? 0);
        if ($discount > $grossTotal) {
            throw ValidationException::withMessages([
                'discount' => 'Discount cannot be greater than the gross total.',
            ]);
        }

        $netTotal = $grossTotal - $discount;
        $balance = $netTotal - $advancePaid;

        return [
            'validated' => $validated,
            'frames' => $frames,
            'lenses' => $lenses,
            'frame_total' => $frameTotal,
            'lens_total' => $lensTotal,
            'discount' => $discount,
            'advance_paid' => $advancePaid,
            'net_total' => $netTotal,
            'balance' => $balance,
            'due_carry_amount' => $dueCarryAmount,
            'due_transfer_mobile_number' => $dueTransferMobileNumber,
        ];
    }

    private function mobileNumberRules(): array
    {
        $phoneSettings = $this->phoneSettings();
        $required = $phoneSettings['required'];
        $phoneLength = $phoneSettings['length'];

        return [
            $required ? 'required' : 'nullable',
            'digits:'.$phoneLength,
        ];
    }

    private function phoneSettings(): array
    {
        $settings = InvoiceControl::first();
        $required = (bool) ($settings?->admin_check ?? false);

        return [
            'required' => $required,
            'length' => $required ? max(1, (int) ($settings?->phone ?? 10)) : 10,
        ];
    }

    private function saveRelatedItems(int $billingId, Collection $frames, Collection $lenses): void
    {
        foreach ($frames as $frame) {
            BillingFrame::create([
                'billing_id' => $billingId,
                'name' => $frame['name'],
                'price' => $frame['price'],
            ]);
        }

        $resolvedLenses = [];

        foreach ($lenses->values() as $position => $lens) {
            $rightEye = $this->normalizeEyePrescription(data_get($lens, 'right', []));
            $leftEye = $this->normalizeEyePrescription(data_get($lens, 'left', []));
            $linkedToIndex = $this->normalizeLinkedLensIndex(data_get($lens, 'linkedLensIndex'));

            if ($linkedToIndex !== null) {
                if ($linkedToIndex > $position) {
                    throw ValidationException::withMessages([
                        "lenses.{$position}.linkedLensIndex" => 'Choose a previous lens to link with.',
                    ]);
                }

                $sourceLens = $resolvedLenses[$linkedToIndex - 1] ?? null;

                if ($sourceLens === null) {
                    throw ValidationException::withMessages([
                        "lenses.{$position}.linkedLensIndex" => 'Selected linked lens could not be resolved.',
                    ]);
                }

                $rightEye = $sourceLens['right'];
                $leftEye = $sourceLens['left'];
            }

            $isLinked = $linkedToIndex !== null || $this->prescriptionsMatch($rightEye, $leftEye);

            BillingLens::create([
                'billing_id' => $billingId,
                'lens_type' => $lens['lensType'],
                'add' => $this->normalizeLensAdd(data_get($lens, 'add')),
                'price' => $lens['price'],
                'right_sph' => $rightEye['sph'],
                'right_cyl' => $rightEye['cyl'],
                'right_axis' => $rightEye['axis'],
                'right_va' => $rightEye['va'],
                'left_sph' => $leftEye['sph'],
                'left_cyl' => $leftEye['cyl'],
                'left_axis' => $leftEye['axis'],
                'left_va' => $leftEye['va'],
                'is_linked' => $isLinked,
                'linked_to_index' => $linkedToIndex,
            ]);

            $resolvedLenses[] = [
                'right' => $rightEye,
                'left' => $leftEye,
            ];
        }
    }

    private function mapBillingForForm(Billing $billing): array
    {
        return [
            'id' => $billing->id,
            'customer_name' => $billing->customer_name,
            'mobile_number' => $billing->mobile_number === 'n/a' ? '' : $billing->mobile_number,
            'order_number' => $billing->order_number,
            'order_date' => $billing->order_date,
            'delivery_date' => $billing->delivery_date,
            'discount' => (string) $billing->discount,
            'advance_paid' => (string) $billing->advance_paid,
            'frames' => $billing->frames->map(fn (BillingFrame $frame): array => [
                'name' => $frame->name,
                'price' => (string) $frame->price,
            ])->values()->all(),
            'lenses' => $billing->lenses->map(fn (BillingLens $lens): array => [
                'lensType' => $lens->lens_type,
                'add' => $lens->add ?? '',
                'price' => (string) $lens->price,
                'linkedLensIndex' => $lens->linked_to_index ? (string) $lens->linked_to_index : '',
                'right' => [
                    'sph' => $lens->right_sph ?? '',
                    'cyl' => $lens->right_cyl ?? '',
                    'axis' => $lens->right_axis ?? '',
                    'va' => $lens->right_va ?? '',
                ],
                'left' => [
                    'sph' => $lens->left_sph ?? '',
                    'cyl' => $lens->left_cyl ?? '',
                    'axis' => $lens->left_axis ?? '',
                    'va' => $lens->left_va ?? '',
                ],
            ])->values()->all(),
        ];
    }

    private function mapBillingForInvoice(Billing $billing): array
    {
        return [
            'id' => $billing->id,
            'customer_name' => $billing->customer_name,
            'mobile_number' => $billing->mobile_number,
            'order_number' => $billing->order_number,
            'order_date' => $billing->order_date,
            'delivery_date' => $billing->delivery_date,
            'frame_total' => (string) $billing->frame_total,
            'lens_total' => (string) $billing->lens_total,
            'discount' => (string) $billing->discount,
            'net_total' => (string) $billing->net_total,
            'advance_paid' => (string) $billing->advance_paid,
            'balance' => (string) $billing->balance,
            'frames' => $billing->frames->map(fn (BillingFrame $frame): array => [
                'name' => $frame->name,
                'price' => (string) $frame->price,
            ])->values()->all(),
            'lenses' => $billing->lenses->map(fn (BillingLens $lens): array => [
                'lens_type' => $lens->lens_type,
                'add' => $lens->add,
                'price' => (string) $lens->price,
                'is_linked' => (bool) $lens->is_linked,
                'linked_to_index' => $lens->linked_to_index,
                'right_sph' => $lens->right_sph,
                'right_cyl' => $lens->right_cyl,
                'right_axis' => $lens->right_axis,
                'right_va' => $lens->right_va,
                'left_sph' => $lens->left_sph,
                'left_cyl' => $lens->left_cyl,
                'left_axis' => $lens->left_axis,
                'left_va' => $lens->left_va,
            ])->values()->all(),
        ];
    }

    private function normalizeEyePrescription(array $eye): array
    {
        return [
            'sph' => trim((string) ($eye['sph'] ?? '')),
            'cyl' => trim((string) ($eye['cyl'] ?? '')),
            'axis' => trim((string) ($eye['axis'] ?? '')),
            'va' => trim((string) ($eye['va'] ?? '')),
        ];
    }

    private function normalizeLensAdd(mixed $add): ?string
    {
        $value = trim((string) ($add ?? ''));

        return $value !== '' ? $value : null;
    }

    private function resolveLinkedPrescription(array $rightEye, array $leftEye): array
    {
        if ($this->hasAnyEyePrescriptionValue($rightEye)) {
            return $rightEye;
        }

        return $leftEye;
    }

    private function hasAnyEyePrescriptionValue(array $eye): bool
    {
        return collect($eye)->contains(fn (string $value): bool => $value !== '');
    }

    private function prescriptionsMatch(array $rightEye, array $leftEye): bool
    {
        if (! $this->hasAnyEyePrescriptionValue($rightEye) && ! $this->hasAnyEyePrescriptionValue($leftEye)) {
            return false;
        }

        return $rightEye === $leftEye;
    }

    private function normalizeLinkedLensIndex(mixed $linkedLensIndex): ?int
    {
        if ($linkedLensIndex === null || $linkedLensIndex === '') {
            return null;
        }

        $value = (int) $linkedLensIndex;

        return $value > 0 ? $value : null;
    }

    private function generateOrderNumber(int $billingId): string
    {
        return 'OP/MEC/OR/'.str_pad((string) $billingId, 4, '0', STR_PAD_LEFT);
    }

    private function normalizeFrames(Collection $frames, float $dueCarryAmount): Collection
    {
        $normalizedFrames = $frames
            ->reject(fn (array $frame): bool => $this->isPreviousDueFrameName((string) ($frame['name'] ?? '')))
            ->map(fn (array $frame): array => [
                'name' => trim((string) ($frame['name'] ?? '')),
                'price' => $frame['price'],
            ])
            ->values();

        if ($dueCarryAmount > 0) {
            $normalizedFrames->push([
                'name' => self::PREVIOUS_DUE_FRAME_NAME,
                'price' => number_format($dueCarryAmount, 2, '.', ''),
            ]);
        }

        return $normalizedFrames->values();
    }

    private function getOutstandingDueBillings(string $mobileNumber, ?int $excludeBillingId = null): Collection
    {
        return Billing::query()
            ->select([
                'id',
                'order_number',
                'order_date',
                'delivery_date',
                'advance_paid',
                'balance',
            ])
            ->where('mobile_number', $mobileNumber)
            ->where('balance', '>', 0)
            ->when($excludeBillingId !== null, function ($query) use ($excludeBillingId) {
                $query->where('id', '!=', $excludeBillingId);
            })
            ->orderBy('order_date')
            ->orderBy('id')
            ->get();
    }

    private function transferOutstandingDue(string $mobileNumber, ?int $excludeBillingId = null): void
    {
        $this->getOutstandingDueBillings($mobileNumber, $excludeBillingId)
            ->each(function (Billing $dueBilling): void {
                $outstandingBalance = round((float) $dueBilling->balance, 2);

                if ($outstandingBalance <= 0) {
                    return;
                }

                $dueBilling->update([
                    'advance_paid' => round((float) $dueBilling->advance_paid + $outstandingBalance, 2),
                    'balance' => 0,
                ]);
            });
    }

    private function isPreviousDueFrameName(string $name): bool
    {
        return trim($name) === self::PREVIOUS_DUE_FRAME_NAME;
    }
}
