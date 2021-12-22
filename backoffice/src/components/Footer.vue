<template>
  <!-- footer -->
  <footer>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-11 col-xl-10">
          <div class="content">
            <div class="divider"></div>
            <div class="address">
              <p>{{ address }}</p>
            </div>
            <div class="rights-privacy">
              <p>© {{ name }}</p>
              <div class="divide"></div>
              <a @click="showModalPrivacyPolicy = true">Aviso de privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal v-show="showModalPrivacyPolicy" @close="showModalPrivacyPolicy = false">
      <template v-slot:header>
        <h6 class="title">Aviso de privacidad</h6>
      </template>

      <component 
        v-for="content in contents"
        v-model:content="content.content"
        :id="content.id"
        :key="content.id"
        :is="content.editable.type"
      ></component>
    </modal>
  </footer>
  <!-- /footer -->
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import Modal from "@/core/components/Modal.vue";
import Editor from "@/core/components/Editor.vue";
export default {
  props: {
    contents: Array
  },
  setup() {
    const 
      store = useStore(),
      showModalPrivacyPolicy = ref(false),
      name = computed(() => store.getters["company/name"]),
      address = computed(() => store.getters["company/address"]);

    return {
      name,
      address,
      showModalPrivacyPolicy
    };
  },
  components: {
    Modal,
    Editor
  }
};
</script>

<style></style>
