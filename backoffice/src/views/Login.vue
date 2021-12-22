<template>
  <form @submit.prevent="submit">
    <p>Inicio de sesión</p>
    <div class="form-group">
      <label for="login-email">Correo electrónico</label>
      <input type="email" name="email" id="login-email" v-model="email">
    </div>

    <div class="form-group">
      <label for="login-password">Contraseña</label>
      <input type="password" name="password" id="login-password" v-model="password">
    </div>

    <button type="submit">Entrar</button>
  </form>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const 
      store = useStore(),
      router = useRouter(),
      email = ref(null),
      password = ref(null),
      submit = () => {
        if(email.value && password.value) {
          const data = new FormData();
          data.append("email", email.value);
          data.append("password", password.value);
          store.dispatch("user/login", data)
            .then((response) => {
              if(response) {
                router.push({ name: "Inicio" });
              } 
            })
            .catch(error => console.log(error));
        }
      };

    return {
      email,
      password,
      submit
    }
  }
};
</script>

<style></style>
