<?php

namespace App\Http\Controllers\Admin\Session;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SystemLogsController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => trim((string) $request->input('search', '')),
            'ip_address' => trim((string) $request->input('ip_address', '')),
            'session_id' => trim((string) $request->input('session_id', '')),
        ];

        $sessions = $this->buildSessionQuery($filters)
            ->orderByDesc('s.last_activity')
            ->paginate(10)
            ->withQueryString();

        $currentSessionId = (string) $request->session()->getId();

        $sessions->setCollection(
            $sessions->getCollection()->map(function ($session) use ($currentSessionId): array {
                $lastActivity = (int) $session->last_activity;

                return [
                    'id' => (string) $session->id,
                    'user_id' => $session->user_id !== null ? (int) $session->user_id : null,
                    'user_name' => $session->user_name,
                    'user_email' => $session->user_email,
                    'user_role' => $session->user_role,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => $lastActivity,
                    'last_activity_at' => Carbon::createFromTimestamp(
                        $lastActivity,
                        config('app.timezone')
                    )->toIso8601String(),
                    'is_current' => (string) $session->id === $currentSessionId,
                ];
            })->values()
        );

        return Inertia::render('admin/SystemLogs/Index', [
            'sessions' => $sessions,
            'filters' => $filters,
            'summary' => $this->sessionSummary(),
        ]);
    }

    public function destroy(Request $request, string $sessionId): RedirectResponse
    {
        $currentSessionId = (string) $request->session()->getId();

        if ($sessionId === $currentSessionId) {
            return back()->with('error', 'The active session is protected.');
        }

        $deletedCount = DB::table('sessions')
            ->where('id', $sessionId)
            ->delete();

        if ($deletedCount === 0) {
            return back()->with('error', 'Session not found or already deleted.');
        }

        return back()->with('success', 'Session deleted successfully.');
    }

    public function destroySelected(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'session_ids' => ['required', 'array', 'min:1'],
            'session_ids.*' => ['string'],
        ]);

        $currentSessionId = (string) $request->session()->getId();
        $sessionIds = collect($validated['session_ids'])
            ->map(fn ($sessionId): string => (string) $sessionId)
            ->filter(fn (string $sessionId): bool => $sessionId !== $currentSessionId)
            ->unique()
            ->values()
            ->all();

        if ($sessionIds === []) {
            return back()->with('error', 'Select at least one session that is not your current session.');
        }

        $deletedCount = DB::table('sessions')
            ->whereIn('id', $sessionIds)
            ->delete();

        if ($deletedCount === 0) {
            return back()->with('error', 'The selected sessions could not be deleted.');
        }

        return back()->with(
            'success',
            "{$deletedCount} ".Str::plural('session', $deletedCount)." deleted successfully."
        );
    }

    public function destroyAll(Request $request): RedirectResponse
    {
        $currentSessionId = (string) $request->session()->getId();

        $deletedCount = DB::table('sessions')
            ->where('id', '!=', $currentSessionId)
            ->delete();

        if ($deletedCount === 0) {
            return back()->with('success', 'No other sessions were found.');
        }

        return back()->with(
            'success',
            "{$deletedCount} ".Str::plural('session', $deletedCount)." deleted successfully."
        );
    }

    private function buildSessionQuery(array $filters)
    {
        return DB::table('sessions as s')
            ->leftJoin('users as u', 'u.id', '=', 's.user_id')
            ->select([
                's.id',
                's.user_id',
                'u.name as user_name',
                'u.email as user_email',
                'u.role as user_role',
                's.ip_address',
                's.user_agent',
                's.last_activity',
            ])
            ->when($filters['search'] !== '', function ($query) use ($filters) {
                $search = $filters['search'];

                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery
                        ->where('u.name', 'like', '%'.$search.'%')
                        ->orWhere('u.email', 'like', '%'.$search.'%')
                        ->orWhere('s.user_agent', 'like', '%'.$search.'%');
                });
            })
            ->when($filters['session_id'] !== '', function ($query) use ($filters) {
                $query->where('s.id', 'like', '%'.$filters['session_id'].'%');
            })
            ->when($filters['ip_address'] !== '', function ($query) use ($filters) {
                $query->where('s.ip_address', 'like', '%'.$filters['ip_address'].'%');
            });
    }

    private function sessionSummary(): array
    {
        $totalSessions = DB::table('sessions')->count();
        $authenticatedSessions = DB::table('sessions')->whereNotNull('user_id')->count();

        return [
            'total_sessions' => $totalSessions,
            'authenticated_sessions' => $authenticatedSessions,
            'guest_sessions' => max($totalSessions - $authenticatedSessions, 0),
        ];
    }
}
