<template>
  <div class="row">
    <template v-if="propertys">
      <inmueble-resumen
        v-for="property in propertys"
        :property="property"
        :key="property.id"
      ></inmueble-resumen>
    </template>
    <template v-else>
      <div class="col-12 text-center">
        <h6 class="title">Sin inmuebles</h6>
      </div>
    </template>
  </div>
</template>

<script>
import InmuebleResumen from "@/components/inmuebles/InmuebleResumen.vue";
export default {
  props: {
    propertys: Object
  },
  components: {
    InmuebleResumen,
  },
};
</script>

<style>
</style>