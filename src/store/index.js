import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		count: 0, // Тестовый пример данных
		appName: "Finomancer",
		filename: "не выбран файл",

		tab: "tabData",
		periodTab: "",

		firm: {name: "Не загружены данные", inn: ""}, // Информация о фирме, которая прислала данные
		
		selectedAcc: "", 				// Текущая закладка счета в таблице "ОСВ по счету"
		selectedForm: "osv",		// Текущая форма
		
		rbs_data: [],
		accs: [],			// Все счета в файле
		periods: [],	// Все периоды в файле

		showAccounts: false, 		// Показывать счета или нет (зависит от формы)

		// Валидность установленных настроек периода и счетов
		valid: {
			period: {
				valid: true,
				msg: "Не выбран ни один период!"
			},
			acc: {
				valid: true,
				msg: "Не выбран ни один счет!"
			}
		},
		message: {
			show: false,
			header: "Заголовок",
			text: "Сообщение!"
		},
		// Сгенерированные данные форм
		formOSV: [],
		formOSVAcc: [],
		formAnalysisAcc: []
	},
	getters: {
		chkdPeriods: state => state.periods.filter(el => el.chkd).map(el => el.p_id),
		chkdAccounts: state => state.accs.filter(el => el.chkd).map(el => el.acc),
		getDataForSelectedForm: state => {
			// чтоб без IF сразу по соответствию получить свойство стейта
			let formNames = {
				osv: "formOSV",
				osv_acc: "formOSVAcc",
				acc_an: "formAnalysisAcc"
			}
			return state[formNames[state.selectedForm]]
		},
		НевалидныеНастройки: state => {
			let isNotValid = false
			for (let k in state.valid) isNotValid = isNotValid || !state.valid[k].valid 
			return isNotValid
		}
			
	},
	mutations: {
		increment (state) {
			state.count++
		},
		set(state, { field, value }) {
			//state.selectedAccs.push({[payload.Период] : "acc"+payload.Счет})
			state[field] = value
		},
		changeForm(state, form) {
			state.selectedForm = form
			
			if (form == "osv") {
				state.showAccounts = false
			}
			if (form == "osv_acc") {
				state.showAccounts = true
			}
			if (form == "acc_an") {
				state.showAccounts = true
			}
		},
		show_msg(state, {header, text}) {
			state.message.show = true
			state.message.header = header
			state.message.text = text
		},
		hide_msg(state) {
			state.message.show = false
		},
		// Помещение в стейт данных из эксель файла
		load_data(state, excel_data) {
			// Сами данные кладем
			state.rbs_data = excel_data	 
			// Выдергиваем периоды
			state.periods = []
			excel_data.periods.map(p => state.periods.push({...p.period, chkd:false})) 
			// Выдергиваем счета
			state.accs = []
			excel_data.data.forEach(d => { 
				if( /^\d{2,3}$/.test(d.acc)) {
					state.accs.push({acc: d.acc, chkd:false})
				}
			})
			// Выдергиваем фирму
			state.firm = excel_data.firm
		},
		set_valid(state, what) {
			if (what != "all") {
				state.valid[what].valid = true
			}
			else {
				state.valid.period.valid = true
				state.valid.acc.valid = true
			}			
		}
	}
})