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
		let ЗаголовокПериода = `${Предст}${ГодПериода} г.`
		// let ЗаголовокТаблицы = `Оборотно сальдовая ведомость за ${ЗаголовокПериода} г.`
		
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
		// Результаты.push({
		// 	Период,
		// 	ЗаголовокПериода,
		// 	ЗаголовокТаблицы,
		// 	Результат
		// })
		Результаты.push({
			Период,
			ЗаголовокПериода,
			ДанныеЗаПериод: {
				Счет: "",
				Результат
			}
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

export function form3(Данные, Счет, Период = "") {
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

export function form3New(data, periods) {
	let table3 = []
	//this.mutate("formAnalysisAcc", FinomancerForms.form3(this.raw_data, this.currAcc, this.currPeriod.p_id))
	if (data == undefined) {
		this.$store.commit("show_msg", {header: "Нет данных", text: "Не загружены данные из Excel"})
		return 
	}
	let curr_acc = ""
	data.forEach(element => {
          
		curr_acc = element.lType == "ОСВ_общая" ? element.acc : curr_acc   // для хранения последнего счета чтоб сравнивать когда метка типа Ан_90.01.1 а самого счета нет
		let isHeader = element.lType == "ОСВ_общая"
		let level = isHeader ? curr_acc.split(".").length -1 : 0
		let isSubconto = element.lType == "ОСВ_"+curr_acc

		// Когда субконто - ищем все строки с таким счетом и вытащим все корр.счета
		if (isSubconto) {
			// проверяем что строки для субконто еще нет в результирующем массиве
			if (table3.find(l => l.acc == curr_acc && l.isSubconto ==true) != undefined ) return 

			// Все корр счета для текущего счета
			let korrs = new Set(data.filter(el=> el.lType == "Ан_"+curr_acc).map(el => el.accName))  // множество для исключения дублей
			// пройдем по всем периодам и вытащим данные по каждому субконто
			// let period_data = []
			periods.forEach(p => {      // - по периодам
				// eslint-disable-next-line no-unused-vars
				let { p_id, ...periodTotal} = element.periodicAmounts.find(el=> el.p_id == p.p_id)	// итоги по периоду: вытаскиваем в periodTotal остальные поля кроме p_id
				let SaldoStart = p.p_num == 1 ? 
					{DtStart: element.DtStart, KtStart: element.KtStart} : 
					(el => ({DtStart: el.SaldoDt, KtStart: el.SaldoKt}))(element.periodicAmounts.find(el => el.p_num == p.p_num-1))
				//let { StartSaldoDt, StartSaldoKt} = element.periodicAmounts.filter(el => el.p_num <= p.p_num).reduce((sum, el) => (sum.), {})
				table3.push({     //  заголовок периода
					acc: curr_acc,
					rowN: element.rowN,	// может и не надо знать из какой строки экселя пришло?
					lType: "subconto",
					level:"",
					p,
					korr:"",
					period_sum: { ...periodTotal, ...SaldoStart}
				})
				// let korr_sums = []
				korrs.forEach(korr => {   // - по субконто
                
					let period_sum = data.filter(el=> el.lType == "Ан_"+curr_acc && el.accName == korr)  // ввыбираем из всех данных по субконто данные по периоду
						.map(str => str.periodicAmounts.find(per=> per.p_id == p.p_id))   // для каждой строки отбираем только текущий период из всех колонок (0-й элемент т.к. фильтр)
						.reduce((acc, p) =>     // суммируем если нашлось несколько строк для корр счета (массивов периодов тоже будет несколько)
							({  
								Dt: acc.Dt + p.Dt, Kt: acc.Kt + p.Kt
							}), 
						{     // начальный объект с суммами
							Dt:0, Kt:0
						})
					// korr_sums.push({
					// 	korr,
					// 	...period_sum
					// })
					table3.push({     // 	отдельная строка для каждого сочетания период*коррсчет
						acc: curr_acc,
						rowN: element.rowN,
						lType: "subconto",
						level:"",
						p,
						korr,
						period_sum
					})
				})
				
				table3.push({     //  ИТОГ по периоду
					acc: curr_acc,
					rowN: element.rowN,
					lType: "total",
					level:"",
					p,
					korr:"",
					period_sum: { ...periodTotal}
				})
				// period_data["p"+p.p_id] = korr_sums
			})
			// сюда надо итоговую строку по счету

			// СТАРЫЙ СПОСОБ
			// полученный свернутый объект пихаем в массив в разрезе счета
			// table3.push({     // 
			// 	acc: curr_acc,
			// 	rowN: element.rowN,
			// 	isHeader,
			// 	isSubconto,
			// 	period_data
			// })
		}
		else if (isHeader) {
			// пихаем простые данные - когда строка это описание счета или субсчета
			table3.push({
				acc: curr_acc,
				rowN: element.rowN,
				lType: "header",
				level,
				p:"",
				korr:"",
				period_sum: ""
			})
		}
    
	})
	return table3
}