<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Provider extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('provider', function (Builder $builder) {
            $builder->whereIn('type', ['provider', 'freelancer', 'company']);
        });
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'provider_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'provider_id');
    }

    public function appointments()
    {
        return $this->hasManyThrough(Appointment::class, Service::class, 'provider_id', 'service_id');
    }
  }
