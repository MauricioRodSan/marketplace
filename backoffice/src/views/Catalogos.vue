<template>
  <main>
    <section id="catalogos" class="py-5">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-11 col-xl-10">
            <div class="content">

              <h4 class="title mb-5">Inmuebles</h4>
              <div class="row justify-content-center" v-if="catalogs">
                <div class="col-12 col-lg-4">
                  <catalog-type></catalog-type>
                </div>
                <div class="col-12 col-lg-4">
                  <catalog-data section="Superficie"></catalog-data>
                </div>
                <div class="col-12 col-lg-4">
                  <catalog-data section="Generales"></catalog-data>
                </div>
                <div class="col-12 col-lg-4 mt-5">
                  <catalog-data section="Servicios"></catalog-data>
                </div>
                <div class="col-12 col-lg-4 mt-5">
                  <catalog-data section="Amenidades"></catalog-data>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";

import CatalogType from "@/components/catalog/CatalogType.vue";
import CatalogData from "@/components/catalog/CatalogData.vue";
export default {
  setup() {
    const 
      store = useStore(),
      catalogs = computed(() => store.getters["catalog/catalogs"]),
      init = () => {
        store.dispatch("catalog/getCatalogs");
      },
      canSave = computed(() => store.getters["catalog/haveChanges"] || store.getters["company/haveChanges"] || store.getters["user/haveChanges"]),
      isSaving = computed(() => store.getters["section/isSaving"]);

    watch(canSave, (canSave) => {
      store.commit("section/setCanSave", canSave);
    });

    watch(isSaving, (isSaving) => {
      if(isSaving) {
        if(store.getters["catalog/haveChanges"]) {
          store.dispatch("catalog/postCatalogs");
        }
        if(store.getters["company/haveChanges"]) {
          store.dispatch("company/postCompany");
        }
        if(store.getters["user/haveChanges"]) {
          store.dispatch("user/postUser");
        }
      }
    });

    watch(catalogs, (catalogs) => {
      if(!catalogs) {
        init();
      }
    });

    onMounted(() => {
      store.commit("section/set", {
        section: "Catálogos",
        subSection: "Administrar",
        type: "catalog",
      });
      init();
    });

    return {
      catalogs
    };
  },
  components: {
    CatalogType,
    CatalogData
  }
};
</script>

<style>
</style>