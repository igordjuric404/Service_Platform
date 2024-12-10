<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Customer extends User
{
    protected static function booted()
    {
        static::addGlobalScope('customer', function (Builder $builder) {
            $builder->where('type', 'customer');
        });
    }

    public function jobs()
    {
        return $this->hasMany(Job::class, 'customer_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'customer_id');
    }
}
