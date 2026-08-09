const XLSX = require('xlsx');
const workbook = XLSX.readFile('DATABASE TDC (EDIT).xlsx');

console.log("members headers:", Object.keys(XLSX.utils.sheet_to_json(workbook.Sheets['members'])[0] || {}));
console.log("users headers:", Object.keys(XLSX.utils.sheet_to_json(workbook.Sheets['users'])[0] || {}));
console.log("RESULT headers:", Object.keys(XLSX.utils.sheet_to_json(workbook.Sheets['RESULT'])[0] || {}));
