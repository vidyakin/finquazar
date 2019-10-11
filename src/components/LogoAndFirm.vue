<template>
  <div class="row">
      <img src="~/assets/logo-finomancer.png" alt="FINOMANCER" />
      <div class="col1 spacer"></div>
      <div class="column items-end firm">
        <div class="firm_name">{{ firm.name }}</div>
        <div class="firm_inn">{{ firm.inn != "" ? "ИНН " + firm.inn : ""}}</div>
      </div>
    </div>
</template>

<script>
export default {
    
    data() {
        return {

        }
    },
    computed: {
        firm() {
            return this.$store.state.firm
        }
    }
}
</script>

<style>

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

</style>