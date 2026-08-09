<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';
    protected $primaryKey = 'event_id';
    public $incrementing = false;
    protected $fillable = [
        'event_id',
        'event_name',
        'event_date',
        'event_time',
        'location',
        'status',
        'kuyy_link',
    ];
    protected $keyType = 'string';
    public $timestamps = false;

    protected $guarded = [];

    public function results()
    {
        return $this->hasMany(Result::class, 'event_id', 'event_id');
    }
}
