<?php
require __DIR__.'/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

$inputFileType = 'Xlsx';
$inputFileName = 'DATABASE TDC (EDIT).xlsx';
$reader = IOFactory::createReader($inputFileType);
$reader->setReadDataOnly(true);
$spreadsheet = $reader->load($inputFileName);

$sheetNames = $spreadsheet->getSheetNames();
echo "Sheets:\n";
print_r($sheetNames);

foreach ($sheetNames as $sheetName) {
    echo "\nHeaders for '$sheetName':\n";
    $sheet = $spreadsheet->getSheetByName($sheetName);
    $highestColumn = $sheet->getHighestColumn();
    $rowData = $sheet->rangeToArray('A1:' . $highestColumn . '1', NULL, TRUE, FALSE);
    print_r($rowData[0]);
}
