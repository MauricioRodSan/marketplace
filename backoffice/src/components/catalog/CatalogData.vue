<template>
  <div class="catalog-content">
    <div class="catalog-title">
      <h5 class="title">{{ section }}</h5>
      <button class="button gradient" @click="addCatalog" :disabled="!canAddCatalog">Agregar</button>
    </div>
    <div class="catalog-items">
      <catalog-data-item v-for="(catalog, index) in catalogs[section].data" :dataCatalog="catalog" :types="types" :key="index" @changed="change => changedItem(index, change)"></catalog-data-item>
    </div>
  </div>  
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import CatalogDataItem from "@/components/catalog/CatalogDataItem"
export default {
  props: {
    section: String
  },
  setup(props) {

    const 
      store = useStore(),
      catalogs = computed(() => store.getters["catalog/data"]),
      types = computed(() => store.getters["catalog/dataTypes"]),
      canAddCatalog = computed(() => {
        const lastCatalog = catalogs.value[props.section].data[catalogs.value[props.section].data.length - 1];
        return lastCatalog.catalog && lastCatalog.dataCatalogTypeId;
      }),
      addCatalog = (() => {
        store.commit("catalog/add", props.section);
      }),
      changedItem = ((index, change) => {
        if(change) {
          store.commit("catalog/setCatalog", { type: "data", section: props.section, index, change });
        } else {
          store.commit("catalog/setCatalog", { type: "data", section: props.section, index });
        }
      });

    return {
      catalogs,
      types,
      canAddCatalog,
      addCatalog,
      changedItem
    };
  },
  components: {
    CatalogDataItem
  }
}
</script>

<style>

</style>