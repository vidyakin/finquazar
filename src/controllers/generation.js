
const FinomancerForms = require("../fin_logic")

/**
 * Функция удобного изменения значения в хранилище
 * @param {Vuex.store} store Хранилище
 * @param {String} field Имя параметра для изменения
 * @param {Any} value Значение для присвоения в поле
 */
const mutate = (store, field, value) => {
	store.commit("set", {field, value })
}

/**
 * Формирование формы :)
 * @param {Vuex.store} store 
 */
export function generateCurrentForm(store) {
	
	if (store.state.filename == "") {
		store.commit("show_msg", {header: "Ошибка формирования", text: "Не загружен файл с исходными данными"})
		return 
	}
	
	let selectedForm = store.state.selectedForm

	if (store.getters.НевалидныеНастройки == true) {
		store.commit("show_msg", {header: "Ошибка настроек", text: "Проверьте выбор периодов и счетов"})
		return
	}
      
	mutate("tab", "tabData")    // переключаемся на закладку с данными
      
	const data = store.state.rbs_data.data
	
	// Форма "ОСВ общая"
	if (selectedForm == "osv") {
		mutate(store, "formOSV", FinomancerForms.form1(data, this.ОтмеченныеПериоды))
		mutate(store, "periodTab", "p_"+this.form_data[0].Период)
	}      
	// Форма "ОСВ по счету"
	else if (selectedForm == "osv_acc") {
		//form_data = FinomancerForms.form2(this.rbs_data.data, this.currAcc, this.currPeriod.p_id)
		mutate(store, "formOSVAcc", FinomancerForms.form2(data, this.ОтмеченныеСчета, this.ОтмеченныеПериоды))
		mutate(store, "periodTab", "p_"+this.form_data[0].Период)
		store.state.selectedAcc = "acc"+this.form_data[0].ДанныеЗаПериод[0].Счет
	}
	// Форма "Анализ по счету"
	else if (selectedForm == "acc_an") {
		const periods = store.state.periods
		const accs = store.state.accs
        
		mutate("formAnalysisAcc", FinomancerForms.form3New(data, periods, this.ОтмеченныеСчета))
		store.state.selectedAcc = "acc"+accs[0].acc
		console.log("Форма 3 сформирована", store.state.formAnalysisAcc)
	}

	//console.log("Форма: %s, период: %s, Счет %s", this.selectedForm, this.currPeriod, this.currAcc);
}

/**
 * Формирование формы Анализ счета
 */
export function generateFormAnalysis() {
	const data = this.$store.state.rbs_data.data
	if (data == undefined) {
		this.$store.commit("show_msg", {header: "Ошибка формирования", text: "Не загружен файл с исходными данными"})
		return
	}
	const periods = this.$store.state.periods  
	this.mutate("formAnalysisAcc", FinomancerForms.form3New(data, periods, this.ОтмеченныеСчета))
	console.log("Форма 3 сформирована", this.$store.state.formAnalysisAcc)
}