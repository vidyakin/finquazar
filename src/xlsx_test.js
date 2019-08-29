
const XLSX = require("xlsx")
const wb = XLSX.readFile("D:/Работа/Михаил Цалапов, БП/Excel/rbs.xlsx")

const sh = wb.Sheets[wb.SheetNames[0]]

const diap = XLSX.utils.decode_range(sh["!ref"]) // 'A1:AI192 => {s: {c:0, r:0}, e: {c:34, r:192}}'

// Упрощающая функция
const getVal = (c, r) => sh[XLSX.utils.encode_cell({c, r})].v || 0

let periods = [], data = []

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
			Dt: getVal(p.col, row),
			Kt: getVal(p.col+1, row),
			SaldoDt: getVal(p.col+2, row),
			SaldoKt: getVal(p.col+3, row)
		}
		line.periodicAmounts.push(pAmount)
	})
	
	data.push(line)
}

console.log(data.length)
