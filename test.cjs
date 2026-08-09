const XLSX = require('xlsx');
const workbook = XLSX.readFile('DATABASE TDC (EDIT).xlsx');
console.log(workbook.SheetNames);
