<?php

use App\Http\Controllers\Staff\UpdateBilling\UpdateBillingController;
use App\Http\Controllers\Staff\FindBilling\FindBillingController;
use App\Http\Controllers\Staff\StaffBilling\StaffBillingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:staff'])
    ->prefix('staff')
    ->name('staff.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('staff/Dashboard');
        })->name('dashboard');

        Route::get('/create-billing', [StaffBillingController::class, 'index'])->name('billing.create');
        Route::post('/create-billing', [StaffBillingController::class, 'store'])->name('billing.store');
        Route::get('/view-billing', [StaffBillingController::class, 'view'])->name('billing.view');
        Route::get('/billing/due-summary', [StaffBillingController::class, 'dueSummary'])->name('billing.due-summary');
        Route::get('/update-billing/{billing}', [UpdateBillingController::class, 'index'])->name('billing.update-page');
        Route::get('/billing/{billing}/edit', [StaffBillingController::class, 'edit'])->name('billing.edit');
        Route::get('/billing/{billing}/invoice', [StaffBillingController::class, 'invoice'])->name('billing.invoice');
        Route::post('/billing/{billing}/collect-payment', [StaffBillingController::class, 'collectPayment'])->name('billing.collect-payment');
        Route::put('/billing/{billing}', [StaffBillingController::class, 'update'])->name('billing.update');
        Route::delete('/billing/{billing}', [StaffBillingController::class, 'destroy'])->name('billing.destroy');

        Route::get('/find-billing', [FindBillingController::class, 'index'])->name('find-billing');

        Route::get('update-billing',[UpdateBillingController::class, 'index'])->name('update-billing');
    });
