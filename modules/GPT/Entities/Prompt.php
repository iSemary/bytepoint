<?php

namespace Modules\GPT\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prompt extends Model
{
    protected $connection = 'landlord';
    
    use HasFactory, SoftDeletes;

    const DATA_REPOSITORY_TYPE = 1;

    const DATA_REPOSITORY_PROMPT = 'Act as a system that exclusively returns JSON data. 
    Provide JSON data based strictly on the columns specified by the user. 
    DO NOT include any codes, examples, or additional information. Only return JSON formatted data with the requested columns.';
    
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['title', 'type', 'body'];
}
