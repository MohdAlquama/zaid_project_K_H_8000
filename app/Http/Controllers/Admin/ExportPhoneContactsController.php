<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\InvoiceControl;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use JeroenDesloovere\VCard\VCard;
use RuntimeException;
use ZipArchive;

class ExportPhoneContactsController extends Controller
{
    public function index(Request $request)
    {
        $settings = InvoiceControl::first();
        $defaultPhoneLength = max(1, (int) ($settings?->phone ?? 10));
        $phoneLength = max(1, min(15, $request->integer('phone_length', $defaultPhoneLength)));

        $query = Billing::query()
            ->whereNotNull('mobile_number')
            ->where('mobile_number', '!=', '');

        if (! $request->boolean('include_na')) {
            $query->whereRaw('LOWER(TRIM(mobile_number)) != ?', ['n/a']);
        }

        if ($request->boolean('filter_length')) {
            $query->whereRaw('mobile_number REGEXP ?', ['^[0-9]{'.$phoneLength.'}$']);
        }

        // Apply Date Filters
        if ($request->filled('start_date')) {
            $query->whereDate('order_date', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('order_date', '<=', $request->end_date);
        }

        // Apply Unique Mobile Numbers filter
        if ($request->boolean('unique_numbers')) {
            // Safe grouping to avoid SQL strict mode errors
            $query->whereIn('id', function ($q) {
                $q->selectRaw('MAX(id)')
                  ->from('billings')
                  ->whereNotNull('mobile_number')
                  ->groupBy('mobile_number');
            });
        }

        $customers = $query->select('id', 'customer_name', 'mobile_number', 'order_number', 'order_date', 'delivery_date')
            ->orderBy('id', 'desc')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/ExportPhoneContacts/ExportPhoneContacts', [
            'customers' => $customers,
            'filters' => [
                ...$request->only([
                    'start_date',
                    'end_date',
                    'unique_numbers',
                    'include_na',
                    'filter_length',
                ]),
                'phone_length' => $phoneLength,
            ],
            'defaultPhoneLength' => $defaultPhoneLength,
        ]);
    }

    public function download(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|max:1000',
            'ids.*' => 'integer|exists:billings,id',
            'name_template' => 'required|string|max:255',
            'file_name' => 'nullable|string|max:100',
        ]);

        $customers = Billing::query()
            ->whereIn('id', $request->ids)
            ->whereRaw("mobile_number REGEXP '^[0-9]+$'")
            ->get();
        abort_if($customers->isEmpty(), 422, 'No selected rows contain a valid numeric phone number.');

        $zipPath = tempnam(sys_get_temp_dir(), 'phone_contacts_');

        if ($zipPath === false) {
            throw new RuntimeException('Unable to create the temporary export file.');
        }

        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            @unlink($zipPath);
            throw new RuntimeException('Unable to create the contacts ZIP archive.');
        }

        foreach ($customers as $customer) {
            $vcard = new VCard();
            $contactName = $this->contactName($customer, $request->string('name_template')->toString());
            $vcard->addName($contactName);
            $vcard->addPhoneNumber($customer->mobile_number, 'PREF;WORK');
            $vcard->addCompany('Bhairahawa Eye Care');

            $contactFileName = Str::of($contactName)
                ->replaceMatches('/[^A-Za-z0-9 _-]/', '')
                ->trim()
                ->replace(' ', '_')
                ->limit(80, '')
                ->toString() ?: 'Contact';

            $zip->addFromString($contactFileName.'_'.$customer->id.'.vcf', $vcard->getOutput());
        }

        $zip->close();

        $fileName = Str::of($request->input('file_name', 'Exported Contacts'))
            ->replaceMatches('/[^A-Za-z0-9 _-]/', '')
            ->trim()
            ->replace(' ', '_')
            ->limit(80, '')
            ->toString() ?: 'Exported_Contacts';

        return response()
            ->download($zipPath, $fileName.'.zip', ['Content-Type' => 'application/zip'])
            ->deleteFileAfterSend(true);
    }

    private function contactName(Billing $customer, string $template): string
    {
        $values = [
            '{name}' => trim((string) $customer->customer_name),
            '{number}' => trim((string) $customer->mobile_number),
            '{order_number}' => trim((string) $customer->order_number),
            '{order_date}' => (string) ($customer->order_date ?? ''),
            '{delivery_date}' => (string) ($customer->delivery_date ?? ''),
        ];

        $name = trim(strtr($template, $values));

        return $name !== '' ? $name : ($values['{name}'] ?: $values['{number}']);
    }
}
