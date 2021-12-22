<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="company content">
          
          <h4 class="title">Información de la empresa</h4>
          <div class="row">
            <div class="form-group col-12 col-sm-4">
              <div class="property-field primary">
                <label>Empresa</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="company">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>
            <div class="form-group col-12 col-sm-4">
              <div class="property-field primary">
                <label>Nombre largo</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="name">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>
            <div class="form-group col-12 col-sm-4">
              <div class="property-field primary">
                <label>Teléfono</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="phone">
                  <span class="input-icon">#</span>
                </div>
              </div>
            </div>

            <div class="form-group col-12">
              <div class="property-field primary">
                <label>Dirección</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="address">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>

            <div class="form-group col-12 col-sm-6">
              <div class="property-field primary">
                <label>Facebook link</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="facebook_url">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>

            <div class="form-group col-12 col-sm-6">
              <div class="property-field primary">
                <label>Instagram link</label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="instagram_url">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>
          </div>

          <h4 class="title">Receptores de los formularios de contacto</h4>
          <div class="row">
            <div class="form-group col-12">
              <div class="property-field primary">
                <label>Correos separados por <strong>;</strong></label>
                <div class="input-wrapper with-icon inline only-bottom w-100">
                  <input type="text" v-model.lazy="form_contacts">
                  <span class="input-icon">¶</span>
                </div>
              </div>
            </div>
          </div>

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
      company = reactive({
        company: null,
        name: null,
        address: null,
        phone: null,
        facebook_url: null,
        instagram_url: null,
        form_contacts: null
      }),
      inStore = ref(false);

    watch(company, () => {
      const change = [];

      for (let key in company) {
        if(company[key].trim() != props.data[key] && company[key].trim() != "") {
          change[key] = company[key];
        }
      }

      if(Object.keys(change).length > 0) {
        store.commit("company/setChange", change);
        inStore.value = true;
      } else {
        if(inStore.value) {
          store.commit("company/deleteChange");
          inStore.value = false;
        }
      }
    });

    onMounted(() => {
      company.company = props.data.company;
      company.name = props.data.name;
      company.address = props.data.address;
      company.phone = props.data.phone;
      company.facebook_url = props.data.facebook_url;
      company.instagram_url = props.data.instagram_url;
      company.form_contacts = props.data.form_contacts;
    });

    return {
      ...toRefs(company)
    };
  }
};
</script>

<style lang="scss">
.company.content {
  label, 
  .title {
    text-align: left;
  }
  label {
    strong {
      font-size: 1rem;
      font-weight: 700;
    }
  }
  .title {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }
}
</style>