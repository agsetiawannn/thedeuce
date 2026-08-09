<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $table = 'members';
    protected $primaryKey = 'member_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // The schema doesn't have timestamps

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function addPoints($points, $context = 'points_checkin', $event_id = null)
    {
        $newPoints = $this->lifetime_points + $points;
        $oldTier = $this->status_tier;
        
        $newTier = 'DIAMOND';
        if ($newPoints >= 4500) {
            $newTier = 'ACE';
        } elseif ($newPoints >= 2000) {
            $newTier = 'SPADE';
        } elseif ($newPoints >= 1000) {
            $newTier = 'HEART';
        } elseif ($newPoints >= 350) {
            $newTier = 'CLUB';
        }

        $this->update([
            'lifetime_points' => $newPoints,
            'status_tier' => $newTier,
        ]);

        // Send point notification
        if ($this->user) {
            $title = $context === 'points_checkin' ? 'Check-in Bonus' : 'Session Result';
            $message = "You received +{$points} CP.";
            $this->user->notify(new \App\Notifications\InAppNotification($title, $message, $context, ['points' => $points, 'event_id' => $event_id]));
            
            // Check for tier up
            if ($oldTier !== $newTier && $this->getTierValue($newTier) > $this->getTierValue($oldTier)) {
                $this->user->notify(new \App\Notifications\InAppNotification(
                    'New Tier Unlocked',
                    "Congratulations! You've reached {$newTier} TIER.",
                    'tier_up',
                    ['new_tier' => $newTier]
                ));
            }
        }
    }

    private function getTierValue($tier)
    {
        $tiers = ['DIAMOND' => 1, 'CLUB' => 2, 'HEART' => 3, 'SPADE' => 4, 'ACE' => 5];
        return $tiers[strtoupper($tier)] ?? 0;
    }

    public function results()
    {
        return $this->hasMany(Result::class, 'member_id', 'member_id');
    }

    public function updateStats()
    {
        $totalWins = $this->results()->sum('wins') ?? 0;
        $totalLosses = $this->results()->sum('losses') ?? 0;
        $totalMatches = $totalWins + $totalLosses;
        $winRate = $totalMatches > 0 ? round(($totalWins / $totalMatches) * 100) : 0;

        $this->update([
            'total_wins' => $totalWins,
            'total_losses' => $totalLosses,
            'win_rate' => $winRate,
        ]);
    }
}
