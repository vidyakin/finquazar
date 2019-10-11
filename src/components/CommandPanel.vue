<template>
  <div class="row justify-start q-gutter-md"> 
		<q-btn color="secondary" icon="attach_file" label="Загрузить файл"
			@click="chooseFile"			
		/>        
		<q-btn-toggle
			v-model="selectedForm" 
			:options="forms"
			toggle-color="teal-5"
		/>
		<!-- <q-select
			label="Тип формы" stack-label filled style="max-width: 150px"
			v-model="currForm" :options="forms" 
			option-value="value" option-label="label" map-options options-cover
			:dense="densed"  :options-dense="densed"
		/> -->
		<q-space/>
		<q-btn color="secondary" icon="create" label="Сформировать" @click="generate" />
		<q-btn color="secondary" icon="save" label="Сохранить" @click="save"/>
	</div>
</template>

<script>

const fs = require("fs");
const { dialog } = require("electron").remote;
const Excel = require('./../excel')

export default {
	data() {
		return {
			forms: [
        { value: "osv", label: "ОСВ общая" },
        { value: "osv_acc", label: "ОСВ по счету" },
        { value: "acc_an", label: "Анализ счета" }
      ],
      
		}
	},
	computed: {
		selectedForm: {
			get() {
				return this.$store.state.selectedForm
			},
			set(value) {
				console.log("Изменяем форму: ",value)
				this.$store.commit('changeForm', value)
			}
		}
	},
	methods: {
		// Синоним для вызова мутации простой записи значения в поле
		 mutate: function(field, value) {
      this.$store.commit('set', {field, value })
		},
		
		/**
		 * Выбор файла с входными данными
		 */
		chooseFile: async function(event) {
      let opt = {
        title: "Выберите файл Excel",
        filters: [{ name: "Excel файлы", extensions: ["xls", "xlsx"] }]
      };
      const dialogResult = await dialog.showOpenDialog(null, opt) //null, opt, fn => {
			if (dialogResult == undefined) return

			let filename = dialogResult[0]

			this.mutate('filename', filename);
			const loaded_data = Excel.readData(filename)

      this.$store.commit('load_data', loaded_data)
			this.$store.commit('set_valid', 'all') 

			console.log("Данные загружены. Счета: ", this.$store.state.accs);
      
      this.tableData = []
      this.tab = "tabSettings"
      this.formData = []
		},
		generate(value) {
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
}
</script>

<style>

</style>