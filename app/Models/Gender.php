<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Gender extends Model
{
    protected $fillable = [
        'name_pl','name_de','is_visible_pl','is_visible_de','position',
    ];

    protected $casts = [
        'is_visible_pl' => 'boolean',
        'is_visible_de' => 'boolean',
    ];

    public function getNameAttribute(): string
    {
        return (string) ($this->name_pl ?? '');
    }

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->code)) {
                $model->code = static::makeUniqueCode($model);
            }
        });
    }

    protected static function makeUniqueCode($model): string
    {
        $base = Str::slug($model->name_pl ?: $model->name_de ?: 'gender', '_');
        if ($base === '') $base = 'gender';
        $code = $base; $i = 2;
        while (static::where('code', $code)->exists()) {
            $code = "{$base}_{$i}";
            $i++;
        }
        return $code;
    }
}
