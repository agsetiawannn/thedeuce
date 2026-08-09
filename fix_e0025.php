<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Member;
use App\Models\Result;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

$excelMembers = [
    'M0075' => 'Ghifari',
    'M0076' => 'Thomas',
    'M0053' => 'ADI NUGRAHA',
    'M0001' => 'HUNG',
    'M0009' => 'REVATA',
    'M0049' => 'VARIEN',
    'M0077' => 'Dicky Chandra',
    'M0028' => 'RAKA S',
];

DB::statement('SET FOREIGN_KEY_CHECKS=0;');

DB::beginTransaction();
try {
    foreach ($excelMembers as $id => $name) {
        $member = Member::where('member_id', $id)->first();
        if ($member) {
            // Check if name matches (ignoring case)
            if (strtolower(trim($member->name)) !== strtolower(trim($name))) {
                // Name mismatch. This means an app user took this ID.
                echo "Conflict for $id: DB has '{$member->name}', Excel has '$name'. Moving DB user...\n";
                
                // Get next available ID
                $maxId = Member::max('member_id');
                $nextNum = intval(substr($maxId, 1)) + 1;
                $newId = 'M' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
                
                // Move the existing member to new ID
                $member->member_id = $newId;
                $member->save();
                
                // Update their results
                Result::where('member_id', $id)->update(['member_id' => $newId]);
                
                // Create the Excel member at the original ID
                Member::create([
                    'member_id' => $id,
                    'name' => $name,
                    'status_tier' => 'DIAMOND',
                    'lifetime_points' => 0
                ]);
                echo "Moved to $newId and created '$name' at $id.\n";
            }
        } else {
            // Member doesn't exist, just create
            Member::create([
                'member_id' => $id,
                'name' => $name,
                'status_tier' => 'DIAMOND',
                'lifetime_points' => 0
            ]);
            echo "Created '$name' at $id.\n";
        }
    }

    // Now fix E0025 results
    echo "Deleting old E0025 results...\n";
    Result::where('event_id', 'E0025')->delete();
    
    $e0025Results = [
        ['member_id' => 'M0075', 'name' => 'Ghifari', 'wins' => 6, 'losses' => 1, 'diff' => 8, 'finish' => 1, 'placement_bonus' => 25, 'attendance' => 10, 'event_points' => 35],
        ['member_id' => 'M0076', 'name' => 'Thomas', 'wins' => 5, 'losses' => 2, 'diff' => 7, 'finish' => 2, 'placement_bonus' => 18, 'attendance' => 10, 'event_points' => 28],
        ['member_id' => 'M0053', 'name' => 'ADI NUGRAHA', 'wins' => 5, 'losses' => 2, 'diff' => 6, 'finish' => 3, 'placement_bonus' => 12, 'attendance' => 10, 'event_points' => 22],
        ['member_id' => 'M0001', 'name' => 'HUNG', 'wins' => 4, 'losses' => 3, 'diff' => 2, 'finish' => 4, 'placement_bonus' => 8, 'attendance' => 10, 'event_points' => 18],
        ['member_id' => 'M0009', 'name' => 'REVATA', 'wins' => 3, 'losses' => 4, 'diff' => -1, 'finish' => 5, 'placement_bonus' => 6, 'attendance' => 10, 'event_points' => 16],
        ['member_id' => 'M0049', 'name' => 'VARIEN', 'wins' => 3, 'losses' => 4, 'diff' => -3, 'finish' => 6, 'placement_bonus' => 4, 'attendance' => 10, 'event_points' => 14],
        ['member_id' => 'M0077', 'name' => 'Dicky Chandra', 'wins' => 2, 'losses' => 5, 'diff' => -8, 'finish' => 7, 'placement_bonus' => 2, 'attendance' => 10, 'event_points' => 12],
        ['member_id' => 'M0028', 'name' => 'RAKA S', 'wins' => 0, 'losses' => 7, 'diff' => -11, 'finish' => 8, 'placement_bonus' => 1, 'attendance' => 10, 'event_points' => 11],
    ];
    
    echo "Inserting new E0025 results...\n";
    foreach ($e0025Results as $res) {
        Result::create([
            'event_id' => 'E0025',
            'member_id' => $res['member_id'],
            'name' => $res['name'],
            'result_date' => '2026-07-31',
            'wins' => $res['wins'],
            'losses' => $res['losses'],
            'diff' => $res['diff'],
            'finish' => $res['finish'],
            'placement_bonus' => $res['placement_bonus'],
            'attendance' => $res['attendance'],
            'event_points' => $res['event_points']
        ]);
    }
    
    // Update Event status
    Event::where('event_id', 'E0025')->update(['status' => 'ended']);
    echo "Updated E0025 status to ended.\n";
    
    DB::commit();
    echo "Successfully updated database!\n";
    
    // Call the console command to update stats
    echo "Updating member stats...\n";
    \Illuminate\Support\Facades\Artisan::call('stats:update');
    echo \Illuminate\Support\Facades\Artisan::output();
    
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
}
