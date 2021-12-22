<template>
  <!-- #nuestrsos-servicios -->
  <section id="nuestrsos-servicios">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">
            <div class="row align-items-stretch">
              
              <template
                v-for="content in contents"
                :key="content.id"
              >
                <div 
                  class="col-12 col-md-6"
                  v-for="service in content.contents"
                  :key="service.id"
                >
                  <nuestro-servicio
                    :contents="service.contents"
                  ></nuestro-servicio>
                </div>
              </template>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#nuestrsos-servicios -->
</template>

<script>
import NuestroServicio from "@/components/servicios/NuestroServicio.vue";
export default {
  props: {
    contents: Array
  },
  components: {
    NuestroServicio
  }
};
</script>

<style>

</style>