<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
\App\Models\Event::where('event_id', 'E0013')->update(['status' => 'ended']);
echo "Updated\n";
