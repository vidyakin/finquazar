/* eslint-disable no-unused-vars */

const XLSX = require("xlsx")
const ExcelJS = require("exceljs")

const fontColor = {argb: "FF003F2F"}
const styles = {
	fonts: {
		headLine: {name: "Arial", size: 10, color: fontColor, bold: true},
		line: {name: "Arial", size: 9},
		line_acc: {name: "Arial", size: 10, bold: true},
		totals: {name: "Arial", size: 10, color: fontColor, bold: true},
		header: {name: "Arial", size: 12, bold: true}
	},
	border: {
		top:  {style: "thin", color: {argb: "FFA0A0A0"}},
		left: {style: "thin", color: {argb: "FFA0A0A0"}},
		bottom: {style: "thin", color: {argb: "FFA0A0A0"}},
		right: {style: "thin", color: {argb: "FFA0A0A0"}}
	},
	fillHeader: {
		type: "pattern",
		pattern: "solid",
		fgColor: {argb:"FFD6E5CB"}
	},
	fillTopAcc: {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "ffe4f0dd"}
	},
	fillPeriodHeader: {
		type: "pattern",
		pattern: "solid",
		fgColor: {argb: "fff0f6ef"}
	},
	fillLineRoot: {
		type: "pattern",
		pattern: "solid",
		fgColor: {argb:"FFE4F0DD"}
	}
}

/**
 * Чтение данных из экселя
 * 
 * @param {string} path Путь к файлу, полученному из диалога выбора файлов
 */
export function readData (path) {

	const wb = XLSX.readFile(path)    
	const sh = wb.Sheets[wb.SheetNames[0]]

	const diap = XLSX.utils.decode_range(sh["!ref"]) // 'A1:AI192 => {s: {c:0, r:0}, e: {c:34, r:192}}'
	const getVal = (c, r) => {
		let cell = sh[XLSX.utils.encode_cell({c, r})]
		return cell === undefined ? 0.0 : 
			typeof(cell.v) === "string" ? cell.v.trim() : cell.v 
			|| 0.0 // упрощающая функция
	}

	let data = [], periods = [], firm = {inn: "", name: ""}
	if (getVal(0, 0) != 0 && getVal(0, 0) != "") {
		firm = {inn: getVal(0, 0).replace("ИНН ",""), name: getVal(1, 0)}
	}	
    
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
					p_id: cell + "_" + cell1.replace("кв. ","").replace(/\(.+\) /g,""),
					p_name: cell + " " + cell1
				}
			})
		// console.log(cell + " " + cell1)
		} 
		pCol += 5
	}

	// очистка строки от пробелов если это строка 
	const conv = v => typeof(v) == "string" ? parseFloat(v.replace(/\s/g,"")) : v

	// собираем данные в таблицу
	let line = {}
	for (let row = 3; row <= diap.e.r; row++) {
		line = {
			rowN: row,
			lType: getVal(0, row),
			acc: getVal(1, row),
			accName: getVal(2, row),
			DtStart: conv(getVal(3, row)),
			KtStart: conv(getVal(4, row)),
			periodicAmounts: [],
			Dt: conv(getVal(diap.e.c - 3, row)),
			Kt: conv(getVal(diap.e.c - 2, row)),
			DtEnd: conv(getVal(diap.e.c - 1, row)),
			KtEnd: conv(getVal(diap.e.c, row))
		}
		periods.forEach( p => {
			let pAmount = {
				p_id: p.period.p_id,
				Dt: conv(getVal(p.col+1, row)), // pCol - колонка где номер периода. Дебет - после нее
				Kt: conv(getVal(p.col+2, row)),
				SaldoDt: conv(getVal(p.col+3, row)),
				SaldoKt: conv(getVal(p.col+4, row))
			}
			line.periodicAmounts.push(pAmount)
		})
	
		data.push(line)
	}

	return {periods, data, firm}    
}

/**
 * Сохранение данных в файл
 * 
 * @param {array of objects} data - массив данных, которые надо сохранить
 * @param {string} path - путь к файлу для сохранения
 * @param {*} header - заголовок для названия отчета в экселе
 */
export function saveData(data, path, header) {
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

	// идентификаторы колонок должны совпадать с именами в объекте таблицы
	sh.columns = [
		{key: "acc", width: 60},
		{key: "accName", width: 20},	// ИНН
		{key: "DtStart", width: 20},
		{key: "KtStart", width: 20},
		{key: "Dt", width: 20},
		{key: "Kt", width: 20},
		{key: "DtEnd", width: 20},
		{key: "KtEnd", width: 20},
	]
	// данные для заполнения
	
	// ШАПКА
	sh.addRow([""])
	let head = sh.addRow([header])
	sh.addRow([""])

	head.font = styles.fonts.header

	let headRows = []
	let h1 = sh.addRow(["Счет","ИНН", "Начальное сальдо", "",      "Обороты", "",      "Конечное сальдо",""])
	let h2 = sh.addRow(["",    "",         "Дт", "Кт",             "Дт", "Кт",            "Дт", "Кт"    ])
	headRows.push(h1, h2)

	headRows.forEach(r => {
		r.eachCell({includeEmpty: true}, (cell, col)=>{
			cell.fill = styles.fillHeader
			cell.border = styles.border
			cell.font = styles.fonts.headLine
			cell.alignment = {horizontal: "center", vertical: "top"}
			// if (col < 3) cell.alignment = {vertical: "top"}
		})
	})

	// объединения в шапке - сальдо, обороты
	sh.mergeCells("C4","D4")
	sh.mergeCells("E4","F4")
	sh.mergeCells("G4","H4")
	// в колонках вертикально:
	sh.mergeCells("A4","A5")
	sh.mergeCells("B4","B5")
	// выравнивание проставляем чтоб совсем красиво
	// sh.getCell("A4").alignment = {vertical: "top"}
	// sh.getCell("B4").alignment = {vertical: "top"}

	const totals = {
		DtStart: 0, KtStart: 0,
		Dt: 0, Kt: 0,
		DtEnd: 0, KtEnd: 0
	}

	// ==== MAIN DATA
	//sh.addRows(tblDemo)
	data.forEach(dataStr => {
		// компонуем данные для строки в нужном виде
		let prepared_row = [
			dataStr.lType == "ОСВ_общая" ? dataStr.acc+", "+dataStr.accName : dataStr.accName,
			dataStr.lType.slice(0,5) == "ОСВ_6" ? (dataStr.acc == 0 ? "" :dataStr.acc) : "",
			dataStr.DtStart,
			dataStr.KtStart,
			dataStr.Dt,
			dataStr.Kt,
			dataStr.DtEnd,
			dataStr.KtEnd,
		]
		// добавляем строку
		let row = sh.addRow(prepared_row)

		// для каждой ячейки применяем форматирование в зависимости от типа и колонки
		row.eachCell({includeEmpty: true}, (cell, col)=>{
			//let level = dataStr.acc !== 0 && dataStr.acc.indexOf(".")!==-1 ? dataStr.acc.split(".").length : 0
			let level = dataStr.lType == "ОСВ_общая" ? dataStr.acc.split(".").length : 3
				
			if (level == 1) {
				cell.fill = styles.fillLineRoot
				cell.font = styles.fonts.headLine
			}
			else if (dataStr.lType == "ОСВ_общая") {
				cell.font = styles.fonts.line_acc
			}
			else {
				cell.font = styles.fonts.line
			}
			cell.border = styles.border
			if (col == 1) cell.alignment = {indent: level-1 , vertical: "top"}
			if (col == 2) cell.alignment = {wrapText: true }
			if (col > 2)  {
				cell.numFmt = "0.00"
				cell.alignment = {vertical: "top"}
			}
		})
		totals.DtStart += dataStr.DtStart
		totals.KtStart += dataStr.KtStart
		totals.Dt += dataStr.Dt
		totals.Kt += dataStr.Kt
		totals.DtEnd += dataStr.DtEnd
		totals.KtEnd += dataStr.KtEnd
	})

	let totalLine = sh.addRow(["Итого","",totals.DtStart, totals.KtStart, totals.Dt, totals.Kt, totals.DtEnd, totals.KtEnd])
	totalLine.eachCell({includeEmpty: true}, (cell) => {
		cell.fill = styles.fillHeader
		cell.font = styles.fonts.totals
		cell.border = styles.border
		cell.numFmt = "0.00"
	})

	wb.xlsx.writeFile(path).then( result => {
		console.log("Сохранение завершено",result)    
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

export function saveAnalysisData(data, path, header, show_empty_lines) {
	const wb = new ExcelJS.Workbook()
	wb.creator = "Finomancer Lab"
	const sh = wb.addWorksheet("Данные по ОСВ")

	// идентификаторы колонок должны совпадать с именами в объекте таблицы
	sh.columns = [
		{key: "col1", width: 40},
		{key: "col2", width: 30},	// ИНН
		{key: "Dt", width: 25},
		{key: "Kt", width: 25},
	]

	// Функция определения выводимости строки 
	let show_empty = item => {
		if (item.period_sum == undefined) {
			console.log(item.acc, item.korr, item.p)
			return true
		}
		return show_empty_lines || item.period_sum.Dt != 0 || item.period_sum.Kt != 0
	}
	
	// ШАПКА
	sh.addRow([""])
	let head = sh.addRow([header])
	sh.addRow([""])

	head.font = styles.fonts.header

	let headRows = []
	let h1 = sh.addRow(["Счет",   "Корр. счет", "Дебет", "Кредит"])
	let h2 = sh.addRow(["Период", "",           "",      ""])
	headRows.push(h1, h2)
	headRows.forEach(r => {
		r.eachCell({includeEmpty: true}, (cell, col)=>{
			cell.fill = styles.fillHeader
			cell.border = styles.border
			cell.font = styles.fonts.headLine
			cell.alignment = {horizontal: "left", vertical: "top"}
			// if (col < 3) cell.alignment = {vertical: "top"}
		})
	})
	// в колонках вертикально объединяем ячейки:
	sh.mergeCells("B4","B5")
	sh.mergeCells("C4","C5")
	sh.mergeCells("D4","D5")
	

	// ==== MAIN DATA
	data.forEach(row => {
		if (row.lType == "header") {
			let r = sh.addRow([row.acc, "Начальное сальдо", "", ""])
			r.eachCell({includeEmpty: true}, (c,coln) => {
				c.fill = styles.fillTopAcc
				c.border = styles.border
			})
		}
		else if (row.lType == "subconto" && row.p != "" && row.korr == "" && show_empty(row) ) {
			let r = sh.addRow([`Обороты за ${row.p.p_name}`, "Начальное сальдо", "", ""])
			r.eachCell({includeEmpty: true}, (c,coln) => {
				c.fill = styles.fillPeriodHeader
				c.border = styles.border
				if (coln <= 2) {
					c.alignment = {indent: 2}
				}
			})
		}
		else if (row.lType == "subconto" && row.korr != "" && show_empty(row)) {
			let r = sh.addRow(["", row.korr, row.period_sum.Dt, row.period_sum.Kt])
			r.eachCell({includeEmpty: true}, (c,coln) => {
				if (coln == 2) { c.alignment = {indent: 4} }
				if (coln>2) { c.numFmt = "0.00" }
			})
		}
		else if (row.lType == "total" && show_empty(row)) {
			let r1 = sh.addRow(["", "Оборот", row.period_sum.Dt, row.period_sum.Kt])
			let r2 = sh.addRow(["", "Конечное сальдо", row.period_sum.SaltoDt || 0, row.period_sum.SaltoKt || 0])
			r1.eachCell({includeEmpty: true}, (c,coln) => {
				c.fill = styles.fillTopAcc
				c.border = styles.border
				if (coln == 1) { c.alignment = {indent: 2} }
				if (coln>2) { c.numFmt = "0.00" }
			})
			r2.eachCell({includeEmpty: true}, (c,coln) => {
				c.fill = styles.fillTopAcc
				c.border = styles.border
				if (coln == 1) { c.alignment = {indent: 2} }
				if (coln>2) { c.numFmt = "0.00" }
			})
		}
	})

	// Write file to disk
	wb.xlsx.writeFile(path).then( result => {
		console.log("Сохранение завершено",result)    
	})
}