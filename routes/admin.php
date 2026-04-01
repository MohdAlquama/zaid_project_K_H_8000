<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FinancialReportController;
use App\Http\Controllers\Admin\Billing\BillingController;
use App\Http\Controllers\Admin\UserStaffController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/reports', [FinancialReportController::class, 'index'])->name('reports.index');
        Route::get('/b', function () {
            return Inertia::render('admin/OpticalBill');
        })->name('optical-bill');

        
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

    }); 
