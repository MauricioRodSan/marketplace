<template>
  <div class="col-12 col-md-4 col-lg-3">
    <div class="inmueble">
      <div class="image">
        <img :src="coverImage" class="img-fluid" alt="" />
      </div>
      <div class="informacion">
        <h5 class="precio">${{ formattedPrice }}</h5>
        <p>{{ resume }}</p>
      </div>
      <div class="property-edit">
        <a :class="{ 'featured': featured == '1' }" :title="featured == '1' ? 'Quitar de destacados' : 'Agregar a destacados'" @click="featured = featured == '1' ? '0' : '1'">
          <icon icon="destacado"></icon>
        </a>
        <a :class="{ 'active': active == '1' }" :title="active == '1' ? 'Desactivar' : 'Activar'" @click="active = active == '1' ? '0' : '1'">
          <icon icon="mostrar" v-show="active == '1'"></icon>
          <icon icon="ocultar" v-show="active == '0'"></icon>
        </a>
      </div>
      <router-link :to="`/inmueble/${ property.slug }`" class="property-link"></router-link>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";

import Icon from "@/core/components/Icon.vue"
export default {
  props: {
    property: Object
  },
  setup(props) {
    const 
      store = useStore(),
      data = reactive({
        featured: null,
        active: null
      }),
      inStore = ref(false),
      coverImage = computed(() => {
        return `${ process.env.VUE_APP_URL_IMAGES }/inmuebles/${
          props.property.cover
            ? `${ props.property.uuid }/${ props.property.cover[0].image }`
            : `portada-predeterminada.jpg`
        }`;
      }),
      formattedPrice = computed(() => {
        return props.property.price
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      }),
      resume = computed(() => {
        return `${props.property.postal_code.estado} / ${props.property.postal_code.municipio} / ${props.property.type} / ${props.property.transaction} / ${props.property.code}`;
      });

    watch(data, () => {
      const change = [];

      for (let key in data) {
        if((props.property[key] == null && data[key] != '0') || (props.property[key] != null && data[key] != props.property[key])) {
          change[key] = data[key];
        }
      }

      if(Object.keys(change).length > 0) {
        store.commit("property/setChange", { type: "propertys", change: { id: props.property.id, ...change } });
        inStore.value = true;
      } else {
        if(inStore.value) {
          store.commit("property/deleteChange", { type: "propertys", change: { id: props.property.id } });
          inStore.value = false;
        }
      }
    });

    onMounted(() => {
      data.featured = props.property.featured || "0";
      data.active = props.property.active;
    });

    return {
      ...toRefs(data),
      coverImage,
      formattedPrice,
      resume
    };
  },
  components: {
    Icon
  }
};
</script>

<style>
</style>