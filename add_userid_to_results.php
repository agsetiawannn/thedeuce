<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

try {
    if (!Schema::hasColumn('results', 'user_id')) {
        Schema::table('results', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('member_id');
        });
        echo "Added user_id column to results table.\n";
    }

    $results = DB::table('results')->get();
    foreach ($results as $result) {
        if (!empty($result->member_id)) {
            $targetUserId = (int) preg_replace('/[^0-9]/', '', $result->member_id);
            DB::table('results')->where('result_id', $result->result_id)->update(['user_id' => $targetUserId]);
        }
    }
    
    echo "Successfully updated user_id in results table.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
