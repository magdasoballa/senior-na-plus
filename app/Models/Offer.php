<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function duties()
    {
        return $this->belongsToMany(Duty::class, 'offer_duty', 'offer_id', 'duty_id');
    }

    public function requirements()
    {
        return $this->belongsToMany(OfferRequirement::class, 'offer_requirement', 'offer_id', 'offer_requirement_id');
    }

    public function perks()
    {
        return $this->belongsToMany(OfferPerk::class, 'offer_perk', 'offer_id', 'offer_perk_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class);
    }

    public function recruitmentRequirements()
    {

        return $this->belongsToMany(RecruitmentRequirement::class)
            ->withTimestamps();
    }
}
