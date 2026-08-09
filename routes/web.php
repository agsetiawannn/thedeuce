<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\LeaderboardController;

Route::get('/login', function () {
    return inertia('Auth/Login');
})->name('login');

Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

Route::middleware('auth')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');
    
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');

    Route::get('/events/{id}', [EventController::class, 'show'])->name('events.show');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');
    Route::match(['get', 'post'], '/events/{id}/checkin', [EventController::class, 'checkin'])->name('events.checkin');
    Route::delete('/events/{id}/checkin/{result_id}', [EventController::class, 'deleteCheckin'])->name('events.checkin.delete');
    Route::post('/events/{id}/end', [EventController::class, 'endSession'])->name('events.endSession');
    Route::put('/events/{id}/result', [EventController::class, 'updateResult'])->name('events.updateResult');

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/history', [HistoryController::class, 'index'])->name('history');

    Route::get('/check-in', function () {
        return inertia('CheckIn/Index');
    })->name('checkin');

    Route::get('/tier', function () {
        return inertia('Tier/Index');
    })->name('tier');

    Route::post('/notifications/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');

    Route::post('/logout', [GoogleController::class, 'logout'])->name('logout');
});


