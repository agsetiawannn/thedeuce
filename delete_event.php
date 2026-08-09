<?php
$event = \App\Models\Event::where('event_id', 'E0044')->first();
if ($event) {
    $results = \App\Models\Result::where('event_id', 'E0044')->get();
    foreach ($results as $res) {
        $member = \App\Models\Member::find($res->member_id);
        if ($member) {
            $totalDeducted = $res->event_points + $res->placement_bonus;
            $member->lifetime_points = max(0, $member->lifetime_points - $totalDeducted);
            
            // Re-calculate tier
            $newPoints = $member->lifetime_points;
            $newTier = 'CLUB';
            if ($newPoints >= 4500) {
                $newTier = 'ACE';
            } elseif ($newPoints >= 2000) {
                $newTier = 'SPADE';
            } elseif ($newPoints >= 1000) {
                $newTier = 'HEART';
            } elseif ($newPoints >= 350) {
                $newTier = 'DIAMOND';
            }
            $member->status_tier = $newTier;
            $member->save();
        }
        $res->delete();
    }
    $event->delete();
    echo 'Deleted successfully';
} else {
    echo 'Event not found';
}
