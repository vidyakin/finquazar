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
          <tr class="top_acc">
              <td>90</td>
              <td>Начальное сальдо</td>
              <td></td>
              <td></td>
          </tr>
          <tr class="sub_acc">
              <td>90.01</td>
              <td>Начальное сальдо</td>
              <td></td>
              <td></td>
          </tr>
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
              <td class="nums">519729</td>
          </tr>
          <tr class="korr_total">
              <td></td>
              <td>Оборот</td>
              <td></td>
              <td class="nums">519729</td>
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
    props: ["tableData"],
    data() {
        return {

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
}
.tbl_an tr:hover td {
    background-color: lightcyan;
    transition: all .5s ease-in-out;
}

.tbl_an tr.top_acc td {
    background-color: #ccc;
}
.tbl_an tr.sub_acc td {
    background-color: #ddd;
    padding-left: 15px
}
.tbl_an tr.period_header td {
    background-color: rgb(166, 212, 212);
    padding-left: 25px
}

/* Все по правому кроме 1 и 2 колонок */
.tbl_an td.nums {
  text-align: right;
}
</style>