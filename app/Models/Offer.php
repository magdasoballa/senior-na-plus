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
        'duties',          // Array
        'requirements',    // Array
        'benefits',        // Array
        'country',
        'city',
        'postal_code',
        'start_date',
        'duration',
        'language',
        'wage',
        'bonus',
        'hero_image',
        'care_recipient_gender',
        'mobility',
        'lives_alone',
        'experience_id',
        'experiences',
        'care_target',
    ];

    protected $casts = [
        'duties' => 'array',          // Cast to array
        'requirements' => 'array',    // Cast to array
        'benefits' => 'array',        // Cast to array
        'lives_alone' => 'boolean',
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function experience()
    {
        return $this->belongsTo(Experience::class);
    }

    // USUŃ relacje many-to-many dla duties, requirements, perks
    // public function duties()
    // {
    //     return $this->belongsToMany(Duty::class, 'offer_duty', 'offer_id', 'duty_id');
    // }

    // public function requirements()
    // {
    //     return $this->belongsToMany(OfferRequirement::class, 'offer_requirement', 'offer_id', 'offer_requirement_id');
    // }

    // public function perks()
    // {
    //     return $this->belongsToMany(OfferPerk::class, 'offer_perk', 'offer_id', 'offer_perk_id');
    // }
}
