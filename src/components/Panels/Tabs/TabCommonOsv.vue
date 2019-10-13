<template>
  <div class="row">
    <!-- Линия заголовка таблицы -->
    <div class="row">
        <h6>Оборотно сальдовая ведомость за {{data.ЗаголовокПериода}}</h6>
    </div>                    
    <AccTable :tableData="data.ДанныеЗаПериод.Результат" :formType="currForm"></AccTable>
  </div>
</template>

<script>
import AccTable from "./Tables/AccTable";

export default {
    props: ["data","currForm"],
    components: { AccTable },
    data() {
        return {
            aaa: ""
        }
    },
    created: function() {
        //this.currAcc = this.$store.state.selectedAcc
        console.log("TabCommonOsv is created!")
        
    },
}</script>

<style>

</style>