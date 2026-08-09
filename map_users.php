<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Member;

$membersWithUserId = Member::whereNotNull('user_id')->get();
$allMembers = Member::all();

echo "Finding correct Excel member for each app user...\n";

foreach ($membersWithUserId as $appUser) {
    // If they have stats, they might already be linked correctly.
    // Let's just find the member with similar name that has no user_id, 
    // OR just show all app users and their current stats to see if they are disconnected.
    echo "App User: {$appUser->member_id} - {$appUser->name} (User ID: {$appUser->user_id}) - Stats: W:{$appUser->total_wins} L:{$appUser->total_losses}\n";
    
    // Find potential matches in Excel members (members with no user_id)
    $bestMatch = null;
    $highestSim = 0;
    foreach ($allMembers as $m) {
        if ($m->member_id === $appUser->member_id) continue;
        
        similar_text(strtolower($appUser->name), strtolower($m->name), $percent);
        if ($percent > $highestSim) {
            $highestSim = $percent;
            $bestMatch = $m;
        }
    }
    
    if ($bestMatch && $highestSim > 60) {
        echo "  -> Potential Match: {$bestMatch->member_id} - {$bestMatch->name} ($highestSim%)\n";
    }
}
