<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $notificationId = $request->input('id');
            if ($notificationId) {
                $notification = $user->unreadNotifications()->where('id', $notificationId)->first();
                if ($notification) {
                    $notification->markAsRead();
                }
            } else {
                $user->unreadNotifications->markAsRead();
            }
        }
        return redirect()->back();
    }
}
