<template>
  <table class="tbl" v-show="tableData.length > 0">
    <thead>
      <tr>
        <th rowspan="2" style="width: 90px;">Счет</th>
        <th rowspan="2" style="width: 350px;">Наименование</th>
        <th colspan="2">Начальное сальдо</th>
        <th colspan="2">Обороты</th> <!-- столько раз сколько периодов * 2 -->
        <th colspan="2">Конечное сальдо</th>
      </tr>
      <tr>
        <th>Дт</th>
        <th>Кт</th>
        <th>Дт</th>
        <th>Кт</th>
        <th>Дт</th>
        <th>Кт</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="tRow in this.tableData" >
        <tr 
          :key="tRow.rowN"
          :class="{
            base: tRow.acc === 0 ? false : tRow.acc.indexOf('.') == -1, 
            sub: tRow.acc === 0 ? false : tRow.acc.split('.').length == 2, 
            sub2: tRow.acc === 0 ? false : tRow.acc.split('.').length == 3,
            subconto: tRow.acc === 0 || tRow.acc.match(/\d{10,12}/g),
            korr_acc: tRow.accName.match(/^\d{2,3}$/),
            analys: ft == 'acc_an'
          }" 
        >
          <td >{{tRow.acc === 0 ? "" : tRow.acc }}</td>
          <td>{{tRow.accName}}</td>
          <td>{{tRow.DtStart | fin_format }}</td>
          <td>{{tRow.KtStart | fin_format }}</td>
          <td>{{tRow.Dt | fin_format }}</td>
          <td>{{tRow.Kt | fin_format }}</td>
          <td>{{tRow.DtEnd | fin_format }}</td>
          <td>{{tRow.KtEnd | fin_format }}</td>
        </tr>
      </template>
      
    </tbody>
  </table>
</template>

<script>

let tblDemo = [
  {
    acc:'000',
    acc_name: 'Ввод начальных остатков',
    НачОстатокДт: 0.0, НачОстатокКт: 0.0,
    ОборотыДт: 0.0,    ОборотыКт: 0.0,
    КонОстатокДт: 0.0, КонОстатокКт: 0.0
  },
  {
    acc:'01',
    acc_name: 'Основные средства',
    НачОстатокДт: 0.0, НачОстатокКт: 0.0,
    ОборотыДт: 0.0,    ОборотыКт: 0.0,
    КонОстатокДт: 0.0, КонОстатокКт: 0.0
  },
  {
    acc:'01.01',
    accName: 'Основные средства в организации',
    НачОстатокДт: 0.0, НачОстатокКт: 0.0,
    ОборотыДт: 0.0,    ОборотыКт: 0.0,
    КонОстатокДт: 0.0, КонОстатокКт: 0.0
  },
  {
    acc:'01.03',
    accName: 'Арендованное имущество',
    НачОстатокДт: 0.0, НачОстатокКт: 0.0,
    ОборотыДт: 0.0,    ОборотыКт: 0.0,
    КонОстатокДт: 0.0, КонОстатокКт: 0.0
  },{
    acc:'02',
    accName: 'Амортизация основных средств',
    НачОстатокДт: 0.0, НачОстатокКт: 0.0,
    ОборотыДт: 0.0,    ОборотыКт: 0.0,
    КонОстатокДт: 0.0, КонОстатокКт: 0.0
  },{
    acc:'02.01',
    accName: 'Амортизация ОС, учитываемых на счете 01',
    НачОстатокДт: 0.0, НачОстатокКт: 0.0,
    ОборотыДт: 0.0,    ОборотыКт: 0.0,
    КонОстатокДт: 0.0, КонОстатокКт: 0.0
  },{
    acc:'02.03',
    accName: 'Амортизация арендованного имущества',
    НачОстатокДт: 0.0, НачОстатокКт: 0.0,
    ОборотыДт: 0.0,    ОборотыКт: 0.0,
    КонОстатокДт: 0.0, КонОстатокКт: 0.0
  },
]

export default {
    props: ["tableData", "formType"],      
    data () {
        return {
          tbl: tblDemo,
          ft: this.formType
        }
    },
    computed: {
      isBase: ф => {
        console.log('Счет '+ф)
        ф.indexOf('.') != -1
      }
    },
    filters: {
      fin_format: value => value.toLocaleString('ru', {style:'decimal', minimumFractionDigits: 2})
    },
    created() {
      console.log("Таблица создалась");
      // this.ft = this.formType;
    }
}
</script>

<style scoped>
.tbl {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid grey;
  font-size: 10pt;
  /* margin-top: 10px; */
}
.tbl thead {
  background-color: beige;
}
.tbl th,
td {
  border: 1px solid grey;
  padding-left: 5px;
  padding-right: 5px;
}
.tbl tr:hover td {
    background-color: lightcyan;
    transition: all .5s ease-in-out;
}

/* Все по правому кроме 1 и 2 колонок */
.tbl td {
  text-align: right;
}
.tbl td:nth-child(2) {
  text-align: left;
}
.tbl td:nth-child(1) {
  text-align: left;
}
/* фон корневого счета - зелененький */
.tbl tr.base {
  background-color: #d9f3e3;
}

/* отступы для 1 и 2 уровней */
.tbl tr.sub td:nth-child(1) {
  padding-left: 15px
}
.tbl tr.sub2 td:nth-child(1) {
  padding-left: 25px
}
/* для субконто */
.subconto td {
  background-color: rgb(250, 250, 220);
  font-size: 9pt
}
.subconto td:nth-child(2) {
  padding-left: 15px;
}
.korr_acc td {
  background-color: white;
}
/* Корр. счет */
.korr_acc td:nth-child(2) {
  font-weight: 600;
  padding-left: 25px;  
}

</style>