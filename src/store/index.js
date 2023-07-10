import { createStore } from "vuex";
import { parseErrorMessage } from "@/lib/errors";

import coin from "./modules/coin";
import ticker from "./modules/ticker";
import { wsApi } from "@/transport/wsApi";

export default createStore({
  modules: { coin, ticker },
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
    closingApp({ rootState }) {
      // mandatory actions when closing the application
      if (rootState.ticker.wsConnection) wsApi.closeConnection();
    },

    throwFatalError({ commit, dispatch }, err) {
      commit("throwFatalError", err);
      dispatch("closingApp");
    },

    initApp({ dispatch }) {
      dispatch("coin/getCoinList")
        .then(() => {
          console.log(
            "The list of cryptocurrencies has been successfully uploaded"
          );
          dispatch("ticker/initTickersFromStorage").then(() => {
            console.log("The list of tickers has been restored");
          });
        })
        .catch((err) => {
          dispatch("throwFatalError", err);
        });
    },
  },
});
