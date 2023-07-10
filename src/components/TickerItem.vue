<template>
  <div class="col">
    <div
      @click="$emit('select')"
      class="position-relative shadow rounded-3 border border-2"
      :class="[cardBorderColor, cardBg]"
    >
      <!-- вывод ошибок API -->
      <div class="position-absolute top-0 end-0 start-0">
        <div class="position-relative">
          <div class="px-2 py-1 text-end">
            <span
              v-if="ticker.wsSubscription"
              class="d-inline-block p-1 bg-success text-white rounded fs-xs cursor-pointer"
              title="You`re subscribed to this trading pair by WebSocket"
              >WS</span
            >
            <span
              v-if="ticker.isErrorApiRest || ticker.isErrorApiWs"
              class="lh-1 fs-5 link-danger"
            >
              <Transition name="fade" mode="out-in">
                <i
                  v-if="showApiError"
                  @click.stop="toggleErrors"
                  class="fa fa-times-circle cursor-pointer"
                  aria-hidden="true"
                  title="Close Errors"
                ></i>
                <i
                  v-else
                  @click.stop="toggleErrors"
                  class="fa fa-exclamation-circle cursor-pointer"
                  aria-hidden="true"
                  title="Show Errors"
                ></i>
              </Transition>
            </span>
          </div>
          <template v-if="ticker.isErrorApiRest || ticker.isErrorApiWs">
            <Transition name="folding-y-300">
              <div v-if="showApiError" class="px-1">
                <div class="p-1 rounded-1 bg-danger text-white shadow">
                  <div v-if="ticker.isErrorApiWs" class="pb-2 px-2">
                    <div class="fs-2xs">Web Socket Api</div>
                    <div class="text-center">
                      {{ ticker.errorApiWsMessage }}
                    </div>
                  </div>
                  <div v-if="ticker.isErrorApiRest" class="pb-2 px-2">
                    <div class="fs-2xs">Rest Api</div>
                    <div class="text-center">
                      {{ ticker.errorApiRestMessage }}
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </template>
        </div>
      </div>

      <div
        class="px-3 py-4 text-center border-bottom border-secondary border-opacity-50"
      >
        <dt class="fs-sm text-secondary text-truncate">
          {{ ticker.name }} - {{ $store.state.ticker.currentCurrency }}
        </dt>
        <dd class="mt-1 mb-0 fs-2 fw-bold">
          {{ ticker.price === null ? "-" : ticker.price }}
        </dd>
      </div>

      <div class="d-grid">
        <button
          @click="attemptDelete()"
          class="btn btn-gray-200 link-secondary mx-1 mb-1 p-3 d-flex align-items-center justify-content-center rounded-top-0"
          title="Double click to delete the ticker"
        >
          <svg
            class="h-5 w-5 me-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#718096"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="fw-bold">Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TickerItem",
  props: {
    ticker: Object,
  },
  emits: ["delete", "select"],
  data() {
    return {
      lastDeleteClick: null,
      maxDoubleClickInterval: 1000,
      showApiError: false,
    };
  },
  computed: {
    cardBg() {
      return this.ticker.isErrorApiWs ? "bg-danger bg-opacity-25" : "bg-white";
    },
    cardBorderColor() {
      return (
        "border-opacity-50 " +
        (this.$store.state.ticker.selectedTickerId === this.ticker.id
          ? this.ticker.isErrorApiWs
            ? "border-danger"
            : "border-purple"
          : "")
      );
    },
  },
  methods: {
    attemptDelete() {
      const clickTime = new Date();
      if (
        this.lastDeleteClick &&
        clickTime - this.lastDeleteClick < this.maxDoubleClickInterval
      ) {
        this.lastDeleteClick = null;
        this.$emit("delete");
      } else {
        this.lastDeleteClick = clickTime;
      }
    },
    toggleErrors() {
      this.showApiError = !this.showApiError;
    },
  },
};
</script>
