<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Member;

// TDC ADMIND was user_id 47, initially M0047, then moved to M0110, then merged into M0047 (ELSYE).
// The user says "kenapa akunku ... jadi akun nya ELSYE bukan TDC ADMIND"
// So M0047 is currently ELSYE, but it has TDC ADMIND's user_id and email.

$elsye = Member::where('member_id', 'M0047')->first();

if ($elsye) {
    echo "Current M0047: " . $elsye->name . " (User ID: " . $elsye->user_id . ", Email: " . $elsye->email . ")\n";

    // 1. Create a new member for TDC ADMIND (or recreate M0110)
    $admin = new Member();
    $admin->member_id = 'M0110';
    $admin->name = 'TDC ADMIND';
    $admin->user_id = $elsye->user_id;
    $admin->email = $elsye->email;
    $admin->phone_number = $elsye->phone_number;
    $admin->join_date = $elsye->join_date;
    $admin->status_tier = 'DIAMOND';
    $admin->lifetime_points = 0;
    $admin->total_wins = 0;
    $admin->total_losses = 0;
    $admin->win_rate = 0;
    $admin->save();
    echo "Created Admin at M0110.\n";

    // 2. Restore ELSYE
    $elsye->user_id = null;
    $elsye->email = null;
    $elsye->phone_number = null;
    $elsye->join_date = null; // Maybe keep if it was in Excel? Excel didn't have join date for ELSYE.
    $elsye->name = 'ELSYE';
    $elsye->save();
    echo "Restored ELSYE at M0047.\n";
} else {
    echo "M0047 not found.\n";
}
