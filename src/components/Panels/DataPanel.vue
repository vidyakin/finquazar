<template>
  <q-card flat>
    <q-tabs v-model="periodTab"
        dense class="text-light-blue-9" 
				active-color="primary" align="left" 
				narrow-indicator
    >
        <q-tab :name="'p_'+Данные.Период" :label="Данные.ЗаголовокПериода"
					v-for="Данные in form_data" :key="Данные.Период"  
				/>
    </q-tabs>
    <q-separator v-show="form_data.length > 0"/>
    <!-- Панели закладок -->
    <q-tab-panels v-model="periodTab" animated
			transition-prev="jump-up"
			transition-next="jump-down"
    >
    	<!-- Расшифровка: q-pt-sm: padding top = small, q-pa-none: padding all = none -->
			<q-tab-panel v-for="Данные in form_data" :key="Данные.Период"
				class="q-pt-sm q-pa-none" :name="'p_'+Данные.Период" >
					
				<TabCommonOsv :data="Данные" v-if="selectedForm == 'osv'" />
				<TabOsvByAcc :data="Данные" v-else-if="selectedForm == 'osv_acc'"/>
					
			</q-tab-panel>
    </q-tab-panels>
	<!-- <TabAnalysis :data="Данные" /> -->
  </q-card>
	
</template>

<script>
import TabOsvByAcc from "./Tabs/TabOsvByAcc";
import TabCommonOsv from "./Tabs/TabCommonOsv"

export default {
	components: { TabCommonOsv, TabOsvByAcc },
    data() {
      return {
				
		}
	},
	computed: {
		form_data() {
			return this.$store.getters.getDataForSelectedForm
		},
		periodTab: {
			get() { return this.$store.state.periodTab},
			set(value) { 
				this.$store.commit("set", {field: "periodTab", value}) 
			}
		},
		selectedForm() {
			return this.$store.state.selectedForm
		}
	}
}
</script>

<style>

</style>