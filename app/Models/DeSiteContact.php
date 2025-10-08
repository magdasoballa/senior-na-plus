<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeSiteContact extends Model
{
    protected $table = 'de_site_contacts'; // kontakty strona DE
    protected $guarded = [];
    protected $casts = ['is_read' => 'boolean', 'created_at' => 'datetime', 'updated_at' => 'datetime'];
}
