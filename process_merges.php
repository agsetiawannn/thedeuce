<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

function calculateWinRate($wins, $losses) {
    $total = $wins + $losses;
    return $total > 0 ? round(($wins / $total) * 100) : 0;
}

try {
    DB::beginTransaction();

    echo "Starting operations...\n";

    $actions = [
        ['type' => 'merge', 'old' => 'M0007', 'new' => 'M0115'],
        ['type' => 'delete', 'id' => 'M0008'],
        ['type' => 'merge', 'old' => 'M0045', 'new' => 'M0135'],
        ['type' => 'delete', 'id' => 'M0095'],
        ['type' => 'delete', 'id' => 'M0053'],
    ];

    foreach ($actions as $action) {
        if ($action['type'] == 'merge') {
            $oldId = $action['old'];
            $newId = $action['new'];
            $oldMember = DB::table('members')->where('member_id', $oldId)->first();
            $newMember = DB::table('members')->where('member_id', $newId)->first();
            if ($oldMember && $newMember) {
                $newPoints = $newMember->lifetime_points + $oldMember->lifetime_points;
                $newWins = $newMember->total_wins + $oldMember->total_wins;
                $newLosses = $newMember->total_losses + $oldMember->total_losses;
                $newWinRate = calculateWinRate($newWins, $newLosses);
                $newSkill = empty($newMember->skill_level) || $newMember->skill_level === 'NULL' ? $oldMember->skill_level : $newMember->skill_level;
                
                DB::table('members')->where('member_id', $newId)->update([
                    'lifetime_points' => $newPoints,
                    'total_wins' => $newWins,
                    'total_losses' => $newLosses,
                    'win_rate' => $newWinRate,
                    'skill_level' => $newSkill
                ]);

                DB::table('results')->where('member_id', $oldId)->update([
                    'member_id' => $newId,
                    'user_id' => $newMember->user_id,
                    'name' => $newMember->name
                ]);
                
                // Now delete old member and potentially user
                DB::table('members')->where('member_id', $oldId)->delete();
                $c = DB::table('members')->where('user_id', $oldMember->user_id)->count();
                if ($c == 0) DB::table('users')->where('id', $oldMember->user_id)->delete();
                
                echo "Merged $oldId into $newId.\n";
            } else {
                echo "Could not merge $oldId into $newId (One of them not found).\n";
            }
        } elseif ($action['type'] == 'delete') {
            $delId = $action['id'];
            $delMem = DB::table('members')->where('member_id', $delId)->first();
            if ($delMem) {
                DB::table('results')->where('member_id', $delId)->delete();
                
                DB::table('members')->where('member_id', $delId)->delete();
                $c = DB::table('members')->where('user_id', $delMem->user_id)->count();
                if ($c == 0) DB::table('users')->where('id', $delMem->user_id)->delete();
                
                echo "Deleted $delId.\n";
            } else {
                echo "Could not delete $delId (Not found).\n";
            }
        }
    }

    DB::commit();
    echo "All operations completed successfully!\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
