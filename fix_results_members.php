<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$results = DB::table('results')->get();
$members = DB::table('members')->get();

$memberMap = [];
foreach ($members as $m) {
    // lowercase and trim
    $name = trim(strtolower($m->name));
    $memberMap[$name] = $m;
}

$fixed = 0;
foreach ($results as $result) {
    if (!$result->name) continue;
    
    $resultName = trim(strtolower($result->name));
    
    if (isset($memberMap[$resultName])) {
        $correctMemberId = $memberMap[$resultName]->member_id;
        $correctUserId = $memberMap[$resultName]->user_id;
        
        if ($result->member_id !== $correctMemberId) {
            echo "Mismatch found: Result ID {$result->result_id} Name '{$result->name}' has member_id {$result->member_id}, should be {$correctMemberId}\n";
            DB::table('results')->where('result_id', $result->result_id)->update([
                'member_id' => $correctMemberId,
                'user_id' => $correctUserId
            ]);
            $fixed++;
        }
    } else {
        echo "Could not find member for result name: {$result->name} (Current member_id: {$result->member_id})\n";
    }
}
echo "Fixed $fixed results.\n";
