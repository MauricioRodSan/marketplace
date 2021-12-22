<template>
  <div class="col-12 col-md-4">
    <div>
      <h4 class="title">{{ name }}</h4>

      <div class="catalog-add" v-if="toAdd.length > 0">
        <label>Agregar opción</label>
        <select v-model="optionToAdd">
          <option value="0" hidden>Seleccionar</option>
          <option v-for="option in toAdd" :value="option.id" :key="option.id">{{ option.catalog }}</option>
        </select>
        <button type="button" @click="addOption" :disabled="optionToAdd == '0'">Agregar</button>
      </div>

      <ul class="property-catalog with-bullets">
        <inmueble-catalogo v-for="option in toEdit" :catalog="option" :key="option.id"></inmueble-catalogo>
        <inmueble-catalogo v-for="option in visible" :catalog="option" :key="option.id"></inmueble-catalogo>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from 'vuex';

import InmuebleCatalogo from "@/components/inmuebles/InmuebleCatalogo.vue";
export default {
  props: {
    name: String,
    catalog: Array
  },
  setup(props) {
    const 
      store = useStore(),
      optionToAdd = ref("0"),
      toEdit= computed(() => {
        return props.catalog.filter(option => option.value != null);
      }),
      visible = computed(() => {
        return props.catalog.filter(option => option.visible == "1" && option.value == null);
      }),
      toAdd = computed(() => {
        return props.catalog.filter(option => option.visible == "0" && option.value == null);
      }),
      addOption = (() => {
        store.commit("setPropertyDataVisible", { name: props.name, id: optionToAdd.value })
        optionToAdd.value = "0";
      });

      return {
        optionToAdd,
        toEdit,
        toAdd,
        visible,
        addOption
      }
  },
  components: {
    InmuebleCatalogo
  }
};
</script>

<style>
</style>