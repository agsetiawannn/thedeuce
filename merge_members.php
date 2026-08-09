<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$merges = [
    'M0047' => 'M0112', // ELSYE -> Elsye Kanalomi
    'M0048' => 'M0113', // RICAT -> Richard Benedic
];

foreach ($merges as $oldId => $newId) {
    $oldMember = DB::table('members')->where('member_id', $oldId)->first();
    $newMember = DB::table('members')->where('member_id', $newId)->first();

    if ($oldMember && $newMember) {
        DB::beginTransaction();
        try {
            // Reassign results and update the name in the results table
            DB::table('results')->where('member_id', $oldId)->update([
                'member_id' => $newId,
                'name' => $newMember->name
            ]);

            // We must also merge points and stats
            $newPoints = $newMember->lifetime_points + $oldMember->lifetime_points;
            $newWins = $newMember->total_wins + $oldMember->total_wins;
            $newLosses = $newMember->total_losses + $oldMember->total_losses;
            
            $totalMatches = $newWins + $newLosses;
            $newWinRate = $totalMatches > 0 ? round(($newWins / $totalMatches) * 100) : 0;
            
            DB::table('members')->where('member_id', $newId)->update([
                'lifetime_points' => $newPoints,
                'total_wins' => $newWins,
                'total_losses' => $newLosses,
                'win_rate' => $newWinRate,
                'skill_level' => $oldMember->skill_level ?? $newMember->skill_level,
            ]);

            // Delete old member
            DB::table('members')->where('member_id', $oldId)->delete();

            // Check if we should delete the old user if it has no other members linked
            if ($oldMember->user_id) {
                $otherMembersUsingUser = DB::table('members')->where('user_id', $oldMember->user_id)->count();
                if ($otherMembersUsingUser == 0) {
                    DB::table('users')->where('id', $oldMember->user_id)->delete();
                }
            }

            DB::commit();
            echo "Successfully merged {$oldMember->name} into {$newMember->name}\n";
        } catch (\Exception $e) {
            DB::rollBack();
            echo "Error merging {$oldId} to {$newId}: " . $e->getMessage() . "\n";
        }
    } else {
        echo "Could not find member $oldId or $newId\n";
    }
}
