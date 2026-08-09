<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->getEmail())->first();
            
            if (!$user) {
                $user = User::create([
                    'email' => $googleUser->getEmail(),
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(\Illuminate\Support\Str::random(16)),
                ]);
            } else {
                $user->google_id = $googleUser->getId();
                // Preserve manually updated avatar, only overwrite if empty
                if (empty($user->avatar) || str_starts_with($user->avatar, 'http')) {
                    $user->avatar = $googleUser->getAvatar();
                }
                $user->save();
            }

            // Link member data automatically based on email
            $member = \Illuminate\Support\Facades\DB::table('members')
                ->where('email', $user->email)
                ->first();

            if (!$member) {
                // Generate new member ID
                $lastMember = \Illuminate\Support\Facades\DB::table('members')->orderBy('member_id', 'desc')->first();
                $nextId = 'M0001';
                if ($lastMember && preg_match('/^M(\d+)$/', $lastMember->member_id, $matches)) {
                    $nextId = 'M' . str_pad((int)$matches[1] + 1, 4, '0', STR_PAD_LEFT);
                }
                
                \Illuminate\Support\Facades\DB::table('members')->insert([
                    'member_id' => $nextId,
                    'name' => $user->name,
                    'join_date' => now()->toDateString(),
                    'status_tier' => 'DIAMOND',
                    'email' => $user->email,
                    'lifetime_points' => 0,
                    'phone_number' => null,
                    'user_id' => $user->id,
                ]);
            } else {
                \Illuminate\Support\Facades\DB::table('members')
                    ->where('member_id', $member->member_id)
                    ->update(['user_id' => $user->id, 'name' => $user->name]);
            }

            Auth::login($user, true);

            return redirect()->intended('/');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google login failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect('/login')->withErrors(['error' => 'Unable to login with Google: ' . $e->getMessage()]);
        }
    }

    public function logout(\Illuminate\Http\Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
