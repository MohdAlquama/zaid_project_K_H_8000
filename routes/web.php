<?php

use App\Http\Controllers\ProfileController;
use App\Modules\Communication\Presentation\Controllers\StudentPaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

use Inertia\Inertia;



Route::get('/', [LoginController::class, 'showLogin']);
Route::post('/', [LoginController::class, 'login'])->name('login');

Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/oo', fn() => Inertia::render('invoice/OpticalInvoice'))->name('optical.invoice');

require __DIR__.'/admin.php';
require __DIR__.'/staff.php';

