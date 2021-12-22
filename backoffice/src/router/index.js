import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import Login from "@/views/Login.vue";
import Inicio from "@/views/Inicio.vue";
import Nosotros from "@/views/Nosotros.vue";
import Servicios from "@/views/Servicios.vue";
import Inmuebles from "@/views/Inmuebles.vue";
import Inmueble from "@/views/Inmueble.vue";
import Catalogos from "@/views/Catalogos.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      layout: "full",
      redirectIfAuth: true
    }
  },
  {
    path: "/inicio",
    name: "Inicio",
    component: Inicio,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: "/nosotros",
    name: "Nosotros",
    component: Nosotros,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: "/servicios",
    name: "Servicios",
    component: Servicios,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: "/inmuebles/:transaction?",
    name: "Inmuebles",
    component: Inmuebles,
    props: true,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: "/inmueble/:transaction/:type?/:estado?/:municipio?/:asentamiento?/:propertySlug?",
    name: "Inmueble",
    component: Inmueble,
    props: true,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: "/catalogos",
    name: "Catalogos",
    component: Catalogos,
    meta: { 
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth && !store.getters["user/isAuthenticated"]) {
    next({ name: "Login" });
  } else {
    if(to.meta.redirectIfAuth && store.getters["user/isAuthenticated"]) {
      next({ name: "Inicio" });
    } else {
      next();
    }
  }
});

export default router;
