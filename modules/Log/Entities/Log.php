<?php

namespace Modules\Log\Entities;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Log extends Model {
    use SoftDeletes;

    protected $connection = 'logs';
    protected $collection = 'logs';


    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['service', 'type', 'title', 'body', 'internal'];

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];
}
