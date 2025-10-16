<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'language_level',
        'additional_language',
        'learned_profession',
        'current_profession',
        'experience',
        'first_aid_course',
        'medical_caregiver_course',
        'care_experience',
        'housekeeping_experience',
        'cooking_experience',
        'driving_license',
        'smoker',
        'salary_expectations',
        'references_path',
        'offer_id',
        'offer_title',
        'consent1',
        'consent2',
        'consent3',
        'status',
        'is_read',
    ];

    protected $casts = [
        'first_aid_course' => 'boolean',
        'medical_caregiver_course' => 'boolean',
        'care_experience' => 'boolean',
        'housekeeping_experience' => 'boolean',
        'cooking_experience' => 'boolean',
        'driving_license' => 'boolean',
        'smoker' => 'boolean',
        'consent1' => 'boolean',
        'consent2' => 'boolean',
        'consent3' => 'boolean',
    ];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }
}
