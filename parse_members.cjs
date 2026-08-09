const XLSX = require('xlsx');
const workbook = XLSX.readFile('Members Point Archive-7.xlsx');
const worksheet = workbook.Sheets['Members'];
const data = XLSX.utils.sheet_to_json(worksheet);

const fs = require('fs');
fs.writeFileSync('storage/app/import_members.json', JSON.stringify({members: data}, null, 2));
console.log(`Saved ${data.length} members to storage/app/import_members.json`);
