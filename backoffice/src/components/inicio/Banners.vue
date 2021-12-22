<template>
  <!-- #inicio -->
  <section id="inicio">
    <!-- .banners -->
    <div class="banners height-100 first-section">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-11 col-xl-10">
            <div class="content">

              <component 
                v-for="content in contents"
                v-model:content="content.content"
                :id="content.id"
                :key="content.id"
                :is="content.editable.type"
              ></component>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- .banners -->
  </section>
  <!-- /#inicio -->
</template>

<script>
import Editor from "@/core/components/Editor.vue";

export default {
  props: {
    contents: Array
  },
  components: {
    Editor
  }
};
</script>

<style></style>
