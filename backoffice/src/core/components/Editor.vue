<template>
  <div class="editor-wrapper" :class="{ changed:  inChanges }">
    <div
      class="editor-content"
      v-html="content"
      @keypress.enter="onKeyEnter"
      @keydown.delete="onKeyDelete"
      @paste="onPaste"
      @blur="changeContent"
      contenteditable="true"
    ></div>
    <div class="editor-toolbar"></div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    id: String,
    content: String,
    toStore: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: [Array, Boolean],
      default: false
    }
  },
  setup(props, { emit }) {
    const 
      store = useStore(),
      inChanges = ref(false),
      onKeyEnter = (evn => {
        evn.preventDefault();
      }),
      onKeyDelete = (evn => {
        if(evn.target.children[0].innerText < 1) {
          evn.preventDefault();
        }
      }),
      onPaste = (evn => {
        evn.preventDefault();
        document.execCommand('inserttext', false, evn.clipboardData.getData('text/plain'));
      }),
      changeContent = (evn => {
        const 
          content = evn.target.innerHTML;
        if(props.content !== content) {
          if(props.toStore) {
            store.commit("content/save", { id: props.id, content });
          } else {
            emit("changed", content);
          }
          inChanges.value = true;
        } else {
          if(inChanges.value) {
            if(props.toStore) {
              store.commit("content/delete", { id: props.id });
            } else {
              emit("unchanged");
            }
            inChanges.value = false;
          }
        }
      });

    return {
      inChanges,
      onKeyEnter,
      onKeyDelete,
      onPaste,
      changeContent
    };
  }
};
</script>

<style lang="scss">
@import "@/core/scss/editor/editor.scss";
</style>
