<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\Result;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $history = collect([]);

        if ($user) {
            $member = Member::where('user_id', $user->id)->first();
            if ($member) {
                $results = Result::with('event')
                    ->where('member_id', $member->member_id)
                    ->orderBy('result_date', 'desc')
                    ->orderBy('result_id', 'desc') // add secondary sort
                    ->get();
                    
                foreach ($results as $result) {
                    if ($result->finish) {
                        // Match ended, split into match result and check-in result
                        
                        // Match result (Placement CP)
                        $placementCp = $result->placement_bonus ?? 0;
                        if ($placementCp > 0) {
                            $history->push([
                                'id' => $result->result_id . '_match',
                                'is_checkin' => false,
                                'finish' => $result->finish,
                                'event' => $result->event,
                                'result_date' => $result->result_date,
                                'event_points' => $placementCp,
                            ]);
                        }
                        
                        // Check-in result
                        $history->push([
                            'id' => $result->result_id . '_checkin',
                            'is_checkin' => true,
                            'finish' => null,
                            'event' => $result->event,
                            'result_date' => $result->result_date,
                            'event_points' => 10,
                        ]);
                    } else {
                        // Check-in only
                        $history->push([
                            'id' => $result->result_id . '_checkin',
                            'is_checkin' => true,
                            'finish' => null,
                            'event' => $result->event,
                            'result_date' => $result->result_date,
                            'event_points' => $result->event_points ?: 10,
                        ]);
                    }
                }
            }
        }

        return Inertia::render('History/Index', [
            'history' => $history,
        ]);
    }
}
