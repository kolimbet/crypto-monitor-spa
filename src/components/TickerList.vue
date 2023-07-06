<template>
  <div>
    <div>
      <div class="clearfix">
        <div class="float-start me-2 mb-2 d-flex">
          <label
            for="tickerFilter"
            class="form-control-sm fw-bold text-secondary"
            >Filter:</label
          >
          <input
            v-model.trim="tickersFilter"
            id="tickerFilter"
            type="text"
            size="4"
            class="form-control form-control-sm"
          />
        </div>
        <div class="float-end mb-2">
          <Transition name="fade">
            <button
              v-if="page > 1"
              @click="goPrevPage()"
              type="button"
              class="btn btn-sm btn-secondary py-1 px-3 rounded-pill"
            >
              Back
            </button>
          </Transition>

          <label class="py-1 px-3 text-gray-700"
            >page: <strong>{{ page }}</strong> / {{ totalPages }}</label
          >
          <Transition name="fade">
            <button
              v-if="hasNextPage"
              @click="goNextPage()"
              type="button"
              class="btn btn-sm btn-secondary py-1 px-3 rounded-pill"
            >
              Next
            </button>
          </Transition>
        </div>
      </div>
      <hr class="mt-2 w-percent-100 border-secondary" />
    </div>

    <Transition name="slide-left">
      <div v-if="$store.state.isFatalError" class="row row-cols-1 mb-0-75rem">
        <div class="col d-flex justify-content-center">
          <ErrorMessage
            :message="$store.state.fatalErrorMessage"
            :isFatal="true"
          />
        </div>
      </div>
    </Transition>

    <Transition name="folding-y-1000" mode="out-in">
      <template v-if="hasFilteredTickers">
        <TransitionGroup
          name="list-folding-y-200"
          tag="div"
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"
        >
          <TickerItem v-for="t in paginatedTickers" :key="t.id" :ticker="t" />
        </TransitionGroup>
      </template>
      <template v-else>
        <div class="row">
          <div class="col text-center">
            <template v-if="hasTickers">
              <div class="mb-2 fs-5">
                None of the tickers matches the installed filter
              </div>
            </template>
            <template v-else>
              <div class="mb-2 fs-5">Not a single ticker has been added.</div>
              <div class="mb-2 text-sm text-secondary">
                Use the widget at the top of the page to create a new ticker to
                track the rate of the cryptocurrency you are interested in
              </div>
            </template>
          </div>
        </div>
      </template>
    </Transition>
  </div>
</template>

<script>
import ErrorMessage from "./ErrorMessage.vue";
import TickerItem from "./TickerItem.vue";

export default {
  name: "TickerList",
  components: { ErrorMessage, TickerItem },
  data() {
    return {
      page: 1,
      limitTickersOnPage: 6,
      tickersFilter: "",
    };
  },
  computed: {
    filteredTickers() {
      let filter = this.tickersFilter.toUpperCase();

      if (filter.length)
        return this.$store.state.ticker.tickerList.filter(
          (t) =>
            t.name.includes(filter) ||
            t.symbol.includes(filter) ||
            t.fullNameUp.includes(filter)
        );
      else return this.$store.state.ticker.tickerList;
    },
    hasTickers() {
      return this.$store.state.ticker.tickerList?.length;
    },
    hasFilteredTickers() {
      return this.filteredTickers?.length;
    },
    totalPages() {
      return this.hasFilteredTickers
        ? Math.ceil(this.filteredTickers.length / this.limitTickersOnPage)
        : 1;
    },
    hasNextPage() {
      return this.totalPages > this.page;
    },
    paginatedTickers() {
      const start = (this.page - 1) * this.limitTickersOnPage;
      const end = this.page * this.limitTickersOnPage;
      return this.filteredTickers.slice(start, end);
    },
  },
  methods: {
    goNextPage() {
      if (this.hasNextPage) this.page += 1;
    },
    goPrevPage() {
      if (this.page > 1) this.page -= 1;
    },
    resetPage() {
      this.page = 1;
    },
    fixPageAverage() {
      if (this.page > this.totalPages || this.page < 1) this.resetPage();
    },
  },
  watch: {
    paginatedTickers() {
      if (this.page > 1 && this.paginatedTickers.length === 0)
        this.goPrevPage();
    },
    tickersFilter() {
      this.resetPage();
    },
  },
  async created() {
    this.$store.dispatch("initApp");
  },
  beforeUnmount() {
    this.$store.dispatch("closingApp");
  },
};
</script>
