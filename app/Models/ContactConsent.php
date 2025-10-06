<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactConsent extends Model
{
    protected $fillable = [
        'name','content_pl','content_de','visible_pl','visible_de',
    ];
    protected $casts = [
        'visible_pl'=>'boolean',
        'visible_de'=>'boolean',
    ];
}
