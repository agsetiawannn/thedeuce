<?php
require __DIR__ . '/domains/thedeuceclub.app/laravel/vendor/autoload.php';
$app = require_once __DIR__ . '/domains/thedeuceclub.app/laravel/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$events = App\Models\Event::whereIn('event_name', ['Singles Intense Point Play'])->where('location', 'testing')->get();
foreach($events as $event) {
    App\Models\Result::where('event_id', $event->event_id)->delete();
    $event->delete();
}
echo "Events deleted.\n";
