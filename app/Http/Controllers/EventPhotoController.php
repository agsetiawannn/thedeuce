<?php

namespace App\Http\Controllers;

use App\Models\EventPhoto;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventPhotoController extends Controller
{
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

    public function upload(Request $request, $eventId)
    {
        if (!$this->isAdmin($request->user())) {
            return back()->with('error', 'Unauthorized.');
        }

        $request->validate([
            'photos' => 'required|array|max:20',
            'photos.*' => 'image|max:10240', // 10MB max per image
        ]);

        $event = Event::findOrFail($eventId);

        foreach ($request->file('photos') as $photo) {
            $filename = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
            $path = $photo->storeAs('event_photos/' . $eventId, $filename, 'public');

            EventPhoto::create([
                'event_id' => $eventId,
                'filename' => $photo->getClientOriginalName(),
                'path' => $path,
                'uploaded_by' => $request->user()->email,
            ]);
        }

        return back()->with('success', count($request->file('photos')) . ' photo(s) uploaded.');
    }

    public function destroy(Request $request, $eventId, $photoId)
    {
        if (!$this->isAdmin($request->user())) {
            return back()->with('error', 'Unauthorized.');
        }

        $photo = EventPhoto::where('event_id', $eventId)->findOrFail($photoId);
        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return back()->with('success', 'Photo deleted.');
    }
}
