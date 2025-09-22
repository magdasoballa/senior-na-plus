<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Page extends Model
{
    protected $fillable = [
        'name','slug','image_pl','image_de','visible_pl','visible_de','position', 'meta_title_pl','meta_title_de','meta_description_pl','meta_description_de',
        'meta_keywords_pl','meta_keywords_de','meta_copyright_pl','meta_copyright_de',
    ];

    protected $casts = [
        'visible_pl' => 'boolean',
        'visible_de' => 'boolean',
    ];

    // URL-e do podglądu miniatur w tabeli
    public function getImagePlUrlAttribute(): ?string
    {
        return $this->image_pl ? Storage::disk('public')->url($this->image_pl) : null;
    }
    public function getImageDeUrlAttribute(): ?string
    {
        return $this->image_de ? Storage::disk('public')->url($this->image_de) : null;
    }

    public function scopeOrdered($q)
    {
        return $q->orderBy('position')->orderBy('id');
    }
}
