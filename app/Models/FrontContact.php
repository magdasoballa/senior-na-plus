<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrontContact extends Model
{
    protected $fillable = [
        'full_name','email','phone','language_level','consents','is_read',
    ];

    protected $casts = [
        'consents' => 'array',
        'is_read'  => 'boolean',
        'created_at' => 'datetime',
    ];
}
