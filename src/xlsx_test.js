
const XLSX = require('xlsx')
const wb = XLSX.readFile("C:/Документы/Доп/Scoring_7799555550_20190729_55127df3135fc047832c7c82a4e2449f/rbs.xlsx");

const sh = wb.Sheets[wb.SheetNames[0]];
const sheet = XLSX.utils.sheet_to_json(sh)

console.log();

console.log(sh['B2'].v);