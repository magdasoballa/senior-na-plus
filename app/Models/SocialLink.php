<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $fillable = [
        'name','url','icon','visible_pl','visible_de','position',
    ];

    protected $casts = [
        'visible_pl' => 'boolean',
        'visible_de' => 'boolean',
    ];

    public function scopeOrdered($q)
    {
        return $q->orderBy('position')->orderBy('id');
    }
}
