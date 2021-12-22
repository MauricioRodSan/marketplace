<template>
  <div class="user-bar">
    <a @click.prevent="showUserMenu" class="show-user-menu">
      <div class="user-name-role">
        <p>{{ `${user.name}${user.last_name ? ` ${user.last_name}` : ``}` }}</p>
        <span>{{ user.role }}</span>
      </div>
      <div class="user-avatar">
        <img :src="imageUser" alt="" class="img-fluid">
      </div>
    </a>
    <ul class="user-menu" :class="{ show: itShowsUserMenu }">
      <li>
        <a @click="showModalCompany = true">
          <span>Empresa</span>
        </a>
      </li>
      <li>
        <a @click="showModalProfile = true">
          <span>Perfil</span>
        </a>
      </li>
      <li>
        <a @click="logout">
          <span>Cerrar sesión</span>
        </a>
      </li>
    </ul>

    <modal v-show="showModalCompany" @close="showModalCompany = false">
      <template v-slot:header>
        <h6 class="title">Empresa</h6>
      </template>
      <company :data="company" v-if="company"></company>
    </modal>

    <modal v-show="showModalProfile" @close="showModalProfile = false">
      <template v-slot:header>
        <h6 class="title">Perfil</h6>
      </template>
      <user-profile :data="person"></user-profile>
    </modal>

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import Company from "@/components/company/Company.vue";
import UserProfile from "@/components/user/UserProfile.vue";
import Modal from "@/core/components/Modal.vue";
export default {
  setup() {
    const 
      store = useStore(),
      router = useRouter(),
      user = computed(() => store.getters["user/get"]),
      person = computed(() => store.getters["user/getPerson"]),
      company = computed(() => store.getters["company/get"]),
      itShowsUserMenu = ref(false),
      showModalProfile = ref(false),
      showModalCompany = ref(false),
      imageUser = computed(() => {
        return user.value.image || "https://futurplace.incitrus.com/assets/img/ui/user-avatar.jpg";
      }),
      logout = (() => {
        store.commit("user/delete");
        router.push({ name: "Login" });
      }),
      showUserMenu = (() => {
        itShowsUserMenu.value = !itShowsUserMenu.value;
      })

    onMounted(() => {

      store.dispatch("company/getCompany");

      document.addEventListener("click", evn => {
        if(!evn.target.closest('.show-user-menu')) {
          if(itShowsUserMenu.value) {
            itShowsUserMenu.value = false;
          }
        }
      });
    });

    return {
      user,
      person,
      company,
      imageUser,
      logout,
      showUserMenu,
      itShowsUserMenu,
      showModalProfile,
      showModalCompany
    };
  },
  components: {
    Company,
    UserProfile,
    Modal
  }
}
</script>

<style>

</style>