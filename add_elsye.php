<?php
$lastMember = \Illuminate\Support\Facades\DB::table('members')->orderBy('member_id', 'desc')->first();
$nextId = 'M0001';
if ($lastMember && preg_match('/^M(\d+)$/', $lastMember->member_id, $matches)) {
    $nextId = 'M' . str_pad((int)$matches[1] + 1, 4, '0', STR_PAD_LEFT);
}

// 1. Create Member
\App\Models\Member::insert([
    'member_id' => $nextId,
    'name' => 'Elsye Kanalomi',
    'email' => 'elsyekanalomi1998@gmail.com',
    'join_date' => '2026-07-16',
    'status_tier' => 'UNRANKED',
    'lifetime_points' => 16,
]);

// 2. Create Result
\App\Models\Result::insert([
    'event_id' => 'E0032',
    'member_id' => $nextId,
    'result_date' => '2026-07-16',
    'name' => 'Elsye Kanalomi',
    'finish' => 5,
    'event_points' => 10,
    'placement_bonus' => 6,
    'attendance' => 6
]);

echo "SUCCESS: Added Member $nextId and Result for Event E0032\n";
