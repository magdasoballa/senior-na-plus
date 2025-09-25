<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareTarget extends Model
{
    protected $fillable = [
        'name_pl','name_de','is_visible_pl','is_visible_de','position',
    ];

    protected $casts = [
        'is_visible_pl' => 'boolean',
        'is_visible_de' => 'boolean',
    ];

    // Na listach pokazujemy PL
    public function getNameAttribute(): string
    {
        return (string) ($this->name_pl ?? '');
    }
}
