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
    <q-btn label="form3 test" @click="generateForm3" v-show="true" />
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
      }
      // Форма "Анализ по счету"
      else if (this.selectedForm == "acc_an") {
          this.mutate("formAnalysisAcc", FinomancerForms.form3New(this.raw_data, this.ОтмеченныеСчета))
      }

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
      let table3 = []
      //this.mutate("formAnalysisAcc", FinomancerForms.form3(this.raw_data, this.currAcc, this.currPeriod.p_id))
      const data = this.raw_data
      const periods = this.$store.state.periods
      if (data == undefined) {
        this.$store.commit("show_msg", {header: "Нет данных", text: "Не загружены данные из Excel"})
        return 
      }
      let curr_acc = ""
      data.forEach(element => {
          
          curr_acc = element.lType == "ОСВ_общая" ? element.acc : curr_acc   // для хранения последнего счета чтоб сравнивать когда метка типа Ан_90.01.1 а самого счета нет
          let isHeader = element.lType == "ОСВ_общая"
          let level = isHeader ? curr_acc.split(".").length -1 : 0
          let isSubconto = element.lType == "ОСВ_"+curr_acc
          let isKorrLine = element.lType == "Ан_"+curr_acc    // это строка с корр.счетом 

          // Когда субконто - ищем все строки с таким счетом и вытащим все корр.счета
          if (isSubconto) {
            // проверяем что строки для субконто еще нет в результирующем массиве
            if (table3.find(l => l.acc == curr_acc && l.isSubconto ==true) != undefined ) return 

            // Все корр счета для текущего счета
            let korrs = new Set(data.filter(el=> el.lType == "Ан_"+curr_acc).map(el => el.accName))  // множество для исключения дублей
            // пройдем по всем периодам и вытащим данные по каждому субконто
            let period_data = []
            periods.forEach(p => {      // - по периодам
              let korr_sums = []
              korrs.forEach(korr => {   // - по субконто
                
                let period_sum = data.filter(el=> el.lType == "Ан_"+curr_acc && el.accName == korr)  // ввыбираем из всех данных по субконто данные по периоду
                  .map(str => str.periodicAmounts.find(per=> per.p_id == p.p_id))   // для каждой строки отбираем только текущий период из всех колонок (0-й элемент т.к. фильтр)
                  .reduce((acc, p) =>     // суммируем если нашлось несколько строк для корр счета (массивов периодов тоже будет несколько)
                    ({  
                      Dt: acc.Dt + p.Dt, Kt: acc.Kt + p.Kt
                    }), 
                    {     // начальный объект с суммами
                      Dt:0, Kt:0
                    })
                korr_sums.push({
                  korr,
                  ...period_sum
                })
                     
              })
              // 
              period_data["p"+p.p_id] = korr_sums
            })
            // полученный свернутый объект пихаем в массив в разрезе счета
            table3.push({     // 
              acc: curr_acc,
              isHeader,
              isSubconto,
              period_data
            })
          }
          else if (isHeader) {
            // пихаем простые данные - когда строка это описание счета или субсчета
            table3.push({
              acc: curr_acc,
              isHeader,
              level,
              periods: {}
            })
          }
          
                  
      })
      console.log("РЕЗУЛЬТАТ ОБРАБОТКИ : ");      
      console.log(table3)
    },
    generateForm3: function() {
      const data = this.raw_data
      const periods = this.$store.state.periods  
      this.mutate("formAnalysisAcc", FinomancerForms.form3New(data, periods, this.ОтмеченныеСчета))
      console.log("Форма 3 сформирована", this.$store.state.formAnalysisAcc.length)
    }
	}
}
</script>

<style>

</style>