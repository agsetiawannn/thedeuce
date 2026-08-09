const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('DATABASE TDC (EDIT).xlsx', { cellDates: true });

const options = { raw: false, dateNF: 'yyyy-mm-dd hh:mm:ss' };
const data = {
    members: XLSX.utils.sheet_to_json(workbook.Sheets['members'], options),
    users: XLSX.utils.sheet_to_json(workbook.Sheets['users'], options),
    results: XLSX.utils.sheet_to_json(workbook.Sheets['RESULT'], options)
};

for (let u of data.users) {
    if (u.avatar === undefined) u.avatar = null;
    if (u.google_id === undefined) u.google_id = null;
    if (u.password === undefined) u.password = '$2y$12$Z1lU9XgA9qY6D...';
}

fs.writeFileSync('db_dump.json', JSON.stringify(data, null, 2));
