<template>
  <div class="main">
    <q-bar class="q-electron-drag bg-light-blue-12">
      <div class="cursor-pointer">Помощь</div>
      <q-space />
      <q-btn dense flat icon="minimize"  @click="minimize" />
      <!-- <q-btn dense flat icon="crop_square" /> -->
      <q-btn dense flat icon="close" @click="closeApp" />
    </q-bar> 
    
    <div class="q-pa-md">
      <LogoAndFirm />

      <div class="row">
        <div class="col filestring">
          Файл с данными: <span class="filename">{{filename}}</span>
        </div>
      </div>
      <div class="row" v-show="reportName.length">
        <div class="col filestring">
          Файл с отчетом: <span class="filename">{{reportName}}</span>
        </div>
      </div>

      <!-- Панель кнопок -->
      <CommandPanel />

      <div class="hor_spacer"></div>

      <!-- группа с табами  -->
      <q-card flat>
        <q-tabs v-model="tab" dense class="text-light-blue-9" active-color="primary" align="left" narrow-indicator>
          <q-tab name="tabData" label="Данные" />
          <q-tab name="tabSettings" label="Счета и периоды" />
        </q-tabs>
        <q-separator/>
        <!-- ПАНЕЛЬ ДАННЫХ -->
        <q-tab-panels v-model="tab">
          <q-tab-panel name="tabData" class="q-pa-none">
              <!-- Заголовки закладок -->
            <DataPanel />
          </q-tab-panel>

          <!-- ПАНЕЛЬ НАСТРОЕК -->

          <q-tab-panel name="tabSettings">
            <div class="row">
              <div class="col text-teal-9">Периоды: {{ ОтмеченныеПериоды }}</div>
            </div>
            <div class="row">
              <div class="col1"  v-show="false">
                <!-- <q-select
                  label="Периоды" stack-label filled  style="min-width: 150px"
                  v-model="currPeriod" :options="periods"
                  option-value="p_id" option-label="p_name" map-options options-cover 
                  :dense="densed" :options-dense="densed"          
                /> -->
              </div>
              <div class="col1" style="flex-direction: row; align-items: flex-start">              
                <div v-for="item in Периоды" :key="item.p_id" class="q-pr-md">
                  <q-checkbox dense v-model="item.chkd" :label="item.p_name" ></q-checkbox>
                </div>
              </div>
            </div>
            <div class="row" v-show="!getValid('period')">
              <div class="col text-red-12">{{getInvalidMsg('period')}}</div>
            </div>
            <div v-show="showAccounts">
              <div class="row">
                <div class="col text-teal-9">Счета: {{ ОтмеченныеСчета }}</div>
              </div>
              <div class="row">
                <div class="col1" v-show="false">
                  <!-- <q-select
                    label="Счет:" stack-label filled style="min-width: 100px"
                    v-model="currAcc" :options="accs"          
                    :dense="densed" :options-dense="densed" 
                    :disable="currForm.id == 'osv'"
                  /> -->
                </div>
                <div class="col1 wrap" style="flex-direction: row; align-items: flex-start">              
                  <div v-for="item in Счета" :key="item.acc" class="q-pr-sm">
                    <q-checkbox dense v-model="item.chkd" :label="item.acc | trim"></q-checkbox>
                  </div>
                </div>
              </div>
              <div class="row" v-show="!getValid('acc')">
                <div class="col text-red-12">{{getInvalidMsg('acc')}}</div>
              </div>
            </div>
            <div class="row" v-show="false">
              {{НевалидныеНастройки()}}
            </div>         
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    
    <!-- <div class="row">
      <img src="~/assets/logo-finomancer.png" alt="FINOMANCER" />
      <div class="col1 spacer"></div>
      <div class="column items-end firm">
        <div class="firm_name">{{firm.name}}</div>
        <div class="firm_inn">{{firm.inn != "" ? "ИНН " + firm.inn : ""}}</div>
      </div>
    </div> -->
    
<!--     
    <q-footer>
      <q-bar dense class="bg-black text-white">
        <div>finomancer 1.6</div>
        <q-space />
        <div>{{Date().now}}</div>
      </q-bar>
    </q-footer> -->
    
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
import TabOsvByAcc from "../components/Tables/TabOsvByAcc";
import TabCommonOsv from "../components/Tables/TabCommonOsv"
import LogoAndFirm from "../components/LogoAndFirm";
import CommandPanel from "../components/CommandPanel";
import DataPanel from "../components/DataPanel"

const fs = require("fs");
const { dialog } = require("electron").remote;

const Excel = require('./../excel')
const FinomancerForms = require("./../fin_logic")
// import {readData} from './../excel'

export default {
  components: { AccTable, TabOsvByAcc, TabCommonOsv, LogoAndFirm, CommandPanel, DataPanel },
  data() {
    return {
      densed: true,
      reportName: "",
      // списки значений 
      forms: [
        { value: "osv", label: "ОСВ общая" },
        { value: "osv_acc", label: "ОСВ по счету" },
        { value: "acc_an", label: "Анализ счета" }
      ],
      
      form_header: "", // заголовок формы
      rbs_data: [], // данные из файла Excel как есть
      form_data: [], // данные сформированной формы, для вывода
      //firm: {name: "", inn: ""},

      tab: "tabData",
      accTab: "",

      currForm: "osv",
      // currAcc: "",
      // currPeriod: '',
      
      showMsg: false,
      messageHeader: "",
      messageText: "Сообщение!"
    };
  },
  computed: {
    ОтмеченныеПериоды: function() { return this.$store.getters.chkdPeriods }, 
    ОтмеченныеСчета: function() { return  this.$store.getters.chkdAccounts },
    filename: function() { return this.$store.state.filename},
    Периоды: { 
      get() { return this.$store.state.periods },
      set(v) { this.mutate('periods', v) }
    },
    Счета: {
      get() { return this.$store.state.accs },
      set(v) { this.mutate('accs', v) }
    },
    showAccounts: function() {
      return this.$store.state.showAccounts
    }
  },
  filters: {
    trim: function(s) {
      return s.trim()
    }
  },
  methods: {
    minimize () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
      }
    },
    closeApp () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
      }
    },
    mutate: function(field, value) {
      this.$store.commit('set', {field, value })
    },
    
    onFormChanged: function(el) {
      if (el == 'osv') {
        this.showAccounts = false
      }
      if (el == 'osv_acc') {
        this.showAccounts = true
      }
      if (el == 'acc_an') {
        this.showAccounts = true
      }
    },
    checked: function(el, el2) {
      if (el == 'period') {
        this.valid.period.valid = this.ОтмеченныеПериоды.length != 0
      }
      if (el == 'acc') {
        this.valid.acc.valid = this.currForm == "osv_acc" && this.ОтмеченныеСчета.length != 0
      }
    },
    getValid: function(f) { 
      return this.$store.state.valid[f].valid 
    },
    getInvalidMsg: function(f) { 
      return this.$store.state.valid[f].msg 
    },
    НевалидныеНастройки: function() {
      let isNotValid = false
      for (let k in this.valid) isNotValid = isNotValid || !this.valid[k].valid 
      return isNotValid
    },
    generate(value) {
      //let errors = []
      // if (!this.currPeriod) {
      //   errors.push("Не выбран период для формирования")
      // }
      // if (this.currForm != "osv" && !this.currAcc) {
      //   errors.push("Не выбран счет для формирования данного вида отчета")
      // }
      // if (errors.length) {
      //   this.messageHeader = "Внимание!"
      //   this.messageText = errors.join("<br/>")
      //   this.showMsg = true
      // }
      if (this.ОтмеченныеПериоды.length == 0) {
        this.valid.period.valid = false
      }
      if (this.currForm == "osv_acc" && this.ОтмеченныеСчета.length == 0) {
        this.valid.acc.valid = false
      }
      if (this.НевалидныеНастройки() == true) {
        this.messageHeader = "Ошибка настроек"
        this.messageText = "Проверьте выбор периодов и счетов"
        this.showMsg = true 
        return
      }
      
      this.tab = "tabData" // переключаем на первую вкладку
      
      // формируем данные
      let form_data
      // Форма "ОСВ общая"
      if (this.currForm == "osv") {
        this.form_data = FinomancerForms.form1(this.rbs_data.data, this.ОтмеченныеПериоды)
        this.dataTab = "p_"+this.form_data[0].Период
      }
      
      // Форма "ОСВ по счету"
      else if (this.currForm == "osv_acc") {
          //form_data = FinomancerForms.form2(this.rbs_data.data, this.currAcc, this.currPeriod.p_id)
          this.form_data = FinomancerForms.form2(this.rbs_data.data, this.ОтмеченныеСчета, this.ОтмеченныеПериоды)
          this.dataTab = "p_"+this.form_data[0].Период
          this.$store.state.selectedAcc = "acc"+this.form_data[0].ДанныеЗаПериод[0].Счет
          // this.acc_tab = "acc"+this.form_data[0].ДанныеЗаПериод[0].Счет
      }
      // Форма "Анализ по счету"
      else if (this.currForm == "acc_an") {
          form_data = FinomancerForms.form3(this.rbs_data.data, this.currAcc, this.currPeriod.p_id)
          // [this.formData, this.form_header] = [form_data.Результат, form_data.ЗаголовокФормы]        
      }
      // if (form_data.Результат.length > 0) {
      //   this.formData = form_data.Результат
      //   this.form_header = form_data.ЗаголовокФормы
      // }

      console.log("Форма: %s, период: %s, Счет %s", this.currForm, this.currPeriod, this.currAcc);
    },
    save: async function(event) {
      let opt = {
        title: "Выберите папку для выгрузки файлов Excel",
        // filters: [{ name: "Excel файлы", extensions: ["xlsx"] }]
        properties: ["openDirectory"]
      };
      const dialogResult = await dialog.showOpenDialog(null, opt) //null, opt, fn => {
      if (dialogResult == undefined) return;
      let folder = dialogResult[0]

      //this.reportName = fileToSaveData;

      for (let fd of this.form_data) {
        const saveResult = Excel.saveData(fd.Результат, `${folder}/Райффайзен ${fd.ЗаголовокПериода}.xlsx`, fd.ЗаголовокТаблицы)
      }     
      
      this.messageHeader = "Файлы сохранены"
      this.messageText = "Файлы успешно записаны"
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
  color: #34a9ff;
  padding-bottom: 5px;
}
.filename {
  font-weight: 600;
}

.main {
  /* margin: 15px; */
  max-width: 1600px;
  min-width: 960px;
  /* font-family: "Open Sans Condensed Light", sans-serif; */
}

.col1 {
  display: flex;
  align-items: left;
  margin-right: 20px;
}
.col1.spacer {
  flex-grow: 1;
}
.hor_spacer {
  height: 10px;
}
span.label {
  margin-right: 5px;
}
.no-pad {
  padding: 0;
}
.pad-5 {
  padding: 5px;
}
</style>