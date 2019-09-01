/* eslint-disable no-unused-vars */

const XLSX = require("xlsx")
const ExcelJS = require("exceljs/modern.nodejs")

export function readData (path) {

	const wb = XLSX.readFile(path)    
	const sh = wb.Sheets[wb.SheetNames[0]]

	const diap = XLSX.utils.decode_range(sh["!ref"]) // 'A1:AI192 => {s: {c:0, r:0}, e: {c:34, r:192}}'
	const getVal = (c, r) => {
		let cell = sh[XLSX.utils.encode_cell({c, r})]
		return cell === undefined ? 0.0 : cell.v || 0.0 // упрощающая функция
	}

	let data = [], periods = []

    
	// заполняем периоды
	let pCol = 5
	let cell, cell1
	while (pCol < diap.e.c) {
	
		cell = getVal(pCol, 0)
		cell1 = getVal(pCol + 1, 0)
    
		if (cell1 !== "Все") { // последняя колонка
			periods.push({
				col: pCol,
				period: {
					p_id: cell + "_" + cell1.replace("кв. ",""),
					p_name: cell + " " + cell1
				}
			})
		// console.log(cell + " " + cell1)
		} 
		pCol += 5
	}

	// собираем данные в таблицу
	let line = {}
	for (let row = 3; row <= diap.e.r; row++) {
		line = {
			lType: getVal(0, row),
			acc: getVal(1, row),
			accName: getVal(2, row),
			saldoStartDt: getVal(3, row),
			saldoStartKt: getVal(4, row),
			periodicAmounts: [],
			totalDtAmounts: getVal(diap.e.c - 3, row),
			totalKtAmounts: getVal(diap.e.c - 2, row),
			totalDtSaldo: getVal(diap.e.c - 1, row),
			totalKtSaldo: getVal(diap.e.c, row)
		}
		periods.forEach( p => {
			let pAmount = {
				p_id: p.period.p_id,
				Dt: getVal(p.col+1, row), // pCol - колонка где номер периода. Дебет - после нее
				Kt: getVal(p.col+2, row),
				SaldoDt: getVal(p.col+3, row),
				SaldoKt: getVal(p.col+4, row)
			}
			line.periodicAmounts.push(pAmount)
		})
	
		data.push(line)
	}

	return {periods, data}    
}

export function saveData(data, path, done_func) {
	// Вариант без форматирования
	// const wb = XLSX.utils.book_new(); // Новая книга
	// const ws = XLSX.utils.json_to_sheet(data, {
	// 	header: ["Счет","Наименование", "Нач. сальдо ДТ", "Нач. сальдо Кт", "Обороты Дт", "Обороты Кт", "Кон. сальдо Дт", "Кон. сальдо Кт"]
	// });
	// XLSX.utils.book_append_sheet(wb, ws, "Данные по ОСВ");
	// XLSX.writeFile(wb, path);
	
	// 2 способ - с другой библиотекой
	const wb = new ExcelJS.Workbook()
	wb.creator = "Finomancer Lab"
	const sh = wb.addWorksheet("Данные по ОСВ")
	sh.colums = [
		{width: 10},
		{width: 30},
		{width: 40},
		{width: 40},
		{width: 40},
		{width: 40},
		{width: 40},
		{width: 40},
	]

	sh.addRow(["Отчет по ОСВ за 1 полугодие 2019 года"])
	sh.addRow(['000','Счет начального заполнения',0,10, 0,0, 0,10])
	sh.getRow(0).font = {name: "Arial", family: 1, size: 16}
	wb.xlsx.writeFile(path).then( result => {
		return done_func(result)
	})
}

export function readData_old(path) {
	
	// return wb.xlsx.readFile(path).then( (file) => {
	// 	//wb.xlsx.readFile(path).then(file => {
	// 	console.log("ФАЙЛ: " + file)
	// 	const sh = file.getWorksheet(1)

	// 	if (sh.getRow(2).values[2] != "Счет (ИНН)") {
	// 		console.log("Файл не подходит для обработки")            
	// 		return 
	// 	}
	// 	let bounds = {
	// 		Cols: sh.actualColumnCount,
	// 		Rows: sh.actualRowCount
	// 	}
	// 	console.log(`Колонок: ${bounds.Cols}, строк ${bounds.Rows}`)
	// 	// читаем периоды по первой строке
	// 	let r1vals = sh.getRow(1).values
	// 	for (let i = 6; i < r1vals.length; i+=5) {
	// 		if (r1vals[i] == "" || r1vals[i] == undefined) break
	// 		periods.push({
	// 			p_id: r1vals[i]+r1vals[i+1].replace("кв. ",""), 
	// 			p_name: r1vals[i]+r1vals[i+1]
	// 		})               
	// 	}
	// 	console.log(periods)
	// 	// sh.eachRow((row, rowNumber) => {
	// 	//     // цикл по колонкам и определение периодов
	// 	//     data.push({
	// 	//         acc: row.values[1],
	// 	//         accName: row.values[2],
	// 	//         DtBegin: row.values[3],
	// 	//         KtBegin: row.values[3],
	// 	//         DtOborot: row.values[3],
	// 	//         KtOborot: row.values[3],
	// 	//         DtEnd: row.values[3],
	// 	//         KtEnd: row.values[3],
	// 	//     })
	// 	//     console.log(rowNumber + ": " + row.values[2]);
	// 	// });
	// 	return periods
	// 	// return new Promise( (resolve,reject) => {
	// 	//     resolve({periods, data})
	// 	// })
	// })
	// .catch(err => {
	// 	console.log("ОШИБКА ЧТЕНИЯ : " + err)
	// })
}
