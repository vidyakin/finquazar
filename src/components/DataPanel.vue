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
			<q-tab-panel class="q-pt-sm q-pa-none" :name="'p_'+Данные.Период" 
				v-for="Данные in form_data" :key="Данные.Период"
			>
					<TabOsvByAcc :data="Данные" v-if="this.$store.state.selectedForm == 'osv_acc'"/>
					<TabCommonOsv :data="Данные" v-else />
			</q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
export default {
    data() {
        return {
						periodTab: "",
						
        }
		},
		computed: {
			form_data() {
				return this.$store.getters.getDataForSelectedForm
			}
		}
}
</script>

<style>

</style>