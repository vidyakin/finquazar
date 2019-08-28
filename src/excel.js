

import { Workbook } from "exceljs/modern.nodejs";
const  fs  = require('fs')
import { resolve } from "path";
import { reject } from "q";

export function readData (path) {
    const wb = new Workbook();
    let data = [], periods = []
        
    let stream = fs.createReadStream(path);
    //stream.push(path)
    //stream.push(null)
    return wb.xlsx.read(stream).then( (file) => {
    //wb.xlsx.readFile(path).then(file => {
        console.log("ФАЙЛ: " + file);
        const sh = file.getWorksheet(1);

        if (sh.getRow(2).values[2] != "Счет (ИНН)") {
            console.log("Файл не подходит для обработки")            
            return 
        }
        let bounds = {
            Cols: sh.actualColumnCount,
            Rows: sh.actualRowCount
        };
        console.log(`Колонок: ${bounds.Cols}, строк ${bounds.Rows}`);
        // читаем периоды по первой строке
        let r1vals = sh.getRow(1).values
        for (let i = 6; i < r1vals.length; i+=5) {
            if (r1vals[i] == "" || r1vals[i] == undefined) break
            periods.push({
                p_id: r1vals[i]+r1vals[i+1].replace('кв. ',''), 
                p_name: r1vals[i]+r1vals[i+1]
            })               
        }
        console.log(periods);
        // sh.eachRow((row, rowNumber) => {
        //     // цикл по колонкам и определение периодов
        //     data.push({
        //         acc: row.values[1],
        //         accName: row.values[2],
        //         DtBegin: row.values[3],
        //         KtBegin: row.values[3],
        //         DtOborot: row.values[3],
        //         KtOborot: row.values[3],
        //         DtEnd: row.values[3],
        //         KtEnd: row.values[3],
        //     })
        //     console.log(rowNumber + ": " + row.values[2]);
        // });
        return periods
        // return new Promise( (resolve,reject) => {
        //     resolve({periods, data})
        // })
    })
        .catch(err => {
        console.log("ОШИБКА ЧТЕНИЯ : " + err);
    });
}
