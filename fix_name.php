<?php
$m20 = \App\Models\Member::find('M0020');
if ($m20) {
    $m20->name = 'SEKAR W';
    $m20->save();

    \App\Models\User::where('id', $m20->user_id)->update(['name' => 'SEKAR W']);
    \App\Models\Result::where('member_id', 'M0020')->update(['name' => 'SEKAR W']);
    echo "SUCCESS\n";
}
