import { parseErrorMessage } from "@/lib/errors";
import { restApi } from "@/transport/restApi";
import { wsApi } from "@/transport/wsApi";

export default {
  namespaced: true,
  state: () => ({
    currentCurrency: "USD",
    tickerList: [],
    selectedTickerId: null,

    wsConnection: false,
  }),
  getters: {
    selectedTicker(state) {
      if (state.selectedTickerId)
        return state.tickerList.filter(
          (t) => t.id === state.selectedTickerId
        )?.[0];
      else return false;
    },
  },
  mutations: {
    addTickerToList(state, newTicker) {
      state.tickerList = [...state.tickerList, newTicker];
    },
    removeTickerFromList(state, deletedTicker) {
      state.tickerList = state.tickerList.filter(
        (elt) => elt.id != deletedTicker.id
      );
    },
    selectTicker(state, ticker) {
      // console.log("selectTicker " + ticker.fullName);
      state.selectedTickerId = ticker.id;
    },
    unselectTicker(state) {
      // console.log("unselectTicker");
      state.selectedTickerId = null;
    },
    updateTickerPrice(state, { tickerName, price }) {
      state.tickerList
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          t.rawPrice = price;
          t.price =
            price === null
              ? price
              : price > 1
              ? price.toFixed(2)
              : price.toPrecision(2);
        });
    },
    throwTickerApiError(
      state,
      { tickerName, message, restApi = false, wsApi = false }
    ) {
      state.tickerList
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (restApi) {
            t.isErrorApiRest = true;
            t.errorApiRestMessage = message;
          } else if (wsApi) {
            t.wsSubscription = false;
            t.isErrorApiWs = true;
            t.errorApiWsMessage = message;
          } else {
            console.log(
              "store->ticker->throwApiError failed: no API specified"
            );
          }
        });
    },
    resetTickerApiError(state, { tickerName, restApi = false, wsApi = false }) {
      state.tickerList
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (restApi) {
            t.isErrorApiRest = false;
            t.errorApiRestMessage = "";
          }
          if (wsApi) {
            t.isErrorApiWs = false;
            t.errorApiWsMessage = "";
          }
        });
    },
    confirmWsSubscription(state, tickerName) {
      state.tickerList
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          t.wsSubscription = true;
          // If there is a WebSocket error, remove it
          if (t.isErrorApiWs) {
            t.isErrorApiWs = false;
            t.errorApiWsMessage = "";
          }
        });
    },
    breakAllWsSubscription(state) {
      state.tickerList.forEach((t) => {
        t.wsSubscription = false;
      });
    },
    confirmWsConnection(state) {
      state.wsConnection = true;
    },
    breakWsConnection(state) {
      state.wsConnection = false;
    },
  },
  actions: {
    addTicker({ state, commit, dispatch, rootState }, tickerName) {
      return new Promise((resolve) => {
        tickerName = tickerName.toUpperCase();

        const newCoin = rootState.coin.coinList.find(
          (c) =>
            tickerName == c.Name ||
            tickerName == c.Symbol ||
            tickerName == c.CoinName
        );

        if (newCoin === undefined)
          throw new Error("No such cryptocurrency was found");

        const newTicker = {
          id: newCoin.Id,
          fullName: newCoin.CoinName,
          fullNameUp: newCoin.CoinName.toUpperCase(),
          name: newCoin.Name,
          symbol: newCoin.Symbol,
          desc: newCoin.Description,
          totalCoinsMined: newCoin.TotalCoinsMined,
          image: newCoin.ImageUrl,
          assetWebsiteUrl: newCoin.AssetWebsiteUrl,
          url: newCoin.Url,
          price: null,
          rawPrice: null,
          wsSubscription: false,
          isErrorApiRest: false,
          errorApiRestMessage: "",
          isErrorApiWs: false,
          errorApiWsMessage: "",
        };

        if (state.tickerList.find((elt) => elt.name == newTicker.name))
          throw new Error("Such a ticker already exists");

        commit("addTickerToList", newTicker);
        commit("chart/addTickerToChart", newTicker.name, {
          root: true,
        });

        // request init prices data from RestAPI for new ticker
        dispatch("requestCoinsPrices", newTicker.name);

        // subscribe on ticker by WebSocket API
        wsApi.subscribeToTicker(newTicker.name);

        dispatch("saveTickersInStorage");
        // console.log(state.tickerList);
        resolve(true);
      });
    },
    deleteTicker({ state, commit, dispatch }, deletedTicker) {
      return new Promise((resolve) => {
        if (deletedTicker.wsSubscription)
          wsApi.unsubscribeFromTicker(deletedTicker.name);
        if (state.selectedTickerId === deletedTicker.id)
          commit("unselectTicker");
        commit("removeTickerFromList", deletedTicker);
        commit("chart/deleteTickerFromChart", deletedTicker.name, {
          root: true,
        });
        dispatch("saveTickersInStorage");
        resolve(true);
      });
    },
    saveTickersInStorage({ state }) {
      localStorage.setItem("tickers", JSON.stringify(state.tickerList));
    },
    initTickersFromStorage({ commit, dispatch }) {
      return new Promise((resolve) => {
        const tickers = localStorage.getItem("tickers")
          ? JSON.parse(localStorage.getItem("tickers"))
          : [];
        let tickerNames = [];

        tickers.forEach((ticker) => {
          commit("addTickerToList", ticker);
          commit("chart/addTickerToChart", ticker.name, {
            root: true,
          });
          commit("updateTickerPrice", {
            tickerName: ticker.name,
            price: null,
          });
          if (ticker.isErrorApiRest || ticker.isErrorApiWs)
            commit("resetTickerApiError", {
              tickerName: ticker.name,
              restApi: true,
              wsApi: true,
            });
          tickerNames.push(ticker.name);
        });

        dispatch("requestCoinsPrices", tickerNames);

        wsApi.initConnection();
        resolve(true);
      });
    },
    requestCoinsPrices({ state, commit }, coinList) {
      if (!Array.isArray(coinList)) coinList = [coinList];
      restApi
        .getExchangeRate(coinList)
        .then((rawPrices) => {
          coinList.forEach((coinName) => {
            if (
              rawPrices[coinName] === undefined ||
              rawPrices[coinName][state.currentCurrency] === undefined
            )
              commit("throwTickerApiError", {
                tickerName: coinName,
                message: `exchange market does not exist for ${coinName}-${state.currentCurrency}`,
                restApi: true,
              });
            else
              commit("updateTickerPrice", {
                tickerName: coinName,
                price: rawPrices[coinName][state.currentCurrency],
              });
          });
        })
        .catch((err) => {
          const errorMessage = parseErrorMessage(err);
          coinList.forEach((coinName) => {
            let message = null;
            if (errorMessage.includes("exchange market does not exist"))
              message = `exchange market does not exist for ${coinName}-${state.currentCurrency}`;

            // console.log(errorMessage, message);
            commit("throwTickerApiError", {
              tickerName: coinName,
              message: message ?? errorMessage,
              restApi: true,
            });
          });
        });
    },
  },
};
