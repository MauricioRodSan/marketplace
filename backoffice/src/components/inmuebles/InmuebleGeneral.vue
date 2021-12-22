<template>
  <div class="breadcrumbs">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">
            <div class="filters">
              <div class="property-field">
                <label>Clave*</label>
                <input type="text" class="mw-75" v-model.lazy="code" />
              </div>

              <p>/</p>
              <div class="property-field">
                <label>Operación*</label>
                <select v-model.lazy="transaction_id">
                  <option value="0" hidden>Seleccionar</option>
                  <option
                    v-for="transaction in property.transactions"
                    :value="transaction.id"
                    :key="transaction.id"
                  >
                    {{ transaction.transaction }}
                  </option>
                </select>
              </div>

              <p>/</p>
              <div class="property-field">
                <label>Tipo de inmueble*</label>
                <select v-model.lazy="property_type_id">
                  <option value="0" hidden>Seleccionar</option>
                  <option
                    v-for="type in property.types"
                    :value="type.id"
                    :key="type.id"
                  >
                    {{ type.type }}
                  </option>
                </select>
              </div>

              <p>/</p>
              <div class="property-field">
                <label>Precio*</label>
                <input
                  type="text"
                  class="with-icon"
                  :value="price"
                  @change="price = useFormatPrice($event)"
                  @keypress="useIsPrice"
                />
                <span class="input-icon">$</span>
              </div>

              <template v-if="property.address">
                <p>/</p>
                <p>
                  {{ property.address.postal_code.municipio }},
                  {{ property.address.postal_code.estado }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch, onMounted } from "vue";
import { useStore } from "vuex";

import { useIsPrice, useFormatPrice } from "@/composables/utils";

export default {
  props: {
    property: Object,
    description: String
  },
  setup(props) {
    const 
      store = useStore(),
      general = reactive({
        code: null,
        price: null,
        transaction_id: 0,
        property_type_id: 0,
        description: null
      }),
      inStore = ref(false);

    watch(() => props.description, (description) => {
      general.description = description;
    });

    watch(general, () => {
      if (!props.property.isNew) {
        const change = [];
        for (let key in general) {
          if (general[key] && props.property[key] != general[key]) {
            if(key != "price") {
              change[key] = general[key];
            } else {
              change[key] = general[key].replace(/,/g, "");
            }
          }
        }

        if (Object.keys(change).length > 0) {
          store.commit("property/setChange", { type: "general", change });
          inStore.value = true;
        } else {
          if(inStore.value) {
            store.commit("property/deleteChange", { type: "general" });
            inStore.value = false;
          }
        }
      } else {
        if (
          general.code &&
          general.transaction_id &&
          general.property_type_id &&
          general.price && 
          (general.description != "<p></p>" || general.description != "")
        ) {
          const change = [];
          for (let key in general) {
            if(key != "price") {
              change[key] = general[key];
            } else {
              change[key] = general[key].replace(/,/g, "");
            }
          }
          store.commit("property/setChange", { type: "general", change });
          inStore.value = true;
        } else {
          if(inStore.value) {
            store.commit("property/deleteChange", { type: "general" });
            inStore.value = false;
          }
        }
      }
    });

    onMounted(() => {
      if (!props.property.isNew) {
        general.code = props.property.code;
        general.price = props.property.price;
        general.transaction_id = props.property.transaction_id;
        general.property_type_id = props.property.property_type_id;
        general.description = props.description;
      }
    });

    return {
      ...toRefs(general),
      useIsPrice,
      useFormatPrice
    };
  },
};
</script>

<style>
</style>