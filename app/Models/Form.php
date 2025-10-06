<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Form extends Model
{
    use HasFactory;
    protected $fillable = ['name','content_pl','content_de','visible_pl','visible_de'];
    protected $casts = ['visible_pl'=>'boolean','visible_de'=>'boolean'];
}
