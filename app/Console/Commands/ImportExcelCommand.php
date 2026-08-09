<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ImportExcelCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-excel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data from JSON dumped from Excel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $json = file_get_contents(base_path('import_data.json'));
        $data = json_decode($json, true);

        // Turn off foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear tables
        DB::table('results')->truncate();
        DB::table('events')->truncate();
        DB::table('members')->truncate();
        DB::table('users')->truncate();

        // 1. Members
        foreach ($data['members'] as $m) {
            if (empty($m['Member ID'])) continue;

            // Excel dates are number of days since 1899-12-30
            $joinDate = isset($m['Join Date']) ? Carbon::create(1899, 12, 30)->addDays($m['Join Date'])->format('Y-m-d') : null;

            // Create a user for everyone
            $user = \App\Models\User::create([
                'name' => $m['Name'],
                'email' => $m['Email'] ?? strtolower(str_replace(' ', '', $m['Name'])) . '@example.com',
                'password' => bcrypt('password'),
            ]);

            DB::table('members')->insert([
                'member_id' => $m['Member ID'],
                'user_id' => $user->id,
                'name' => $m['Name'],
                'join_date' => $joinDate,
                'skill_level' => $m['Skill Level'] ?? null,
                'email' => $m['Email'] ?? null,
                'lifetime_points' => $m['Lifetime Points'] ?? 0,
                'status_tier' => $m['Status Tier'] ?? null,
                'phone_number' => $m['Phone Number'] ?? null,
            ]);
        }
        $this->info('Members imported.');

        // 2. Events
        foreach ($data['events'] as $e) {
            if (empty($e['Event ID'])) continue;

            $eventDate = isset($e['Event Date']) ? Carbon::create(1899, 12, 30)->addDays($e['Event Date'])->format('Y-m-d') : null;

            DB::table('events')->insert([
                'event_id' => $e['Event ID'],
                'event_name' => $e['Event Name'] ?? null,
                'event_date' => $eventDate,
                'event_time' => $e['Event Time'] ?? '16:00 - 18:00', // Default time
                'location' => $e['Location'] ?? null,
                'status' => $e['Status'] ?? 'SCHEDULED',
            ]);
        }
        $this->info('Events imported.');

        // 3. Results
        foreach ($data['results'] as $r) {
            if (empty($r['Event ID'])) continue;
            
            $resultDate = isset($r['Date']) ? Carbon::create(1899, 12, 30)->addDays($r['Date'])->format('Y-m-d') : null;

            DB::table('results')->insert([
                'event_id' => $r['Event ID'],
                'result_date' => $resultDate,
                'member_id' => $r['Member ID'],
                'name' => $r['Name'] ?? null,
                'finish' => $r['Finish'] ?? null,
                'placement_bonus' => $r['Placement Bonus'] ?? null,
                'attendance' => $r['Attendance'] ?? null,
                'event_points' => $r['Event Points'] ?? 0,
            ]);
        }
        $this->info('Results imported.');

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Also update thedeuce.sql so it matches the new state
        exec('mysqldump -u root thedeuce > thedeuce.sql');
        
        $this->info('Done! You can login with anandazhou09@gmail.com and password');
    }
}
