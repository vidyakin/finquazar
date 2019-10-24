<template>
  <q-card flat>
    <q-tabs dense class="text-light-blue-9" active-color="primary" align="left" narrow-indicator
        v-model="currAcc"
    >
      <q-tab v-for="Счет in Счета" :key="Счет.acc"
          :name="'acc'+Счет.acc" :label="Счет.acc" 
      />
    </q-tabs>
    <q-separator/>
    <q-tab-panels v-model="currAcc"
        animated transition-prev="jump-up" transition-next="jump-up"
      >
      <q-tab-panel v-for="Счет in Счета" :key="Счет.acc" :name="'acc'+Счет.acc" class="q-pt-none" >
      <!-- Линия заголовка таблицы -->
        <div class="row">
          <h6>Анализ счета {{Счет.acc}}</h6>
          <div style="width:300px"></div>
          <div class="col-shrink q-py-sm">
            <q-checkbox dense v-model="ПоказыватьПустыеОбороты" label="Показывать пустые обороты по корр. счетам"></q-checkbox>
          </div>
        </div>        
        <div class="col-12">
          <AnalysisTable :ПоказыватьПустыеОбороты="ПоказыватьПустыеОбороты" :Счет="Счет.acc"/>  
        </div>
      </q-tab-panel>
    </q-tab-panels>
    
    <!-- <div class="col-shrink">
      <h6>Анализ счета за {{ЗаголовокПериода}}</h6>      
    </div>
    <div style="width:200px"></div>
    <div class="col-shrink q-py-sm">
      <q-checkbox dense v-model="ПоказыватьПустыеОбороты" label="Показывать пустые обороты по корр. счетам"></q-checkbox>
    </div>
    <div class="col-12">
      <AnalysisTable :ПоказыватьПустыеОбороты="ПоказыватьПустыеОбороты"/>  
    </div> -->
    
  </q-card>
</template>

<script>
import AnalysisTable from "./Tables/AnalysisTable"

export default {
    components: { AnalysisTable },
    props: ["data"],
    data() {
        return {
          ЗаголовокПериода: "2019 год",
          Результат: [],        }
    },
    computed: {
      Счета() { return this.$store.state.accs },
      ПоказыватьПустыеОбороты: {
        get() {
          return this.$store.state.show_blank_rows
        },
        set(value) {
          this.$store.commit("set", {field: "show_blank_rows", value}) 
        }
      },
      currAcc: {
        get() {
            return this.$store.state.selectedAcc
        },
        set(e) {
            this.$store.commit('set', {field: 'selectedAcc', value: e})
        }
      }
    }
}
</script>

<style>

</style>