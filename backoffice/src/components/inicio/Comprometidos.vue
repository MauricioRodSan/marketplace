<template>
  <!-- #comprometidos -->
  <section id="comprometidos">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">
            <div class="row align-items-center">
              <div class="col-12 col-md-7 order-2 order-md-1">

                <component 
                  v-for="content in leftContent"
                  v-model:content="content.content"
                  :id="content.id"
                  :key="content.id"
                  :is="content.editable.type"
                ></component>

                <div class="row">

                  <div 
                    v-for="compromiso in compromisos" 
                    :key="compromiso.id"
                    class="col-12 col-md-4"
                  >
                    <div class="compromiso">
                      <img src="https://futurplace.incitrus.com/assets/img/home/icon-compromiso.svg" class="img-fluid" alt="">
                      <component
                        v-model:content="compromiso.content"
                        :id="compromiso.id"
                        :is="compromiso.editable.type"
                      ></component>
                    </div>
                  </div>

                </div>
              </div>
              <div class="col-12 col-md-5 order-1 order-md-2 imagen" v-html="rightContent">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /#comprometidos -->
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
        return props.contents.left.filter( content => !Object.prototype.hasOwnProperty.call(content, "contents") );
      }),
      compromisos = computed(() => {
        return props.contents.left.filter( content => Object.prototype.hasOwnProperty.call(content, "contents") )[0]['contents'];
      }),
      rightContent = computed(() => {
        return props.contents.right[0].content;
      });

    return {
      leftContent,
      compromisos,
      rightContent
    }
  },
  components: {
    Editor
  }
};
</script>

<style></style>
