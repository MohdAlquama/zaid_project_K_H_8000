<?php

namespace App\Providers;

use App\Modules\Admission\Infrastructure\Persistence\EloquentRepositories\EloquentAcademicYearRepository;
use App\Modules\Admission\Infrastructure\Persistence\EloquentRepositories\EloquentStudentRepository;
use App\Modules\Admission\Repositories\AcademicYearRepositoryInterface;
use App\Modules\Admission\Repositories\StudentRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

class AdmissionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
           $this->app->bind(
            AcademicYearRepositoryInterface::class,
            EloquentAcademicYearRepository::class
        );
           // Student Repository Binding
        $this->app->bind(
            StudentRepositoryInterface::class,
            EloquentStudentRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
         Vite::prefetch(concurrency: 3);
    }
}
