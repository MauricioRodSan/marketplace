<template>
  <div class="layout-vertical">
    <vertical-nav-menu></vertical-nav-menu>
    <nav-bar></nav-bar>
    <div class="app-wrapper">
      <div class="nav-bar-shadow"></div>
      <div class="loader-wrapper" :class="{ loading: isLoading }" v-show="isLoading">
        <div class="content">
            <div class="loader-circle"></div>
            <div class="loader-line-mask">
                <div class="loader-line"></div>
            </div>
        </div>
      </div>
      <div class="app-content">
        <slot />
      </div>
      <notifications />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import VerticalNavMenu from "@/core/layout/vertical/components/VerticalNavMenu.vue";
import NavBar from "@/core/layout/vertical/components/NavBar.vue";

export default {
  setup() {
    const 
      store = useStore(),
      isLoading = computed(() => store.getters["section/isSaving"]);

    return {
      isLoading
    };
  },
  components: {
    VerticalNavMenu,
    NavBar
  }
};
</script>

<style lang="scss">
@import "@/core/scss/layout/layout-vertical.scss";
.vue-notification-group {
  top: 5.05rem !important;
  right: 2rem !important;
  .vue-notification {
    margin-right: 0;
  }
}
</style>
