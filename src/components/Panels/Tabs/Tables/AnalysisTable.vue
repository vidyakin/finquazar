<template>
	<table class="tbl_an" >
			<thead>
					<tr>
							<th width="250">Счет</th>
							<th width="250" rowspan="2">Кор. счет</th>
							<th rowspan="2">Дебет</th>
							<th rowspan="2">Кредит</th>
					</tr>
					<tr>
							<th>Период</th>
					</tr>
			</thead>
			<tbody>
					<!-- :key="row.acc+row.p.p_id+row.korr" - для TR обязателен ключ -->
					<template :class="get_class(row)" v-for="row of analysis_data" > 
						<!-- для заголовка выводим строку со счетом -->
						<template  v-if="row.lType == 'header'">
							<tr :key="'H-'+row.rowN" :class="get_class(row)">
								<td>{{row.acc}}</td>
								<td>Начальное сальдо</td>
								<td></td>
								<td></td>
							</tr>
						</template>
						<!-- Для субконто надо вывести заголовок с названием периода и субмассив по периодам -->
						<template v-if="row.lType == 'subconto' && row.p != '' && row.korr == '' && show_empty(row) ">
							<tr :key="'B-'+row.rowN+row.p.p_id" :class="get_class(row)">
								<td>Обороты за {{row.p.p_name}}</td>
								<td>Начальное сальдо</td>
								<td></td>
								<td></td>								
							</tr>
						</template>
						<!-- Для детальных строк по корр. счетам -->
						<template v-if="row.lType == 'subconto' && row.korr != '' && show_empty(row)">
							<tr :key="'K-'+row.rowN+row.p.p_id+row.korr" :class="get_class(row)" >
								<td></td>
								<td>{{row.korr}}</td>
								<td class="nums">{{row.period_sum.Dt| fin_format }}</td>
								<td class="nums">{{row.period_sum.Kt| fin_format }}</td>
							</tr>
						</template>
						<!-- Для детальных строк по корр. счетам -->
						<template v-if="row.lType == 'total' && show_empty(row)">
							<tr :key="'T-'+row.rowN+row.p.p_id+'_1'" :class="get_class(row)">
								<td></td>
								<td>Оборот</td>
								<td class="nums">{{row.period_sum.Dt| fin_format}}</td>
								<td class="nums">{{row.period_sum.Kt| fin_format}}</td>								
							</tr>
							<tr :key="row.rowN+row.p.p_id+'_2'" :class="get_class(row)">
								<td></td>
								<td>Конечное сальдо {{row.rowN}}</td>
								<td class="nums">{{row.period_sum.SaltoDt| fin_format}}</td>
								<td class="nums">{{row.period_sum.SaldoKt| fin_format}}</td>								
							</tr>
						</template>							
					</template>
						
					<!-- Корр счет №1 -->
					<!-- <tr class="period_header">
							<td>Обороты за Январь 18</td>
							<td>Начальное сальдо</td>
							<td></td>
							<td></td>
					</tr>
					<tr class="korr_sum">
							<td></td>
							<td>62</td>
							<td></td>
							<td class="nums">519 729.00</td>
					</tr>
					<tr class="korr_total">
							<td></td>
							<td>Оборот</td>
							<td></td>
							<td class="nums">519 729.00</td>
					</tr>
					<tr class="korr_total">
							<td></td>
							<td>Конечное сальдо</td>
							<td></td>
							<td class="nums"></td>
					</tr> -->
			</tbody>
	</table>
</template>

<script>

export default {
		props: ["ПоказыватьПустыеОбороты"],
		data() {
				return {
						
				}
		},
		computed: {
				analysis_data() {
						return this.$store.state.formAnalysisAcc
				}
		},
		filters: {
			fin_format: value => value == undefined ? '' : value.toLocaleString('ru', {style:'decimal', minimumFractionDigits: 2})
		},    
		methods: {
				get_class(item) {
						if (item.lType == "header") {
							if (item.level == 0) return "top_acc"
							else if (item.level == 1) return "sub_acc"
							else if (item.level == 2) return "sub_sub_acc"
						}
						else if (item.lType == "subconto" && item.korr == '') 
							return "period_header"
						else if (item.lType == "subconto" && item.korr != '') 
							return "korr_sum"
						else if (item.lType == "total") 
							return "korr_total"
				},
				show_empty(item) {
					if (item.period_sum == undefined) {
						console.log(item.acc,item.korr,item.p);
						return true
					}
					return this.ПоказыватьПустыеОбороты || item.period_sum.Dt != 0 || item.period_sum.Kt != 0
				}
		},
		created() {
			console.log("Форма анализа создана, данные ");
			// this.ft = this.formType;
		}
}
</script>

<style>
.tbl_an {
	width: 800px;
	table-layout: fixed;
	border-collapse: collapse;
	border: 1px solid grey;
	font-size: 10pt;
	/* margin-top: 10px; */
}
.tbl_an thead {
	background-color: #f5f5dc;
}
.tbl_an th,
td {
	border: 1px solid grey;
	padding-left: 5px;
	padding-right: 5px;
	text-align: left;
}
.tbl_an tr:hover td {
		background-color: lightcyan;
		transition: all .5s ease-in-out;
}

.tbl_an tr.top_acc td {
		background-color: #e4f0dd;
}
.tbl_an tr.sub_acc td {
		background-color: #e4f0dd;
		padding-left: 15px
}
.tbl_an tr.sub_sub_acc td {
		background-color: #e4f0dd;
		padding-left: 25px
}
.tbl_an tr.period_header td, .tbl_an tr.korr_total td {
		background-color: #f0f6ef;
		padding-left: 35px
}
.tbl_an tr.korr_sum td {
		padding-left: 60px
}

.tbl_an tr.korr_total td {
		font-weight: bold;
		color: rgb(0,63,47)
}
/* Все по правому кроме 1 и 2 колонок */
.tbl_an td.nums {
	text-align: right;
}
</style>