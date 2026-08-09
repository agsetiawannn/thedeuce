<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Member;
use App\Models\Result;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

$syncData = json_decode(file_get_contents('sync_data_9.json'), true);
$excelMembers = $syncData['members'];
$excelResults = $syncData['results'];

DB::statement('SET FOREIGN_KEY_CHECKS=0;');
DB::beginTransaction();
try {
    echo "--- SYNCING MEMBERS ---\n";
    foreach ($excelMembers as $em) {
        $id = $em['Member ID'];
        $name = trim($em['Name'] ?? '');
        if (!$id || !$name) continue;
        
        $member = Member::where('member_id', $id)->first();
        if ($member) {
            if (strtolower(trim($member->name)) !== strtolower($name)) {
                echo "Conflict for $id: DB has '{$member->name}', Excel has '$name'. Moving DB user...\n";
                $maxId = Member::max('member_id');
                $nextNum = intval(substr($maxId, 1)) + 1;
                $newId = 'M' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
                
                $member->member_id = $newId;
                $member->save();
                
                Result::where('member_id', $id)->update(['member_id' => $newId]);
                
                Member::create([
                    'member_id' => $id,
                    'name' => $name,
                    'status_tier' => 'DIAMOND',
                    'lifetime_points' => 0
                ]);
                echo "Moved to $newId and created '$name' at $id.\n";
            }
        } else {
            Member::create([
                'member_id' => $id,
                'name' => $name,
                'status_tier' => 'DIAMOND',
                'lifetime_points' => 0
            ]);
            echo "Created '$name' at $id.\n";
        }
    }

    echo "\n--- SYNCING RESULTS ---\n";
    $eventIds = array_unique(array_column($excelResults, 'Event ID'));
    foreach ($eventIds as $evId) {
        if (!$evId) continue;
        Result::where('event_id', $evId)->delete();
        Event::where('event_id', $evId)->update(['status' => 'ended']);
        echo "Cleared old results and ended event $evId.\n";
    }
    
    foreach ($excelResults as $res) {
        $evId = $res['Event ID'];
        if (!$evId) continue;
        
        $excelDate = $res['Date'] ?? null;
        $formattedDate = '2026-07-01'; // Default
        if ($excelDate && is_numeric($excelDate)) {
            $unixDate = ($excelDate - 25569) * 86400;
            $formattedDate = gmdate("Y-m-d", $unixDate);
        }

        Result::create([
            'event_id' => $evId,
            'member_id' => $res['Member ID'] ?? '',
            'name' => $res['Name'] ?? '',
            'result_date' => $formattedDate,
            'wins' => intval($res['W'] ?? 0),
            'losses' => intval($res['L'] ?? 0),
            'diff' => intval($res['Diff'] ?? 0),
            'finish' => intval($res['Finish'] ?? 0),
            'placement_bonus' => intval($res['Placement Bonus'] ?? 0),
            'attendance' => intval($res['Attendance'] ?? 0),
            'event_points' => intval($res['Event Points'] ?? 0)
        ]);
    }
    
    DB::commit();
    echo "\nSuccessfully synchronized all results and members!\n";
    
    echo "Updating member stats...\n";
    \Illuminate\Support\Facades\Artisan::call('members:update-stats');
    echo \Illuminate\Support\Facades\Artisan::output();
    
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
}
