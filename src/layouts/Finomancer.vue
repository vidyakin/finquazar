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
    <div class="row" v-show="reportName.length">
      <div class="col filestring">
        Файл с отчетом:
        <span class="filename">{{reportName}}</span>
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
          label="Периоды" stack-label filled  style="min-width: 150px"
          v-model="currPeriod" :options="periods"
          option-value="p_id" option-label="p_name" map-options options-cover 
          :dense="densed" :options-dense="densed"          
        />
      </div>

      <div class="col1">
        <q-select
          label="Тип формы" stack-label filled style="max-width: 150px"
          v-model="currForm" :options="forms" 
          option-value="id" option-label="desc" map-options options-cover
          :dense="densed"  :options-dense="densed"
        />
      </div>
      <div class="col1">
        <q-select
          label="Счет:" stack-label filled style="min-width: 100px"
          v-model="currAcc" :options="accs"          
          :dense="densed" :options-dense="densed" 
          :disable="currForm.id == 'osv'"
        />
      </div>
      <div class="col1 spacer"></div>
      <div class="col1">
        <q-btn color="secondary" icon="create" label="Сформировать" @click="generate" />
      </div>
      <div class="col1">
        <q-btn color="secondary" icon="save" label="Сохранить" @click="save"/>
      </div>
    </div>
    <div class="row">
      <h6>{{form_header}}</h6>
    </div>
    <div class="row">
      <AccTable :tableData="formData" :header="form_header"></AccTable>
    </div>
    
    
    <!-- Скрытые элементы типа диалоговых окон -->
    <q-dialog v-model="showMsg" transition-show="flip-down" transition-hide="flip-up">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{messageHeader}}</div>
        </q-card-section>        
        <q-card-section v-html="messageText">
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import AccTable from "../components/AccTable";
import { log } from "util";
const fs = require("fs");
const { dialog } = require("electron").remote;

const Excel = require('./../excel')
const FinomancerForms = require("./../fin_logic")
// import {readData} from './../excel'

export default {
  components: { AccTable },
  data() {
    return {
      densed: true,
      filename: "не выбран",
      reportName: "",
      // списки значений 
      forms: [
        { id: "osv", desc: "ОСВ общая" },
        { id: "osv_acc", desc: "ОСВ по счету" },
        { id: "acc_an", desc: "Анализ счета" }
      ],
      accs: [],
      periods: [],
      
      form_header: "", // заголовок формы
      rbs_data: [], // данные из файла Excel как есть
      formData: [], // данные сформированной формы, для вывода

      currForm: { id: "osv", desc: "ОСВ общая" },
      currAcc: "",
      currPeriod: '',
      showMsg: false,
      messageHeader: "",
      messageText: "Сообщение!"
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

      this.rbs_data = Excel.readData(this.filename)//.then((periods, data)=>{
      
      this.periods = []
      this.rbs_data.periods.map(p => this.periods.push(p.period))
      this.rbs_data.data.forEach(d => { if( /^\d{2,3}$/.test(d.acc)) this.accs.push(d.acc)})
      this.currPeriod = this.periods[0]
      this.currAcc = "01"
      
      this.tableData = []

      console.log(this.periods);        
      // });
    },

    generate(value) {
      let errors = []
      if (!this.currPeriod) {
        errors.push("Не выбран период для формирования")
      }
      if (this.currForm != "osv" && !this.currAcc) {
        errors.push("Не выбран счет для формирования данного вида отчета")
      }
      if (errors.length) {
        this.messageHeader = "Внимание!"
        this.messageText = errors.join("<br/>")
        this.showMsg = true
      }
      // формируем данные
      let form_data
      switch (this.currForm.id) {
        case "osv":
          form_data = FinomancerForms.form1(this.rbs_data.data, this.currPeriod.p_id)
          this.formData = form_data.Результат
          this.form_header = form_data.ЗаголовокФормы
          break
        case "osv_acc": 
          form_data = FinomancerForms.form2(this.rbs_data.data, this.currAcc, this.currPeriod.p_id)
          this.formData = form_data.Результат
          this.form_header = form_data.ЗаголовокФормы
          break
        case "an_acc":
          FinomancerForms.form3(this.rbs_data, this.currPeriod)
      }

      console.log("Форма: %s, период: %s, Счет %s", this.currForm, this.currPeriod, this.currAcc);
    },
    save(value) {
      let opt = {
        title: "Выберите файл Excel",
        filters: [{ name: "Excel файлы", extensions: ["xlsx"] }]
      };
      const fileToSaveData = dialog.showSaveDialog(null, opt) //null, opt, fn => {
      if (fileToSaveData === undefined) return;

      //this.reportName = fileToSaveData;

      Excel.saveData(this.formData, fileToSaveData, this.form_header)
      
      this.messageHeader = "Файл сохранен"
      this.messageText = "Файл успешно записан"
      this.showMsg = true 
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap");

body {
  font-family: 'SF', sans-serif;
  font-size: 12pt
}

h6 {
  margin: 5px;
  /* font-family: 'Arial Narrow'; */
  font-size: 16pt;
  font-weight: 600;
  color: teal
}
.filestring {
  color: rgb(51, 99, 170);
  padding-bottom: 5px;
}
.filename {
  font-weight: 600;
}
.main {
  margin: 15px;
  max-width: 1400px;
  min-width: 960px;
  /* font-family: "Open Sans Condensed Light", sans-serif; */
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