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
          <tr class="sub_sub_acc">
              <td>90.01.1</td>
              <td>Начальное сальдо</td>
              <td></td>
              <td></td>
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
    props: ["tableData"],
    data() {
        return {
            test_data: {
                "periods": [
                    {"col": 5, "period": { "p_id": "1_2015", "p_name": "1 кв. 2015"}}, {"col": 10, "period": {"p_id": "2_2015", "p_name": "2 кв. 2015"}}, {"col": 15, "period": {"p_id": "3_2015", "p_name": "3 кв. 2015"}}, {"col": 20, "period": {"p_id": "4_2015", "p_name": "4 кв. 2015"}}, {"col": 25, "period": {"p_id": "1_2016", "p_name": "1 кв. 2016"}}
                ], 
                "data": [
                {"rowN": 77, "lType": "ОСВ_общая", "acc": "52", "accName": "Валютные счета", "DtStart": 0, "KtStart": 0, "periodicAmounts": 
                [
                    {"p_id": "1_2015","Dt": 0,"Kt": 0,"SaldoDt": 0,"SaldoKt": 0 }, 
                    {"p_id": "2_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "3_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "4_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "1_2016", "Dt": 1945043.3, "Kt": 1938282.54, "SaldoDt": 6760.76, "SaldoKt": 0 }
                ], "Dt": 1945043.3, "Kt": 1938282.54, "DtEnd": 6760.76, "KtEnd": 0 }, 
                {"rowN": 78, "lType": "ОСВ_52", "acc": 0, "accName": "40702840000000005551, ПАО СБЕРБАНК, USD", "DtStart": 0, "KtStart": 0, "periodicAmounts": [
                    {"p_id": "1_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "2_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "3_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "4_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "1_2016", "Dt": 1945043.3, "Kt": 1938282.54, "SaldoDt": 6760.76, "SaldoKt": 0 }
                ], "Dt": 1945043.3, "Kt": 1938282.54, "DtEnd": 6760.76, "KtEnd": 0 }, 
                {"rowN": 79, "lType": "АнВал_52", "acc": "USD", "accName": 0, "DtStart": 0, "KtStart": 0, "periodicAmounts": [
                    {"p_id": "1_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "2_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "3_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "4_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "1_2016", "Dt": 25000, "Kt": 24900, "SaldoDt": 100, "SaldoKt": 0 }
                ], "Dt": 25000, "Kt": 24900, "DtEnd": 100, "KtEnd": 0 }, 
                {"rowN": 80, "lType": "АнВал_52", "acc": "USD", "accName": "57", "DtStart": 0, "KtStart": 0, "periodicAmounts": [
                    {"p_id": "1_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "2_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "3_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "4_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "1_2016", "Dt": 24000, "Kt": 900, "SaldoDt": 0, "SaldoKt": 0 }
                ], "Dt": 24000, "Kt": 900, "DtEnd": 0, "KtEnd": 0 }, 
                {"rowN": 81, "lType": "АнВал_52", "acc": "USD", "accName": "60", "DtStart": 0, "KtStart": 0, "periodicAmounts": [
                    {"p_id": "1_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "2_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "3_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "4_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "1_2016", "Dt": 0, "Kt": 24000, "SaldoDt": 0, "SaldoKt": 0 }
                ], "Dt": 0, "Kt": 24000, "DtEnd": 0, "KtEnd": 0 }, 
                {"rowN": 82, "lType": "АнВал_52", "acc": "USD", "accName": "62", "DtStart": 0, "KtStart": 0, "periodicAmounts": [
                    {"p_id": "1_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "2_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "3_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "4_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "1_2016", "Dt": 1000, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }
                ], "Dt": 1000, "Kt": 0, "DtEnd": 0, "KtEnd": 0 }, 
                {"rowN": 83, "lType": "АнВал_52", "acc": "USD", "accName": "91", "DtStart": 0, "KtStart": 0, "periodicAmounts": [
                    {"p_id": "1_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "2_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "3_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "4_2015", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }, 
                    {"p_id": "1_2016", "Dt": 0, "Kt": 0, "SaldoDt": 0, "SaldoKt": 0 }
                ], "Dt": 0, "Kt": 0, "DtEnd": 0, "KtEnd": 0 }]
            }
        }
    },
    computed: {
        prepared() {
            let result = []
            //this.mutate("formAnalysisAcc", FinomancerForms.form3(this.raw_data, this.currAcc, this.currPeriod.p_id))
            const data = this.raw_data
            let curr_acc = ""
            data.forEach(element => {
                
                curr_acc = element.lType == "ОСВ_общая" ? element.acc : curr_acc   // для хранения последнего счета чтоб сравнивать когда метка типа Ан_90.01.1 а самого счета нет
                
                let periodicData = {}
                if (element.lType == "Ан_"+curr_acc) {
                    // для сворачивания по счету надо схлопнуть этот массив строк
                    let СтрокиКоррСчета = data.filter(str => str.lType == "Ан_"+curr_acc && str.accName == element.accName)
                    for (let СтрСчета of СтрокиКоррСчета) {
                        for (let СтрПериода of СтрСчета.periodicAmounts) {
                            let p = СтрПериода.p_id
                            if (periodicData[p] == undefined) {
                                periodicData[p] = {
                                Dt: СтрПериода.Dt,
                                Kt: СтрПериода.Kt
                                }
                            }
                            else {
                                periodicData[p].Dt += СтрПериода.Dt
                                periodicData[p].Kt += СтрПериода.Kt
                            }
                        }
                    }
                    
                    // debug
                }
                
                let isHeader = element.lType == "ОСВ_общая"
                let isSubconto = element.lType == "ОСВ_"+curr_acc
                // проверяем что если мы на строке кор счета и он уже ранее был добавлен, второй раз не добавляем и пропускаем эту строку
                let korr = result.filter(el => el.acc == curr_acc && el.korr == element.accName)  // массив из результата, где объект с таким счетом и корр.счетом
                let isKorrLine = element.lType == "Ан_"+curr_acc    // это строка с корр.счетом 
                if (!isKorrLine || isKorrLine && korr.length == 0) {
                    // добавление обработанных данных в результат
                    result.push({
                        acc: isHeader ? element.acc : "",
                        isHeader,
                        isKorrLine,
                        isSubconto,        // заголовок субконто, по заданию не надо выводить, а суммировать только по счетам
                        korr: isKorrLine ? element.accName : "",   
                        level: isHeader ? element.acc.split(".").length-1 : 0,
                        subconto: isSubconto ? element.accName : "",
                        periodicData,

                    })
                }         
            })
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