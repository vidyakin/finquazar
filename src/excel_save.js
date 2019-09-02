/* eslint(no-unused-vars) */ 

const ExcelJS = require("exceljs/modern.nodejs")
const wb = new ExcelJS.Workbook()
wb.creator = "Finomancer Lab"
const sh = wb.addWorksheet("Данные по ОСВ")

// идентификаторы колонок должны совпадать с именами в объекте таблицы
sh.columns = [
	{key: "acc", width: 8},
	{key: "acc_name", width: 30},
	{key: "DtStart", width: 15},
	{key: "KtStart", width: 15},
	{key: "Dt", width: 15},
	{key: "Kt", width: 15},
	{key: "DtEnd", width: 15},
	{key: "KtEnd", width: 15},
]
// данные для заполнения
let tblDemo = [
	{
		acc:"000",
		acc_name: "Ввод начальных остатков",
		DtStart: 15400000.0, KtStart: 45667777.0,
		Dt: 34000000.0,      Kt: 123456900.0,
		DtEnd: 206000000.0,   KtEnd: 123570000.0
	},
	{
		acc:"01",
		acc_name: "Основные средства",
		DtStart: 0.0, KtStart: 0.0,
		Dt: 0.0,    Kt: 0.0,
		DtEnd: 0.0, KtEnd: 0.0
	}
]
  
// СТИЛЕВЫЕ ЭЛЕМЕНТЫ
const fontColor = {argb: "FF003F2F"}
const fonts = {
	headLine: {
		name: "Arial", size: 10, color: fontColor
	},
	line: {
		name: "Arial", size: 9
	},
	totals: {
		name: "Arial", size: 10, color: fontColor, bold: true
	},
	header: {
		name: "Arial", size: 12, bold: true
	}
}

let border = {
	top:  {style: "thin", color: {argb: "FFA0A0A0"}},
	left: {style: "thin", color: {argb: "FFA0A0A0"}},
	bottom: {style: "thin", color: {argb: "FFA0A0A0"}},
	right: {style: "thin", color: {argb: "FFA0A0A0"}}
}

let fillHeader = {
	type: "pattern",
	pattern: "solid",
	fgColor: {argb:"FFD6E5CB"}
}
let fillLineRoot = {
	type: "pattern",
	pattern: "solid",
	fgColor: {argb:"FFE4F0DD"}
}

// ШАПКА
sh.addRow([""])
let head = sh.addRow(["Отчет по ОСВ за 1 полугодие 2019 года"])
sh.addRow([""])

head.font = fonts.header

let headRows = []
let h1 = sh.addRow(["Счет","Наименование", "Сальдо на начало периода", "",      "Обороты за период", "",      "Сальдо на конец периода",""])
let h2 = sh.addRow(["",    "",             "Дебет"                   , "Кредит","Дебет"            , "Кредит","Дебет"                 , "Кредит"    ])
headRows.push(h1, h2)

headRows.forEach(r => {
	r.eachCell({includeEmpty: true}, (cell, col)=>{
		cell.fill = fillHeader
		cell.border = border
		cell.font = fonts.headLine
		cell.alignment = {horizontal: "center"}
		if (col < 3) cell.alignment = {vertical: "top"}
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


// ==== MAIN DATA
//sh.addRows(tblDemo)
tblDemo.forEach(dataStr => {
	let row = sh.addRow(dataStr)
	row.eachCell({includeEmpty: true}, (cell, col)=>{
		if (dataStr.acc == "000") {
			cell.fill = fillLineRoot
			cell.font = fonts.headLine
		}
		else {
			cell.font = fonts.line
		}
		cell.border = border
		if (col == 1) {
			cell.type = ExcelJS.ValueType.String
		}
		else if (col > 2) {
			cell.numFmt = "0.00"
		}
	})
})

let totalLine = sh.addRow(["Итого","",235.60, 567888.00, 123123123, 23424, 222133.50, 12345.99])
totalLine.eachCell({includeEmpty: true}, (cell) => {
	cell.fill = fillHeader
	cell.font = fonts.totals
	cell.border = border
	cell.numFmt = "0.00"
})

wb.xlsx.writeFile("D:/Работа/Михаил Цалапов, БП/Excel/test.xlsx").then( result => {
	console.log("Сохранение завершено",result)    
})