

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
        let data = []
        sh.eachRow((row, rowNumber) => {
            // цикл по колонкам и определение периодов
            data.push({
                acc: row.values[1],
                accName: row.values[2],
                DtBegin: row.values[3],
                KtBegin: row.values[3],
                DtOborot: row.values[3],
                KtOborot: row.values[3],
                DtEnd: row.values[3],
                KtEnd: row.values[3],
            })
            console.log(rowNumber + ": " + row.values[2]);
        });
    })
        .catch(err => {
        console.log("ОШИБКА ЧТЕНИЯ : " + err);
    });
}

export { read }