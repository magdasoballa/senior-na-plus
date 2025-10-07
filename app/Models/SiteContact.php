<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class SiteContact extends Model
{
    protected $table = 'site_contacts';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'consents',
        'is_read',
        'locale',
    ];

    protected $casts = [
        'consents'   => 'array',
        'is_read'    => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'is_read' => false,
        'locale'  => 'pl',
    ];

    // dla wygody – w kontrolerach/Front używamy czasem "full_name"
    protected $appends = ['full_name'];

    protected function fullName(): Attribute
    {
        return Attribute::get(fn () => $this->name);
    }

    /* --- pomocnicze scope'y (opcjonalnie) --- */

    public function scopeSearch($q, ?string $term)
    {
        if (!$term) return $q;

        return $q->where(function ($x) use ($term) {
            $x->where('name', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%")
                ->orWhere('subject', 'like', "%{$term}%")
                ->orWhere('message', 'like', "%{$term}%");
        });
    }

    public function scopeRead($q, ?string $flag) // 'yes' | 'no' | null
    {
        return match ($flag) {
            'yes' => $q->where('is_read', true),
            'no'  => $q->where('is_read', false),
            default => $q,
        };
    }
}
