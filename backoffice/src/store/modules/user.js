import axios from "axios";
import { useCreateFormData } from "@/composables/utils";

const state = {
  id: localStorage.getItem("uFuturID") || null,
  name: localStorage.getItem("uFuturName") || null,
  last_name: (localStorage.getItem("uFuturLastName") != "null" ? localStorage.getItem("uFuturLastName") : null) || null,
  image: (localStorage.getItem("uFuturImage") != "null" ? localStorage.getItem("uFuturImage") : null) || null,
  role: localStorage.getItem("uFuturRole") || null,
  changes: []
};

const getters = {
  get(state) {
    return {
      name: state.changes['name'] || state.name,
      last_name: state.changes['last_name'] || state.last_name,
      img: state.image,
      role: state.role
    }
  },
  getPerson(state) {
    return {
      name: state.name,
      last_name: state.last_name,
    }
  },
  isAuthenticated(state) {
    if (state.name) {
      return true;
    }
    return false;
  },
  haveChanges(state) {
    return Object.keys(state.changes).length > 0;
  },
  changes(state) {
    const changes = {
      id: state.id,
      changes: {}
    };

    if(state.changes['name'] || state.changes['last_name']) {
      changes['changes']['person'] = {};
      if(state.changes['name']) {
        changes['changes']['person']['name'] = state.changes['name'];
      }
      if(state.changes['last_name']) {
        changes['changes']['person']['last_name'] = state.changes['last_name'];
      }
    }

    if(state.changes['password'] || state.changes['password_new']) {
      changes['changes']['user'] = {};
      if(state.changes['password']) {
        changes['changes']['user']['password'] = state.changes['password'];
      }
      if(state.changes['password_new']) {
        changes['changes']['user']['password_new'] = state.changes['password_new'];
      }
    }

    return changes;
  }
};

const actions = {
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post("login", data)
        .then((response) => {
          let res = false;
          if (response.data) {
            commit("save", response.data);
            res = true;
          }
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  postUser({ getters, commit, dispatch }) {
    commit("section/setToSave", { module: "user", add: true }, { root: true });
    axios.post("user", useCreateFormData(new FormData(), "changes", getters.changes))
      .then((response) => {
        if(response.data.person) {
          if(!response.data.person.error) {
            commit("section/showNotification", { title: "Perfil", text: "Se guardaron correctamente los cambios", type: "success" }, { root: true });
            commit("save", response.data.person);
          } else {
            commit("section/showNotification", { title: "Perfil", text: response.data.person.error.message, type: "error" }, { root: true });
          }
        }

        if(response.data.user) {
          if(!response.data.user.error) {
            commit("section/showNotification", { title: "Perfil", text: "Se actualizo la contraseña", type: "success" }, { root: true });
          } else {
            commit("section/showNotification", { title: "Cambio de contraseña", text: response.data.user.error.message, type: "error" }, { root: true });
          }
        }
        dispatch("endSaveUser");
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Perfil", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
        dispatch("endSaveUser");
      });
  },
  endSaveUser({ state, commit }) {
    setTimeout(() => {
      commit("section/setToSave", { module: "user" }, { root: true })
      state.changes = [];
    }, 1000);
  }
};

const mutations = {
  save(state, user) {
    state.name = user.name;
    localStorage.setItem("uFuturName", user.name);

    state.last_name = user.last_name;
    localStorage.setItem("uFuturLastName", user.last_name);

    if(user.id) {
      state.id = user.id;
      localStorage.setItem("uFuturID", user.id);
    }

    if(user.image) {
      state.image = user.image;
      localStorage.setItem("uFuturImage", user.image);
    }

    if(user.role) {
      state.role = user.role;
      localStorage.setItem("uFuturRole", user.role);
    }
  },
  delete() {
    state.id = null;
    state.name = null;
    state.last_name = null;
    state.image = null;
    state.role = null;
    localStorage.removeItem("uFuturID");
    localStorage.removeItem("uFuturName");
    localStorage.removeItem("uFuturLastName");
    localStorage.removeItem("uFuturImage");
    localStorage.removeItem("uFuturRole");
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