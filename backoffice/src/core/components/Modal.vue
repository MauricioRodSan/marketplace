<template>
  <transition name="modal-fade">
    <div class="modal-wrappper">
      <div class="modal" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
        <div class="modal-header" id="modal-title">
          <slot name="header">Título por defecto</slot>
        </div>

        <section class="modal-body" id="modal-description">
          <slot>Contenido por defecto</slot>
        </section>
        <button class="modal-close" @click="$emit('close')">X</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  emits: ["close"]
};
</script>

<style lang="scss">
.modal-wrappper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(#232f3b, 0.7);
  overflow-y: auto;
  z-index: 9999;
  .modal {
    position: relative;
    max-width: 1140px;
    background: white;
    .modal-header {
      padding: 1rem 2rem;
      background: #45b7ad;
      text-align: center;
      color: white;
    }
    .modal-body {
      max-height: 65vh;
      padding: 20px 1rem;
      overflow-y: auto;
    }
    .modal-close {
      position: absolute;
      padding: 0.5rem 0.75rem 0.125rem;
      top: -1.25rem;
      right: -1.25rem;
      font-size: 2rem;
      font-weight: 200;
      color: #232f3b;
      line-height: 1;
      background: #45b7ad;
      border-radius: 50%;
      border: none;
      opacity: 0.75;
      &:hover {
        opacity: 1;
      }
    }
  }
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>