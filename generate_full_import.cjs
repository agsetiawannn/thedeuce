const XLSX = require('xlsx');
const fs = require('fs');

const filename = process.argv[2] || 'Members Point Archive-7.xlsx';
const workbook = XLSX.readFile(filename);

const eventsSheet = workbook.Sheets['Events'];
const eventsData = XLSX.utils.sheet_to_json(eventsSheet);

const resultsSheet = workbook.Sheets['Results'];
const resultsData = XLSX.utils.sheet_to_json(resultsSheet);

const membersSheet = workbook.Sheets['Members'];
const membersData = XLSX.utils.sheet_to_json(membersSheet);

fs.writeFileSync('storage/app/full_import_data.json', JSON.stringify({
    events: eventsData,
    results: resultsData,
    members: membersData
}, null, 2));

console.log(`Saved ${eventsData.length} events, ${resultsData.length} results, and ${membersData.length} members to full_import_data.json`);
