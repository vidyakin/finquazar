<template>
	<q-card flat>
		<div class="row">
			<div class="col text-teal-9">Периоды: {{ ОтмеченныеПериоды }}</div>
		</div>
		<div class="row">
			<div class="col1"  v-show="false">
			<!-- <q-select
					label="Периоды" stack-label filled  style="min-width: 150px"
					v-model="currPeriod" :options="periods"
					option-value="p_id" option-label="p_name" map-options options-cover 
					:dense="densed" :options-dense="densed"          
			/> -->
			</div>
			<div class="col1" style="flex-direction: row; align-items: flex-start">              
			<div v-for="item in Периоды" :key="item.p_id" class="q-pr-md">
					<q-checkbox dense v-model="item.chkd" :label="item.p_name" ></q-checkbox>
			</div>
			</div>
		</div>
		<div class="row" v-show="!getValid('period')">
			<div class="col text-red-12">{{getInvalidMsg('period')}}</div>
		</div>
		<div v-show="showAccounts">
			<div class="row">
				<div class="col text-teal-9">Счета: {{ ОтмеченныеСчета }}</div>
			</div>
			<div class="row">
				<div class="col1" v-show="false">
					<!-- <q-select
					label="Счет:" stack-label filled style="min-width: 100px"
					v-model="currAcc" :options="accs"          
					:dense="densed" :options-dense="densed" 
					:disable="currForm.id == 'osv'"
					/> -->
				</div>
				<div class="col1 wrap" style="flex-direction: row; align-items: flex-start">              
					<div v-for="item in Счета" :key="item.acc" class="q-pr-sm">
						<q-checkbox dense v-model="item.chkd" :label="item.acc | trim"></q-checkbox>
					</div>
				</div>
			</div>
			<div class="row" v-show="!getValid('acc')">
				<div class="col text-red-12">{{getInvalidMsg('acc')}}</div>
			</div>
		</div>
		<div class="row" v-show="false">
				{{НевалидныеНастройки()}}
		</div>
	</q-card>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {
		getValid: function(f) { 
      return this.$store.state.valid[f].valid 
    },
    getInvalidMsg: function(f) { 
      return this.$store.state.valid[f].msg 
    },
    НевалидныеНастройки: function() {
      this.$store.getters.НевалидныеНастройки
    },
    
	},
	computed: {
		ОтмеченныеПериоды: function() { return this.$store.getters.chkdPeriods }, 
    ОтмеченныеСчета: function() { return  this.$store.getters.chkdAccounts },
    Периоды: { 
      get() { return this.$store.state.periods },
      set(v) { this.mutate('periods', v) }
    },
    Счета: {
      get() { return this.$store.state.accs },
      set(v) { this.mutate('accs', v) }
    },
    showAccounts: function() {
      return this.$store.state.showAccounts
    }
	},
	filters: {
    trim: function(s) {
      return s.trim()
    }
  },
  
}
</script>

<style>

</style>