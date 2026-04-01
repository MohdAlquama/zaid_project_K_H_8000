<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    /**
     * Show the login page (or redirect if already logged in)
     */
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole(Auth::user());
        }

        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login attempt
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials + ['status' => 'active'])) {
            return back()
                ->with('error', 'Login Failed')
                ->withErrors(['email' => 'These credentials do not match our records or the account is inactive.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        $user = Auth::user();

        // Optional: extra safety (in case attempt() didn't filter status)
        if (!$user->isActive()) {
            Auth::logout();
            return back()
                ->with('error', 'Login Failed')
                ->withErrors(['email' => 'Your account is inactive. Please contact support.']);
        }
        
        return $this->redirectBasedOnRole($user)->with('success', 'Login Success');
    }

    /**
     * Log the user out
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Redirect user based on their role
     */
    protected function redirectBasedOnRole($user): RedirectResponse
    {
        return match (true) {
            $user->isAdmin()      => redirect()->route('admin.dashboard'),
            $user->isStaff()      => redirect()->route('staff.dashboard'),
            default               => redirect('/'),
        };
    }
}
