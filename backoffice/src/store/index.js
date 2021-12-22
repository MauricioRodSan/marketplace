import { createStore, createLogger } from "vuex";
import user from "./modules/user";
import company from "./modules/company";
import section from "./modules/section";
import content from "./modules/content";
import catalog from "./modules/catalog";
import property from "./modules/property";

export default createStore({
  modules: {
    user,
    company,
    section,
    content,
    catalog,
    property
  },
  plugins: process.env.NODE_ENV !== "production"
    ? [createLogger()]
    : []
});
