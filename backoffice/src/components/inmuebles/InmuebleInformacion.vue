<template>
  <section id="informacion">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">

            <inmueble-catalogo-columnas name="Superficie" :catalog="property.data.Superficie"></inmueble-catalogo-columnas>

            <div class="descripcion">
              <h4 class="title">Descripción</h4>
              <editor :content="property.isNew ? descriptionGeneral : property.description" :toStore="false" @changed="descriptionChange" @unchanged="descriptionChange"></editor>
            </div>

            <div class="row">
              <inmueble-catalogo-filas name="Generales" :catalog="property.data.Generales"></inmueble-catalogo-filas>
              <inmueble-catalogo-filas name="Servicios" :catalog="property.data.Servicios"></inmueble-catalogo-filas>
              <inmueble-catalogo-filas name="Amenidades" :catalog="property.data.Amenidades"></inmueble-catalogo-filas>
            </div>

            <inmueble-direccion :property="property"></inmueble-direccion>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted } from "vue";
import { useModelWrapper } from "@/composables/utils";

import InmuebleCatalogoColumnas from "@/components/inmuebles/InmuebleCatalogoColumnas.vue";
import InmuebleCatalogoFilas from "@/components/inmuebles/InmuebleCatalogoFilas.vue";
import InmuebleDireccion from '@/components/inmuebles/InmuebleDireccion.vue';

import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    property: Object,
    description: String
  },
  setup(props, { emit }) {
    const 
      descriptionGeneral = useModelWrapper(props, emit, "description"),
      descriptionChange = (change => {
        if(change) {
          descriptionGeneral.value = change;
        }
      });
    
    onMounted(() => {
      if(props.property.isNew) {
        descriptionGeneral.value = "<p>Texto ejemplo descriptivo del inmueble</p>";
      }
    });

    return {
      descriptionGeneral,
      descriptionChange
    }
  },
  components: {
    Editor,
    InmuebleCatalogoColumnas,
    InmuebleCatalogoFilas,
    InmuebleDireccion
  }
};
</script>

<style>
</style>