<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model // lub class SiteForm extends Model
{
    use HasFactory;

    protected $table = 'site_forms'; // ← ZMIANA

    protected $fillable = [
        'full_name','email','phone',
        'language_level','profession_trained','profession_performed',
        'experience','skills','salary','references',
        'consents','is_read','locale',
    ];

    protected $casts = [
        'skills'     => 'array',
        'consents'   => 'array',
        'is_read'    => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
