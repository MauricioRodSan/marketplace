<template>
  <main id="inmueble" v-if="property">
    <section id="encabezado">

      <inmueble-galeria></inmueble-galeria>

      <inmueble-general :property="property" :description="description"></inmueble-general>

    </section>

    <inmueble-informacion :property="property" v-model:description="description"></inmueble-informacion>
    
  </main>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { onBeforeRouteLeave } from "vue-router";

import InmuebleGeneral from "@/components/inmuebles/InmuebleGeneral.vue";
import InmuebleInformacion from "@/components/inmuebles/InmuebleInformacion.vue";
import InmuebleGaleria from "@/components/inmuebles/InmuebleGaleria.vue";

export default {
  props: {
    transaction: String,
    type: String,
    estado: String,
    municipio: String,
    asentamiento: String,
    propertySlug: String,
  },
  setup(props) {
    const 
      store = useStore(),
      property = computed(() => store.getters['property/get']),
      description = ref(null),
      newProperty = props.transaction == "nuevo",
      canSave = computed(() => store.getters["property/haveChanges"] || store.getters["company/haveChanges"] || store.getters["user/haveChanges"]),
      isSaving = computed(() => store.getters["section/isSaving"]),
      canApplyChanges = computed(() => store.getters["property/canApplyChanges"]);

    watch(canSave, (canSave) => {
      store.commit("section/setCanSave", canSave);
    });

    watch([canApplyChanges, isSaving], () => {
      if(canApplyChanges.value && isSaving.value) {
        if(store.getters["property/haveChanges"]) {
          store.dispatch("property/applyChanges");
        }
      }
      if(isSaving.value) {
        if(store.getters["company/haveChanges"]) {
          store.dispatch("company/postCompany");
        }
        if(store.getters["user/haveChanges"]) {
          store.dispatch("user/postUser");
        }
      }
    });

    onMounted(() => {
      store.commit('section/set', { section: "Inmueble", subSection: (newProperty ? "Nuevo" : "Editar"), type: "property" });
      store.dispatch(
        "property/getProperty",
        !newProperty
          ? {
              params: {
                property: `${props.transaction}/${props.type}/${props.estado}/${props.municipio}/${props.asentamiento}/${props.propertySlug}`,
              },
            }
          : null
      );
    });

    onBeforeRouteLeave(() => {
      store.commit("property/reset", false);
    });

    return {
      property,
      description,
      canApplyChanges
    };
  },
  components: {
    InmuebleGeneral,
    InmuebleGaleria,
    InmuebleInformacion,
  },
};
</script>

<style>
</style>