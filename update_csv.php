<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$file = fopen('members (1).csv', 'r');
$header = fgetcsv($file, 0, ';');
while (($row = fgetcsv($file, 0, ';')) !== false) {
    if (empty($row[0])) continue;
    $member_id = $row[0];
    $lifetime_points = (int)$row[6];
    $status_tier = $row[7];
    
    $member = App\Models\Member::where('member_id', $member_id)->first();
    if ($member) {
        $member->lifetime_points = $lifetime_points;
        $member->status_tier = $status_tier;
        $member->save();
        echo "Updated $member_id to $lifetime_points points\n";
    }
}
fclose($file);
