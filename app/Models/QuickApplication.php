<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuickApplication extends Model
{
    protected $fillable = [
        'name','email','phone',
        'consent1','consent2','consent3',
        'offer_id','offer_title','url','ip','user_agent',
    ];

    protected $casts = [
        'consent1' => 'bool',
        'consent2' => 'bool',
        'consent3' => 'bool',
    ];
}
