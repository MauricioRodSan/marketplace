<template>
  <div
    class="vertical-nav-menu"
    :class="{ expanded: isMouseHovered }"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <div class="logo-wrapper">
      <img
        src="@/assets/img/logo/futurplace-imagotipo.svg"
        class="icon"
        alt="Futurplace imagotipo"
      />
      <img
        src="@/assets/img/logo/futurplace-texto.svg"
        class="text"
        alt="Futurplace imagotipo"
      />
    </div>
    <ul class="main-nav">

      <template
        v-for="item in menu"
        :key="item.header || item.title"
      >
        <template v-if="item.title">
          <router-link 
            :to="getLinkRoute(item)" 
            custom
            v-slot="{ href, navigate, isExactActive }"
          > 
            <li class="nav-item" :class="{ active: isExactActive }">
              <a :href="href" @click="navigate">
                <icon :icon="item.icon"></icon>
                <span class="menu-title">{{ item.title }}</span>
              </a>
            </li>
          </router-link>
        </template>
        <template v-else>
          <li class="nav-header">
            <span>{{ item.header }}</span>
            <span class="accent"></span>
          </li>
        </template>

      </template>

    </ul>
  </div>
</template>

<script>
import { ref } from "vue";
import Icon from "@/core/components/Icon.vue"
export default {
  setup() {
    const 
      menu = [
        {
          header: "Páginas"
        },
        {
          title: 'Inicio',
          icon: 'inicio',
        },
        {
          title: 'Nosotros',
          icon: 'nosotros',
        },
        {
          title: 'Servicios',
          icon: 'servicios',
        },
        {
          header: "Inmuebles"
        },
        {
          title: 'Todos',
          route: { name: "Inmuebles", params: { transaction: "todos" } },
          icon: 'todos',
        },
        {
          title: 'Renta',
          route: { name: "Inmuebles", params: { transaction: "renta" } },
          icon: 'renta',
        },
        {
          title: 'Compra',
          route: { name: "Inmuebles", params: { transaction: "compra" } },
          icon: 'compra',
        },
        {
          title: 'Remate',
          route: { name: "Inmuebles", params: { transaction: "remate" } },
          icon: 'remate',
        },
        {
          header: "Catálogos"
        },
        {
          title: 'Administrar',
          route: { name: "Catalogos" },
          icon: 'catalogos',
        }
      ],
      getLinkRoute = (item) => {
        if(!item.route) {
          return { name: item.title };
        }
        return item.route;
      },
      isMouseHovered = ref(false),
      updateMouseHovered = (val) => {
        isMouseHovered.value = val;
      };

    return {
      menu,
      getLinkRoute,
      isMouseHovered,
      updateMouseHovered
    };
  },
  components: {
    Icon
  }
};
</script>
