<template>
  <main>
    <template v-if="content">

      <banners 
        :contents="content.banners"
      ></banners>

      <destacados 
        :contents="content.destacados"
      ></destacados>

      <comprometidos 
        :contents="content.comprometidos"
      ></comprometidos>

      <servicios-resumen 
        :contents="content.servicios_resumen"
      ></servicios-resumen>
      
      <contacto
        :contents="content.contacto"
        v-if="company"
      ></contacto>

      <Footer 
        :contents="content.aviso_de_privacidad"
        v-if="company"
      ></Footer>

    </template>
  </main>
</template>

<script>
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { onBeforeRouteLeave } from "vue-router";

import Banners from "@/components/inicio/Banners.vue";
import Comprometidos from "@/components/inicio/Comprometidos.vue";

import Destacados from "@/components/inmuebles/Destacados.vue";
import ServiciosResumen from "@/components/servicios/ServiciosResumen.vue";

import Contacto from "@/components/Contacto.vue";
import Footer from "@/components/Footer.vue";

export default {
  setup() {
    const 
      store = useStore(),
      page = "/",
      company = computed(() => store.getters["company/get"]),
      content = computed(() => store.getters["content/get"]),
      canSave = computed(() => store.getters["content/haveChanges"] || store.getters["property/haveChanges"] || store.getters["company/haveChanges"] || store.getters["user/haveChanges"]),
      isSaving = computed(() => store.getters["section/isSaving"]);

    watch(canSave, (canSave) => {
      store.commit("section/setCanSave", canSave);
    });

    watch(isSaving, (isSaving) => {
      if(isSaving) {
        if(store.getters["content/haveChanges"]) {
          store.dispatch("content/postContent");
        }
        if(store.getters["property/haveChanges"]) {
          store.dispatch("property/applyChanges");
        }
        if(store.getters["company/haveChanges"]) {
          store.dispatch("company/postCompany");
        }
        if(store.getters["user/haveChanges"]) {
          store.dispatch("user/postUser");
        }
      }
    });

    onMounted(() => {
      store.commit('section/set', { section: "Páginas", subSection: "Inicio", type: ["content", "property"] });
      store.commit('content/setPage', page);
      store.dispatch("content/getContent");
    });

    onBeforeRouteLeave(() => {
      store.commit("content/reset", false);
    });

    return {
      content,
      company
    }
  },
  components: {
    Banners,
    Destacados,
    Comprometidos,
    ServiciosResumen,
    Contacto,
    Footer
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/futurplace";
</style>
