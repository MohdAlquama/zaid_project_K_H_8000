<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Help\HelpController;
use App\Http\Controllers\Admin\FinancialReportController;
use App\Http\Controllers\Admin\Billing\BillingController;
use App\Http\Controllers\Admin\InvoiceControlController;
use App\Http\Controllers\Admin\Session\SystemLogsController;
use App\Http\Controllers\Admin\UserStaffController;
use App\Http\Controllers\Admin\ExportPhoneContactsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Pest\Support\Exporter;

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/reports', [FinancialReportController::class, 'index'])->name('reports.index');
        Route::get('/help', [HelpController::class, 'index'])->name('help');
        Route::get('/b', function () {
            return Inertia::render('admin/OpticalBill');
        })->name('optical-bill');
        Route::get('/system.logs', [SystemLogsController::class, 'index'])->name('system-logs.index');
        Route::post('/system.logs/delete-selected', [SystemLogsController::class, 'destroySelected'])->name('system-logs.destroy-selected');
        Route::delete('/system.logs', [SystemLogsController::class, 'destroyAll'])->name('system-logs.destroy-all');
        Route::delete('/system.logs/{sessionId}', [SystemLogsController::class, 'destroy'])->name('system-logs.destroy');

        
        Route::get('/create__/billing', [BillingController::class, 'index'])->name('create-billing');
        Route::post('/create__/billing', [BillingController::class, 'store'])->name('billing.store');
        Route::get('/view__/billing', [BillingController::class, 'view'])->name('billing.view');
        Route::get('/billing/due-summary', [BillingController::class, 'dueSummary'])->name('billing.due-summary');
        Route::get('/billing/{billing}/edit', [BillingController::class, 'edit'])->name('billing.edit');
        Route::get('/billing/{billing}/invoice', [BillingController::class, 'invoice'])->name('billing.invoice');
        Route::post('/billing/{billing}/collect-payment', [BillingController::class, 'collectPayment'])->name('billing.collect-payment');
        Route::put('/billing/{billing}', [BillingController::class, 'update'])->name('billing.update');
        Route::delete('/billing/{billing}', [BillingController::class, 'destroy'])->name('billing.destroy');

        
        Route::get('/create__/user/staff', [UserStaffController::class, 'index'])->name('user-staff.index');
        Route::get('/user/staff/create', [UserStaffController::class, 'create'])->name('user-staff.create');
        Route::post('/user/staff', [UserStaffController::class, 'store'])->name('user-staff.store');
        Route::get('/user/staff/{user}/edit', [UserStaffController::class, 'edit'])->name('user-staff.edit');
        Route::put('/user/staff/{user}', [UserStaffController::class, 'update'])->name('user-staff.update');
        Route::delete('/user/staff/{user}', [UserStaffController::class, 'destroy'])->name('user-staff.destroy');
        // Route::get('/invoice-control_customizable', [InvoiceControlController::class, 'index'])->name('invoice-control.index');
        Route::get('/invoice-control', [InvoiceControlController::class, 'index'])->name('invoice-control.index');
        Route::post('/invoice-control', [InvoiceControlController::class, 'store'])->name('invoice-control.store');

        //ExportPhoneContacts
    //    Route::get('/export-phone-contacts', [ExportPhoneContactsController::class, 'index'])->name('export-phone-contacts.index');
        Route::get('/export-contacts', [ExportPhoneContactsController::class, 'index'])->name('export.contacts.index');
        Route::post('/export-contacts/download', [ExportPhoneContactsController::class, 'download'])->name('export.contacts.download');
    }); 
