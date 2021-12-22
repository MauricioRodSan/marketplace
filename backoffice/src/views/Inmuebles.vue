<template>
  <main id="busqueda">
    <section id="encabezado">
      <div class="filtros-orden breadcrumbs first-section">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-11 col-xl-10">
              <div class="content">
                <div class="filters">
                  <p>{{ section.subSection }}</p>
                </div>
                <div class="order-by">
                  <router-link to="/inmueble/nuevo" class="button gradient">Agregar inmueble</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- #inmuebles -->
    <section id="inmuebles">
      <div class="inmuebles">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-11 col-xl-10">
              <div class="content">
                <inmueble-listado :propertys="propertys"></inmueble-listado>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- /#inmuebles -->
  </main>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";

import InmuebleListado from "@/components/inmuebles/InmuebleListado.vue";
export default {
  props: {
    transaction: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const 
      store = useStore(),
      section = computed(() => store.getters["section/get"]),
      propertys = ref(null),
      getPropertys = () => {
        propertys.value = null;
        axios
          .get(
            `property/${
              props.transaction != "todos"
                ? `transaction?transaction=${props.transaction}`
                : `all`
            }`
          )
          .then(function (response) {
            if (response.data) {
              propertys.value = response.data;
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      init = () => {
        store.commit("section/set", {
          section: "Inmuebles",
          subSection: props.transaction.charAt(0).toUpperCase() + props.transaction.slice(1),
          type: "property",
        });
        getPropertys();
      },
      canSave = computed(() => store.getters["property/haveChanges"] || store.getters["company/haveChanges"] || store.getters["user/haveChanges"]),
      isSaving = computed(() => store.getters["section/isSaving"]);

    watch(
      () => props.transaction,
      () => {
        init();
      }
    );

    watch(canSave, (canSave) => {
      store.commit("section/setCanSave", canSave);
    });

    watch(isSaving, (isSaving) => {
      if(isSaving) {
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
      init();
    });

    return {
      section,
      propertys,
      canSave
    };
  },
  components: {
    InmuebleListado,
  },
};
</script>

<style>
</style>