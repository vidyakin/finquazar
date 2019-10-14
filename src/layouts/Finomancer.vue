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

      <LogoAndFirm /> <!-- Панель шапки -->

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

      <CommandPanel />  <!-- Панель кнопок -->

      <div class="hor_spacer"></div>

      <!-- группа с табами  -->
      <q-card flat>
        <q-tabs v-model="tab" dense class="text-light-blue-9" active-color="primary" align="left" narrow-indicator>
          <q-tab name="tabData" label="Данные" />
          <q-tab name="tabSettings" label="Счета и периоды" />
        </q-tabs>
        <q-separator/>
        
        <q-tab-panels v-model="tab">
          <q-tab-panel name="tabData" class="q-pa-none">
            <DataPanel />   <!-- ПАНЕЛЬ ДАННЫХ -->
          </q-tab-panel>
          <q-tab-panel name="tabSettings">
            <SettingsPanel/>    <!-- ПАНЕЛЬ НАСТРОЕК -->
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    
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

import LogoAndFirm from "../components/LogoAndFirm";
import CommandPanel from "../components/CommandPanel";
import DataPanel from "../components/Panels/DataPanel"
import SettingsPanel from "../components/Panels/SettingsPanel"

const { dialog } = require("electron").remote;

export default {
  components: { LogoAndFirm, CommandPanel, DataPanel, SettingsPanel },
  data() {
    return {
      densed: true,
      reportName: "",
      
      form_header: "", // заголовок формы
      rbs_data: [], // данные из файла Excel как есть
      
      accTab: "",
      
    };
  },
  computed: {
    filename: function() { return this.$store.state.filename},
    tab: { 
      get() { return this.$store.state.tab},
      set(value) { this.$store.commit("set", {field: "tab", value}) }
    },
    showMsg: { 
      get() { return this.$store.state.message.show },
      set(value) { this.$store.commit(value == true ? "show_msg" : "hide_msg") }
    },
    messageHeader: function() { return this.$store.state.message.header},
    messageText: function() { return this.$store.state.message.text},
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
    
    checked: function(el, el2) {
      if (el == 'period') {
        this.valid.period.valid = this.ОтмеченныеПериоды.length != 0
      }
      if (el == 'acc') {
        this.valid.acc.valid = this.currForm == "osv_acc" && this.ОтмеченныеСчета.length != 0
      }
    },
    
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