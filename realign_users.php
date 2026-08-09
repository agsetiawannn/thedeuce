<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

DB::beginTransaction();
try {
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');

    $members = DB::table('members')->whereNotNull('user_id')->get();
    
    // Step 1: Shift all users and related foreign keys by +100000
    $offset = 100000;
    
    DB::table('users')->update(['id' => DB::raw('id + ' . $offset)]);
    DB::table('members')->whereNotNull('user_id')->update(['user_id' => DB::raw('user_id + ' . $offset)]);
    
    if (Schema::hasTable('notifications')) {
        DB::table('notifications')->where('notifiable_type', 'App\\Models\\User')
                                  ->update(['notifiable_id' => DB::raw('notifiable_id + ' . $offset)]);
    }
    
    if (Schema::hasTable('sessions')) {
        DB::table('sessions')->whereNotNull('user_id')
                             ->update(['user_id' => DB::raw('user_id + ' . $offset)]);
    }

    // Step 2: Re-align user_ids
    $usedIds = [];
    
    foreach ($members as $member) {
        $oldUserId = $member->user_id; // already shifted
        $targetId = (int) preg_replace('/[^0-9]/', '', $member->member_id);
        
        if (in_array($targetId, $usedIds) || $targetId === 0) {
            $targetId = max(array_merge($usedIds, [0])) + 1;
        }
        $usedIds[] = $targetId;
        
        DB::table('users')->where('id', $oldUserId)->update(['id' => $targetId]);
        DB::table('members')->where('member_id', $member->member_id)->update(['user_id' => $targetId]);
        
        if (Schema::hasTable('notifications')) {
            DB::table('notifications')->where('notifiable_type', 'App\\Models\\User')
                                      ->where('notifiable_id', $oldUserId)
                                      ->update(['notifiable_id' => $targetId]);
        }
        
        if (Schema::hasTable('sessions')) {
            DB::table('sessions')->where('user_id', $oldUserId)
                                 ->update(['user_id' => $targetId]);
        }
    }

    // Step 3: Handle orphan users
    $orphans = DB::table('users')->where('id', '>', $offset)->get();
    $nextId = (count($usedIds) > 0 ? max($usedIds) : 0) + 1;
    $nextId = max($nextId, 1000); // Put orphans at 1000+
    
    foreach ($orphans as $orphan) {
        $oldUserId = $orphan->id;
        
        DB::table('users')->where('id', $oldUserId)->update(['id' => $nextId]);
        
        if (Schema::hasTable('notifications')) {
            DB::table('notifications')->where('notifiable_type', 'App\\Models\\User')
                                      ->where('notifiable_id', $oldUserId)
                                      ->update(['notifiable_id' => $nextId]);
        }
        if (Schema::hasTable('sessions')) {
            DB::table('sessions')->where('user_id', $oldUserId)
                                 ->update(['user_id' => $nextId]);
        }
        
        $nextId++;
    }

    $highestId = DB::table('users')->max('id') ?? 0;
    $nextAutoIncrement = $highestId + 1;
    DB::statement("ALTER TABLE users AUTO_INCREMENT = {$nextAutoIncrement}");
    
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    DB::commit();
    echo "Successfully realigned user IDs to match member IDs.\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
