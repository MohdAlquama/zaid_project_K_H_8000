<?php

namespace App\Http\Controllers\Admin\Help;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HelpController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Help/Index');
    }
}
