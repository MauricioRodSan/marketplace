<template>
  <div class="ubicacion">
    <h4 class="title text-center">Ubicación del inmueble</h4>

    <div class="address-wrapper">
      <div class="address-postal-code">

        <div class="address-row">
          <div class="property-field primary mr-4">
            <label>Código postal*</label>
            <div class="input-wrapper with-icon inline mw-100 only-bottom">
              <input type="text" v-model="codigo_postal" @change="findCodigoPostal" @keypress="useIsNumber" maxlength="5">
              <span class="input-icon">#</span>
            </div>
          </div>
          <div class="property-field primary">
            <label>Municipio, Estado</label>
            <span>{{ municipio }}, {{ estado }}</span>
          </div>
        </div>

        <div class="address-row my-4">
          <div class="property-field primary">
            <label>Asentamiento*</label>
            <div class="input-wrapper inline primary only-bottom mw-400">
              <select v-model="codigo_postal_id" :disabled="codigo_postal_id == '-1'">
                <option value="-1" hidden>Ingresa el código postal</option>
                <option value="0" v-if="asentamientos && asentamientos.length > 1" hidden>Seleccionar</option>
                <option v-for="colonia in asentamientos" :value="colonia.id" :key="colonia.id">{{ colonia.asentamiento }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="address-street-number ml-5">
        <div class="address-row">
          <div class="property-field primary mr-4">
            <label>Calle*</label>
            <div class="input-wrapper with-icon inline only-bottom">
              <input type="text" v-model.lazy="street">
              <span class="input-icon">¶</span>
            </div>
          </div>

          <div class="property-field primary mr-4">
            <label>Número*</label>
            <div class="input-wrapper with-icon inline mw-90 only-bottom">
              <input type="text" v-model.lazy="number">
              <span class="input-icon">#</span>
            </div>
          </div>

          <div class="property-field primary">
            <label>Número interior</label>
            <div class="input-wrapper with-icon inline mw-90 only-bottom">
              <input type="text" v-model.lazy="indoor_number">
              <span class="input-icon">#</span>
            </div>
          </div>
        </div>

        <div class="address-row align-items-center my-4">
          <div class="property-field primary mr-4">
            <label>Coordenadas</label>
            <span>{{ latitude }} / {{ longitude }}</span>
          </div>
          <div class="property-field primary">
            <button type="button" @click="toggleByFullAddress(true)" :disabled="street.trim() == '' && number.trim() == ''">Buscar coordenadas por dirección</button>
          </div>
        </div>
      </div>
      
    </div>

    <inmueble-direccion-mapa :address="getAddress" v-model:latitude="latitude" v-model:longitude="longitude" v-model:zoom="zoom" v-model:map_image="map_image"></inmueble-direccion-mapa>

  </div>
</template>

<script>
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";

import { useIsNumber } from "@/composables/utils";

import InmuebleDireccionMapa from "@/components/inmuebles/InmuebleDireccionMapa.vue";

export default {
  props: {
    property: Object
  },
  setup(props) {
    const 
      store = useStore(),
      address = reactive({
        codigo_postal_id: "-1",
        street: "",
        number: "",
        indoor_number: null,
        latitude: null,
        longitude: null,
        zoom: 15,
        map_image: null
      }),
      codigo_postal = ref(null),
      asentamientos = ref(null),
      estado = ref(null),
      municipio = ref(null),
      inStore = ref(false),
      byFullAddress = ref(false),
      getAddress = computed(() => {
        let response = false;
        if(address.codigo_postal_id > 0) {
          response = `${ (byFullAddress.value ? `${ address.street } ${ (!isNaN(address.number) ? `#` : ``) }${ address.number }` : ``) } ${ asentamientos.value.filter( option => option.id == address.codigo_postal_id )[0].asentamiento }, ${ municipio.value }, ${ estado.value }`;
          toggleByFullAddress(false);
        }
        return response;
      }),
      toggleByFullAddress = ( value => byFullAddress.value = value),
      findCodigoPostal = (() => {
        if(codigo_postal.value.length == 5) {
          // console.log("Busca código");
          axios.get("postal-code", { params: { postal_code: codigo_postal.value } } )
            .then(function(response) {
              const postal_code = response.data;
              if(postal_code) {
                municipio.value = postal_code.municipio;
                estado.value = postal_code.estado;
                asentamientos.value = postal_code.postal_codes;
                if(asentamientos.value.length > 1) {
                  address.codigo_postal_id = "0";
                } else {
                  address.codigo_postal_id = asentamientos.value[0].id;
                }
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          console.log("Borrar");
        }
      });

    watch(address, () => {
      address.street = address.street.trim();
      address.number = address.number.trim();
      if(address.indoor_number) {
        address.indoor_number = address.indoor_number.trim();
      }

      const 
        change = [],
        editing = !props.property.isNew;
      let canSave = (!editing ? 
        address.codigo_postal_id > 0 && 
        address.latitude && 
        address.longitude && 
        address.street != "" && 
        address.number != "" : 
        true
      );

      if(canSave) {
        for (let key in address) {
          if(editing) {
            if(address[key] != props.property.address[key] && address[key] != "0") {
              if(key != "indoor_number") {
                if(address[key] != "") {
                  change[key] = address[key];      
                }
              } else {
                change[key] = address[key];
              }
            }
          } else if(!editing) {
            change[key] = address[key];
          }
        }
        canSave = Object.keys(change).length > 0;
      }

      if(canSave) {
        store.commit("property/setChange", { type: "address", change });
        inStore.value = true;
      } else {
        if(inStore.value) {
          store.commit("property/deleteChange", { type: "address" });
          inStore.value = false;
        }
      }
    });

    onMounted(() => {
      if (!props.property.isNew) {
        address.codigo_postal_id = props.property.address.codigo_postal_id;
        address.latitude = props.property.address.latitude;
        address.longitude = props.property.address.longitude;
        address.street = props.property.address.street;
        address.number = props.property.address.number;
        address.indoor_number = props.property.address.indoor_number;
        address.zoom = parseInt(props.property.address.zoom);
        address.map_image = props.property.address.map_image;

        codigo_postal.value = props.property.address.postal_code.postal_codes[0].codigo_postal;
        asentamientos.value = props.property.address.postal_code.postal_codes;
        estado.value = props.property.address.postal_code.estado;
        municipio.value = props.property.address.postal_code.municipio;
      }
    });

    return {
      ...toRefs(address),
      codigo_postal,
      asentamientos,
      estado,
      municipio,
      getAddress,
      findCodigoPostal,
      byFullAddress,
      toggleByFullAddress,
      useIsNumber
    }
  },
  components: {
    InmuebleDireccionMapa
  }
};
</script>

<style>
</style>