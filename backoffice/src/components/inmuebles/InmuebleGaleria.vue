<template>
  <div class="gallery-form first-section">

    <template v-if="galleryImages.length > 0">
        <div class="gallery">
          <template v-if="galleryImages.length > 1">
            <div class="glide__track" data-glide-el="track">
              <ul class="glide__slides">
                <li class="glide__slide" v-for="item in galleryImages" :key="item.id || item.image"> 
                  <div class="image-wrapper">
                    <img :src="item.image" alt="">
                  </div>
                </li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="gallery-single-image">
              <div class="image-wrapper">
                <img :src="galleryImages[0].image" alt="">
              </div>
            </div>
          </template>
        </div>
    </template>
    <template v-else>
      <div class="gallery-default">
        <icon icon="inmueble"></icon>
      </div>
    </template>

    <button class="button-edit" @click="showModalEdit = true" title="Editar">
      <icon icon="imagen"></icon>
    </button>

    <modal v-show="showModalEdit" @close="showModalEdit = false">
      <template v-slot:header>
        <h6 class="title">Editar galería</h6>
      </template>
      <inmueble-galeria-editar></inmueble-galeria-editar>
    </modal>

  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useStore } from "vuex";
import Glide from "@glidejs/glide";

import Modal from "@/core/components/Modal.vue";
import Icon from "@/core/components/Icon.vue";

import InmuebleGaleriaEditar from "@/components/inmuebles/InmuebleGaleriaEditar.vue";
export default {
  setup() {
    const 
      store = useStore(),
      carousel = ref(null),
      carouselOptions = {type: "carousel", perView: 2, startAt: 0, gap: 15},
      galleryImages = computed(() => store.getters["property/gallery"].filter(item => item.active == "1" && !item.delete)),
      showModalEdit = ref(false);

    watch(galleryImages, () => {
      if(carousel.value) {
        carousel.value.destroy();
        carousel.value = null;
      }

      if(galleryImages.value.length > 1) {
        nextTick(() => {
          carousel.value = new Glide(".gallery", carouselOptions);
          carousel.value.mount();
        });
      }
    });

    onMounted(() => {
      if(galleryImages.value.length > 1) {
        carousel.value = new Glide(".gallery", carouselOptions);
        carousel.value.mount();
      }
    });

    return {
      galleryImages,
      showModalEdit
    }
  },
  components: {
    InmuebleGaleriaEditar,
    Modal,
    Icon
  }
};
</script>

<style lang="scss">
.gallery-form {
  position: relative;
  &:hover {
    .button-edit {
      opacity: 0.9;
    }
  }
  .button-edit {
    position: absolute;
    padding: 1.5rem;
    top: 50%;
    left: 50%;
    background: #232f3b;
    border-radius: 50%;
    border: none;
    opacity: 0;
    line-height: 1;
    transform: translate(-50%, -50%);
    i {
      color: #d7d9db;
      font-size: 2.5rem;
    }
  }
  .gallery-default {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 640px;
    background: #d7d9db;
    i {
      font-size: 6rem;
      background: linear-gradient(#5bd2ee, #45ab95);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>