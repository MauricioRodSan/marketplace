<template>
  <div class="catalog-content">
    <div class="catalog-title">
      <h5 class="title">Tipo</h5>
      <button class="button gradient" @click="addCatalog" :disabled="!canAddCatalog">Agregar</button>
    </div>
    <div class="catalog-items">
      <catalog-type-item v-for="(catalog, index) in catalogs" :catalog="catalog" :types="types" :key="index" @changed="change => changedItem(index, change)"></catalog-type-item>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import CatalogTypeItem from "@/components/catalog/CatalogTypeItem.vue";
export default {
  setup() {
    const 
      store = useStore(),
      catalogs = computed(() => store.getters["catalog/type"]),
      types = computed(() => catalogs.value.map(type => type.slug)),
      canAddCatalog = computed(() => catalogs.value[catalogs.value.length - 1].type),
      addCatalog = (() => {
        store.commit("catalog/add");
      }),
      changedItem = ((index, change) => {
        if(change) {
          store.commit("catalog/setCatalog", { type: "type", index, change });
        } else {
          store.commit("catalog/setCatalog", { type: "type", index });
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
    CatalogTypeItem
  }
}
</script>

<style>

</style>