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
		<q-btn color="secondary" icon="create" label="Сформировать" @click="generate" v-show="false" />
		<q-btn color="secondary" icon="save" label="Сохранить" @click="save" v-show="false"/>
    <q-btn color="secondary" icon="message" label="Сформировать и сохранить" @click="generate_and_save"/>
    <q-btn label="form3 test" @click="download_form3" v-show="false" />
	</div>
</template>

<script>

const fs = require("fs");
const { dialog } = require("electron").remote;
const Excel = require('./../excel')
const FinomancerForms = require("./../fin_logic")

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
    ОтмеченныеПериоды: function() { return this.$store.getters.chkdPeriods }, 
    ОтмеченныеСчета: function() { return  this.$store.getters.chkdAccounts },
    
		selectedForm: {
			get() {
				return this.$store.state.selectedForm
			},
			set(value) {
				console.log("Изменяем форму: ",value)
				this.$store.commit('changeForm', value)
			}
    },
    raw_data() {
      return this.$store.state.rbs_data.data
    },
    form_data() {
      return this.$store.getters.getDataForSelectedForm
    }
	},
	methods: {
		// Синоним для вызова мутации простой записи значения в поле
		mutate: function(field, value) {
      this.$store.commit('set', {field, value })
		},
		НевалидныеНастройки: function() {
      this.$store.getters.НевалидныеНастройки
    },
    msg: function() {
      this.$store.commit("show_msg", {header: "Тест", text: "Тестовое сообщение"})
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
      this.mutate("tab","tabSettings") 
      
      console.log("Данные загружены. Счета: ", this.$store.state.accs);
      let an_string = JSON.stringify(loaded_data)
      fs.writeFileSync("D:/Работа/Михаил Цалапов, БП/Excel/Форма 3, тест/raw_data.json", an_string)
      
      this.tableData = []
      this.formData = []
		},
		generate(value) {
      if (this.ОтмеченныеПериоды.length == 0) {
        this.valid.period.valid = false
      }
      if (this.selectedForm == "osv_acc" && this.ОтмеченныеСчета.length == 0) {
        this.valid.acc.valid = false
      }
      if (this.НевалидныеНастройки() == true) {
        this.$store.commit("show_message", {header: "Ошибка настроек", text: "Проверьте выбор периодов и счетов"})
        return
      }
      
      this.mutate("tab", "tabData")    // переключаемся на закладку с данными
      
      // формируем данные
      let form_data
      // Форма "ОСВ общая"
      if (this.selectedForm == "osv") {
        this.mutate("formOSV", FinomancerForms.form1(this.raw_data, this.ОтмеченныеПериоды))
        this.mutate("periodTab", "p_"+this.form_data[0].Период)
      }      
      // Форма "ОСВ по счету"
      else if (this.selectedForm == "osv_acc") {
          //form_data = FinomancerForms.form2(this.rbs_data.data, this.currAcc, this.currPeriod.p_id)
          this.mutate("formOSVAcc", FinomancerForms.form2(this.raw_data, this.ОтмеченныеСчета, this.ОтмеченныеПериоды))
          this.mutate("periodTab", "p_"+this.form_data[0].Период)
          this.$store.state.selectedAcc = "acc"+this.form_data[0].ДанныеЗаПериод[0].Счет
          // this.acc_tab = "acc"+this.form_data[0].ДанныеЗаПериод[0].Счет
      }
      // Форма "Анализ по счету"
      else if (this.selectedForm == "acc_an") {
          this.mutate("formAnalysisAcc", FinomancerForms.form3(this.raw_data, this.currAcc, this.currPeriod.p_id))
          
          // [this.formData, this.form_header] = [form_data.Результат, form_data.ЗаголовокФормы]        
      }
      // if (form_data.Результат.length > 0) {
      //   this.formData = form_data.Результат
      //   this.form_header = form_data.ЗаголовокФормы
      // }

      console.log("Форма: %s, период: %s, Счет %s", this.selectedForm, this.currPeriod, this.currAcc);
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
      let inn = this.$store.state.firm.inn
      
      // СОХРАНЯЕМ ДАННЫЕ В ЭКСЕЛЬ

      if (this.selectedForm == "osv") {     // ПРОСТАЯ ОСВ - только по периодам 
        for (let fd of this.form_data) {
          let header = `Оборотно сальдовая ведомость за ${fd.ЗаголовокПериода} г.`
          const saveResult = Excel.saveData(fd.Результат, `${folder}/Райффайзен ${fd.ЗаголовокПериода}.xlsx`, header)
        }
      }     
      else if (this.selectedForm == "osv_acc") {    // ОСВ ПО СЧЕТАМ - по периодам и счетам
        for (let fd of this.form_data) {
          for (let acc_data of fd.ДанныеЗаПериод) {
            let acc = acc_data.Счет
            let header = `Оборотно сальдовая ведомость за ${fd.ЗаголовокПериода} по счету ${acc}`
            const saveResult = Excel.saveData(acc_data.Результат, `${folder}/${inn} - ${fd.ЗаголовокПериода} - счет ${acc}.xlsx`, header)
          }          
        }     
      }
      this.$store.commit("show_msg", {header: "Файлы сохранены", text: "Файлы успешно записаны"})
    },
    generate_and_save: async function() {
      this.generate()
      await this.save()
    },
    download_form3: function() {
      let result = []
      //this.mutate("formAnalysisAcc", FinomancerForms.form3(this.raw_data, this.currAcc, this.currPeriod.p_id))
      const data = this.raw_data
      let curr_acc = ""
      data.forEach(element => {
          
          curr_acc = element.lType == "ОСВ_общая" ? element.acc : curr_acc   // для хранения последнего счета чтоб сравнивать когда метка типа Ан_90.01.1 а самого счета нет
          
          let periodicData = {}
          if (element.lType == "Ан_"+curr_acc) {
              // для сворачивания по счету надо схлопнуть этот массив строк
              let СтрокиКоррСчета = data.filter(str => str.lType == "Ан_"+curr_acc && str.accName == element.accName)
              for (let СтрСчета of СтрокиКоррСчета) {
                  for (let СтрПериода of СтрСчета.periodicAmounts) {
                      let p = СтрПериода.p_id
                      if (periodicData[p] == undefined) {
                        periodicData[p] = {
                          Dt: СтрПериода.Dt,
                          Kt: СтрПериода.Kt
                        }
                      }
                      else {
                        periodicData[p].Dt += СтрПериода.Dt
                        periodicData[p].Kt += СтрПериода.Kt
                      }
                  }
              }
              
              // debug
          }
          
          let isHeader = element.lType == "ОСВ_общая"
          let isSubconto = element.lType == "ОСВ_"+curr_acc
          // проверяем что если мы на строке кор счета и он уже ранее был добавлен, второй раз не добавляем и пропускаем эту строку
          let korr = result.filter(el => el.acc == curr_acc && el.korr == element.accName)  // массив из результата, где объект с таким счетом и корр.счетом
          let isKorrLine = element.lType == "Ан_"+curr_acc    // это строка с корр.счетом 
          if (!isKorrLine || isKorrLine && korr.length == 0) {
            // добавление обработанных данных в результат
            result.push({
                acc: isHeader ? element.acc : "",
                isHeader,
                isKorrLine,
                isSubconto,        // заголовок субконто, по заданию не надо выводить, а суммировать только по счетам
                korr: isKorrLine ? element.accName : "",   
                level: isHeader ? element.acc.split(".").length-1 : 0,
                subconto: isSubconto ? element.accName : "",
                periodicData,

            })
          }         
      })
      console.log("РЕЗУЛЬТАТ ОБРАБОТКИ : ");      
      console.log(result)
    }
	}
}
</script>

<style>

</style>