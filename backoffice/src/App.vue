<template>
  <component :is="layoutType">
    <router-view />
  </component>
</template>

<script>
import LayoutVertical from "@/core/layout/vertical/LayoutVertical.vue";
import LayoutFull from "@/core/layout/full/LayoutFull.vue";

export default {
  computed: {
    layoutType() {
      if (this.$route.meta.layout === "full") {
        return "layout-full";
      }
      return "layout-vertical";
    }
  },
  components: {
    LayoutVertical,
    LayoutFull
  }
};
</script>

<style lang="scss">
@import "@/core/scss/core.scss";
</style>
