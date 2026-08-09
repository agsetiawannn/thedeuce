<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Member;
use Illuminate\Support\Facades\DB;

$mappings = [
    'M0108' => 'M0005', // Abiseka -> ABISEKA J
    'M0109' => 'M0020', // SEKAR TABSKUY -> SEKAR W
    'M0110' => 'M0047', // TDC ADMIND -> ELSYE
    'M0105' => 'M0050', // Relin Tania -> RELIN
    'M0117' => 'M0051', // Andrian -> ANDRIAN
    'M0114' => 'M0049', // Varien -> VARIEN
    'M0116' => 'M0052', // DEVA NUGRAHA -> DEVA
    'M0129' => 'M0054', // Ariyudha IB -> ARI YUDHA
    'M0130' => 'M0056', // Kaon Hasegawa -> KAON H
    'M0133' => 'M0057', // Kadek Ana Dwijayanti -> ANA DWI
    'M0120' => 'M0058', // B.02.Albert Gunawan -> ALBERT
    'M0078' => 'M0059', // jason darmadi -> Jason
    'M0104' => 'M0060', // Detha Nata Ganendra -> Detha
    'M0080' => 'M0061', // Yuvinta Riandisty -> Vinta
    'M0107' => 'M0062', // Yuvan Gunawan -> Yuvan
    'M0083' => 'M0063', // Revin Almadani -> REVIN
    'M0084' => 'M0064', // Arya Janardana -> ARYA
    'M0082' => 'M0065', // cika reni hafida -> CIKA
    'M0079' => 'M0067', // thessalonica kd -> THESSA
    'M0086' => 'M0069', // raffael henrycus -> HENRY
    'M0091' => 'M0070', // Kenzy Kusmulyadi -> Kenzy
    'M0092' => 'M0071', // Michellie Danara -> Michellie
    'M0088' => 'M0072', // Muhammad Habbib Rayhan -> Habib
    'M0090' => 'M0073', // Nofella -> Nofella
    'M0089' => 'M0074', // Risa P. -> Risa
    'M0093' => 'M0075', // Muhammad Ghiffari Eka Wiguna -> Ghifari
    'M0096' => 'M0076', // Thomas Suryanata -> Thomas
    'M0094' => 'M0077', // Chandra D Pakpahan -> Dicky Chandra
];

DB::statement('SET FOREIGN_KEY_CHECKS=0;');
DB::beginTransaction();
try {
    foreach ($mappings as $fromId => $toId) {
        $memberFrom = Member::where('member_id', $fromId)->first();
        $memberTo = Member::where('member_id', $toId)->first();
        
        if ($memberFrom && $memberTo) {
            echo "Mapping {$memberFrom->name} ($fromId) -> {$memberTo->name} ($toId)...\n";
            $memberTo->user_id = $memberFrom->user_id;
            $memberTo->email = $memberFrom->email;
            $memberTo->phone_number = $memberFrom->phone_number;
            $memberTo->join_date = $memberFrom->join_date;
            $memberTo->name = $memberFrom->name; // Keep app name
            $memberTo->save();
            
            try {
                $memberFrom->delete();
                echo "  Deleted empty $fromId.\n";
            } catch (\Exception $e) {
                $memberFrom->user_id = null;
                $memberFrom->save();
                echo "  Could not delete $fromId, set user_id to null.\n";
            }
        }
    }
    
    // One final stat update to be safe
    \Illuminate\Support\Facades\Artisan::call('members:update-stats');
    
    DB::commit();
    echo "SUCCESS!\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
} finally {
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
}
