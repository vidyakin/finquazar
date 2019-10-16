<template>
  <div class="row">
    <!-- Линия заголовка таблицы -->
    <div class="col-12">
      <h6>Анализ счета за {{ЗаголовокПериода}}</h6>
    </div>
    <AnalysisTable />  
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
          Результат: []
        }
    }
}
</script>

<style>

</style>