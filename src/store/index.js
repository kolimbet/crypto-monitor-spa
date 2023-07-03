import { createStore } from "vuex";
import { parseErrorMessage } from "@/lib/errors";

import coin from "./modules/coin";

export default createStore({
  modules: { coin },
  state: {
    init: false,
    isFatalError: false,
    fatalErrorMessage: "",
  },
  getters: {},
  mutations: {
    throwFatalError(state, err) {
      state.fatalErrorMessage = parseErrorMessage(err);
      state.isFatalError = true;
    },
  },
  actions: {
    closingApp() {
      // mandatory actions when closing the application
    },

    throwFatalError({ commit, dispatch }, err) {
      commit("throwFatalError", err);
      dispatch("closingApp");
    },

    initApp({ dispatch }) {
      dispatch("coin/getCoinList")
        .then(() => {
          console.log("Список крипто-валют успешно загружен");
        })
        .catch((err) => {
          dispatch("throwFatalError", err);
        });
    },
  },
});
