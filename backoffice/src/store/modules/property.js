import axios from "axios";
import router from "@/router";
import { useCreateFormData } from "@/composables/utils";

const state = {
  property: null,
  changes: {
    general: [],
    information: [],
    address: [],
    gallery: [],
    propertys: []
  }
};

const getters = {
  get(state) {
    return state.property;
  },
  UUID({ property }) {
    if (property) {
      return property.uuid;
    }
    return false;
  },
  isNew(state) {
    return state.property ? state.property.isNew : null;
  },
  gallery({ property }) {
    if(property) {
      return property.gallery;
    }
    return [];
  },
  haveChanges(state) {
    if (state.property) {
      if (state.property.isNew) {
        return Object.keys(state.changes.general).length > 0 && Object.keys(state.changes.address).length > 0;
      } else {
        return Object.keys(state.changes.general).length > 0 || Object.keys(state.changes.information).length > 0 || Object.keys(state.changes.address).length > 0 || state.changes.gallery.length > 0;
      }
    } else {
      return state.changes.propertys.length > 0;
    }
  },
  changes(state) {
    const changes = {};
    if (state.property) {
      
      if(state.property.id) {
        changes["id"] = state.property.id;
      }

      if(Object.keys(state.changes.general).length > 0) {
        changes["general"] = state.changes.general;
      }

      if(Object.keys(state.changes.information).length > 0) {
        changes["information"] = state.changes.information;
      }

      if(Object.keys(state.changes.address).length > 0) {
        changes["address"] = state.changes.address;
      }

      if(state.changes.gallery.length > 0) {
        changes["gallery"] = state.changes.gallery;
      }
    } else {
      changes["propertys"] = state.changes.propertys;
    }
    return changes;
  },
  canApplyChanges(state) {
    if(Object.keys(state.changes.address).length > 0) {
      if(state.changes.address.latitude || state.changes.address.zoom) {
        if(!state.changes.address.map_image) {
          return false;
        }
      }
    }
    return true;
  },
  changeMapImage(state, getters, rootState, rootGetters) {
    return rootGetters["section/isSaving"] && ("latitude" in state.changes.address || "zoom" in state.changes.address);
  }
};

const actions = {
  getProperty({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get("property", data)
        .then((response) => {
          let valid = false;
          if (response.data) {
            response.data.isNew = !Object.prototype.hasOwnProperty.call(response.data, "id");
            commit("set", response.data);
            valid = true;
          }
          resolve(valid);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  applyChanges({ state, dispatch }) {
    if (state.property) {
      if (state.property.isNew) {
        dispatch("postProperty");
      } else {
        dispatch("postPropertyEdit");
      }
    } else {
      dispatch("postPropertys");
    }
  },
  postProperty({ getters, commit, dispatch }) {
    commit("section/setToSave", { module: "property", add: true }, { root: true });
    axios.post("property", useCreateFormData(new FormData(), "changes", getters.changes))
      .then((response) => {
        dispatch("sendNotifications", { type: "add", data: response.data });
        // setTimeout(() => commit("section/setToSave", { module: "property" }, { root: true }), 1000);
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Inmueble", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
        // setTimeout(() => commit("section/setToSave", { module: "property" }, { root: true }), 1000);
      })
      .then(() => {
        dispatch("endSaveProperty");
      });
  },
  postPropertyEdit({ getters, commit, dispatch }) {
    commit("section/setToSave", { module: "property", add: true }, { root: true });
    axios.post("property/edit", useCreateFormData(new FormData(), "changes", getters.changes))
      .then((response) => {
        dispatch("sendNotifications", { type: "edit", data: response.data });
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Inmueble", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
      })
      .then(() => {
        dispatch("endSaveProperty");
      });
  },
  postPropertys({ getters, commit, dispatch }) {
    commit("section/setToSave", { module: "property", add: true }, { root: true });
    axios.post("property/resume", useCreateFormData(new FormData(), "changes", getters.changes))
      .then((response) => {
        dispatch("sendNotifications", { type: "propertys", data: response.data });
      })
      .catch((error) => {
        commit("section/showNotification", { title: "Inmuebles", text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
      })
      .then(() => {
        dispatch("endSaveProperties");
      });
  },
  sendNotifications({commit}, response) {
    const title = `Inmueble${ response.type == "propertys" ? `s` : `` }`;
    let withError = false;

    for(const key in response.data) {
      if(response.data[key]["error"]) {
        withError = true;
        if(response.data[key]["error"]["message"]) {
          commit("section/showNotification", { title, text: response.data[key]["error"]["message"], type: "error" }, { root: true });
        } else {
          for (const action in response.data[key]["error"]) {
            commit("section/showNotification", { title, text: response.data[key]["error"][action]["message"], type: "error" }, { root: true });
          }
        }
      }
    }

    if(!withError) {
      commit("section/showNotification", { title, text: `${ response.type == "add" ? `Se agrego el inmueble` : `Se guardaron los cambios realizados` }`, type: "success" }, { root: true });
    }
  },
  endSaveProperty({commit}) {
    setTimeout(() => {
      commit("reset");
      router.push("/inmuebles/todos");
      commit("section/setToSave", { module: "property" }, { root: true });
    }, 1000);
  },
  endSaveProperties({commit}) {
    setTimeout(() => {
      router.go({ force: true });
      commit("reset");
      commit("section/setToSave", { module: "property" }, { root: true });
    }, 1000);
  }
};

const mutations = {
  set(state, property) {
    if (!property.isNew) {
      state.property = property;
      state.property["gallery"] = property.images.gallery ? 
        JSON.parse(JSON.stringify(property.images.gallery.map((item) => { 
          item.image = `${ process.env.VUE_APP_URL_IMAGES }/inmuebles/${ property.uuid }/${ item.image }`;
          return item;
        }))) : [];
    } else {
      const
        propertyDefault = {
          transaction_id: 0,
          property_type_id: 0,
          description: "",
          gallery: []
        };
      state.property = { ...property, ...propertyDefault }
    }
  },
  setDataVisible(state, data) {
    const index = state.property.data[data.name].findIndex(current => current.id === data.id);
    state.property.data[data.name][index].visible = "1";
  },
  setGalleryItem(state, item) {
    item.image = `${ process.env.VUE_APP_URL_IMAGES }/temp/${ item.image }`;
    state.property.gallery.push(item);
    state.changes.gallery.push(item);
  },
  changeGalleryItem(state, item) {
    const 
      index = item.index,
      change = item.change || null,
      indexGalleryChange = state.changes.gallery.findIndex(item => item.id ? 
        item.id == state.property.gallery[index].id : 
        item.name == state.property.gallery[index].name
      );

    if(change) {
      const changeObject = {};

      if(Object.prototype.hasOwnProperty.call(change, "is_cover") && change["is_cover"] == "1") {
        const indexCurrentCover = state.property.gallery.findIndex(item => item.is_cover == "1");
        if(indexCurrentCover != -1) {
          state.property.gallery[indexCurrentCover].is_cover = "0";
        }
      }

      for(let key in change) {
        let withChange = true;
        if(state.property.gallery[index].id) {
          const indexPropertyGallery = state.property.images.gallery.findIndex(item => item.id == state.property.gallery[index].id);
          // console.log(change[key]);
          // console.log(state.property.images.gallery[indexPropertyGallery][key]);
          withChange = change[key] != state.property.images.gallery[indexPropertyGallery][key];
        }
        // console.log(withChange);
        state.property.gallery[index][key] = change[key];
        if(withChange) {
          changeObject[key] = change[key];
        }
      }

      if(Object.keys(changeObject).length > 0) {
        if(indexGalleryChange != -1) {
          state.changes.gallery[indexGalleryChange] = { ...state.changes.gallery[indexGalleryChange], ...changeObject };
        } else {
          state.changes.gallery.push({ id: state.property.gallery[index].id || null, ...changeObject });
        }
      } else {
        if(indexGalleryChange != -1) {
          state.changes.gallery.splice(indexGalleryChange, 1);
        }
      }
    } else {
      if(indexGalleryChange != -1) {
        state.changes.gallery.splice(indexGalleryChange, 1);
        if(state.property.gallery[index]['delete']) {
          delete state.property.gallery[index]['delete'];
        }
      }
    }
  },
  setChange(state, data) {
    if (data.type != "information" && data.type != "propertys") {
      state.changes[data.type] = data.change;
    } else {
      const index = state.changes[data.type].findIndex(current => current.id === data.change.id);
      if (index != -1) {
        state.changes[data.type][index] = data.change;
      } else {
        state.changes[data.type].push(data.change);
      }
    }
  },
  deleteChange(state, data) {
    if (data.type != "information" && data.type != "propertys") {
      state.changes[data.type] = [];
    } else {
      const index = state.changes[data.type].findIndex(current => current.id === data.change.id);
      if (index != -1) {
        state.changes[data.type].splice(index, 1);
      }
    }
  },
  reset(state) {
    state.property = null;
    state.changes.general = [];
    state.changes.information = [];
    state.changes.address = [];
    state.changes.gallery = [];
    state.changes.propertys = [];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};