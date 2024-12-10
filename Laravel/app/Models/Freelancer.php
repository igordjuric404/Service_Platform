<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Freelancer extends Provider
{
    protected static function booted()
    {
        static::addGlobalScope('freelancer', function (Builder $builder) {
            $builder->where('type', 'freelancer');
        });
    }
}
