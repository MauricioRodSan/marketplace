<template>
  <!-- #servicios -->
  <section id="servicios" class="section-header first-section">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="row">
            <div class="col-12 col-md-6 offset-md-6">
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
    </div>
  </section>
  <!-- /#servicios -->
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

<style>
</style>