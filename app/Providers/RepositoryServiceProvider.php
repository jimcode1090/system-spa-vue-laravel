<?php

namespace App\Providers;

use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Repositories\Contracts\FileRepositoryInterface;
use App\Repositories\Contracts\OrderRespositoryInterface;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\EloquentCustomerRepositoryImpl;
use App\Repositories\Eloquent\EloquentFileRepositoryImpl;
use App\Repositories\Eloquent\EloquentOrderRepositoryImpl;
use App\Repositories\Eloquent\EloquentPermissionRepositoryImpl;
use App\Repositories\Eloquent\EloquentProductRepositoryImpl;
use App\Repositories\Eloquent\EloquentRoleRepositoryImpl;
use App\Repositories\Eloquent\EloquentUserRepositoryImpl;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind repository interfaces to their implementations
        $this->app->bind(CustomerRepositoryInterface::class, EloquentCustomerRepositoryImpl::class);
        $this->app->bind(FileRepositoryInterface::class, EloquentFileRepositoryImpl::class);
        $this->app->bind(OrderRespositoryInterface::class, EloquentOrderRepositoryImpl::class);
        $this->app->bind(PermissionRepositoryInterface::class, EloquentPermissionRepositoryImpl::class);
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepositoryImpl::class);
        $this->app->bind(RoleRepositoryInterface::class, EloquentRoleRepositoryImpl::class);
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepositoryImpl::class);


    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
