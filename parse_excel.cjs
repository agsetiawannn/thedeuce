const XLSX = require('xlsx');

const workbook = XLSX.readFile('Members Point Archive-7.xlsx');
const worksheet = workbook.Sheets['Results'];
const data = XLSX.utils.sheet_to_json(worksheet);

const fs = require('fs');
fs.writeFileSync('storage/app/import_data_8.json', JSON.stringify({results: data}, null, 2));
console.log(`Saved ${data.length} results to storage/app/import_data_8.json`);
