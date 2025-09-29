<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfferRequirement extends Model
{
    protected $fillable = ['name','is_visible','position'];
    protected $casts = ['is_visible'=>'boolean'];
}
