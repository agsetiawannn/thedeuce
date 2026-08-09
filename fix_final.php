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

    // 1. M0066 (YUWI) PINDAH KE M0085 (Ayu Widyastuti)
    $oldM0066 = DB::table('members')->where('member_id', 'M0066')->first();
    $newM0085 = DB::table('members')->where('member_id', 'M0085')->first();
    
    if ($oldM0066 && $newM0085) {
        $newPoints = $newM0085->lifetime_points + $oldM0066->lifetime_points;
        $newWins = $newM0085->total_wins + $oldM0066->total_wins;
        $newLosses = $newM0085->total_losses + $oldM0066->total_losses;
        $newWinRate = calculateWinRate($newWins, $newLosses);
        
        $newSkill = $newM0085->skill_level;
        if (empty($newSkill) || $newSkill === 'NULL') {
            $newSkill = $oldM0066->skill_level;
        }

        DB::table('members')->where('member_id', 'M0085')->update([
            'lifetime_points' => $newPoints,
            'total_wins' => $newWins,
            'total_losses' => $newLosses,
            'win_rate' => $newWinRate,
            'skill_level' => $newSkill
        ]);

        DB::table('results')->where('member_id', 'M0066')->update([
            'member_id' => 'M0085',
            'user_id' => $newM0085->user_id,
            'name' => $newM0085->name
        ]);
        
        DB::table('members')->where('member_id', 'M0066')->delete();
        
        $userCountM0066 = DB::table('members')->where('user_id', $oldM0066->user_id)->count();
        if ($userCountM0066 == 0) {
            DB::table('users')->where('id', $oldM0066->user_id)->delete();
        }
        
        echo "Merged M0066 into M0085.\n";
    }

    // 2. M0055 (GUSDE) PINDAH KE M0131 (IB Gede Prastawa)
    $oldM0055 = DB::table('members')->where('member_id', 'M0055')->first();
    $newM0131 = DB::table('members')->where('member_id', 'M0131')->first();
    
    if ($oldM0055 && $newM0131) {
        $newPoints = $newM0131->lifetime_points + $oldM0055->lifetime_points;
        $newWins = $newM0131->total_wins + $oldM0055->total_wins;
        $newLosses = $newM0131->total_losses + $oldM0055->total_losses;
        $newWinRate = calculateWinRate($newWins, $newLosses);
        
        $newSkill = $newM0131->skill_level;
        if (empty($newSkill) || $newSkill === 'NULL') {
            $newSkill = $oldM0055->skill_level;
        }

        DB::table('members')->where('member_id', 'M0131')->update([
            'lifetime_points' => $newPoints,
            'total_wins' => $newWins,
            'total_losses' => $newLosses,
            'win_rate' => $newWinRate,
            'skill_level' => $newSkill
        ]);

        DB::table('results')->where('member_id', 'M0055')->update([
            'member_id' => 'M0131',
            'user_id' => $newM0131->user_id,
            'name' => $newM0131->name
        ]);
        
        DB::table('members')->where('member_id', 'M0055')->delete();
        
        $userCountM0055 = DB::table('members')->where('user_id', $oldM0055->user_id)->count();
        if ($userCountM0055 == 0) {
            DB::table('users')->where('id', $oldM0055->user_id)->delete();
        }
        
        echo "Merged M0055 into M0131.\n";
    }

    // 3. REVERT Result ID 456 FROM M0012 TO M0069
    $m0069 = DB::table('members')->where('member_id', 'M0069')->first();
    if ($m0069) {
        DB::table('results')->where('result_id', 456)->update([
            'member_id' => 'M0069',
            'user_id' => $m0069->user_id
        ]);
        echo "Reverted Result 456 back to M0069.\n";
    }

    DB::commit();
    echo "All operations completed successfully!\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
