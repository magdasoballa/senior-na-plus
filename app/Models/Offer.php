<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duties',
        'requirements',
        'benefits',
        'country',
        'city',
        'postal_code',
        'start_date',
        'duration',
        'language',
        'wage',
        'bonus',
        'hero_image'
    ];

    protected $casts = [
        'duties' => 'array',
        'requirements' => 'array',
        'benefits' => 'array',
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
