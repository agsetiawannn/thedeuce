<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

DB::beginTransaction();
try {
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');

    $members = DB::table('members')->get();
    $usedIds = [];
    
    foreach ($members as $member) {
        $targetId = (int) preg_replace('/[^0-9]/', '', $member->member_id);
        
        if (in_array($targetId, $usedIds) || $targetId === 0) {
            $targetId = max(array_merge($usedIds, [0])) + 1;
        }
        $usedIds[] = $targetId;
        
        // Find the user that belongs to this member
        $user = null;
        if (!empty($member->email)) {
            $user = DB::table('users')->where('email', $member->email)->first();
        }
        if (!$user) {
            $user = DB::table('users')->whereRaw('LOWER(name) = ?', [strtolower($member->name)])->first();
        }
        
        if ($user) {
            // Update the user's ID to targetId
            DB::table('users')->where('id', $user->id)->update(['id' => $targetId]);
            // Update member's user_id
            DB::table('members')->where('member_id', $member->member_id)->update(['user_id' => $targetId]);
            // Update notifications and sessions if they had any, using the old user id
            if (\Illuminate\Support\Facades\Schema::hasTable('notifications')) {
                DB::table('notifications')->where('notifiable_type', 'App\\Models\\User')
                                          ->where('notifiable_id', $user->id)
                                          ->update(['notifiable_id' => $targetId]);
            }
            if (\Illuminate\Support\Facades\Schema::hasTable('sessions')) {
                DB::table('sessions')->where('user_id', $user->id)
                                     ->update(['user_id' => $targetId]);
            }
        }
    }

    $highestId = DB::table('users')->max('id') ?? 0;
    $nextAutoIncrement = $highestId + 1;
    DB::statement("ALTER TABLE users AUTO_INCREMENT = {$nextAutoIncrement}");
    
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    DB::commit();
    echo "Successfully fixed and realigned user IDs.\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
