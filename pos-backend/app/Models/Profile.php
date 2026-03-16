<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;


class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'image',
        'type'
    ];
    //relationship in user one-to-one
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}