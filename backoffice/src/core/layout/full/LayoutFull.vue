<template>
  <div class="layout-full">
    <main>
      <div class="auth-wrapper">
        <div class="auth-content">
          <div class="brand-title">
            <img src="https://futurplace.incitrus.com/assets/img/logo/futureplace-logo.svg" class="img-fluid" alt="Futurplace logo">
            <h5>Administración del sitio web</h5>
          </div>

          <slot />

        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/core/scss/layout/layout-full.scss";
</style>
