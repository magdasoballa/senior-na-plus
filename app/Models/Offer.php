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
        'hero_image',
        'care_recipient_gender','mobility','lives_alone',

    ];

    protected $casts = [
        'duties' => 'array',
        'requirements' => 'array',
        'benefits' => 'array',
        'lives_alone' => 'boolean',
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
