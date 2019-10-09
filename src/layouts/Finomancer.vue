<template>
  <div class="main">
    <div class="row">
      <img src="~/assets/logo-finomancer.png" alt="FINOMANCER" />
      <div class="col1 spacer"></div>
      <div class="column items-end firm">
        <div class="firm_name">{{firm.name}}</div>
        <div class="firm_inn">{{firm.inn != "" ? "ИНН " + firm.inn : ""}}</div>
      </div>
    </div>
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

    <!-- Линия кнопок -->
    <div class="row justify-start"> 
      <div class="col1">
        <q-btn
          color="secondary"
          icon="attach_file"
          v-on:click="chooseFile"
          label="Загрузить файл"
        />
        
      </div>

      <div class="col3">
        <q-btn-toggle
          v-model="currForm" :options="forms"
          toggle-color="teal-5"
          @input="onFormChanged"     
        />
        <!-- <q-select
          label="Тип формы" stack-label filled style="max-width: 150px"
          v-model="currForm" :options="forms" 
          option-value="value" option-label="label" map-options options-cover
          :dense="densed"  :options-dense="densed"
        /> -->
      </div>
      <!-- Тут был счет -->
      <div class="col1 spacer"></div>
      <div class="col1">
        <q-btn color="secondary" icon="create" label="Сформировать" @click="generate" />
      </div>
      <div class="col1">
        <q-btn color="secondary" icon="save" label="Сохранить" @click="save"/>
      </div>
    </div> 
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
          <q-card flat>
            <q-tabs v-model="dataTab" 
              dense class="text-light-blue-9" active-color="primary" align="left" narrow-indicator
            >
              <q-tab v-for="Данные in form_data" :key="Данные.Период" :name="'p_'+Данные.Период" :label="Данные.ЗаголовокПериода" />
            </q-tabs>
            <q-separator v-show="form_data.length > 0"/>
            <!-- Панели закладок -->
            <q-tab-panels v-model="dataTab" animated
              transition-prev="jump-up"
              transition-next="jump-down"
            >
              <!-- q-pt-sm: padding top = small, q-pa-none: padding all = none -->
              <q-tab-panel v-for="Данные in form_data" :key="Данные.Период" :name="'p_'+Данные.Период" class="q-pt-sm q-pa-none"> 
                <div class="row">
                  <div class="col-auto text-grey-7 pad-5">
                    <q-tabs vertical class="text-teal" dense v-model="acc_tab">
                      <q-tab :name="'acc'+ДанныеПоСчету.Счет" :label="ДанныеПоСчету.Счет" v-for="ДанныеПоСчету in Данные.ДанныеЗаПериод" :key="ДанныеПоСчету.Счет" />
                    </q-tabs>
                  </div>
                  <q-separator vertical></q-separator>
                  <div class="col">
                    <!-- Линия данных - счета в табах-->
                    <q-tab-panels animated
                      v-model="acc_tab"                  
                      transition-prev="jump-up"
                      transition-next="jump-up"
                    >
                      <q-tab-panel :name="'acc'+ДанныеПоСчету.Счет" class="q-pt-none" v-for="ДанныеПоСчету in Данные.ДанныеЗаПериод" :key="ДанныеПоСчету.Счет">
                        <!-- Линия заголовка таблицы -->
                        <div class="row">
                          <h6>Оборотно сальдовая ведомость по счету {{ДанныеПоСчету.Счет}} за {{Данные.ЗаголовокПериода}}</h6>
                        </div>                    
                        <AccTable :tableData="ДанныеПоСчету.Результат" :formType="currForm"></AccTable>
                      </q-tab-panel>
                    </q-tab-panels>
                  </div>
                </div>                
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
         </q-tab-panel>

        <!-- ПАНЕЛЬ НАСТРОЕК -->

        <q-tab-panel name="tabSettings">
          <div class="row">
            <div class="col text-teal-9">Периоды:</div>
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
              <div v-for="item in periods2" :key="item.p_id" class="q-pr-md">
                <q-checkbox dense v-model="item.chkd" :label="item.p_name" @input="checked('period')"></q-checkbox>
              </div>
            </div>
          </div>
          <div class="row" v-show="!valid.period.valid">
            <div class="col text-red-12">{{valid.period.msg}}</div>
          </div>
          <div v-show="showAccounts">
            <div class="row">
              <div class="col text-teal-9">Счета:</div>
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
                <div v-for="item in accs2" :key="item.acc" class="q-pr-sm">
                  <q-checkbox dense v-model="item.chkd" :label="item.acc | trim" @input="checked('acc')"></q-checkbox>
                </div>
              </div>
            </div>
            <div class="row" v-show="!valid.acc.valid">
              <div class="col text-red-12">{{valid.acc.msg}}</div>
            </div>
          </div>
          <div class="row" v-show="false">
            {{НевалидныеНастройки()}}
          </div>         
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    
    
    
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
        { value: "osv", label: "ОСВ общая" },
        { value: "osv_acc", label: "ОСВ по счету" },
        { value: "acc_an", label: "Анализ счета" }
      ],
      accs2: [],      
      periods2: [],
      
      form_header: "", // заголовок формы
      rbs_data: [], // данные из файла Excel как есть
      form_data: [], // данные сформированной формы, для вывода
      firm: {name: "", inn: ""},

      tab: "tabData",
      dataTab: "",
      acc_tab: "",

      currForm: "osv",
      showAccounts: false,
      // currAcc: "",
      // currPeriod: '',
      valid: {
        period: {
          vaild: true,
          msg: "Не выбран ни один период!"
        },
        acc: {
          vaild: true,
          msg: "Не выбран ни один счет!"
        }
      },
      showMsg: false,
      messageHeader: "",
      messageText: "Сообщение!"
    };
  },
  computed: {
    ОтмеченныеПериоды: function() {return this.periods2.filter(el => el.chkd).map(el => el.p_id) }, 
    ОтмеченныеСчета: function() { return  this.accs2.filter(el => el.chkd).map(el => el.acc) }
  },
  filters: {
    trim: function(s) {
      return s.trim()
    }
  },
  methods: {
    chooseFile: async function(event) {
      let opt = {
        title: "Выберите файл Excel",
        filters: [{ name: "Excel файлы", extensions: ["xls", "xlsx"] }]
      };
      const fn = await dialog.showOpenDialog(null, opt) //null, opt, fn => {
      if (fn.canceled ==true) return;
      this.filename = fn[0];

      this.rbs_data = Excel.readData(this.filename)//.then((periods, data)=>{

      // this.periods = [] // очищаем периоды
      // this.currPeriod = this.periods[0]
      // this.accs = []
      // this.rbs_data.periods.map(p => this.periods.push(p.period))
      
      // суем прочитанные данные и признак отметки = Ложь
      this.periods2 = [] // очищаем периоды 2
      this.rbs_data.periods.map(p => this.periods2.push({...p.period, chkd:false}))
      this.firm = this.rbs_data.firm
      this.accs2 = []
      this.valid.period.valid = true
      this.valid.acc.valid = true
      this.rbs_data.data.forEach(d => { 
        if( /^\d{2,3}$/.test(d.acc)) {
          //this.accs.push(d.acc)
          this.accs2.push({acc: d.acc, chkd:false})
        }
      })
      //this.currAcc = this.accs[0]
      
      this.tableData = []
      this.tab = "tabSettings"
      this.formData = []

      console.log(this.periods);        
      // });
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
          this.acc_tab = "acc"+this.form_data[0].ДанныеЗаПериод[0].Счет
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

.firm {
  font-family: Bebas;
  color: dodgerblue;
  line-height: 1.7rem;
  margin-top: 10px;
}
.firm_name {
  font-size: 1.9rem;
}
.firm_inn {
  font-size: 1.1rem;
}
.main {
  margin: 15px;
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