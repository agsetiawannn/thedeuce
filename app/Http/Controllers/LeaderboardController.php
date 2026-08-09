<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;

class LeaderboardController extends Controller
{
    public function index()
    {
        $currentMonth = \Carbon\Carbon::now()->month;
        $currentYear = \Carbon\Carbon::now()->year;

        // Calculate points for the current month dynamically from the results table.
        // Using withSum avoids MySQL ONLY_FULL_GROUP_BY errors.
        $leaderboard = Member::with('user')
            ->withSum(['results as monthly_points' => function($query) use ($currentMonth, $currentYear) {
                $query->whereMonth('result_date', $currentMonth)
                      ->whereYear('result_date', $currentYear);
            }], 'event_points')
            ->get()
            ->map(function ($member) {
                $member->monthly_points = $member->monthly_points ?? 0;
                return $member;
            })
            ->sortByDesc('lifetime_points') // Fallback sorting by lifetime points
            ->sortByDesc('monthly_points')
            ->values();

        return Inertia::render('Leaderboard/Index', [
            'leaderboard' => $leaderboard,
        ]);
    }
}
