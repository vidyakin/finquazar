<template>
  <table class="tbl_an" >
      <thead>
          <tr>
              <th width="250">Счет</th>
              <th width="250" rowspan="2">Кор. счет</th>
              <th rowspan="2">Дебет</th>
              <th rowspan="2">Кредит</th>
          </tr>
          <tr>
              <th>Период</th>
          </tr>
      </thead>
      <tbody>
          <tr :class="get_class(row)" v-for="row of analysis_data" :key="row.rowN">
              <template v-if="row.isHeader">
                <td>{{row.acc}}</td>
                <td>Начальное сальдо</td>
                <td>{{row.rowN}}</td>
                <td>{{row.level}} {{row.isSubconto}}</td>
              </template>
              <template v-else-if="row.isSubconto">
                <td>Обороты за :</td>
                <td>Начальное сальдо 2</td>
                <td>{{row.rowN}}</td>
                <td>{{row.level}} {{row.isSubconto}}</td>
              </template>
          </tr>
          <!-- Корр счет №1 -->
          <tr class="period_header">
              <td>Обороты за Январь 18</td>
              <td>Начальное сальдо</td>
              <td></td>
              <td></td>
          </tr>
          <tr class="korr_sum">
              <td></td>
              <td>62</td>
              <td></td>
              <td class="nums">519 729.00</td>
          </tr>
          <tr class="korr_total">
              <td></td>
              <td>Оборот</td>
              <td></td>
              <td class="nums">519 729.00</td>
          </tr>
          <tr class="korr_total">
              <td></td>
              <td>Конечное сальдо</td>
              <td></td>
              <td class="nums"></td>
          </tr>
      </tbody>
  </table>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    computed: {
        analysis_data() {
            return this.$store.state.formAnalysisAcc
        },
        
    },
    methods: {
        get_class(item) {
            if (item.isHeader === true) {
                if (item.level == 0) return "top_acc"
                else if (item.level == 1) return "sub_acc"
                else if (item.level == 2) return "sub_sub_acc"
            }
            else if (item.isSubconto) return "period_header"
        }
    },
    created() {
      console.log("Форма анализа создана");
      // this.ft = this.formType;
    }
}
</script>

<style>
.tbl_an {
  width: 960px;
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid grey;
  font-size: 10pt;
  /* margin-top: 10px; */
}
.tbl_an thead {
  background-color: beige;
}
.tbl_an th,
td {
  border: 1px solid grey;
  padding-left: 5px;
  padding-right: 5px;
  text-align: left;
}
.tbl_an tr:hover td {
    background-color: lightcyan;
    transition: all .5s ease-in-out;
}

.tbl_an tr.top_acc td {
    background-color: #e4f0dd;
}
.tbl_an tr.sub_acc td {
    background-color: #e4f0dd;
    padding-left: 15px
}
.tbl_an tr.sub_sub_acc td {
    background-color: #e4f0dd;
    padding-left: 25px
}
.tbl_an tr.period_header td, .tbl_an tr.korr_total td {
    background-color: #f0f6ef;
    padding-left: 35px
}
.tbl_an tr.korr_sum td {
    padding-left: 60px
}

.tbl_an tr.korr_total td {
    font-weight: bold;
    color: rgb(0,63,47)
}
/* Все по правому кроме 1 и 2 колонок */
.tbl_an td.nums {
  text-align: right;
}
</style>