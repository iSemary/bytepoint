<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'iso', 'iso3', 'num_code', 'phone_code', 'continent_code', 'status'];
}
