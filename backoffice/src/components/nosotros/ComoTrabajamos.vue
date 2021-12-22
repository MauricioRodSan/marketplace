<template>
  <!-- #como-trabajamos -->
  <section id="como-trabajamos">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">
            <template v-for="content in contents" :key="content.id">
              <template v-if="!content.contents">
                <component
                  v-model:content="content.content"
                  :id="content.id"
                  :is="content.editable.type"
                ></component>
              </template>
              <template v-else>
                <div class="row">
                  <div
                    class="col-12 col-md-3"
                    v-for="step in content.contents"
                    :key="step.id"
                  >
                    <paso :contents="step.contents"></paso>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#como-trabajamos -->
</template>

<script>
import Paso from "@/components/nosotros/Paso.vue";
import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array,
  },
  components: {
    Paso,
    Editor,
  },
};
</script>

<style>
</style>