<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="user content">

          <h4 class="title">Información del usuario</h4>
          <div class="row">
            <div class="form-group col-12">
              <div class="property-field primary">
                <label>Nombre</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="name">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>
            <div class="form-group col-12">
              <div class="property-field primary">
                <label>Apellido</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="last_name">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>
          </div>

          <h4 class="title">Cambio de contraseña</h4>
          <div class="row">
            <div class="form-group col-12">
              <div class="property-field primary">
                <label>Contraseña anterior</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="password" v-model.lazy="password">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>

            <div class="form-group col-12">
              <div class="property-field primary">
                <label>Contraseña nueva</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="password" v-model.lazy="password_new">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>

            <div class="form-group col-12">
              <div class="property-field primary">
                <label>Contraseña nueva verificación</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="password" v-model.lazy="password_new_verify">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>
          </div>

          <p class="text-left mb-0" v-show="passwordVerificationMessage"><small>{{ passwordVerificationMessage }}</small></p>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    data: Object
  },
  setup(props) {
    const 
      store = useStore(),
      user = reactive({
        name: null,
        last_name: null,
        password: "",
        password_new: "",
        password_new_verify: ""
      }),
      inStore = ref(false),
      passwordVerificationMessage = ref(null);

    watch(user, () => {
      const change = [];

      if(user.name.trim() != props.data.name && user.name.trim() != "") {
        change['name'] = user.name;
      }

      if(user.last_name) {
        if(user.last_name.trim() != props.data.last_name && user.last_name.trim() != "") {
          change['last_name'] = user.last_name;
        }
      }

      if(user.password.trim() != "" && user.password_new.trim() != "" && user.password_new_verify.trim() != "") {
        if(user.password_new == user.password_new_verify) {
          passwordVerificationMessage.value = null;
          change['password'] = user.password;
          change['password_new'] = user.password_new;
        } else {
          passwordVerificationMessage.value = "La contraseña nueva y la verificación no coinciden";
        }
      }

      if(Object.keys(change).length > 0) {
        store.commit("user/setChange", change);
        inStore.value = true;
      } else {
        if(inStore.value) {
          store.commit("user/deleteChange");
          inStore.value = false;
        }
      }
    });

    onMounted(() => {
      user.name = props.data.name;
      user.last_name = props.data.last_name;
    });

    return {
      ...toRefs(user),
      passwordVerificationMessage
    };
  }
}
</script>

<style lang="scss">
.user.content {
  max-width: 300px;
  label, 
  .title {
    text-align: left;
  }
  .title {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }
}
</style>