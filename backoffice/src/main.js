import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import axios from "axios";

import Notifications from '@kyvg/vue3-notification'

axios.defaults.baseURL = process.env.VUE_APP_URL_API;

createApp(App)
  .use(store)
  .use(router)
  .use(Notifications)
  .mount("#app");


