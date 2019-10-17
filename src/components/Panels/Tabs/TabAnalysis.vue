<template>
  <div class="row items-start">
    <!-- Линия заголовка таблицы -->
    <div class="col-shrink">
      <h6>Анализ счета за {{ЗаголовокПериода}}</h6>      
    </div>
    <div style="width:200px"></div>
    <div class="col-shrink q-py-sm">
      <q-checkbox dense v-model="ПоказыватьПустыеОбороты" label="Показывать пустые обороты по корр. счетам"></q-checkbox>
    </div>
    <div class="col-12">
      <AnalysisTable :ПоказыватьПустыеОбороты="ПоказыватьПустыеОбороты"/>  
    </div>
    
  </div>
</template>

<script>
import AnalysisTable from "./Tables/AnalysisTable"

export default {
    components: { AnalysisTable },
    props: ["data"],
    data() {
        return {
          ЗаголовокПериода: "2019 год",
          Результат: [],
          ПоказыватьПустыеОбороты: true
        }
    }
}
</script>

<style>

</style>