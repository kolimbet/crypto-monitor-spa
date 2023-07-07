export default {
  namespaced: true,
  state: () => ({
    currentCurrency: "USD",
    tickerList: [],
    selectedTickerId: null,
  }),
  getters: {},
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

        dispatch("saveTickersInStorage");
        // console.log(state.tickerList);
        resolve(true);
      });
    },
    deleteTicker({ state, commit, dispatch }, deletedTicker) {
      return new Promise((resolve) => {
        if (state.selectedTickerId === deletedTicker.id)
          commit("unselectTicker");
        commit("removeTickerFromList", deletedTicker);

        dispatch("saveTickersInStorage");
        resolve(true);
      });
    },
    saveTickersInStorage({ state }) {
      localStorage.setItem("tickers", JSON.stringify(state.tickerList));
    },
    initTickersFromStorage({ commit }) {
      return new Promise((resolve) => {
        const tickers = localStorage.getItem("tickers")
          ? JSON.parse(localStorage.getItem("tickers"))
          : [];

        tickers.forEach((ticker) => {
          commit("addTickerToList", ticker);
        });

        resolve(true);
      });
    },
  },
};
