const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('DATABASE TDC (EDIT).xlsx', { cellDates: false });

const data = {
    members: XLSX.utils.sheet_to_json(workbook.Sheets['members']),
    users: XLSX.utils.sheet_to_json(workbook.Sheets['users']),
    results: XLSX.utils.sheet_to_json(workbook.Sheets['RESULT'])
};

// Clean up dates or undefined
for (let u of data.users) {
    if (u.created_at) u.created_at = String(u.created_at);
    if (u.updated_at) u.updated_at = String(u.updated_at);
    if (u.avatar === undefined) u.avatar = null;
    if (u.google_id === undefined) u.google_id = null;
    if (u.password === undefined) u.password = '$2y$12$Z1lU9XgA9qY6D...'; // just placeholder
}

fs.writeFileSync('db_dump.json', JSON.stringify(data, null, 2));
