export default {
  namespaced: true,
  state: () => ({
    currentCurrency: "USD",
    tickerList: [],
  }),
  getters: {},
  mutations: {
    addTickerToList(state, newTicker) {
      state.tickerList = [...state.tickerList, newTicker];
    },
  },
  actions: {
    addTicker({ state, commit, rootState }, tickerName) {
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

        // console.log(state.tickerList);
        resolve(true);
      });
    },
  },
};
