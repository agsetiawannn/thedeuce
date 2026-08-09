<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\Result;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $member = null;
        $sessionJoined = 0;
        $currentRank = null;
        $totalWins = 0;
        $totalLosses = 0;
        $winRate = 0;

        if ($user) {
            $member = Member::where('user_id', $user->id)->first();
            if ($member) {
                $sessionJoined = Result::where('member_id', $member->member_id)->count();
                
                // Calculate monthly rank
                $currentMonth = \Carbon\Carbon::now()->month;
                $currentYear = \Carbon\Carbon::now()->year;
                
                $allMembers = Member::withSum(['results as monthly_points' => function($query) use ($currentMonth, $currentYear) {
                        $query->whereMonth('result_date', $currentMonth)
                              ->whereYear('result_date', $currentYear);
                    }], 'event_points')
                    ->get()
                    ->map(function ($m) {
                        $m->monthly_points = $m->monthly_points ?? 0;
                        return $m;
                    })
                    ->sortByDesc('lifetime_points')
                    ->sortByDesc('monthly_points')
                    ->values();

                $currentRank = $allMembers->search(function($item) use ($member) {
                    return $item->member_id === $member->member_id;
                }) + 1;

                $totalWins = $member->total_wins;
                $totalLosses = $member->total_losses;
                $winRate = $member->win_rate;
            }
        }

        return Inertia::render('Profile/Index', [
            'sessionJoined' => $sessionJoined,
            'currentRank' => $currentRank,
            'totalWins' => $totalWins,
            'totalLosses' => $totalLosses,
            'winRate' => $winRate,
        ]);
    }

    public function show($id)
    {
        $member = Member::with('user')->where('member_id', $id)->firstOrFail();
        $sessionJoined = Result::where('member_id', $member->member_id)->count();
        
        // Calculate monthly rank
        $currentMonth = \Carbon\Carbon::now()->month;
        $currentYear = \Carbon\Carbon::now()->year;
        
        $allMembers = Member::withSum(['results as monthly_points' => function($query) use ($currentMonth, $currentYear) {
                $query->whereMonth('result_date', $currentMonth)
                      ->whereYear('result_date', $currentYear);
            }], 'event_points')
            ->get()
            ->map(function ($m) {
                $m->monthly_points = $m->monthly_points ?? 0;
                return $m;
            })
            ->sortByDesc('lifetime_points')
            ->sortByDesc('monthly_points')
            ->values();

        $currentRank = $allMembers->search(function($item) use ($member) {
            return $item->member_id === $member->member_id;
        }) + 1;

        $totalWins = $member->total_wins;
        $totalLosses = $member->total_losses;
        $winRate = $member->win_rate;

        return Inertia::render('Profile/Show', [
            'member' => $member,
            'sessionJoined' => $sessionJoined,
            'currentRank' => $currentRank,
            'totalWins' => $totalWins,
            'totalLosses' => $totalLosses,
            'winRate' => $winRate,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:100',
            'avatar' => 'nullable|image|max:10240', // max 10MB
        ]);

        $member = Member::where('user_id', $user->id)->first();
        if (!$member) {
            return redirect()->back()->with('error', 'Member profile not found');
        }

        // Handle Avatar Upload
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path;
        }

        // Update User Model
        $user->name = $request->name;
        $user->save();

        // Update Member Model
        $member->name = $request->name;
        $member->save();

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}
