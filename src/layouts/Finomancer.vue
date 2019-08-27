<template>
  <div class="main">
    <div class="row">
      <img src="~/assets/logo-finomancer.png" alt="FINOMANCER" />
    </div>
    <div class="row">
      <div class="col filestring">
        Файл ведомости:
        <span class="filename">{{filename}}</span>
      </div>
    </div>

    <div class="row justify-start">
      <div class="col1">
        <q-btn
          color="secondary"
          icon="attach_file"
          @click="chooseFile()"
          label="Загрузить ведомость"
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
      <AccTable></AccTable>
    </div>
  </div>
</template>

<script>
import AccTable from "../components/AccTable";
import { log } from "util";
const fs = require("fs");
const { dialog } = require("electron").remote;

const Excel = require('./../excel')

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
      accs: ["000", "01", "02", "08"]
    };
  },
  methods: {
    chooseFile() {
      let opt = {
        title: "Выберите файл Excel",
        filters: [{ name: "Excel файлы", extensions: ["xls", "xlsx"] }]
      };
      dialog.showOpenDialog(null, opt, fn => {
        if (fn === undefined) return;
        this.filename = fn[0];

        Excel.read(fn[0])
        
      });
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