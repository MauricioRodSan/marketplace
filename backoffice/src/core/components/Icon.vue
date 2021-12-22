<template>
  <i :class="getIcon"></i>
</template>

<script>
import { computed } from "vue";
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  setup( props ) {
    const 
      getIcon = computed(() => {
        return `icon-${ props.icon }`;
      });

    return {
      getIcon
    }
  }
}
</script>

<style>
@import "../font/icons/icons.css";
</style>