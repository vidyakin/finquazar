<template>
  <table class="tbl" v-show="tableData.length > 0">
    <thead>
      <tr>
        <th rowspan="2" style="width: 70px;">Счет</th>
        <th rowspan="2" style="width: 300px;">Наименование</th>
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
        <tr :class="{base: tRow.acc.indexOf('.') == -1 }" :key="tRow.acc">
          <td >{{tRow.acc }}</td>
          <td>{{tRow.accName}}</td>
          <td>{{tRow.НачОстатокДт | fin_format }}</td>
          <td>{{tRow.НачОстатокКт | fin_format }}</td>
          <td>{{tRow.ОборотыДт | fin_format }}</td>
          <td>{{tRow.ОборотыКт | fin_format }}</td>
          <td>{{tRow.КонОстатокДт | fin_format }}</td>
          <td>{{tRow.КонОстатокКт | fin_format }}</td>
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
    props: ['tableData'],      
    data () {
        return {
          tbl: tblDemo
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
.tbl td {
  text-align: right;
}
.tbl td:nth-child(1) {
  text-align: left;
  padding-left: 15px
}
.tbl td:nth-child(2) {
  text-align: left;
}
.tbl tr.base {
  background-color: #d9f3e3;
}
.tbl tr.base td:nth-child(1) {
  padding-left: 5px
}
</style>