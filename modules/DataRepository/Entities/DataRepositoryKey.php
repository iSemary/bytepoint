<?php

namespace Modules\DataRepository\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataRepositoryKey extends Model {
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['data_repository_id', 'data_repository_key', 'data_type_id'];
}
