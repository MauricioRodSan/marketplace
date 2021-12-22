<template>
  <div class="catalog-item">
    <div class="input-wrapper with-icon primary mw-100p only-bottom">
      <input type="text" v-model.lazy.trim="type">
      <span class="input-icon">¶</span>
    </div>
    <span v-if="repeatedType"><small>El tipo ya existe</small></span>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useCreateSlug } from "@/composables/utils";
export default {
  props: {
    catalog: Object,
    types: Array
  },
  setup(props, { emit }) {
    const 
      type = ref(""),
      inStore = ref(false),
      repeatedType = ref(false);

    watch(type, () => {
      let 
        slug = null,
        inTypes = null,
        canSave = props.catalog.id ? type.value != props.catalog.type && type.value : type.value;

      if(canSave) {
        slug = useCreateSlug(type.value);
        inTypes = props.types.includes(slug);
        if(inTypes) {
          canSave = false;
          repeatedType.value = true;
        } else {
          repeatedType.value = false;
        }
      }

      if(canSave) {
        emit("changed", { type: type.value, slug });
        inStore.value = true;
      } else {
        if(inStore.value) {
          emit("changed");
          inStore.value = false;
        }

        if(!inTypes) {
          repeatedType.value = false;
        }
      }
    });

    onMounted(() => {
      if(props.catalog.id) {
        type.value = props.catalog.type;
      }
    });

    return {
      type,
      repeatedType
    };
  }
}
</script>

<style>

</style>