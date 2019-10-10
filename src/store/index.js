import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		count: 0,
		appName: "Finomancer",
		selectedAcc: ""
	},
	mutations: {
		increment (state) {
			state.count++
		},
		currAccChanged (state, payload) {
			//state.selectedAccs.push({[payload.Период] : "acc"+payload.Счет})
			state.selectedAcc = payload
		}

	}
})