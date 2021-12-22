<template>
  <!-- #destacados -->
  <section id="destacados">
    <div class="inmuebles">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-11 col-xl-10">
            <div class="content">
              <component
                v-for="content in contents"
                v-model:content="content.content"
                :id="content.id"
                :key="content.id"
                :is="content.editable.type"
              ></component>

              <inmueble-listado :propertys="propertysFeatured"></inmueble-listado>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#destacados -->
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

import InmuebleListado from "@/components/inmuebles/InmuebleListado.vue";

import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array,
  },
  setup() {
    const 
      propertysFeatured = ref(null);

    onMounted(() => {
      axios
        .get("property/featured")
        .then(function (response) {
          if (response.data) {
            propertysFeatured.value = response.data;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });

    return {
      propertysFeatured
    };
  },
  components: {
    Editor,
    InmuebleListado,
  },
};
</script>

<style></style>
