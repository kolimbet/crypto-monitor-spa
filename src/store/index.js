import { createStore } from "vuex";
import { parseErrorMessage } from "@/lib/errors";

import coin from "./modules/coin";
import ticker from "./modules/ticker";
import chart from "./modules/chart";
import { wsApi } from "@/transport/wsApi";

export default createStore({
  modules: { coin, ticker, chart },
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
    closingApp({ dispatch, rootState }) {
      // mandatory actions when closing the application
      if (rootState.ticker.wsConnection) wsApi.closeConnection();
      dispatch("chart/deletePoll", null, {
        root: true,
      });
      dispatch("chart/uninstallChartResize", null, {
        root: true,
      });
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
            dispatch("chart/initPoll", null, {
              root: true,
            });
            dispatch("chart/initChartResize", null, {
              root: true,
            });
          });
        })
        .catch((err) => {
          dispatch("throwFatalError", err);
        });
    },
  },
});
