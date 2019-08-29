<template>
  <div class="main">
    <div class="row">
      <img src="~/assets/logo-finomancer.png" alt="FINOMANCER" />
    </div>
    <div class="row">
      <div class="col filestring">
        Файл с данными:
        <span class="filename">{{filename}}</span>
      </div>
    </div>

    <div class="row justify-start">
      <div class="col1">
        <q-btn
          color="secondary"
          icon="attach_file"
          v-on:click="chooseFile"
          label="Загрузить файл"
        />
        
      </div>

      <div class="col1">
        <q-select 
          label="Периоды" stack-label filled v-model="currPeriod" :options="periods"
          option-value="p_id" option-label="p_name"
          map-options options-cover 
          :dense="densed" :options-dense="densed"
          style="min-width: 150px"
        />
      </div>

      <div class="col1">
        <q-select
          label="Тип формы"
          stack-label
          filled
          v-model="currForm"
          :options="forms"
          option-value="id"
          option-label="desc"
          map-options
          options-cover
          :dense="densed"
          :options-dense="densed"
          @change="formChange"
          style="max-width: 150px"
        />
      </div>
      <div class="col1">
        <q-select
          label="Счет:"
          stack-label
          filled
          v-model="currAcc"
          :options="accs"
          style="min-width: 100px"
          :dense="densed"
          :options-dense="densed"
          @change="accChange"
        />
      </div>
      <div class="col1 spacer"></div>
      <div class="col1">
        <q-btn color="secondary" icon="create" label="Сформировать" />
      </div>
      <div class="col1">
        <q-btn color="secondary" icon="save" label="Сохранить" />
      </div>
    </div>
    <div class="row">
      <AccTable :data="data"></AccTable>
    </div>
  </div>
</template>

<script>
import AccTable from "../components/AccTable";
import { log } from "util";
const fs = require("fs");
const { dialog } = require("electron").remote;

const Excel = require('./../excel')
// import {readData} from './../excel'

export default {
  components: { AccTable },
  data() {
    return {
      densed: true,
      filename: "не выбран",
      forms: [
        { id: "osv", desc: "ОСВ общая" },
        { id: "osv_acc", desc: "ОСВ по счету" },
        { id: "acc_an", desc: "Анализ счета" }
      ],
      currForm: "osv_acc",
      currAcc: "01",
      currPeriod: '',
      accs: ["000", "01", "02", "08"],
      periods: []
    };
  },
  methods: {
    chooseFile: function(event) {
      let opt = {
        title: "Выберите файл Excel",
        filters: [{ name: "Excel файлы", extensions: ["xls", "xlsx"] }]
      };
      const fn = dialog.showOpenDialog(null, opt) //null, opt, fn => {
      if (fn === undefined) return;
      this.filename = fn[0];

      let V = this
      let PD = Excel.readData(this.filename)//.then((periods, data)=>{
        //   V.periods = periods
        //   // for rows in data ...
        // })
      PD.periods.map(p => this.periods.push(p.period))
      this.currPeriod = this.periods[0].p_id
      this.data = PD.data

      console.log(this.periods);        
      // });
    },
    formChange(value) {
      console.log("form was changed " + value);
    },
    accChange(value) {
      console.log("Счет был изменен " + value);
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap");

body {
  font-family: "Open Sans Condenced", sans-serif !important;
}

.filestring {
  color: rgb(51, 99, 170);
}
.filename {
  font-weight: 600;
}
.main {
  margin: 15px;
  max-width: 1400px;
  min-width: 960px;
  font-family: "Open Sans Condensed Light", sans-serif;
}

.col1 {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.col1.spacer {
  flex-grow: 1;
}
span.label {
  margin-right: 5px;
}
</style>