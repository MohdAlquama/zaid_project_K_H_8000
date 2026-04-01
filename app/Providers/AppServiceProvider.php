<?php

namespace App\Providers;

use App\Modules\Fee\Repositories\FeeHeadRepository;
use App\Modules\Communication\Infrastructure\Repositories\CommunicationRepository;
use App\Modules\Communication\Infrastructure\Repositories\CommunicationRepositoryInterface;
use App\Modules\Fee\Infrastructure\Repositories\FeeManagementRepository;
use App\Modules\Fee\Infrastructure\Repositories\FeeManagementRepositoryInterface;
use App\Modules\Fee\Infrastructure\Repositories\FeeRepository;
use App\Modules\Fee\Infrastructure\Repositories\FeeRepositoryInterface;
use App\Modules\Letter\Infrastructure\Repositories\LetterRepository;
use App\Modules\Letter\Infrastructure\Repositories\LetterRepositoryInterface;
use App\Modules\Leave\Domain\Models\LeaveRequest;
use App\Modules\Leave\Infrastructure\Repositories\LeaveRepository;
use App\Modules\Leave\Infrastructure\Repositories\LeaveRepositoryInterface;
use App\Modules\Student\Domain\Models\Student;
use App\Modules\Student\Infrastructure\Repositories\StudentLetterRepository;
use App\Modules\Student\Infrastructure\Repositories\StudentLetterRepositoryInterface;
use App\Modules\Student\Infrastructure\Repositories\StudentRepository;
use App\Modules\Student\Infrastructure\Repositories\StudentRepositoryInterface;
use App\Policies\LeaveRequestPolicy;
use App\Policies\StudentProfilePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repository (optional but clean)
        $this->app->bind(FeeHeadRepository::class, function ($app) {
            return new FeeHeadRepository();
        });

        $this->app->bind(FeeRepositoryInterface::class, FeeRepository::class);
        $this->app->bind(FeeManagementRepositoryInterface::class, FeeManagementRepository::class);
        $this->app->bind(CommunicationRepositoryInterface::class, CommunicationRepository::class);
        $this->app->bind(LetterRepositoryInterface::class, LetterRepository::class);
        $this->app->bind(LeaveRepositoryInterface::class, LeaveRepository::class);
        $this->app->bind(StudentRepositoryInterface::class, StudentRepository::class);
        $this->app->bind(StudentLetterRepositoryInterface::class, StudentLetterRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Gate::policy(Student::class, StudentProfilePolicy::class);
        Gate::policy(LeaveRequest::class, LeaveRequestPolicy::class);
    }
}
