<?php

namespace Modules\Api\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApiPurpose extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'landlord';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['title', 'type', 'description'];

}
