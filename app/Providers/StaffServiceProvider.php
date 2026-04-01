<?php
namespace App\Providers;

use App\Modules\Staff\Infrastructure\Eloquent\EloquentStaffRepository;
use App\Modules\Staff\Repositories\StaffRepositoryInterface;
use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\Vite;

class StaffServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            StaffRepositoryInterface::class,
            EloquentStaffRepository::class
        );
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
