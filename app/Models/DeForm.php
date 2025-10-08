<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeForm extends Model
{
protected $table = 'de_forms';
protected $fillable = [
'name','zip','city','phone','start_at','timezone',
'people_on_site','mobility','gender','sent_at','consents','is_read',
];
    protected $casts = ['skills' => 'array', 'consents' => 'array', 'is_read' => 'boolean'];

}
