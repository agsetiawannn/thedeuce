const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('DATABASE TDC (EDIT).xlsx', { cellDates: true });
const data = {
    members: XLSX.utils.sheet_to_json(workbook.Sheets['MEMBER LIST'], { raw: false, dateNF: 'yyyy-mm-dd' }),
    events: XLSX.utils.sheet_to_json(workbook.Sheets['EVENT'], { raw: false, dateNF: 'yyyy-mm-dd' }),
    results: XLSX.utils.sheet_to_json(workbook.Sheets['RESULT'], { raw: false, dateNF: 'yyyy-mm-dd' })
};

fs.writeFileSync('import_data_new.json', JSON.stringify(data, null, 2));
console.log("Converted to import_data_new.json");
