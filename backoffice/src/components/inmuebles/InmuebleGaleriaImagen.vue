<template>
  <div class="image-wrapper">
    <img :src="imageURL" alt="">
  </div>
</template>

<script>
import { useStore } from "vuex";
export default {
  props: {
    image: Object
  },
  setup(props) {
    const 
      store = useStore(),
      propertyUUID = store.getters["property/UUID"],
      imageURL = `http://futurplace.local/assets/img/inmuebles/${ propertyUUID }/${ props.image.image }`;

      return {
        imageURL
      };
  }
};
</script>

<style>
</style>