<template>
  <!-- #futureplace -->
  <section id="futureplace">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">
            <div class="row align-items-center">
              <div class="col-12 col-md-6">

                <component
                  v-for="content in leftContent"
                  v-model:content="content.content"
                  :id="content.id"
                  :key="content.id"
                  :is="content.editable.type"
                ></component>
                
              </div>
              <div class="col-12 col-md-6 imagen">
                <img :src="image" class="img-fluid" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#futureplace -->
</template>

<script>
import { computed } from "vue";
import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Object
  },
  setup( props ) {
    const 
      leftContent = computed(() => {
        return props.contents.left;
      }),
      image = computed(() => {
        const 
          imageContent = props.contents.right[0];
        return imageContent.content.match(/<img [^>]*src="[^"]*"[^>]*>/gm).map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0];
      });

    return {
      leftContent,
      image
    };
  },
  components: {
    Editor
  }
};
</script>

<style>
</style>