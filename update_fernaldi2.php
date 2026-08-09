<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::where('name', 'like', '%Fernaldi%')->get();
if ($users->isEmpty()) {
    // Try checking Member directly by name
    $members = App\Models\Member::where('name', 'like', '%Fernaldi%')->get();
    foreach ($members as $m) {
        echo "Found member: " . $m->name . " (ID: " . $m->member_id . ")\n";
        $m->addPoints(25, 'points_admin');
        echo 'Added 25 CP to ' . $m->name . " (New total: " . $m->lifetime_points . ")\n";
    }
    if ($members->isEmpty()) {
        echo "No members found containing Fernaldi.\n";
    }
} else {
    foreach($users as $u) {
        echo "Found user: " . $u->name . "\n";
        $m = $u->member;
        if ($m) {
            $m->addPoints(25, 'points_admin');
            echo 'Added 25 CP to ' . $u->name . " (New total: " . $m->lifetime_points . ")\n";
        } else {
            echo "No member found for user " . $u->name . "\n";
            // Check member by name
            $m2 = App\Models\Member::where('name', 'like', '%' . $u->name . '%')->first();
            if ($m2) {
                $m2->addPoints(25, 'points_admin');
                echo 'Added 25 CP to member ' . $m2->name . " (New total: " . $m2->lifetime_points . ")\n";
            }
        }
    }
}
