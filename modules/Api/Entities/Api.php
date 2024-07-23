<?php

namespace Modules\Api\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Api extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'description',
        'type',
        'service', // app/Constants/ApiServices.php
        'data_repository_id',
        'end_point',
        'method_id',
        'body_type_id',
        'is_authenticated'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty();
    }
}
