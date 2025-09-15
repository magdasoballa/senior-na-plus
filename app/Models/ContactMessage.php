<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name','email','phone','message','consent1','consent2','consent3','ip','user_agent'
    ];

    protected $casts = [
        'consent1' => 'bool',
        'consent2' => 'bool',
        'consent3' => 'bool',
    ];
}
