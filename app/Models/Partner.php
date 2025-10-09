<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Partner extends Model
{
protected $fillable = [
'link', 'image_path', 'is_visible', 'position',
];

protected $casts = [
'is_visible' => 'bool',
];

// prosty scope do szukania
public function scopeSearch(Builder $q, ?string $term): Builder
{
if (!$term) return $q;
$term = trim($term);
return $q->where('link', 'like', "%{$term}%");
}

// url do obrazka
public function getImageUrlAttribute(): ?string
{
return $this->image_path ? Storage::url($this->image_path) : null;
}
}
