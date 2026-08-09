<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Member;
use Illuminate\Support\Facades\DB;

$syncData = json_decode(file_get_contents('sync_data_9.json'), true);
$excelMembers = $syncData['members'];

DB::beginTransaction();
try {
    echo "Updating lifetime points and tier from Excel...\n";
    foreach ($excelMembers as $em) {
        $id = $em['Member ID'];
        $member = Member::where('member_id', $id)->first();
        if ($member) {
            $lp = intval($em['Lifetime Points'] ?? 0);
            $tier = $em['Status Tier'] ?? 'DIAMOND';
            $skill = $em['Skill Level'] ?? null;
            
            $member->lifetime_points = $lp;
            $member->status_tier = strtoupper(trim($tier));
            if ($skill) {
                $member->skill_level = $skill;
            }
            $member->save();
            echo "Updated $id: LP=$lp, Tier=$tier\n";
        }
    }
    
    // Also re-run updateStats to ensure wins/losses match exactly
    \Illuminate\Support\Facades\Artisan::call('members:update-stats');
    
    DB::commit();
    echo "SUCCESS!\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
}
