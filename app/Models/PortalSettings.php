<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortalSettings extends Model
{
    protected $table = 'portal_settings';
    protected $fillable = ['phone_pl','phone_de','address_pl','address_de','email_pl','email_de'];
}
