<template>
  <div class="catalog-item">
    <div class="input-wrapper with-icon primary only-bottom mw-100p mb-3">
      <input type="text" v-model.lazy.trim="catalog">
      <span class="input-icon">¶</span>
    </div>
    <div class="catalog-types" :class="{ disabled: !canChange }">
      <div class="custom-radio" v-for="(type, index) in types" :key="index">
          <label>
              <input type="radio" :name="radioName" :value="type.id" v-model="dataCatalogTypeId" :disabled="!canChange">
              <span class="checkmark"></span>{{ type.type }}
          </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";

export default {
  props: {
    dataCatalog: Object,
    types: Object
  },
  setup(props, { emit }) {
    const 
      data = reactive({
        catalog: props.dataCatalog.catalog || "",
        dataCatalogTypeId: props.dataCatalog.dataCatalogTypeId || null
      }),
      canChange = ref(true),
      inStore = ref(false),
      radioName = computed(() => {
        return `type_${ props.dataCatalog.id || Math.random().toString(36).substr(2, 5) }`;
      });

    watch(data, () => {
      const change = [];

      if(props.dataCatalog.id) {
        for(let key in data) {
          if(data[key] != props.dataCatalog[key] && data[key]) {
            change[key] = data[key];
          }
        }
      } else {
        if(data.catalog && data.dataCatalogTypeId) {
          change["catalog"] = data.catalog;
          change["dataCatalogTypeId"] = data.dataCatalogTypeId;
        }
      }

      if(Object.keys(change).length > 0) {
        emit("changed", change);
        inStore.value = true;
      } else {
        if(inStore.value) {
          emit("changed");
          inStore.value = false;
        }
      }
    });

    onMounted(() => {
      if(props.dataCatalog.id) {
        canChange.value = props.dataCatalog.canChange;
      }
    });

    return {
      ...toRefs(data),
      canChange,
      radioName
    };
  }
}
</script>

<style>

</style>