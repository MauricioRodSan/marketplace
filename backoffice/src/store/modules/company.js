import axios from "axios";
import { useCreateFormData } from "@/composables/utils";

const state = {
  company: null,
  changes: []
};

const getters = {
  get(state) {
    return state.company;
  },
  name(state) {
    return state.changes["name"] || state.company.name;
  },
  address(state) {
    return state.changes["address"] || state.company.address;
  },
  phone(state) {
    return state.changes["phone"] || state.company.phone;
  },
  haveChanges(state) {
    return Object.keys(state.changes).length > 0;
  },
  changes(state) {
    return state.changes;
  }
};

const actions = {
  getCompany({ commit }) {
    axios.get("company")
      .then((response) => {
        if(response.data) {
          commit("set", response.data);
        }
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Empresa", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
      });
  },
  postCompany({ getters, commit, dispatch }) {
    commit("section/setToSave", { module: "company", add: true }, { root: true });
    axios.post("company", useCreateFormData(new FormData(), "changes", getters.changes))
      .then((response) => {
        if(!response.data.error) {
          commit("section/showNotification", { title: "Empresa", text: "Se guardaron correctamente los cambios", type: "success" }, { root: true });
        } else {
          commit("section/showNotification", { title: "Empresa", text: response.data.error, type: "error" }, { root: true });
        }
        dispatch("endSaveCompany");
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Empresa", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
        dispatch("endSaveCompany");
      });
  },
  endSaveCompany({ state, commit, dispatch }) {
    setTimeout(() => {
      dispatch("getCompany");
      commit("section/setToSave", { module: "company" }, { root: true });
      state.changes = [];
    }, 1000);
  }
};

const mutations = {
  set(state, company) {
    state.company = company;
  },
  setChange(state, change) {
    state.changes = change;
  },
  deleteChange(state) {
    state.changes = [];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};