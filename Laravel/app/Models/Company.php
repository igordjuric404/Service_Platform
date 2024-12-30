<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Company extends Provider
{
    protected static function booted()
    {
        static::addGlobalScope('company', function (Builder $builder) {
            $builder->where('type', 'company');
        });
    }
}
