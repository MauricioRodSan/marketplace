<template>
  <!-- #tus-aliados -->
  <section id="tus-aliados">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">

            <template 
              v-for="content in contents"
              :key="content.id"
            >
              <template 
                v-if="!content.contents"
              >
                <component 
                  v-model:content="content.content"
                  :id="content.id"
                  :is="content.editable.type"
                ></component>
              </template>

              <template 
                v-else
              >
                <div class="row justify-content-center">
                  <div class="col-12 col-lg-10">
                    <div class="row">
                      <div 
                        class="col-12 col-md-4"
                        v-for="offer in content.contents"
                        :key="offer.id"
                      >

                        <ofrecimiento
                          :contents="offer.contents"
                        ></ofrecimiento>

                      </div>
                    </div>
                  </div>
                </div>
              </template>
            
            </template>
            
            <div class="divider"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#tus-aliados -->
</template>

<script>
import Ofrecimiento from "@/components/nosotros/Ofrecimiento.vue";
import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array
  },
  components: {
    Ofrecimiento,
    Editor
  }
};
</script>

<style>
</style>