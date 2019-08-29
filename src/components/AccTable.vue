<template>
  <table class="tbl">
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
      <template v-for="tRow in this.tbl" >
        <tr :class="{base: tRow.acc.indexOf('.') == -1 }" :key="tRow.acc">
          <td >{{tRow.acc}}</td>
          <td>{{tRow.name}}</td>
          <td>{{tRow.DtBegin}}</td>
          <td>{{tRow.KtBegin}}</td>
          <td>{{tRow.DtOb}}</td>
          <td>{{tRow.KtOb}}</td>
          <td>{{tRow.DtEnd}}</td>
          <td>{{tRow.KtEnd}}</td>
        </tr>
      </template>
      
    </tbody>
  </table>
</template>

<script>

let tblDemo = [
  {
    acc:'000',
    name: 'Ввод начальных остатков',
    DtBegin: 0.0, KtBegin: 0.0,
    DtOb: 0.0,    KtOb: 0.0,
    DtEnd: 0.0,   KtEnd: 0.0
  },
  {
    acc:'01',
    name: 'Основные средства',
    DtBegin: 0.0, KtBegin: 0.0,
    DtOb: 0.0,    KtOb: 0.0,
    DtEnd: 0.0,   KtEnd: 0.0
  },
  {
    acc:'01.01',
    name: 'Основные средства в организации',
    DtBegin: 0.0, KtBegin: 0.0,
    DtOb: 0.0,    KtOb: 0.0,
    DtEnd: 0.0,   KtEnd: 0.0
  },
  {
    acc:'01.03',
    name: 'Арендованное имущество',
    DtBegin: 0.0, KtBegin: 0.0,
    DtOb: 0.0,    KtOb: 0.0,
    DtEnd: 0.0,   KtEnd: 0.0
  },{
    acc:'02',
    name: 'Амортизация основных средств',
    DtBegin: 0.0, KtBegin: 0.0,
    DtOb: 0.0,    KtOb: 0.0,
    DtEnd: 0.0,   KtEnd: 0.0
  },{
    acc:'02.01',
    name: 'Амортизация ОС, учитываемых на счете 01',
    DtBegin: 0.0, KtBegin: 0.0,
    DtOb: 0.0,    KtOb: 0.0,
    DtEnd: 0.0,   KtEnd: 0.0
  },{
    acc:'02.03',
    name: 'Амортизация арендованного имущества',
    DtBegin: 0.0, KtBegin: 0.0,
    DtOb: 0.0,    KtOb: 0.0,
    DtEnd: 0.0,   KtEnd: 0.0
  },
]

export default {
    props: {
      tdata: Array
    },
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
    }
}
</script>

<style scoped>
.tbl {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid grey;
  margin-top: 10px;
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