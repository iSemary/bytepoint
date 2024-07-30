<?php

namespace Modules\GPT\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prompt extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'landlord';

    const DATA_REPOSITORY_TYPE = 1;
    const API_TYPE = 2;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['title', 'type', 'body'];
}
