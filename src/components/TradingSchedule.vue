<template>
  <Transition name="folding-y-300" mode="out-in">
    <div v-if="hasTickerSelected">
      <div
        @click="unselectTicker()"
        role="button"
        class="float-end link-secondary"
        title="Close"
      >
        <i class="fa fa-times-circle fa-2x" aria-hidden="true"></i>
      </div>

      <h4 class="mb-2 d-flex align-items-center gap-2">
        <img v-if="imageUrl" :src="imageUrl" class="h-8 w-auto" /><span
          >{{ selectedTicker.name }} -
          {{ $store.state.ticker.currentCurrency }}</span
        ><span class="link-secondary">
          <Transition name="fade" mode="out-in">
            <i
              v-if="showDescription"
              @click="toggleDisplayDescription()"
              class="fa fa-chevron-circle-up cursor-pointer"
              title="Close Description"
            ></i>
            <i
              v-else
              @click="toggleDisplayDescription()"
              class="fa fa-chevron-circle-down cursor-pointer"
              title="Open Description"
            ></i>
          </Transition>
        </span>
      </h4>

      <transition name="folding-y-300">
        <div v-if="showDescription">
          <h5 class="text-center">{{ selectedTicker.fullName }}</h5>
          <p>{{ selectedTicker.desc ?? "Нет описания" }}</p>
        </div>
      </transition>

      <div
        v-if="hasWsSubscription"
        class="mt-4 mb-2 h-64 d-flex align-items-end border-bottom border-start border-secondary"
      >
        <div
          v-for="(bar, idx) in normalizedGraph"
          :key="idx"
          :style="{ height: `${bar.height}%` }"
          class="bg-primary border"
          :class="[graphElementWidth]"
          :title="bar.price"
        ></div>
      </div>
      <div v-else class="row mt-4 mb-2">
        <div class="col text-center fs-5">
          Failed to subscribe to this trading pair
        </div>
      </div>
    </div>

    <div v-else>
      <div class="row">
        <div class="col text-center">
          <div class="mb-2 fs-5">Ticker not selected</div>
          <div class="mb-2 fs-sm text-secondary">
            Click on the ticker to display detailed information
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { sourceUrls } from "@/transport/config/sourceUrls";

export default {
  name: "TradingSchedule",
  data() {
    return {
      showDescription: false,
    };
  },
  computed: {
    hasTickerSelected() {
      return Boolean(this.$store.state.ticker.selectedTickerId);
    },
    selectedTicker() {
      // console.log(this.$store.getters["ticker/selectedTicker"]);
      return this.$store.getters["ticker/selectedTicker"];
    },
    hasWsSubscription() {
      return this.selectedTicker?.wsSubscription ?? false;
    },
    imageUrl() {
      return this.selectedTicker?.image
        ? sourceUrls.imagesSource + this.selectedTicker.image
        : false;
    },
    chart() {
      if (this.hasTickerSelected)
        return this.$store.getters["chart/getTickerChart"](
          this.selectedTicker.name
        );
      else return [];
    },
    graphElementWidth() {
      return this.$store.state.chart.chartWidthClass;
    },
    maxGraphValue() {
      if (this.hasTickerSelected && this.chart.length)
        return Math.max(...this.chart);
      else return 1;
    },
    minGraphValue() {
      if (this.hasTickerSelected && this.chart.length)
        return Math.min(...this.chart);
      else return 1;
    },
    normalizedGraph() {
      if (
        this.hasTickerSelected &&
        this.hasWsSubscription &&
        this.chart.length
      ) {
        if (this.maxGraphValue == this.minGraphValue)
          return this.chart.map((price) => {
            return {
              price: price,
              height: 50,
            };
          });
        else
          return this.chart.map((price) => {
            return {
              price: price,
              height:
                5 +
                ((price - this.minGraphValue) * 95) /
                  (this.maxGraphValue - this.minGraphValue),
            };
          });
      } else return [];
    },
  },
  methods: {
    toggleDisplayDescription() {
      this.showDescription = !this.showDescription;
    },
    unselectTicker() {
      this.$store.commit("ticker/unselectTicker");
    },
  },
};
</script>
