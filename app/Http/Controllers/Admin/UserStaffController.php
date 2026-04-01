<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserStaffController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'name' => trim((string) $request->input('name', '')),
            'email' => trim((string) $request->input('email', '')),
            'role' => trim((string) $request->input('role', '')),
            'status' => trim((string) $request->input('status', '')),
        ];

        $users = User::query()
            ->select([
                'id',
                'name',
                'email',
                'role',
                'status',
                'created_at',
            ])
            ->when($filters['name'] !== '', function ($query) use ($filters) {
                $query->where('name', 'like', '%'.$filters['name'].'%');
            })
            ->when($filters['email'] !== '', function ($query) use ($filters) {
                $query->where('email', 'like', '%'.$filters['email'].'%');
            })
            ->when($filters['role'] !== '', function ($query) use ($filters) {
                $query->where('role', $filters['role']);
            })
            ->when($filters['status'] !== '', function ($query) use ($filters) {
                $query->where('status', $filters['status']);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $users->setCollection(
            $users->getCollection()->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => optional($user->created_at)->toISOString(),
            ])->values()
        );

        return Inertia::render('admin/UserStaff/Index', [
            'users' => $users,
            'filters' => $filters,
            'roleOptions' => $this->roleOptions(),
            'statusOptions' => $this->statusOptions(),
            'currentUserId' => $request->user()?->id,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('admin/UserStaff/CreateUserStaff', [
            'roleOptions' => $this->roleOptions(),
            'statusOptions' => $this->statusOptions(),
            'currentUserId' => $request->user()?->id,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateUserData($request);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'password' => $validated['password'],
        ]);

        return redirect()
            ->route('admin.user-staff.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(Request $request, User $user): Response
    {
        return Inertia::render('admin/UserStaff/EditUserStaff', [
            'user' => $this->mapUserForForm($user),
            'roleOptions' => $this->roleOptions(),
            'statusOptions' => $this->statusOptions(),
            'currentUserId' => $request->user()?->id,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $this->validateUserData($request, $user);
        $this->guardSelfAccess($request, $user, $validated);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            ...($validated['password'] !== '' ? ['password' => $validated['password']] : []),
        ]);

        return redirect()
            ->route('admin.user-staff.edit', $user)
            ->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()?->id === $user->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }

    private function validateUserData(Request $request, ?User $user = null): array
    {
        $passwordRules = $user
            ? ['nullable', 'string', 'min:8', 'confirmed']
            : ['required', 'string', 'min:8', 'confirmed'];

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user?->id),
            ],
            'role' => ['required', Rule::in($this->roleOptions())],
            'status' => ['required', Rule::in($this->statusOptions())],
            'password' => $passwordRules,
        ]);

        $validated['password'] = (string) ($validated['password'] ?? '');

        return $validated;
    }

    private function guardSelfAccess(Request $request, User $user, array $validated): void
    {
        if ($request->user()?->id !== $user->id) {
            return;
        }

        if (($validated['role'] ?? $user->role) !== 'admin') {
            throw ValidationException::withMessages([
                'role' => 'You cannot remove your own admin role.',
            ]);
        }

        if (($validated['status'] ?? $user->status) !== 'active') {
            throw ValidationException::withMessages([
                'status' => 'You cannot set your own account inactive.',
            ]);
        }
    }

    private function mapUserForForm(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role ?: 'staff',
            'status' => $user->status ?: 'active',
        ];
    }

    private function roleOptions(): array
    {
        return ['admin', 'staff'];
    }

    private function statusOptions(): array
    {
        return ['active', 'inactive'];
    }
}
