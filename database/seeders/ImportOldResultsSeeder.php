<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Result;
use App\Models\Event;
use App\Models\Member;

class ImportOldResultsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(storage_path('app/import_data_8.json'));
        $data = json_decode($json, true);

        if (!isset($data['results'])) {
            $this->command->error('No results found in JSON file.');
            return;
        }

        $count = 0;
        foreach ($data['results'] as $row) {
            if (!isset($row['Event ID']) || !isset($row['Member ID'])) continue;

            $eventId = $row['Event ID'];
            $memberId = $row['Member ID'];

            $result = Result::where('event_id', $eventId)
                            ->where('member_id', $memberId)
                            ->first();

            if ($result) {
                $wins = isset($row['W']) ? (int)$row['W'] : 0;
                $losses = isset($row['L']) ? (int)$row['L'] : 0;
                $diff = isset($row['Diff']) ? (int)$row['Diff'] : 0;
                $finish = isset($row['Finish']) ? (int)$row['Finish'] : null;

                $result->update([
                    'wins' => $wins,
                    'losses' => $losses,
                    'diff' => $diff,
                    'finish' => $finish,
                ]);
                $count++;
            }
        }

        $this->command->info("Updated {$count} result records.");
    }
}
