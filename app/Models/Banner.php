<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = ['name', 'image', 'visible', 'position', 'starts_at', 'ends_at', 'link', 'scope'];

    protected $casts = ['visible' => 'bool', 'starts_at' => 'datetime', 'ends_at' => 'datetime'];


    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}
