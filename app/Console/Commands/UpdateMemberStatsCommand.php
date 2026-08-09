<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Member;

class UpdateMemberStatsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'members:update-stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates total wins, total losses, and win rate for all members based on their historical results.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $members = Member::all();
        $count = 0;
        
        $this->withProgressBar($members, function (Member $member) use (&$count) {
            $member->updateStats();
            $count++;
        });

        $this->newLine();
        $this->info("Updated stats for {$count} members successfully.");
    }
}
