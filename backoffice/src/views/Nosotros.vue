<template>
  <main>
    <template v-if="content">

      <nosotros-header
        :contents="content.nosotros"
      ></nosotros-header>

      <futurplace
        :contents="content.futurplace"
      ></futurplace>

      <tus-aliados
        :contents="content.tus_aliados"
      ></tus-aliados>

      <como-trabajamos
        :contents="content.como_trabajamos"
      ></como-trabajamos>

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

import NosotrosHeader from "@/components/nosotros/NosotrosHeader.vue";
import Futurplace from "@/components/nosotros/Futurplace.vue";
import TusAliados from '@/components/nosotros/TusAliados.vue';
import ComoTrabajamos from '@/components/nosotros/ComoTrabajamos.vue';

import ServiciosResumen from "@/components/servicios/ServiciosResumen.vue";

import Contacto from "@/components/Contacto.vue";
import Footer from "@/components/Footer.vue";
export default {
  setup() {
    const 
      store = useStore(),
      page = "nosotros",
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
      store.commit('section/set', { section: "Páginas", subSection: "Nosotros", type: "content" });
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
    NosotrosHeader,
    Futurplace,
    TusAliados,
    ComoTrabajamos,
    ServiciosResumen,
    Contacto,
    Footer
  }
};
</script>

<style></style>
