<template>
  <div class="servicio">
    <template v-for="content in contents" :key="content.id">
      <template v-if="content.editable.type !== 'Image'">
        <component
          v-model:content="content.content"
          :id="content.id"
          :is="content.editable.type"
        ></component>
      </template>

      <template v-else>
        <img :src="image" class="img-fluid" alt="" />
      </template>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";
import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array,
  },
  setup(props) {
    const image = computed(() => {
      const imageContent = props.contents.filter(
        (content) => content.editable.type == "Image"
      )[0];
      return imageContent.content
        .match(/<img [^>]*src="[^"]*"[^>]*>/gm)
        .map((x) => x.replace(/.*src="([^"]*)".*/, "$1"))[0];
    });
    return {
      image,
    };
  },
  components: {
    Editor,
  },
};
</script>

<style>
</style>