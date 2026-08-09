<?php
$m20 = \App\Models\Member::find('M0020');
$m50 = \App\Models\Member::find('M0050');
if ($m20 && $m50) {
    \App\Models\Result::where('member_id', 'M0050')->update(['member_id' => 'M0020']);
    $m20->lifetime_points += $m50->lifetime_points;
    $m20->email = $m50->email;
    $m20->user_id = $m50->user_id;
    $m20->name = $m50->name;
    $m20->save();
    $m50->delete();
    echo "SUCCESS\n";
} else {
    echo "FAILED: Member not found\n";
}
