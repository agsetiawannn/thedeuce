<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

echo "Starting fix...\n";
$members = DB::table('members')->get();
$changes = 0;

foreach ($members as $member) {
    $validUserId = null;
    
    // First, if they have an email, try to find a user by email
    if (!empty($member->email)) {
        $userByEmail = DB::table('users')->where('email', $member->email)->first();
        if ($userByEmail) {
            $validUserId = $userByEmail->id;
        }
    }
    
    // If we haven't found a user by email, let's look at their current user_id
    if (!$validUserId && !empty($member->user_id)) {
        $userById = DB::table('users')->where('id', $member->user_id)->first();
        if ($userById) {
            if (!empty($userById->email) && !str_ends_with($userById->email, '@example.com')) {
                // User has a real email. If it matches member's email, it's valid.
                if (!empty($member->email) && strtolower($userById->email) === strtolower($member->email)) {
                    $validUserId = $userById->id;
                }
            } else {
                // User has no email or is a dummy email. Check by name.
                if (strtolower($userById->name) === strtolower($member->name)) {
                    $validUserId = $userById->id;
                }
            }
        }
    }
    
    // If still no valid user, create a new one!
    if (!$validUserId) {
        $dummyEmail = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $member->name)) . '_' . $member->member_id . '@example.com';
        $emailToUse = !empty($member->email) ? $member->email : $dummyEmail;
        
        // Ensure this email isn't already taken somehow
        $existing = DB::table('users')->where('email', $emailToUse)->first();
        if ($existing) {
            $validUserId = $existing->id;
        } else {
            $validUserId = DB::table('users')->insertGetId([
                'name' => $member->name,
                'email' => $emailToUse,
                'password' => bcrypt('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            echo "Created NEW user {$validUserId} for member {$member->member_id} ({$member->name}) with email {$emailToUse}\n";
        }
    }
    
    // Update if changed
    if ($validUserId != $member->user_id) {
        DB::table('members')->where('member_id', $member->member_id)->update(['user_id' => $validUserId]);
        echo "Updated member {$member->member_id} ({$member->name}): user_id changed from " . ($member->user_id ?? 'NULL') . " to {$validUserId}\n";
        $changes++;
    }
}
echo "Finished! Total changes: {$changes}\n";
