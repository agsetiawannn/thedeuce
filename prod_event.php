<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::whereDate('event_date', '>=', \Carbon\Carbon::now('Asia/Makassar')->toDateString())
                       ->orderBy('event_date', 'asc')
                       ->get();

        return Inertia::render('Event/Index', [
            'events' => $events,
        ]);
    }

    private function isAdmin($user)
    {
        if (!$user || !$user->email) return false;
        $allowed = [
            'anandazhou09@gmail.com', 
            'idabagusadhya@gmail.com', 
            'abiseka33@gmail.com', 
            'setiawan18221@gmail.com'
        ];
        return in_array(strtolower($user->email), $allowed);
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin($request->user())) {
            return redirect()->route('events.index')->with('error', 'Unauthorized action.');
        }

        $validated = $request->validate([
            'event_name' => 'required|string|max:100',
            'event_date' => 'required|date',
            'event_time' => 'required|string|max:100',
            'location' => 'required|string|max:150',
            'kuyy_link' => 'nullable|url|max:255',
        ]);

        // Generate a new event_id (e.g. E0010)
        $lastEvent = Event::orderBy('event_id', 'desc')->first();
        $nextId = 'E0001';
        if ($lastEvent && preg_match('/^E(\d+)$/', $lastEvent->event_id, $matches)) {
            $nextId = 'E' . str_pad((int)$matches[1] + 1, 4, '0', STR_PAD_LEFT);
        }

        Event::create([
            'event_id' => $nextId,
            'event_name' => $validated['event_name'],
            'event_date' => $validated['event_date'],
            'event_time' => $validated['event_time'],
            'location' => $validated['location'],
            'kuyy_link' => $validated['kuyy_link'] ?? null,
        ]);

        return redirect()->route('events.index');
    }

    public function show($id)
    {
        $event = Event::with(['results.member.user'])->findOrFail($id);
        
        return Inertia::render('Event/Show', [
            'event' => $event,
            'participants' => $event->results, // The checked-in participants
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if (!$this->isAdmin($request->user())) {
            return redirect()->route('events.show', $id)->with('error', 'Unauthorized action.');
        }

        $event = Event::findOrFail($id);
        
        // Deduct points for all results and delete them
        $results = \App\Models\Result::where('event_id', $id)->get();
        foreach ($results as $result) {
            $member = \App\Models\Member::where('member_id', $result->member_id)->first();
            if ($member) {
                $member->update(['lifetime_points' => max(0, $member->lifetime_points - 10)]);
            }
            $result->delete();
        }
        
        $event->delete();

        return redirect()->route('events.index')->with('success', 'Event deleted successfully.');
    }

    public function checkin(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        // Find member from logged in user (or dummy check for testing)
        $user = $request->user();
        if (!$user) {
            return redirect()->route('events.show', $id)->with('error', 'You must be logged in.');
        }

        $member = \App\Models\Member::where('user_id', $user->id)->first();
        if (!$member) {
            return redirect()->route('events.show', $id)->with('error', 'You are not a member.');
        }

        // Ensure not already checked in
        $alreadyCheckedIn = \App\Models\Result::where('event_id', $id)
            ->where('member_id', $member->member_id)
            ->exists();

        if ($alreadyCheckedIn) {
            return redirect()->route('events.show', $id)->with('error', 'You have already checked in for this event.');
        }

        \App\Models\Result::create([
                'event_id' => $id,
                'member_id' => $member->member_id,
                'name' => $member->name,
                'result_date' => $event->event_date,
                'event_points' => 10,
            ]);
            
            // Add 10 CP to member's lifetime points using addPoints which handles tiers and notifications
            $member->addPoints(10, 'points_checkin', $id);

        return redirect()->route('events.show', $id)->with('success', 'Checked in successfully!');
    }

    public function deleteCheckin(Request $request, $id, $result_id)
    {
        if (!$this->isAdmin($request->user())) {
            return redirect()->route('events.show', $id)->with('error', 'Unauthorized action.');
        }

        $result = \App\Models\Result::where('event_id', $id)->where('result_id', $result_id)->first();
        if ($result) {
            $member = \App\Models\Member::where('member_id', $result->member_id)->first();
            if ($member) {
                $member->update(['lifetime_points' => max(0, $member->lifetime_points - 10)]);
            }
            $result->delete();
        }

        return redirect()->back()->with('success', 'Participant removed.');
    }

    public function endSession(Request $request, $id)
    {
        if (!$this->isAdmin($request->user())) {
            return redirect()->route('events.show', $id)->with('error', 'Unauthorized action.');
        }

        $event = Event::findOrFail($id);
        
        if ($event->status === 'ended') {
            return redirect()->back()->with('error', 'Session already ended.');
        }

        // $request->placements = [{ result_id: 1, finish: 1 }, { result_id: 2, finish: 2 }]
        $placements = $request->input('placements', []);

        $cpMap = [
            1 => 25,
            2 => 18,
            3 => 12,
            4 => 8,
            5 => 6,
            6 => 4,
            7 => 2,
            8 => 1,
        ];

        foreach ($placements as $place) {
            $result = \App\Models\Result::find($place['result_id']);
            if ($result) {
                $finish = !empty($place['finish']) ? (int)$place['finish'] : null;
                $cp = $finish ? ($cpMap[$finish] ?? 0) : 0;
                
                // Update result with additional placement points and wins/losses/diff
                $result->update([
                    'finish' => $finish,
                    'attendance' => count($placements),
                    'placement_bonus' => $cp,
                    'wins' => isset($place['wins']) ? (int)$place['wins'] : 0,
                    'losses' => isset($place['losses']) ? (int)$place['losses'] : 0,
                    'diff' => isset($place['diff']) ? (int)$place['diff'] : 0,
                ]);

                    $member = \App\Models\Member::where('member_id', $result->member_id)->first();
                    if ($member) {
                        if ($cp > 0) {
                            $member->addPoints($cp, 'points_placement', $id);
                        }
                        $member->updateStats();
                    }
                } else {
                    $member = \App\Models\Member::where('member_id', $result->member_id)->first();
                    if ($member) {
                        $member->updateStats();
                    }
                }
            }
        }

        $event->update(['status' => 'ended']);

        return redirect()->back();
    }

    public function updateResult(Request $request, $id)
    {
        if (!$this->isAdmin($request->user())) {
            return redirect()->route('events.show', $id)->with('error', 'Unauthorized action.');
        }

        $resultId = $request->input('result_id');
        $result = \App\Models\Result::findOrFail($resultId);
        
        $wins = $request->input('wins');
        $losses = $request->input('losses');
        $diff = $request->input('diff');
        $finish = $request->input('finish');
        
        // Handle CP differences if placement changed (Optional, simple implementation first)
        $cpMap = [1 => 25, 2 => 18, 3 => 12, 4 => 8, 5 => 6, 6 => 4, 7 => 2, 8 => 1];
        $newCp = $finish ? ($cpMap[$finish] ?? 0) : 0;
        $oldCp = $result->placement_bonus;
        $cpDiff = $newCp - $oldCp;

        $result->update([
            'wins' => isset($wins) ? (int)$wins : 0,
            'losses' => isset($losses) ? (int)$losses : 0,
            'diff' => isset($diff) ? (int)$diff : 0,
            'finish' => !empty($finish) ? (int)$finish : null,
            'placement_bonus' => $newCp
        ]);

        $member = \App\Models\Member::where('member_id', $result->member_id)->first();
        if ($member) {
            if ($cpDiff !== 0) {
                // Adjust lifetime points if placement bonus changed
                // (Using addPoints directly with positive/negative value, though addPoints notification might be weird for negatives)
                // For a proper system, we just recalculate or update lifetime_points directly, but let's use the DB query.
                $member->update(['lifetime_points' => $member->lifetime_points + $cpDiff]);
            }
            $member->updateStats();
        }

        return redirect()->back();
    }
}
