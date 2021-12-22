<template>
  <main>
    <template v-if="content">

      <servicios-header
        :contents="content.servicios"
      ></servicios-header>

      <nuestros-servicios
        :contents="content.nuestros_servicios"
      ></nuestros-servicios>
      
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

import ServiciosHeader from "@/components/servicios/ServiciosHeader.vue";
import NuestrosServicios from "@/components/servicios/NuestrosServicios.vue";

import Contacto from "@/components/Contacto.vue";
import Footer from "@/components/Footer.vue";
export default {
  setup() {
    const 
      store = useStore(),
      page = "servicios",
      company = computed(() => store.getters["company/get"]),
      content = computed(() => store.getters["content/get"]),
      canSave = computed(() => store.getters['content/haveChanges'] || store.getters["company/haveChanges"] || store.getters["user/haveChanges"]),
      isSaving = computed(() => store.getters["section/isSaving"]);

    watch(canSave, (canSave) => {
      store.commit("section/setCanSave", canSave);
    });

     watch(isSaving, (isSaving) => {
      if(isSaving) {
        if(store.getters["content/haveChanges"]) {
          store.dispatch("content/postContent");
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
      store.commit('section/set', { section: "Páginas", subSection: "Servicios", type: "content" });
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
    ServiciosHeader,
    NuestrosServicios,
    Contacto,
    Footer
  }
};
</script>

<style></style>
