<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Result;
use App\Models\Member;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $upcomingEvent = Event::whereDate('event_date', '>=', \Carbon\Carbon::now('Asia/Makassar')->toDateString())
            ->orderBy('event_date', 'asc')
            ->first();

        $lastSession = null;
        $currentRank = null;
        $member = null;
        $user = $request->user();

        if ($user) {
            $member = Member::where('user_id', $user->id)->first();
            if ($member) {
                $lastSession = Result::with('event')
                    ->where('member_id', $member->member_id)
                    ->orderBy('result_date', 'desc')
                    ->first();
                if ($lastSession) {
                    $lastSession->total_players = Result::where('event_id', $lastSession->event_id)->count();
                }
            }
        }

        $currentMonth = \Carbon\Carbon::now()->month;
        $currentYear = \Carbon\Carbon::now()->year;

        // Leaderboard based on monthly points
        $allMembers = Member::with('user')
            ->withSum(['results as monthly_points' => function($query) use ($currentMonth, $currentYear) {
                $query->whereMonth('result_date', $currentMonth)
                      ->whereYear('result_date', $currentYear);
            }], 'event_points')
            ->get()
            ->map(function ($m) {
                $m->monthly_points = $m->monthly_points ?? 0;
                return $m;
            })
            ->sortByDesc('lifetime_points') // Fallback sorting by lifetime points
            ->sortByDesc('monthly_points')
            ->values();

        $leaderboard = $allMembers->take(3);

        if ($member) {
            // Check for monthly recap notification
            $lastMonth = \Carbon\Carbon::now()->subMonth()->month;
            $lastMonthYear = \Carbon\Carbon::now()->subMonth()->year;
            $recapKey = "recap_{$lastMonthYear}_{$lastMonth}";

            $hasRecap = $user->notifications()
                ->where('type', 'App\Notifications\InAppNotification')
                ->where('data', 'LIKE', "%{$recapKey}%")
                ->exists();

            if (!$hasRecap) {
                // Calculate their rank for last month
                $allLastMonth = Member::withSum(['results as monthly_points' => function($query) use ($lastMonth, $lastMonthYear) {
                        $query->whereMonth('result_date', $lastMonth)
                              ->whereYear('result_date', $lastMonthYear);
                    }], 'event_points')
                    ->get()
                    ->map(function ($m) {
                        $m->monthly_points = $m->monthly_points ?? 0;
                        return $m;
                    })
                    ->sortByDesc('lifetime_points')
                    ->sortByDesc('monthly_points')
                    ->values();

                $indexLastMonth = $allLastMonth->search(function ($item) use ($member) {
                    return $item->member_id === $member->member_id;
                });

                if ($indexLastMonth !== false) {
                    $rankLastMonth = $indexLastMonth + 1;
                    $pointsLastMonth = $allLastMonth[$indexLastMonth]->monthly_points;
                    
                    if ($pointsLastMonth > 0) {
                        $monthName = \Carbon\Carbon::now()->subMonth()->format('F');
                        $user->notify(new \App\Notifications\InAppNotification(
                            "{$monthName} Recap",
                            "You ranked #{$rankLastMonth} last month with {$pointsLastMonth} CP!",
                            'monthly_recap',
                            ['recap_key' => $recapKey, 'rank' => $rankLastMonth, 'points' => $pointsLastMonth, 'month' => $monthName]
                        ));
                    } else {
                        // Insert a dummy notification so we don't keep calculating this every time if they had 0 points
                        $user->notify(new \App\Notifications\InAppNotification('Silent Recap', '0', 'monthly_recap_silent', ['recap_key' => $recapKey]));
                    }
                }
            }

            // Find rank dynamically based on sorted collection for CURRENT month
            $index = $allMembers->search(function ($item) use ($member) {
                return $item->member_id === $member->member_id;
            });
            $currentRank = $index !== false ? $index + 1 : null;
        }

        $notifications = [];
        if ($user) {
            $notifications = $user->unreadNotifications()
                ->where('type', 'App\Notifications\InAppNotification')
                ->where('data->type', '!=', 'monthly_recap_silent')
                ->get();
        }

        return Inertia::render('Main', [
            'upcomingEvent' => $upcomingEvent,
            'lastSession' => $lastSession,
            'leaderboard' => $leaderboard,
            'currentRank' => $currentRank,
            'notifications' => $notifications,
        ]);
    }
}
