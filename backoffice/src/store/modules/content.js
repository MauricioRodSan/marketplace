import axios from "axios";
import { useCreateFormData } from "@/composables/utils";

const state = {
  content: null,
  page: null,
  changes: []
};

const getters = {
  get({ content }) {
    return content;
  },
  changes(state) {
    return state.changes;
  },
  haveChanges(state) {
    return state.changes.length > 0;
  }
};

const actions = {
  getContent({ state }) {
    axios.get("content", { 
        params: { 
          page: state.page 
        } 
      })
      .then(function(response) {
        state.content = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  postContent({ getters, commit, dispatch, rootGetters }) {
    const { subSection } = rootGetters["section/get"];
    commit("section/setToSave", { module: "content", add: true }, { root: true });
    axios.post("content", useCreateFormData(new FormData(), "changes", getters.changes))
      .then((response) => {
        if(!response.data.error) {
          commit("section/showNotification", { title: subSection, text: "Se actualizo el contenido", type: "success" }, { root: true });
        } else {
          commit("section/showNotification", { title: subSection, text: response.data.error.message, type: "error" }, { root: true });
        }
        dispatch("endSaveContent");
      })
      .catch((error) => {
        commit("section/showNotification", { title: subSection, text: `Error en la petición al servidor (${error})`, type: "error" }, { root: true });
        dispatch("endSaveContent");
      });
  },
  endSaveContent({ state, commit, dispatch }) {
    setTimeout(() => {
      dispatch("getContent");
      commit("section/setToSave", { module: "content" }, { root: true });
      state.changes = [];
    }, 1000);
  }
};

const mutations = {
  setPage(state, page) {
    state.page = page;
  },
  save(state, content) {
    const index = state.changes.findIndex(current => current.id === content.id);
    if (index != -1) {
      state.changes[index].content = content.content;
    } else {
      state.changes.push({ ...content, page: state.page });
    }
  },
  delete(state, content) {
    const index = state.changes.findIndex(current => current.id === content.id);
    if (index != -1) {
      state.changes.splice(index, 1);
    }
  },
  reset(state) {
    state.content = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};