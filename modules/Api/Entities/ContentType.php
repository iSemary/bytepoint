<?php

namespace Modules\Api\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Api\Database\factories\ContentTypeFactory;

class ContentType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title'];
    
}
