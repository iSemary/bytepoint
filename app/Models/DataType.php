<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataType extends Model {
    use HasFactory, SoftDeletes;
    protected $connection = 'landlord';
     
    protected $fillable = ['title'];
}
