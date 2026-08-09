<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$results = DB::table('results')->get();
$members = DB::table('members')->get()->keyBy('member_id');

foreach ($results as $result) {
    if (!isset($members[$result->member_id])) {
        echo "Result ID {$result->result_id} ({$result->name}) has member_id {$result->member_id} WHICH DOES NOT EXIST IN MEMBERS!\n";
        continue;
    }
    
    $mName = strtolower(trim($members[$result->member_id]->name));
    $rName = strtolower(trim($result->name));
    
    // Check if one contains the other, to allow "Fahmi" vs "Aplikasi Fahmi"
    if (strpos($mName, $rName) === false && strpos($rName, $mName) === false) {
        // Not a simple substring match
        // Let's print out potential mismatches that might need manual review
        echo "POTENTIAL MISMATCH: Result [{$result->name}] is assigned to member_id {$result->member_id} [{$members[$result->member_id]->name}]\n";
    }
}
