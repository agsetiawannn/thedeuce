<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Event;
use App\Models\Result;
use App\Models\Member;
use App\Models\User;
use Carbon\Carbon;

class FullImportSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(storage_path('app/full_import_data.json'));
        $data = json_decode($json, true);

        if (!isset($data['members']) || !isset($data['events']) || !isset($data['results'])) {
            $this->command->error('Missing members, events, or results in JSON file.');
            return;
        }

        $membersCount = 0;
        foreach ($data['members'] as $row) {
            if (!isset($row['Member ID'])) continue;
            
            $memberId = (string)$row['Member ID'];
            // Just basic member insert if not exists to avoid FK error
            Member::firstOrCreate(
                ['member_id' => $memberId],
                [
                    'name' => $row['Name'] ?? 'Unknown',
                    'email' => $row['Email'] ?? null,
                    'phone_number' => $row['Phone Number'] ?? null,
                    'skill_level' => $row['Skill Level'] ?? 'BEGINNER',
                    'status_tier' => $row['Status Tier'] ?? 'CLUB',
                    'join_date' => Carbon::now()->format('Y-m-d')
                ]
            );
            $membersCount++;
        }
        $this->command->info("Processed {$membersCount} members.");

        $eventsCount = 0;
        foreach ($data['events'] as $row) {
            if (!isset($row['Event ID']) || !isset($row['Event Name']) || !isset($row['Event Date'])) continue;
            
            $dateVal = $row['Event Date'];
            if (is_numeric($dateVal)) {
                $date = Carbon::createFromDate(1900, 1, 1)->addDays($dateVal - 2)->format('Y-m-d');
            } else {
                $date = Carbon::parse($dateVal)->format('Y-m-d');
            }

            Event::updateOrCreate(
                ['event_id' => (string)$row['Event ID']],
                [
                    'event_name' => $row['Event Name'],
                    'event_date' => $date,
                    'location' => $row['Location'] ?? 'Unknown'
                ]
            );
            $eventsCount++;
        }
        $this->command->info("Upserted {$eventsCount} events.");

        $resultsCount = 0;
        foreach ($data['results'] as $row) {
            if (!isset($row['Event ID']) || !isset($row['Member ID'])) continue;

            $eventId = (string)$row['Event ID'];
            $memberId = (string)$row['Member ID'];

            $wins = isset($row['W']) ? (int)$row['W'] : 0;
            $losses = isset($row['L']) ? (int)$row['L'] : 0;
            $diff = isset($row['Diff']) ? (int)$row['Diff'] : 0;
            $finish = isset($row['Finish']) ? (int)$row['Finish'] : null;
            $placementBonus = isset($row['Placement Bonus']) ? (int)$row['Placement Bonus'] : 0;
            $attendance = isset($row['Attendance']) ? (int)$row['Attendance'] : 10;
            $eventPoints = isset($row['Event Points']) ? (int)$row['Event Points'] : ($placementBonus + $attendance);

            Result::updateOrCreate(
                [
                    'event_id' => $eventId,
                    'member_id' => $memberId
                ],
                [
                    'wins' => $wins,
                    'losses' => $losses,
                    'diff' => $diff,
                    'finish' => $finish,
                    'placement_bonus' => $placementBonus,
                    'attendance' => $attendance,
                    'event_points' => $eventPoints
                ]
            );
            $resultsCount++;
        }
        $this->command->info("Upserted {$resultsCount} result records.");
    }
}
