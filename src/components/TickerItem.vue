<template>
  <div class="col">
    <div
      class="position-relative overflow-hidden shadow rounded-3 border border-2 border-opacity-50 bg-white"
    >
      <!-- вывод ошибок API -->
      <div class="position-absolute top-0 end-0 start-0">
        <div class="position-relative">
          <div class="px-2 py-1 text-end">
            <span
              class="d-inline-block p-1 bg-secondary text-white rounded fs-xs cursor-pointer"
              title="Connection status indicator"
              >Status</span
            >
            <!-- <span
              class="d-inline-block p-1 bg-success text-white rounded fs-xs cursor-pointer"
              title="You`re subscribed to this trading pair by WebSocket"
              >WS</span
            > -->
            <!-- <span class="lh-1 fs-5 link-danger">
              <i
                class="fa fa-exclamation-circle cursor-pointer"
                aria-hidden="true"
                title="Show Errors"
              ></i>
            </span> -->
          </div>
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
  computed: {},
  methods: {},
};
</script>
