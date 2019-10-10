<template>
    <div class="row">
        <div class="col-auto text-grey-7 pad-5">
        <q-tabs vertical class="text-teal" dense v-model="currAcc">
            <q-tab :name="'acc'+ДанныеПоСчету.Счет" :label="ДанныеПоСчету.Счет" v-for="ДанныеПоСчету in data.ДанныеЗаПериод" :key="ДанныеПоСчету.Счет" />
        </q-tabs>
        </div>
        <q-separator vertical></q-separator>
        <div class="col">
        <!-- Линия данных - счета в табах-->
        <q-tab-panels animated
            v-model="currAcc"                  
            transition-prev="jump-up"
            transition-next="jump-up"
        >
            <q-tab-panel :name="'acc'+ДанныеПоСчету.Счет" class="q-pt-none" v-for="ДанныеПоСчету in data.ДанныеЗаПериод" :key="ДанныеПоСчету.Счет">
            <!-- Линия заголовка таблицы -->
            <div class="row">
                <h6>Оборотно сальдовая ведомость по счету {{ДанныеПоСчету.Счет}} за {{data.ЗаголовокПериода}}</h6>
            </div>                    
            <AccTable :tableData="ДанныеПоСчету.Результат" :formType="currForm"></AccTable>
            </q-tab-panel>
        </q-tab-panels>
        </div>
    </div>                
</template>

<script>
import AccTable from "../AccTable";

export default {
    props: ["data","currForm"],
    components: { AccTable },
    data() {
        return {
            aaa: ""
        }
    },
    created: function() {
        //this.currAcc = this.$store.state.selectedAcc
        console.log("TabOsvByAcc is created!", this.currAcc)
        
    },
    computed: {
        // двунаправленное свойство - читаем из стора и пишем туда через мутацию
        currAcc: {
            get() {
                return this.$store.state.selectedAcc
            },
            set(e) {
                this.$store.commit('currAccChanged', e)
            }
        }
    }
}
</script>

<style>

</style>