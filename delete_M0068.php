<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    DB::beginTransaction();

    $delId = 'M0068';
    $delMem = DB::table('members')->where('member_id', $delId)->first();
    if ($delMem) {
        DB::table('results')->where('member_id', $delId)->delete();
        DB::table('members')->where('member_id', $delId)->delete();
        $c = DB::table('members')->where('user_id', $delMem->user_id)->count();
        if ($c == 0) {
            DB::table('users')->where('id', $delMem->user_id)->delete();
        }
        echo "Deleted $delId.\n";
    } else {
        echo "M0068 not found.\n";
    }

    DB::commit();
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
