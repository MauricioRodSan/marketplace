<template>
  <div class="nav-bar">
    <div class="bar-title-section">
      <h6 class="section">{{ section.section }}</h6>
      <div class="divide"></div>
      <span class="sub-section">{{ section.subSection }}</span>
    </div>
    <div class="bar-actions">
      <button class="button" @click="setSectionIsSaving" :disabled="!sectionHaveChanges || sectionIsSaving">{{ !sectionIsSaving ? "Guardar" : "Guardando" }}</button>
      <div class="divide"></div>
      <user-bar></user-bar>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import UserBar from "@/components/user/UserBar.vue";
export default {
  setup() {

    const 
      store = useStore(),
      section = computed(() => store.getters["section/get"]),
      sectionHaveChanges = computed(() => store.getters["section/canSave"]),
      sectionIsSaving = computed(() => store.getters["section/isSaving"]),
      setSectionIsSaving = (() => store.commit("section/setSaving", true));

    return {
      section,
      sectionHaveChanges,
      sectionIsSaving,
      setSectionIsSaving
    };
  },
  components: {
    UserBar
  }
};
</script>

<style lang="scss"></style>
