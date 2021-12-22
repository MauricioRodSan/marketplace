<template>
  <div class="servicio">
    <img :src="image" class="img-fluid" alt="">
    <div class="informacion">
      <component 
        v-for="text in texts"
        v-model:content="text.content"
        :id="text.id"
        :key="text.id"
        :is="text.editable.type"
      >
      </component>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array,
  },
  setup( props ) {
    const 
      image = computed(() => {
        const 
          imageContent = props.contents.filter(content => content.editable.type == "Image")[0];
        return imageContent.content.match(/<img [^>]*src="[^"]*"[^>]*>/gm).map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0];
      }),
      texts = computed(() => {
        return props.contents.filter(content => content.editable.type == "Editor");
      });

      return {
        image,
        texts
      }
  },
  components: {
    Editor
  }
};
</script>

<style>
</style>