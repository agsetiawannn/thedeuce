<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->integer('total_wins')->default(0)->after('status_tier');
            $table->integer('total_losses')->default(0)->after('total_wins');
            $table->integer('win_rate')->default(0)->after('total_losses');
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['total_wins', 'total_losses', 'win_rate']);
        });
    }
};
