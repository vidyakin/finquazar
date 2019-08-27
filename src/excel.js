

import { Workbook } from "exceljs";

const read = (path) => {
    const wb = new Workbook();

    wb.xlsx.readFile(path).then(file => {
        console.log("ФАЙЛ: " + file);
        const sh = file.getWorksheet(1);
        let bounds = {
            Cols: sh.actualColumnCount,
            Rows: sh.actualRowCount
        };
        console.log(`Колонок: ${bounds.Cols}, строк ${bounds.Rows}`);

        sh.eachRow((row, rowNumber) => {
            console.log(rowNumber + ": " + row.values[2]);
        });
    })
        .catch(err => {
        console.log("ОШИБКА ЧТЕНИЯ : " + err);
    });

}

export { read }