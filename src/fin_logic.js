/* eslint-disable no-useless-escape */

function breakPeriodToHeaderAndParts(Период) {
	
	let [НПериода, ГодПериода] = Период.split("_")
	
	let Предст = ["", "1 кв. ", "1 полугодие ","9 месяцев "][НПериода]
			
	return [НПериода, ГодПериода, Предст || ""]
}

function countLine(СтрДанных, НПериода, ГодПериода){
	// выделяем только периоды по условию "с начала года"
	let ПодходящиеПериоды = СтрДанных.periodicAmounts.filter(p => {
		let [n,y] = p.p_id.split("_")
		return n <= НПериода && y == ГодПериода
	})
	
	let Dt = ПодходящиеПериоды.reduce((sum, onePeriod) => sum + onePeriod.Dt, 0)
	let Kt = ПодходящиеПериоды.reduce((sum, onePeriod) => sum + onePeriod.Kt, 0)
	
	ПодходящиеПериоды = ПодходящиеПериоды.reverse() // переворачиваем чтоб последний стал первым и не вычислять индекс последнего
	let DtEnd = ПодходящиеПериоды[0].SaldoDt
	let KtEnd = ПодходящиеПериоды[0].SaldoKt
	
	return {Dt, Kt, DtEnd, KtEnd} 
}

/** Формирование первой формы - по всем счетам, без ИНН и субконто
 *  Данные - Массив объектов - прочитанные из экселя данные
 *  Период - Строка - выбранный пользователем период, по который нужно посчитать обороты
 */
export function form1(Данные, Периоды) {

	let Результаты = []

	for (const Период of Периоды) {
		let [НПериода, ГодПериода, Предст] = breakPeriodToHeaderAndParts(Период)
		let ЗаголовокТаблицы = `Оборотно сальдовая ведомость за ${Предст}${ГодПериода} г.`
		let ЗаголовокПериода = `${Предст}${ГодПериода} г.`
		
		let Результат = []
		// проходим по всем строкам
		Данные.forEach(СтрДанных => {
			if (СтрДанных.lType == "ОСВ_общая") {
				let ПодсчетПоСтроке = countLine(СтрДанных, НПериода, ГодПериода)
				Результат.push({
					...СтрДанных,
					...ПодсчетПоСтроке
				})
			}        
		})
		Результаты.push({
			Период,
			ЗаголовокПериода,
			ЗаголовокТаблицы,
			Результат
		})
	}
	return Результаты
}

// Переход на несколько счетов и периодов - счета складываются в одном отчете, а периоды - это отдельные отчеты
/**
 * 
 * @param {Array} Данные Прочитанные данные, которые надо преобразовать
 * @param {Array} Счета Список счетов
 * @param {Array} Периоды Список периодов
 * @returns {Map of Objects} Структура данных для вывода
			Результаты[Период] = {
				Период,
				ЗаголовокПериода,
				ДанныеЗаПериод[Счет]
			}
 */
export function form2(Данные, Счета, Периоды) {
	
	// Результаты = {
	// 	{
	// 		Период: "1_2014",
	// 		ЗаголовокПериода: "1 кв. 2014 г.",
	// 		ДанныеЗаПериод: [
	// 			{
	// 				Счет: 21,
	// 				Результат: [
	// 					{
	// 						// все реквизиты строки таблицы
	// 					},
	// 				]
	// 			}
	// 		]
	// 	}
	// ]

	let Результаты = []
	for (const Период of Периоды) {
		let [НПериода, ГодПериода, Предст] = breakPeriodToHeaderAndParts(Период) // Период = строка "1_2015" например
		let ЗаголовокПериода = `${Предст}${ГодПериода} г.`
		
		let ДанныеЗаПериод = []
		for (const Счет of Счета) {
			// let СчетаСтр = Счета.join("|")
			//let ЗаголовокТаблицы = `Оборотно сальдовая ведомость по счету ${Счет} за ${Предст}${ГодПериода} г.`
			// проходим по всем строкам
			let Результат = []
			Данные.forEach(СтрДанных => {
				// логика 
				// - если ОСВ_общая и счет подходит (включая субсчета) - берем
				// - если ОСВ_[СЧЕТ] - берем
				let accAndSub = СтрДанных.lType == "ОСВ_общая" && СтрДанных.acc.search("^"+Счет+"\.?") !== -1
				if (accAndSub || СтрДанных.lType.search("ОСВ_("+Счет+")")!== -1) {
					let ПодсчетПоСтроке = countLine(СтрДанных, НПериода, ГодПериода)
					Результат.push({
						...СтрДанных,
						...ПодсчетПоСтроке
					})
				}
			})
			ДанныеЗаПериод.push({
				Счет,
				Результат
			})
		}		

		Результаты.push({
			Период,
			ЗаголовокПериода,
			ДанныеЗаПериод
		})
	}

	return Результаты
}

export function form3(Данные, Счет, Период) {
	let [НПериода, ГодПериода] = Период.split("_")
	const Месяцы = ["", "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
	let ЗаголовокФормы = `Анализ счета ${Счет} за январь-${Месяцы[НПериода]} ${ГодПериода} г.`
	let Результат = []

	// проходим по всем строкам
	Данные.forEach(СтрДанных => {
		// логика 
		// - если "ОСВ_общая" и счет подходит (включая субсчета)  - берем
		// - если "ОСВ_общая" и счет подходит (включая всех родителей)  - берем
		// - если АН_[счет] - берем
		let accAndSub = СтрДанных.lType == "ОСВ_общая" && СтрДанных.acc.search("^"+Счет+"\.?") !== -1
		let isAnalys = СтрДанных.lType.search("^Ан_"+Счет) == 0
		let isOSV = СтрДанных.lType.search("^ОСВ_"+Счет) == 0
		if (accAndSub || isAnalys || isOSV) {
			let ПодсчетПоСтроке = countLine(СтрДанных, НПериода, ГодПериода)
			Результат.push({
				...СтрДанных,
				...ПодсчетПоСтроке
			})
		}
	})

	return {Результат, ЗаголовокФормы}
}