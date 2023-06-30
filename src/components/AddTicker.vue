<template>
  <div>
    <label for="addNewCoin" class="fs-sm text-secondary ms-1 fw-bold"
      >Cryptocurrency</label
    >
    <div class="d-flex">
      <input
        id="addNewCoin"
        type="text"
        class="form-control mw-40"
        placeholder="Например DOGE"
        autocomplete="off"
      />
      <button type="button" class="btn btn-secondary rounded-pill px-3 ms-2">
        <i class="fa fa-plus-circle me-2 lh-1" aria-hidden="true"></i
        ><span>Add</span>
      </button>
    </div>
    <div class="d-flex flex-wrap p-1 mt-1 rounded-1 bg-white shadow">
      <template v-for="index in 10" :key="index">
        <span
          class="d-inline-flex px-2 m-1 fs-xs fw-bold bg-secondary bg-opacity-25 rounded-2 cursor-pointer"
          >BankCoin [B]</span
        >
        <span
          class="d-inline-flex px-2 m-1 fs-xs fw-bold bg-secondary bg-opacity-25 rounded-2 cursor-pointer"
          >BitMoon [BM]</span
        >
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTicker",
};
</script>
