<?php

namespace Modules\Template\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Template extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'landlord';

    protected $fillable = ['title', 'slug', 'type', 'description', 'icon', 'is_cloud'];
}
