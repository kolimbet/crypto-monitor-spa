import { restApi } from "@/transport/restApi";
import { parseErrorMessage } from "@/lib/errors";

export default {
  namespaced: true,
  state: () => ({
    coinList: [],
  }),
  getters: {},
  mutations: {
    setCoinList(state, coins) {
      state.coinList = coins;
    },
  },
  actions: {
    getCoinList({ commit }) {
      return restApi
        .getCoinList()
        .then((coinsData) => {
          let coinList = [];
          for (let key in coinsData) coinList.push(coinsData[key]);
          // console.log(coinList.length, coinList);
          if (!coinList.length) {
            throw new Error("An empty list of currencies was received");
          }
          commit("setCoinList", coinList);
          return true;
        })
        .catch((err) => {
          throw new Error(parseErrorMessage(err, "transport error"));
        });
    },
  },
};
