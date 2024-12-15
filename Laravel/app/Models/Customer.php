<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Customer extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('customer', function (Builder $builder) {
            $builder->where('type', 'customer');
        });
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'customer_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'customer_id');
    }
}
