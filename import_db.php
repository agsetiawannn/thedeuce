<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

function parseExcelDate($dateStr) {
    if (empty($dateStr) || $dateStr === 'NULL') return null;
    if (is_numeric($dateStr)) {
        return Carbon::create(1899, 12, 30)->addDays((float)$dateStr)->format('Y-m-d H:i:s');
    }
    return $dateStr; 
}

function parseNull($val) {
    return ($val === 'NULL' || $val === '' || str_starts_with((string)$val, '#')) ? null : $val;
}

function parseIntOrZero($val) {
    if ($val === 'NULL' || $val === '' || $val === null || str_starts_with((string)$val, '#')) return 0;
    return (int)$val;
}

$json = file_get_contents(__DIR__.'/db_dump.json');
$data = json_decode($json, true);

DB::statement('SET FOREIGN_KEY_CHECKS=0;');

DB::table('results')->truncate();
DB::table('members')->truncate();
DB::table('users')->truncate();

foreach ($data['users'] as $user) {
    if (empty($user['id'])) continue;
    DB::table('users')->insert([
        'id' => $user['id'],
        'name' => parseNull($user['name']),
        'email' => parseNull($user['email']),
        'avatar' => parseNull($user['avatar'] ?? null),
        'google_id' => parseNull($user['google_id'] ?? null),
        'password' => parseNull($user['password']) ?? bcrypt('password'),
        'created_at' => parseExcelDate($user['created_at'] ?? null),
        'updated_at' => parseExcelDate($user['updated_at'] ?? null),
    ]);
}

foreach ($data['members'] as $member) {
    if (empty($member['member_id'])) continue;
    DB::table('members')->insert([
        'member_id' => $member['member_id'],
        'user_id' => parseNull($member['user_id'] ?? null),
        'name' => parseNull($member['name']),
        'join_date' => parseExcelDate($member['join_date'] ?? null),
        'skill_level' => parseNull($member['skill_level'] ?? null),
        'email' => parseNull($member['email'] ?? null),
        'lifetime_points' => parseIntOrZero($member['lifetime_points'] ?? 0),
        'status_tier' => parseNull($member['status_tier'] ?? null),
        'total_wins' => parseIntOrZero($member['total_wins'] ?? 0),
        'total_losses' => parseIntOrZero($member['total_losses'] ?? 0),
        'win_rate' => parseIntOrZero($member['win_rate'] ?? 0),
        'phone_number' => parseNull($member['phone_number'] ?? null),
    ]);
}

foreach ($data['results'] as $result) {
    if (empty($result['result_id'])) continue;
    DB::table('results')->insert([
        'result_id' => $result['result_id'],
        'event_id' => $result['event_id'],
        'result_date' => parseExcelDate($result['result_date'] ?? null),
        'member_id' => parseNull($result['member_id']),
        'name' => parseNull($result['name'] ?? null),
        'finish' => parseIntOrZero($result['finish'] ?? null),
        'placement_bonus' => parseIntOrZero($result['placement_bonus'] ?? 0),
        'attendance' => parseIntOrZero($result['attendance'] ?? 0),
        'event_points' => parseIntOrZero($result['event_points'] ?? 0),
        'wins' => parseIntOrZero($result['wins'] ?? 0),
        'losses' => parseIntOrZero($result['losses'] ?? 0),
        'diff' => parseIntOrZero($result['diff'] ?? 0),
    ]);
}

DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo "Database wiped and re-populated successfully from db_dump.json\n";
