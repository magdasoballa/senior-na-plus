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

    public function duties(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Duty::class, 'offer_duty', 'offer_id', 'duty_id');
    }

    public function requirements(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\OfferRequirement::class, 'offer_requirement', 'offer_id', 'offer_requirement_id');
    }

    public function perks(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\OfferPerk::class, 'offer_perk', 'offer_id', 'offer_perk_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
