<template>
  <!-- #inicio-servicios -->
  <section id="inicio-servicios">
    <div class="servicios-resumidos">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-11 col-xl-10">
            <div class="content">

              <template 
                v-for="content in contents"
                :key="content.id"
              >
                <template 
                  v-if="!content.contents"
                >
                  <template 
                    v-if="content.order != 3"
                  >
                    <component
                      v-model:content="content.content"
                      :id="content.id"
                      :key="content.id"
                      :is="content.editable.type"
                    ></component>
                  </template>
                  <template 
                    v-else
                  >
                    <div class="row justify-content-center">
                      <div class="col-12 col-md-6 col-lg-5 col-xl-4">
                        <component
                          v-model:content="content.content"
                          :id="content.id"
                          :key="content.id"
                          :is="content.editable.type"
                        ></component>
                      </div>
                    </div>
                  </template>
                  
                </template>

                <template 
                  v-else
                >
                  <div class="row align-items-stretch">
                    <div
                      class="col-12 col-md-4"
                      v-for="service in content.contents"
                      :key="service.id"
                    >
                      <servicio-resumen
                        :contents="service.contents"
                      ></servicio-resumen>
                    </div>
                  </div>
                </template>
              </template>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#inicio-servicios -->
</template>

<script>
import ServicioResumen from "@/components/servicios/ServicioResumen.vue"
import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array
  },
  components: {
    ServicioResumen,
    Editor
  }
};
</script>