import { notify } from "@kyvg/vue3-notification";

const state = {
  section: null,
  subSection: null,
  type: null,
  canSave: false,
  saving: false,
  toSave: []
};

const getters = {
  get(state) {
    return {
      section: state.section,
      subSection: state.subSection,
      type: state.type
    }
  },
  canSave({ canSave }) {
    return canSave;
  },
  isSaving({ saving }) {
    return saving;
  },
};

const mutations = {
  set(state, section) {
    state.section = section.section;
    state.subSection = section.subSection;
    state.type = section.type;
  },
  setCanSave(state, save) {
    state.canSave = save;
  },
  setSaving(state, saving) {
    state.saving = saving;
  },
  setToSave(state, toSave) {
    if(toSave.add) {
      state.toSave.push(toSave.module);
    } else {
      const indexModule = state.toSave.findIndex(item => item == toSave.module);
      state.toSave.splice(indexModule, 1);
      if(state.toSave.length == 0) {
        state.saving = false;
      }
    }
  },
  showNotification(state, notification) {
    notify({
      ...notification,
      duration: 10000
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};