
const Excel = require('exceljs/modern.nodejs')

const wb = new Excel.Workbook()

let periods = []

wb.xlsx.readFile('C:/Документы/Доп/rbs.xlsx').then(file => {
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
})
.catch(err=>{
    console.log('Ошибка чтения: '+err + '\n' + err.stack);        
})