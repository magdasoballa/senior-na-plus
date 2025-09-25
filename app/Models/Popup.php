<?php
namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;


class Popup extends Model
{
    protected $fillable = ['name','link','image_path','is_visible'];


    protected $casts = [
        'is_visible' => 'boolean',
    ];


    protected $appends = ['image_url'];


    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/'.$this->image_path) : null;
    }


    public function deleteImage(): void
    {
        if ($this->image_path && Storage::disk('public')->exists($this->image_path)) {
            Storage::disk('public')->delete($this->image_path);
        }
        $this->image_path = null;
    }
}
