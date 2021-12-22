const state = {
  urlImages: process.env.NODE_ENV !== "production" ? "http://futurplace.local/assets/img/" : "https://futurplace.incitrus.com/assets/img/"
};

const getters = {
  urlImages({ urlImages }) {
    return urlImages;
  }
};

export default {
  namespaced: true,
  state,
  getters
};