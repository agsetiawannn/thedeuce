<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$json = file_get_contents(storage_path('app/full_import_data.json'));
$data = json_decode($json, true);

$inserted = 0;
$skipped = 0;
foreach ($data['results'] as $row) {
    if (!isset($row['Event ID']) || !isset($row['Member ID'])) continue;
    
    $eventId = (string)$row['Event ID'];
    $memberId = (string)$row['Member ID'];
    
    try {
        App\Models\Result::updateOrCreate(
            ['event_id' => $eventId, 'member_id' => $memberId],
            [
                'wins' => isset($row['W']) ? (int)$row['W'] : 0,
                'losses' => isset($row['L']) ? (int)$row['L'] : 0,
                'diff' => isset($row['Diff']) ? (int)$row['Diff'] : 0,
                'finish' => isset($row['Finish']) ? (int)$row['Finish'] : null,
                'placement_bonus' => isset($row['Placement Bonus']) ? (int)$row['Placement Bonus'] : 0,
                'attendance' => isset($row['Attendance']) ? (int)$row['Attendance'] : 10,
                'event_points' => isset($row['Event Points']) ? (int)$row['Event Points'] : 0,
            ]
        );
        $inserted++;
    } catch (\Exception $e) {
        echo "Error for $eventId, $memberId: " . $e->getMessage() . "\n";
        $skipped++;
    }
}
echo "Inserted/Updated: $inserted, Skipped/Errors: $skipped\n";
