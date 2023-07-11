export default {
  namespaced: true,
  state: () => ({
    pollPointer: null,
    pollInterval: 10000,
    tradingChart: {},
    chartLength: 200,
    chartDisplayedPath: 100,
    chartWidthClass: "w-percent-1",
  }),
  getters: {
    getTickerChart: (state) => (tickerName) => {
      if (state.tradingChart[tickerName].length)
        return state.tradingChart[tickerName].slice(-state.chartDisplayedPath);
      else return [];
    },
  },
  mutations: {
    addTickerToChart(state, tickerName) {
      state.tradingChart[tickerName] = [];
    },
    deleteTickerFromChart(state, tickerName) {
      delete state.tradingChart[tickerName];
    },
    recalculatingChartSize(state) {
      if (window.innerWidth >= 1400) {
        state.chartDisplayedPath = 200;
        state.chartWidthClass = "w-percent-0-5";
      } else if (window.innerWidth >= 768) {
        state.chartDisplayedPath = 100;
        state.chartWidthClass = "w-percent-1";
      } else {
        state.chartDisplayedPath = 50;
        state.chartWidthClass = "w-percent-2";
      }
    },
    setPoll(state, link) {
      state.pollPointer = link;
    },
    clearPoll(state) {
      state.pollPointer === null;
    },
    clearChart(state) {
      state.tradingChart = {};
    },
    addValueInChart(state, { tickerName, tickerPrice }) {
      state.tradingChart[tickerName].push(tickerPrice);
      if (state.tradingChart[tickerName].length > state.chartLength) {
        state.tradingChart[tickerName] = state.tradingChart[tickerName].slice(
          -state.chartLength
        );
      }
    },
  },
  actions: {
    initPoll({ state, commit, dispatch }) {
      console.log("store->chart->initPoll");
      if (state.pollPointer === null) {
        commit(
          "setPoll",
          setInterval(() => {
            dispatch("updateChart");
          }, state.pollInterval)
        );
      }
    },
    deletePoll({ state, commit }) {
      if (state.pollPointer) {
        clearInterval(state.pollPointer);
        commit("clearPoll");
      }
    },
    initChartResize({ commit }) {
      commit("recalculatingChartSize");
      window.onresize = () => {
        commit("recalculatingChartSize");
      };
    },
    uninstallChartResize() {
      window.onresize = null;
    },
    updateChart({ state, commit, rootState }) {
      // console.log("store->chart->updateChart");
      if (!rootState.ticker.wsConnection) return false;
      if (!rootState.ticker.tickerList.length) return false;

      rootState.ticker.tickerList.forEach((t) => {
        if (!t.wsSubscription || t.price === null) return;
        if (state.tradingChart[t.name] === undefined) return;

        commit("addValueInChart", {
          tickerName: t.name,
          tickerPrice: t.price,
        });
      });
    },
  },
};
