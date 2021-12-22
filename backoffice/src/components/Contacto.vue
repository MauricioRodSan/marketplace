<template>
  <!-- #contacto -->
  <div id="contacto">
      <div class="container-fluid">
          <div class="row justify-content-center">
              <div class="col-11 col-xl-10">
                  <div class="content">
                      <div class="row">
                          <div class="col-12 col-md-6">
                              <div class="informacion">

                                <component 
                                  v-for="content in contents"
                                  v-model:content="content.content"
                                  :id="content.id"
                                  :key="content.id"
                                  :is="content.editable.type"
                                ></component>

                                <div class="medio">
                                    <img src="https://futurplace.incitrus.com/assets/img/ui/icon-marker.svg" class="img-fluid" alt="">
                                    <p><strong>{{ address }}</strong></p>
                                </div>
                                <a href="tel:5541240311" class="medio align-items-center">
                                    <img src="https://futurplace.incitrus.com/assets/img/ui/icon-phone.svg" class="img-fluid" alt="">
                                    <p><strong>{{ phone }}</strong></p>
                                </a>
                              </div>
                          </div>
                          <div class="col-12 col-md-6">
                              <form id="contacto-form">
                                  <div class="row">
                                      <div class="form-group col-12 col-sm-6">
                                          <input type="text" name="nombre" class="form-control required" placeholder="Nombre" data-placeholder="Nombre">
                                      </div>
          
                                      <div class="form-group col-12 col-sm-6">
                                          <input type="text" name="apellido" class="form-control required" placeholder="Apellido" data-placeholder="Apellido">
                                      </div>
                                  </div>
      
                                  <div class="row">
                                      <div class="form-group col-12 col-sm-6">
                                          <input type="email" name="correo" class="form-control required" placeholder="Correo electrónico" data-placeholder="Correo electrónico">
                                      </div>
                                      <div class="form-group col-12 col-sm-6">
                                          <input type="text" name="telefono" class="form-control required" placeholder="Teléfono" data-placeholder="Teléfono">
                                      </div>
                                  </div>
      
                                  <div class="form-group">
                                      <textarea name="mensaje" class="form-control required" rows="6" placeholder="Mensaje" data-placeholder="Mensaje"></textarea>
                                  </div>
      
                                  <div class="row">
                                      <div class="col-12 col-md-6 col-xl-5">
                                          <button type="submit" class="button gradient w-100">Enviar</button>
                                      </div>
                                  </div>
                                  
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <!-- /#contacto -->
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array
  },
  setup() {
    const 
      store = useStore(),
      address = computed(() => store.getters["company/address"]),
      phone = computed(() => store.getters["company/phone"]);

    return {
      address,
      phone
    };
  },
  components: {
    Editor
  }
};
</script>

<style></style>
