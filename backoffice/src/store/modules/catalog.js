import axios from "axios";
import { useCreateFormData } from "@/composables/utils";

const state = {
  catalogs: null,
  changes: {
    type: [],
    data: []
  }
};

const getters = {
  catalogs(state) {
    return state.catalogs;
  },
  type(state) {
    return state.catalogs.type;
  },
  data(state) {
    return state.catalogs.data;
  },
  dataTypes(state) {
    return state.catalogs.data.type;
  },
  haveChanges(state) {
    return state.changes.type.length > 0 || state.changes.data.length > 0;
  },
  changes(state) {
    const changes = {};
    if(state.changes.type.length > 0) {
      changes["type"] = state.changes.type;
    }
    if(state.changes.data.length > 0) {
      changes["data"] = state.changes.data;
    }
    return changes;
  }
};

const actions = {
  getCatalogs({ commit }) {
    axios.get("catalog")
      .then((response) => {
        if (response.data) {
          commit("set", response.data);
        }
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Catálogos", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
      });
  },
  postCatalogs({ getters, commit, dispatch }) {
    commit("section/setToSave", { module: "catalog", add: true }, { root: true });
    axios.post("catalog", useCreateFormData(new FormData(), "changes", getters.changes))
      .then((response) => {
        dispatch("sendNotifications", { data: response.data });
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Catálogos", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
      })
      .then(() => {
        dispatch("endSaveCatalogs");
      });
  },
  sendNotifications({commit}, response) {
    const title = "Catálogos";
    let withError = false;

    for(const key in response.data) {
      if(response.data[key]["error"]) {
        withError = true;
        commit("section/showNotification", { title, text: response.data[key]["error"]["message"], type: "error" }, { root: true });
      }
    }

    if(!withError) {
      commit("section/showNotification", { title, text: "Se guardaron los cambios realizados", type: "success" }, { root: true });
    }
  },
  endSaveCatalogs({ commit }) {
    setTimeout(() => {
      // router.go({ force: true });
      commit("reset");
      commit("section/setToSave", { module: "catalog" }, { root: true });
    }, 1000);
  }
};

const mutations = {
  set(state, catalogs) {
    state.catalogs = catalogs;
  },
  add(state, category) {
    if (category) {
      state.catalogs.data[category].data.push({});
    } else {
      state.catalogs.type.push({});
    }
  },
  setCatalog(state, catalog) {

    let currentCatalog = catalog.section ? state.catalogs[catalog.type][catalog.section].data[catalog.index] : state.catalogs[catalog.type][catalog.index];

    if(currentCatalog.id) {
      const indexCatalogChange = state.changes[catalog.type].findIndex(current => current.id == currentCatalog.id);
      if(catalog.change) {
        if(indexCatalogChange != -1) {
          state.changes[catalog.type][indexCatalogChange] = { id: currentCatalog.id, ...catalog.change };
        } else {
          state.changes[catalog.type].push({ id: currentCatalog.id, ...catalog.change });
        }
      } else {
        if(indexCatalogChange != -1) {
          state.changes[catalog.type].splice(indexCatalogChange, 1);
        }
      }
    } else {
      const indexCatalogChange = state.changes[catalog.type].findIndex(current => current.index == catalog.index && (catalog.section ? current.dataCategoryId == state.catalogs[catalog.type][catalog.section].id : true));
      if(catalog.change) {
        if(indexCatalogChange != -1) {
          state.changes[catalog.type][indexCatalogChange] = { ...state.changes[catalog.type][indexCatalogChange], ...catalog.change };
        } else {
          const newCatalog = { index: catalog.index, ...catalog.change };
          if(catalog.section) {
            newCatalog["dataCategoryId"] = state.catalogs[catalog.type][catalog.section].id;
          } else {
            newCatalog["order"] = catalog.index + 1;
          }
          state.changes[catalog.type].push(newCatalog);
        }

        if(catalog.section) {
          state.catalogs[catalog.type][catalog.section].data[catalog.index] = { ...catalog.change };
        } else {
          state.catalogs[catalog.type][catalog.index] = { ...catalog.change };
        }
      } else {
        if(indexCatalogChange != -1) {
          state.changes[catalog.type].splice(indexCatalogChange, 1);
        }

        if(catalog.section) {
          state.catalogs[catalog.type][catalog.section].data[catalog.index] = {};
        } else {
          state.catalogs[catalog.type][catalog.index] = {};
        }
      }
    }
  },
  reset(state) {
    state.catalogs = null;
    state.changes = {
      type: [],
      data: []
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};