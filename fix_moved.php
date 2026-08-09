<?php
$log = <<<LOG
Moved to M0108 and created 'ABISEKA J' at M0005.
Moved to M0109 and created 'SEKAR W' at M0020.
Moved to M0110 and created 'ELSYE' at M0047.
Moved to M0111 and created 'RICAT' at M0048.
Moved to M0112 and created 'RELIN' at M0050.
Moved to M0113 and created 'ANDRIAN' at M0051.
Moved to M0114 and created 'DEVA' at M0052.
Moved to M0115 and created 'ARI YUDHA' at M0054.
Moved to M0116 and created 'GUSDE' at M0055.
Moved to M0117 and created 'KAON H' at M0056.
Moved to M0118 and created 'ANA DWI' at M0057.
Moved to M0119 and created 'ALBERT' at M0058.
Moved to M0120 and created 'Jason' at M0059.
Moved to M0121 and created 'Detha' at M0060.
Moved to M0122 and created 'Vinta' at M0061.
Moved to M0123 and created 'Yuvan' at M0062.
Moved to M0124 and created 'REVIN' at M0063.
Moved to M0125 and created 'ARYA' at M0064.
Moved to M0126 and created 'CIKA' at M0065.
Moved to M0127 and created 'YUWI' at M0066.
Moved to M0128 and created 'THESSA' at M0067.
Moved to M0129 and created 'ANDRE' at M0068.
Moved to M0130 and created 'HENRY' at M0069.
Moved to M0131 and created 'Kenzy' at M0070.
Moved to M0132 and created 'Michellie' at M0071.
Moved to M0133 and created 'Habib' at M0072.
Moved to M0134 and created 'Nofella' at M0073.
Moved to M0135 and created 'Risa' at M0074.
LOG;
$lines = explode("\n", $log);
$moves = [];
foreach ($lines as $line) {
    if (preg_match("/Moved to (M\d+) and created '(.*?)' at (M\d+)/", $line, $matches)) {
        $moves[] = [
            'new_id' => $matches[1],
            'excel_name' => $matches[2],
            'old_id' => $matches[3]
        ];
    }
}
echo json_encode($moves, JSON_PRETTY_PRINT);
