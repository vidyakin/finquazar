
import { Workbook } from "exceljs/modern.nodejs";

const wb = new Workbook()

wb.xlsx.readFile('D:/Работа/Михаил Цалапов, БП/Excel/rbs.xlsx').then(file => {
    console.log("ФАЙЛ: " + file);
    const sh = file.getWorksheet(1);
    let data = [], periods = [], n=6
        // читаем периоды по первой строке
        let r1vals = sh.getRow(1).values
        while (true) {
            if (r1vals[n] == "") break
            periods.push({
                p_id: r1vals[n]+r1vals[n+1].replace('кв. ',''), 
                p_name: r1vals[n]+r1vals[n+1]
            })               
        }
        console.log(periods)
    })
    .catch(err=>{
        console.log('Ошибка чтения: '+err + '\n' + err.stack);        
    })