<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = App\Models\User::where('name', 'like', '%Fernaldi%')->first();
if ($u) {
    $m = $u->member;
    if ($m) {
        $m->addPoints(25, 'points_admin');
        echo 'Added 25 CP to ' . $u->name . " (New total: " . $m->lifetime_points . ")\n";
    } else {
        echo "No member found\n";
    }
} else {
    echo "No user found\n";
}
